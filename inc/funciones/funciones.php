<?php 

    //Retorna el nombre del archivo
    function obtenerPaginaActual(){
        //Obtener el nombre del archivo
        $archivo = basename($_SERVER['PHP_SELF']);
        //Reemplazar '.php' por una cadena vacía
        $pagina = str_replace('.php', '', $archivo);

        return $pagina;
    }

?>