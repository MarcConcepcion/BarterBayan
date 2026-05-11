<?php
require_once "../config/cors.php";
require_once "../config/db.php";
 
$data = json_decode(file_get_contents("php://input"), true);
 
if (empty($data["username"]) || empty($data["email"]) || empty($data["password"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
// Check if email already exists
$check = $conn->prepare("SELECT user_id FROM users WHERE email = :email");
$check->execute([":email" => $data["email"]]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Email is already registered."]);
    exit();
}
 
$hash = password_hash($data["password"], PASSWORD_BCRYPT);
 
$stmt = $conn->prepare(
    "INSERT INTO users (username, email, password_hash, location)
     VALUES (:username, :email, :password_hash, :location)"
);
$stmt->execute([
    ":username"      => trim($data["username"]),
    ":email"         => trim($data["email"]),
    ":password_hash" => $hash,
    ":location"      => $data["location"] ?? null,
]);
 
echo json_encode(["success" => true, "message" => "Registration successful."]);
?>
