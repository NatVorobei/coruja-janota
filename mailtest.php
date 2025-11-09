<?php
$ok = mail("office@corujajanota.eu", "Test from PHP mail()", "Hello from web server", "From: office@corujajanota.eu\r\n");
var_dump($ok);
?>