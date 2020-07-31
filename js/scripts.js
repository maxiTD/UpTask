
eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    //Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    //Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
    //Document Ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    })
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
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
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

                        //Seleccionar el párrafo con el aviso de lista vacía
                        var parrafoListaVacia = document.querySelectorAll(".lista-vacia");
                        //Remover párrafo
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }
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
                        //Actualizar el progreso
                        actualizarProgreso();
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

//Cambiar el estado de las tareas o eliminarlas
function accionesTareas(e){
    e.preventDefault();

    //Con e.target puedo saber a qué elemento se hizo click, en lugar de colocar un listener en cada elemento --> DELEGATION
    //Click en el icono de completar tareas
    if (e.target.classList.contains('fa-check-circle')) {
        //Si la tarea está comleta
        if (e.target.classList.contains('completo')) {
            //Marcar como incompleto
            e.target.classList.remove('completo');
            //Cambiar el estado de la tarea en la DB
            cambiarEstadoTarea(e.target, 0);
        } else {
            //Marcar como completo
            e.target.classList.add('completo');
            //Cambiar el estado de la tarea en la DB
            cambiarEstadoTarea(e.target, 1);
        }
    }
    //Click en el icono de eliminar tareas
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Está seguro?',
            text: "Esta acción no se puede revertir.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la DB
                eliminarTareaDB(tareaEliminar);
                //Borrar del HTML
                tareaEliminar.remove();
                Swal.fire(
                'Eliminado!',
                'La tarea se eliminó correctamente.',
                'success'
                )
            }
          })
    }
}

//Cambiar estado de la tarea de completo a incompleto y viceversa
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    //Crear llamado AJAX
    var xhr = new XMLHttpRequest();
    //Información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //Onload
    xhr.onload = function() {
        if (this.status == 200) {
            //Actualizar el progreso
            actualizarProgreso();
        }
    }
    //Enviar la pertición
    xhr.send(datos);
}

//Eliminar tarea de la DB
function eliminarTareaDB(tarea) {
    var idTarea = tarea.id.split(':');

    //Crear llamado AJAX
    var xhr = new XMLHttpRequest();
    //Información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //Onload
    xhr.onload = function() {
        if (this.status == 200) {
            //Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length == 0) {
                document.querySelector(".listado-pendientes ul").innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            //Actualizar el progreso
            actualizarProgreso();
        }
    }
    //Enviar la pertición
    xhr.send(datos);
}

//Actualiza el avance del proyecto
function actualizarProgreso() {
    //Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');
    //Obtener las tareas completas
    const tareasCompletas = document.querySelectorAll('i.completo');
    //Determinar el avance
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
    //Asignar el avance a la barra
    const porsentaje = document.querySelector('#porcentaje');
    porsentaje.style.width = avance + '%';
    //Mostrar alerta al completar proyecto
    if (avance == 100) {
        Swal.fire(
            'Proyecto terminado!',
            'Ya no tienes tareas pendientes.',
            'success'
            )
    }
}