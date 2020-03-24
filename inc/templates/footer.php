
<script src="js/sweetalert2.all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>

<?php 
    $pagActual = obtenerPaginaActual();
    if($pagActual === 'crear-cuenta' || $pagActual === 'login') {
        echo '<script src="js/formulario.js"></script>';
    }
?>
</body>
</html>