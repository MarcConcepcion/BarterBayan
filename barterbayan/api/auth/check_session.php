<?php
session_start();
require_once "../config/cors.php";
 
if (isset($_SESSION["user_id"])) {
    echo json_encode([
        "success"  => true,
        "user_id"  => $_SESSION["user_id"],
        "username" => $_SESSION["username"],
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false]);
}
?>
