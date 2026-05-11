<?php
session_start();
require_once "../config/cors.php";
require_once "../config/db.php";
 
$data = json_decode(file_get_contents("php://input"), true);
 
if (empty($data["email"]) || empty($data["password"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
$stmt->execute([":email" => trim($data["email"])]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
 
if ($user && password_verify($data["password"], $user["password_hash"])) {
    $_SESSION["user_id"]  = $user["user_id"];
    $_SESSION["username"] = $user["username"];
    echo json_encode([
        "success"     => true,
        "user_id"     => $user["user_id"],
        "username"    => $user["username"],
        "email"       => $user["email"],
        "profile_pic" => $user["profile_pic"],
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
}
?>
