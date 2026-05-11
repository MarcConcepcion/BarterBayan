<?php
class Database {
    private $host     = "localhost";
    private $db_name  = "barterbayan_db";
    private $username = "root";
    private $password = "";   // XAMPP default password is empty
    public  $conn;
 
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("SET NAMES utf8mb4");
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
            exit();
        }
        return $this->conn;
    }
}
?>
