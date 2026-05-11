<?php
session_start();
require_once "../config/cors.php";
require_once "../config/db.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 30"
);
$stmt->execute([":user_id" => $_SESSION["user_id"]]);
$notifs = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
$count_stmt = $conn->prepare(
    "SELECT COUNT(*) AS unread_count FROM notifications
     WHERE user_id = :user_id AND is_read = 0"
);
$count_stmt->execute([":user_id" => $_SESSION["user_id"]]);
$unread = $count_stmt->fetch(PDO::FETCH_ASSOC)["unread_count"];
 
echo json_encode([
    "success"       => true,
    "notifications" => $notifs,
    "unread_count"  => (int)$unread,
]);
?>
