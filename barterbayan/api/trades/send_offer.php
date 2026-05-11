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
    "INSERT INTO trade_offers
        (sender_id, receiver_id, offered_item_id, requested_item_id, cash_topup)
     VALUES
        (:sender_id, :receiver_id, :offered_item_id, :requested_item_id, :cash_topup)"
);
$stmt->execute([
    ":sender_id"         => $_SESSION["user_id"],
    ":receiver_id"       => $data["receiver_id"],
    ":offered_item_id"   => $data["offered_item_id"],
    ":requested_item_id" => $data["requested_item_id"],
    ":cash_topup"        => $data["cash_topup"] ?? 0,
]);
$offer_id = $conn->lastInsertId();
 
// Create notification for receiver
$notif = $conn->prepare(
    "INSERT INTO notifications (user_id, type, reference_id, message)
     VALUES (:user_id, 'trade_offer', :reference_id, :message)"
);
$notif->execute([
    ":user_id"      => $data["receiver_id"],
    ":reference_id" => $offer_id,
    ":message"      => "You received a new trade offer!",
]);
 
echo json_encode(["success" => true, "offer_id" => $offer_id]);
?>
