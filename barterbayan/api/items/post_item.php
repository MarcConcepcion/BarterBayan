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
 
if (empty($data["title"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Title is required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "INSERT INTO items (user_id, title, description, category, condition_status, images)
     VALUES (:user_id, :title, :description, :category, :condition_status, :images)"
);
$stmt->execute([
    ":user_id"          => $_SESSION["user_id"],
    ":title"            => trim($data["title"]),
    ":description"      => $data["description"] ?? "",
    ":category"         => $data["category"]    ?? "other",
    ":condition_status" => $data["condition_status"] ?? "good",
    ":images"           => json_encode($data["images"] ?? []),
]);
 
echo json_encode(["success" => true, "item_id" => $conn->lastInsertId()]);
?>
