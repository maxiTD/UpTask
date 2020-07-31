<?php
    $accion = $_POST['accion'];
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    $id_tarea = $_POST['id'];
    $estado = $_POST['estado'];

    if($accion == 'crear') {
        //Crear la conexion a la BD
        include '../funciones/conexion.php';

        //Realizar la consulta a la BD
        try {
            //Se utiliza Prepare Statement
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
            $stmt->bind_param("si", $tarea, $id_proyecto);
            $stmt->execute();

            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'tarea' => $tarea,
                    'id_proyecto' => $id_proyecto
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
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }

    if ($accion == 'actualizar') {
        //Crear la conexion a la BD
        include '../funciones/conexion.php';

        //Realizar la consulta a la BD
        try {
            //Se utiliza Prepare Statement
            $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
            $stmt->bind_param("ii", $estado, $id_tarea);
            $stmt->execute();

            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto'
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
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }

    if ($accion == 'eliminar') {
        //Crear la conexion a la BD
        include '../funciones/conexion.php';

        //Realizar la consulta a la BD
        try {
            //Se utiliza Prepare Statement
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
            $stmt->bind_param("i", $id_tarea);
            $stmt->execute();

            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto'
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
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
?>