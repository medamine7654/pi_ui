<?php
$passwords = ['', 'root', 'admin', 'password', '12345678', '!ChangeMe!', 'smart_rental_platform', 'pi_ui'];
foreach ($passwords as $pwd) {
    echo "Testing with password: '$pwd'... ";
    try {
        $pdo = new PDO("mysql:host=localhost;port=3306", "root", $pwd);
        echo "SUCCESS!\n";
        exit(0);
    }
    catch (PDOException $e) {
        echo "Failed: " . $e->getMessage() . "\n";
    }
}
echo "All common passwords failed.\n";
exit(1);
