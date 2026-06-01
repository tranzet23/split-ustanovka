<?php

ini_set('display_errors', 'On');
error_reporting('E_ALL');

$to = 'vladislavzyuzyukov@gmail.com';
$siteName = $_SERVER['SERVER_NAME'];
$name = strip_tags($_POST['name']);
$phone = strip_tags($_POST['phone']);

if (isset($_POST['name']) && !empty($_POST['name']))
{
    // Формирование заголовка письма

   $subject = "[Zayavka s saita = .$siteName ]";
   $headers = "From mail@".$siteName." \r\n";
   $headers .= "MIME-Version: 1.0\r\n";
   $headers .= "Content-Type: text/html;charset=utf-8\r\n";

   // Формирование тела письма

    $message = "<html><body style='font-family: Arial,sans-serif;' >";
    $message .= "<h2>Новая заявка</h2>\r\n";

    if(isset($_POST['name']) && !empty($_POST['name'])) {
        $message .= "<p><strong>Имя: </strong> ".$name."</p>\r\n";
    }
    if(isset($_POST['phone']) && !empty($_POST['phone'])) {
        $message .= "<p><strong>Телефон: </strong> " . $phone . "</p>\r\n";
    }
    $message .= "</body></html>";

// отправка сообщ

mail($to, $subject, $message, $headers);
}
else
{
    echo "false";
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"
</head>
</html>
