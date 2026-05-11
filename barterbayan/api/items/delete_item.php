<?php
session_start();
require_once "../config/cors.php";
require_once "../config/db.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$data    = json_decode(file_get_contents("php://input"), true);
$item_id = $data["item_id"] ?? null;
 
$database = new Database();
$conn     = $database->getConnection();
 
// Verify ownership before deleting
$check = $conn->prepare("SELECT user_id FROM items WHERE item_id = :item_id");
$check->execute([":item_id" => $item_id]);
$row = $check->fetch(PDO::FETCH_ASSOC);
 
if (!$row || $row["user_id"] != $_SESSION["user_id"]) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Not authorized."]);
    exit();
}
 
$stmt = $conn->prepare("DELETE FROM items WHERE item_id = :item_id");
$stmt->execute([":item_id" => $item_id]);
 
echo json_encode(["success" => true, "message" => "Item deleted."]);
?>
