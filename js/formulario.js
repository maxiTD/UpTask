
eventListeners();

function eventListeners() {
    //Listener para el formulario de crear cuenta
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    //Evita que el formulario se envié atumaticamente
    e.preventDefault();
    
    //Leer los datos
    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
    
    //Valido que los campos no estén vacios
    if(usuario === '' || password === '') {
        //Si algún campo está vacío se muestra el mensaje de error
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Todos los campos son obligatorios'
        })

    } else {
        //Si ambos campos están completos se manda a ejecutar AJAX
        //FormData -> permite la estructuración de pares clave/objeto para enviar en una peticion XMLHttpRequest
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);
        //console.log(...datos);

        //Crear el objeto
        var xhr = new XMLHttpRequest();
        //Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
        //Leer la respuesta
        xhr.onload = function() {
            if(this.status == 200) {
                var respuesta = JSON.parse(xhr.responseText);

                //console.log(respuesta);
                //Si la respuesta es correcto
                if(respuesta.respuesta == 'correcto') {
                    //Si se crea un nuevo usuario
                    if(respuesta.tipo == 'crear') {
                        //Muestro notificación de éxito
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creó correctamente.'
                        })

                    //Si se loguea un usuario
                    } else if(respuesta.tipo == 'login'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard.',
                        })
                        //Esperar a que el usuario seleccione ok para redireccionar a dashboard
                        .then(resultado => {
                            if(resultado.value) {
                                //Redireccionar al dashboard
                                window.location.href = 'index.php';
                            }
                        })
                    }

                //Si la respuesta es 'error'
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Ha ocurrido un error...'
                    })
                }
            }
        }
        //Enviar los datos
        xhr.send(datos);
    }
}