<?php
session_start();
require_once "../config/cors.php";
require_once "../config/db.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$data = json_decode(file_get_contents("php://input"), true);
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "UPDATE users SET username = :username, location = :location WHERE user_id = :user_id"
);
$stmt->execute([
    ":username" => trim($data["username"]),
    ":location" => $data["location"] ?? null,
    ":user_id"  => $_SESSION["user_id"],
]);
 
echo json_encode(["success" => true, "message" => "Profile updated."]);
?>
