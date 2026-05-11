<?php
require_once "../../config/cors.php";
require_once "../../config/db.php";
 
$reviewee_id = $_GET["reviewee_id"] ?? null;
if (!$reviewee_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "reviewee_id required."]);
    exit();
}
 
$database = new Database();
$conn     = $database->getConnection();
 
$stmt = $conn->prepare(
    "SELECT r.review_id, r.rating, r.comment, r.created_at,
            u.username AS reviewer_name, u.profile_pic AS reviewer_pic
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.user_id
     WHERE r.reviewee_id = :reviewee_id
     ORDER BY r.created_at DESC"
);
$stmt->execute([":reviewee_id" => $reviewee_id]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
// Calculate average
$avg_stmt = $conn->prepare(
    "SELECT ROUND(AVG(rating),1) AS avg_rating, COUNT(*) AS total
     FROM reviews WHERE reviewee_id = :reviewee_id"
);
$avg_stmt->execute([":reviewee_id" => $reviewee_id]);
$stats = $avg_stmt->fetch(PDO::FETCH_ASSOC);
 
echo json_encode([
    "success"    => true,
    "reviews"    => $reviews,
    "avg_rating" => (float) $stats["avg_rating"],
    "total"      => (int)   $stats["total"],
]);
?>
