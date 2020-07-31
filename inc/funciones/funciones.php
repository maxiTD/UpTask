<?php

    //Retorna el nombre del archivo
    function obtenerPaginaActual(){
        //Obtener el nombre del archivo
        $archivo = basename($_SERVER['PHP_SELF']);
        //Reemplazar '.php' por una cadena vacía
        $pagina = str_replace('.php', '', $archivo);

        return $pagina;
    }

    /** Consultas **/
    //Obtener todos los proyectos
    function obtenerProyectos() {
        include 'conexion.php';
        try {
            return $conn->query('SELECT id, nombre FROM proyectos');
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    //Obtener nombre del proyecto
    function obtenerNombreProyecto($id = null) {
        include 'conexion.php';
        try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    //Obtener las tareas del proyecto
    function obtenerTareasProyecto($id = null) {
        include 'conexion.php';
        try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

?>