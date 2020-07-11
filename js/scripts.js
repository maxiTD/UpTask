
eventListenes();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListenes() {
    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
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
    //inyectar el HTML
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = `
        <a href="#">${nombreProyecto}</a>
    `;
    listaProyectos.appendChild(nuevoProyecto);
}