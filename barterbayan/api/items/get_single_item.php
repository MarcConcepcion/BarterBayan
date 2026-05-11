<?php
require_once "../config/cors.php";
require_once "../config/db.php";
 
$item_id = $_GET["item_id"] ?? null;
if (!$item_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "item_id is required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "SELECT i.*, u.username, u.location, u.profile_pic
     FROM items i
     JOIN users u ON i.user_id = u.user_id
     WHERE i.item_id = :item_id LIMIT 1"
);
$stmt->execute([":item_id" => $item_id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);
 
if (!$item) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Item not found."]);
    exit();
}
 
$item["images"] = json_decode($item["images"], true) ?? [];
echo json_encode(["success" => true, "item" => $item]);
?>
