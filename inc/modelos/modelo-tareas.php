<?php
    $accion = $_POST['accion'];
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];

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
?>