<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول</title>
</head>
<body>
    <?php
    if(isset($_POST['name'])){
        $conn = mysqli_connect('localhost', 'root', '', 'kheirbiladak1');
        $name = $_POST['name'];
        $email = $_POST['email'];
        $pass= $_POST['pass'];
        $sql = "INSERT INTO `user`(`name`, `email`, `password`) VALUES('$name','$email','$pass')";
        mysqli_query($conn, $sql);
        echo 'done';
    }
    ?>
    <form action="" method="post">
        name: <input type="text" name="name"> <br>
        email : <input type="email" name="email"><br>
        password: <input type="password" name="pass"><br>
        <input type="submit" value="حفظ">
    </form>
</body>
</html>