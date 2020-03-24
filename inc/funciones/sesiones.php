<?php 

    function usuarioAutenticado(){
        //Si no está iniciada la sesión se redirexiona a login.php
        if(!revisarUsuario()) {
            header('Location:login.php');
            exit();
        }
    }  

    function revisarUsuario(){
        //isset — Determina si una variable está definida y no es NULL
        return isset($_SESSION['nombre']);
    }

    //session_start -> Iniciar una nueva sesión o reanudar la existente
    session_start();
    usuarioAutenticado();

?>