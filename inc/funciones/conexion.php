<?php 

    //credenciales de la base de datos
    define('DB_USUARIO', 'root');
    define('DB_PASSWORD', '113415');
    define('DB_HOST', '127.0.0.1:3306');
    define('DB_NOMBRE', 'uptask');

    $conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

    //Prueba de conexion
    /*echo "<pre>";
        var_dump($conn->ping());
    echo "</pre>";*/

    if($conn->connect_error) {
        echo $conn->connect_error;
    }

    //set_charset -> Establece el conjunto  de caracteres a utilizar cuando se envían peticiones desde y hacia el servidor
    $conn->set_charset('utf8');
?>