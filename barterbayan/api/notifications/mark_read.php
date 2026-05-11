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
$notif_id = $data["notif_id"] ?? null;
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "UPDATE notifications SET is_read = 1
     WHERE notif_id = :notif_id AND user_id = :user_id"
);
$stmt->execute([
    ":notif_id" => $notif_id,
    ":user_id"  => $_SESSION["user_id"],
]);
 
echo json_encode(["success" => true]);
?>
