const GET_RECOLECCIONES_URL = 'http://localhost:8000/api/recolecciones-usuario';
const GET_CADENA_COMERCIAL_URL = 'http://localhost:8000/api/cadenaComercial/show/';
async function fetchUrl(url) {
    const response = await fetch(url, {
        headers: { 
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

const STATUS_ONE_BADGE = '<span class="badge bg-warning">Pendiente</span></div><div class="col-3 col-md-2"><a href="/pages/pendiente-detalles.html" class="btn btn-info btn-sm">Recolectar</a></div></div></div></div>';
const STATUS_TWO_BADGE = '<span class="badge bg-info">En camino</span></div><div class="col-3 col-md-2"><a href="" class="btn btn-primary btn-sm">Entregado</a></div></div></div></div>';
const STATUS_THREE_BADGE = '<span class="badge bg-success">Realizada</span></div><div class="col-3 col-md-2"><a href="/pages/detalles-recoleccion.html" class="btn btn-secondary btn-sm">Detalles</a></div></div></div></div>';

fetchUrl(GET_RECOLECCIONES_URL).then(data => {
    let body = '<div class = "col-12"><div class="row">'
    let i = 0;
    Object.entries(data.data).forEach(([key, value]) => {
        body += `<div class="card mt-3"><div class="card-body"><div class="row"><div class="col-6 col-md-8 text-truncate" id="cc${value.id}"></div><div class="col-3 col-md-2">${value.status === 1 ? STATUS_ONE_BADGE : value.status === 2 ? STATUS_TWO_BADGE : STATUS_THREE_BADGE}`
        getCadena(value.almacen.cadena_comercial_id, value.id);
        console.log(value.almacen.cadena_comercial_id);
        i++;
    });
    document.getElementById('listado').innerHTML = body;
})

async function getCadena (id, idObj) {
    await fetchUrl(GET_CADENA_COMERCIAL_URL + id).then(data => {
        console.log("FUN: " + data.data.nombre);
        document.getElementById(`cc${idObj}`).innerHTML = data.data.nombre;
        return data.data;
    })
}