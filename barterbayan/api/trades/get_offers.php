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
    "SELECT t.*,
            s.username AS sender_name,
            r.username AS receiver_name,
            oi.title   AS offered_title,
            ri.title   AS requested_title
     FROM trade_offers t
     JOIN users s ON t.sender_id   = s.user_id
     JOIN users r ON t.receiver_id = r.user_id
     JOIN items oi ON t.offered_item_id   = oi.item_id
     JOIN items ri ON t.requested_item_id = ri.item_id
     WHERE t.sender_id = :uid OR t.receiver_id = :uid2
     ORDER BY t.created_at DESC"
);
$stmt->execute([":uid" => $_SESSION["user_id"], ":uid2" => $_SESSION["user_id"]]);
$offers = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
echo json_encode(["success" => true, "offers" => $offers]);
?>
