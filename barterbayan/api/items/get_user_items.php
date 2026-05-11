<?php
require_once "../config/cors.php";
require_once "../config/db.php";
 
$user_id = $_GET["user_id"] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "user_id is required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "SELECT * FROM items WHERE user_id = :user_id ORDER BY created_at DESC"
);
$stmt->execute([":user_id" => $user_id]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
foreach ($items as &$item) {
    $item["images"] = json_decode($item["images"], true) ?? [];
}
 
echo json_encode(["success" => true, "items" => $items]);
?>
