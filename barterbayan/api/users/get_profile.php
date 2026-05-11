<?php
require_once "../config/cors.php";
require_once "../config/db.php";
 
$user_id = $_GET["user_id"] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "user_id required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "SELECT user_id, username, email, location, profile_pic, is_verified, created_at
     FROM users WHERE user_id = :user_id LIMIT 1"
);
$stmt->execute([":user_id" => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
 
if (!$user) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit();
}
 
echo json_encode(["success" => true, "user" => $user]);
?>
