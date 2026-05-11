<?php
session_start();
require_once "../config/cors.php";
require_once "../config/db.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$data     = json_decode(file_get_contents("php://input"), true);
$offer_id = $data["offer_id"] ?? null;
$response = $data["response"] ?? null; // "accepted" or "declined"
 
if (!in_array($response, ["accepted", "declined"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid response value."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "UPDATE trade_offers SET status = :status WHERE offer_id = :offer_id AND receiver_id = :uid"
);
$stmt->execute([
    ":status"   => $response,
    ":offer_id" => $offer_id,
    ":uid"      => $_SESSION["user_id"],
]);
 
echo json_encode(["success" => true, "message" => "Offer " . $response . "."]);
?>
