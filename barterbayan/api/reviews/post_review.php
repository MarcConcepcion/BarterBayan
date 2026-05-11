<?php
session_start();
require_once "../../config/cors.php";
require_once "../../config/db.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$data = json_decode(file_get_contents("php://input"), true);
 
if (empty($data["reviewee_id"]) || empty($data["rating"]) || empty($data["comment"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "reviewee_id, rating, and comment required."]);
    exit();
}
 
$rating = (int) $data["rating"];
if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Rating must be between 1 and 5."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
// Prevent duplicate review for same offer
if (!empty($data["offer_id"])) {
    $dup = $conn->prepare(
        "SELECT review_id FROM reviews
         WHERE reviewer_id = :rid AND offer_id = :oid LIMIT 1"
    );
    $dup->execute([":rid" => $_SESSION["user_id"], ":oid" => $data["offer_id"]]);
    if ($dup->fetch()) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "You already reviewed this trade."]);
        exit();
    }
}
 
$stmt = $conn->prepare(
    "INSERT INTO reviews (reviewer_id, reviewee_id, offer_id, rating, comment)
     VALUES (:reviewer_id, :reviewee_id, :offer_id, :rating, :comment)"
);
$stmt->execute([
    ":reviewer_id" => $_SESSION["user_id"],
    ":reviewee_id" => $data["reviewee_id"],
    ":offer_id"    => $data["offer_id"] ?? null,
    ":rating"      => $rating,
    ":comment"     => trim($data["comment"]),
]);
 
echo json_encode(["success" => true, "review_id" => $conn->lastInsertId()]);
?>
