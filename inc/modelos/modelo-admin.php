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
        //Crear la conexion a la BD
        include '../funciones/conexion.php';

        //Realizar la consulta a la BD
        try {
            //Se utiliza Prepare Statement
            $stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ?");
            $stmt->bind_param("s", $usuario);
            $stmt->execute();

            //Loguear el usuario
            //bind_result -> trae el resultado de la consulta
            $stmt->bind_result($id_usuario, $nombre_usuario, $hash_password);
            $stmt->fetch();

            //Si existe...
            if($nombre_usuario) {
                //Verificar password
                if(password_verify($password, $hash_password)) {
                    //Iniciar la sesión
                    session_start();
                    $_SESSION['nombre'] = $nombre_usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    
                    //Login correcto
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'usuario' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    //Login incorrecto, enviar error
                    $respuesta = array(
                        'respuesta' => 'Contraseña incorrecta'
                    );
                }
                
            //Si no existe un usuario se devuelve el error
            } else {
                $respuesta = array (
                    'error' => 'Usuario no existe'
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
?>