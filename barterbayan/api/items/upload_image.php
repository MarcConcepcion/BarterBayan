<?php
session_start();
require_once "../config/cors.php";
 
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit();
}
 
$data = json_decode(file_get_contents("php://input"), true);
 
if (empty($data["image_data"]) || empty($data["file_name"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "image_data and file_name required."]);
    exit();
}
 
// Validate base64 image (jpg/png only)
$allowed = ["jpg", "jpeg", "png", "webp"];
$ext     = strtolower(pathinfo($data["file_name"], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Only JPG, PNG, WEBP allowed."]);
    exit();
}
 
// Decode and size-check (max 5MB)
$base64  = preg_replace("/^data:image\/[a-z]+;base64,/", "", $data["image_data"]);
$decoded = base64_decode($base64);
if (strlen($decoded) > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File exceeds 5MB limit."]);
    exit();
}
 
$upload_dir = __DIR__ . "/../uploads/";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
 
$filename  = uniqid("bb_", true) . "." . $ext;
$full_path = $upload_dir . $filename;
 
if (file_put_contents($full_path, $decoded) === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to save file."]);
    exit();
}
 
// Return a URL the React frontend can use
$url = "http://localhost/barterbayan/api/uploads/" . $filename;
echo json_encode(["success" => true, "url" => $url]);
?>
