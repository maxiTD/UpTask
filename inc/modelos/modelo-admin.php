<?php 

    //Cuando se utilizan Prepare Statements no es necesario limpiar (sanitizar) las entradas
    $accion = $_POST['accion'];
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    //Crear usuarios
    if($accion == 'crear') {
        //Hashear passwords
        $opciones = array(
            'cost' => 12
        );
        $hashPassword = password_hash($password, PASSWORD_BCRYPT, $opciones);
        
        //Crear la conexion a la BD
        include '../funciones/conexion.php';

        //Realizar la consulta a la BD
        try {
            //Se utiliza Prepare Statement
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $usuario, $hashPassword);
            $stmt->execute();

            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array (
                    'respuesta' => 'error'
                );
            }

            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $respuesta = array(
                'respuesta' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }

    if($accion == 'login') {
        
    }
?>