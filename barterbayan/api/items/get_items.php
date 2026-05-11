<?php
require_once "../config/cors.php";
require_once "../config/db.php";
 
$database = new Database();
$conn     = $database->getConnection();
 
$category = $_GET["category"] ?? null;
 
$sql = "SELECT i.item_id, i.title, i.description, i.category,
               i.condition_status, i.images, i.status, i.created_at,
               u.user_id, u.username, u.location, u.profile_pic
        FROM items i
        JOIN users u ON i.user_id = u.user_id
        WHERE i.status = 'available'";
 
if ($category && $category !== "all") {
    $sql .= " AND i.category = :category";
}
$sql .= " ORDER BY i.created_at DESC";
 
$stmt = $conn->prepare($sql);
if ($category && $category !== "all") {
    $stmt->execute([":category" => $category]);
} else {
    $stmt->execute();
}
 
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($items as &$item) {
    $item["images"] = json_decode($item["images"], true) ?? [];
}
 
echo json_encode(["success" => true, "items" => $items]);
?>
