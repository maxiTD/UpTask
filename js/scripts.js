
eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //crear in <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //seleccionar el ID con el nuevo Proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter crear el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        //traer el identificador de la tecla que se presiona
        var tecla = e.which || e.keyCode;
        //si @tecla == es un enter
        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value)
            //eliminar el input
            listaProyectos.removeChild(nuevoProyecto);
        } 
    });
}

function guardarProyectoDB(nombreProyecto) {
    //Crear llamado AJAX
    var xhr = new XMLHttpRequest();
    //Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //En la carga
    xhr.onload = function() {
        if(this.status === 200) {
            //Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;
            //Comprobar la inserción
            if(resultado === 'correcto') {
                //fue exitoso
                if(tipo === 'crear') {
                    //Se creó un nuevo proyecto
                    //inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    //Agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);
                    //Eviar alerta
                    Swal.fire({
                        icon: 'success',
                        title: 'Proyecto Agregado',
                        text: 'El proyecto: ' + proyecto + ', se agregó correctamente.'
                    })
                    //Esperar a que el usuario seleccione ok para redireccionar
                    .then(resultado => {
                        if(resultado.value) {
                            //Redireccionar a la nueva URL
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                } else {
                    //Se actualizó o se eliminó
                }
            } else {
                //hubo un error
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Hubo un error al crear el proyecto'
                })
            }
        }
    }
    //Enviar el Request
    xhr.send(datos);
}

//Agregar tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //Validar que el campo no esté vacío
    if (nombreTarea === '') {
        Swal.fire({
            icon: 'error',
            title:'Error!',
            text: 'Este campo es obligatorio'
        })
    } else {
        //Crear llamado a AJAX
        var xhr = new XMLHttpRequest();
        //Crear formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
        //Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        //Ejecutarlo y respuesta
        xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                //Asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    //Se agregó correctamente
                    if (tipo === 'crear') {
                        //lanzar la alerta
                        Swal.fire({
                            icon: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente.'
                        });

                        //Construir el template
                        var nuevaTarea = document.createElement('li');
                        //agregar ID
                        nuevaTarea.id = 'tarea:'+id_insertado;
                        //agragar la clase Tarea
                        nuevaTarea.classList.add('tarea');
                        //construir en el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        //agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);
                        //limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();
                    }
                } else {
                    //hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Error al agregar Tarea.'
                    })
                }
            }
        }
        //Enviar la consulta
        xhr.send(datos);
    }
}