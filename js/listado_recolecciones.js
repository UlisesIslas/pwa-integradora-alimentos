const GET_RECOLECCIONES_URL = 'https://recoleccion-api-production.up.railway.app/api/recolecciones-usuario';
const STATUS_THREE_BADGE = `<span class="badge bg-success">Realizada</span></div><div class="col-3 col-md-2"><a href="../pages/detalles-recoleccion.html" class="btn btn-secondary btn-sm">Detalles</a></div></div></div></div>`
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

fetchUrl(GET_RECOLECCIONES_URL).then(data => {
    let body = '<div class = "col-12"><div class="row">'
    Object.entries(data.data).forEach(([key, value]) => {
        body += `<div class="card mt-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 col-md-8 text-truncate" id="cc${value.id}">${value.nombre}</div>
                            <div class="col-3 col-md-2">${value.status === 1 ? `<span class="badge rounded-pill bg-warning">Pendiente</span></div>
                            <div class="col-3 col-md-2"><a href="./pendiente-detalles.html?alm=${value.almacen}&rec=${value.id}" class="btn btn-info btn-sm">Recolectar</a></div>
                            </div></div></div>` : value.status === 2 ? `<span class="badge rounded-pill bg-info">En camino</span></div>
                            <div class="col-3 col-md-2"><button data-id="${value.id}" class="btn btn-primary btn-sm entregar">Entregado</button></div>
                        </div>
                    </div>
                </div>` : `<span class="badge rounded-pill bg-success">Realizada</span></div><div class="col-3 col-md-2"><a href="./detalles-recoleccion.html?rec=${value.id}" class="btn btn-secondary btn-sm">Detalles</a></div></div></div></div>`}`
    });

    document.getElementById('listado').innerHTML = body;
    
    document.querySelectorAll('.entregar').forEach((x,index) => {
        x.addEventListener('click', async function () {
            console.log(index)
            window.location.href = `/pwa-integradora-alimentos/pages/lista-alimentos-recolectados.html?id=${data.data[index].id}`;
            

            // const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/actualizar-estatus-recoleccion/${x.dataset.id}`, {
            //     method: "GET",
            //     headers: {
            //         Accept: 'application/json',
            //         Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
            //     },
            // });
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // } else {
            //     console.log("Si"+response);
            //     fetchUrl(GET_RECOLECCIONES_URL).then(data => {
            //         console.log(data)
            //         let body = '<div class = "col-12"><div class="row">'
            //         Object.entries(data.data).forEach(([key, value]) => {
            //             body += `<div class="card mt-3">
            //                         <div class="card-body">
            //                             <div class="row">
            //                                 <div class="col-6 col-md-8 text-truncate" id="cc${value.id}">${value.nombre}</div>
            //                                     <div class="col-3 col-md-2">${value.status === 1 ? `<span class="badge rounded-pill bg-warning">Pendiente</span></div>
            //                                     <div class="col-3 col-md-2"><a href="./pendiente-detalles.html?alm=${value.almacen}&rec=${value.id}" class="btn btn-info btn-sm">Recolectar</a></div>
            //                                 </div>
            //                             </div></div>` : value.status === 2 ? `<span class="badge rounded-pill bg-info">En camino</span></div><div class="col-3 col-md-2"><button data-id="${value.id}" class="btn btn-primary btn-sm entregar">Entregado</button></div></div></div></div>` : STATUS_THREE_BADGE}`
            //         });
            //         document.getElementById('listado').innerHTML = body;

            //         // document.querySelectorAll('.entregar').forEach(x => {
            //         //     x.addEventListener('click', async function () {
            //         //         const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/actualizar-estatus-recoleccion/${x.dataset.id}`, {
            //         //             method: "GET",
            //         //             headers: {
            //         //                 Accept: 'application/json',
            //         //                 Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
            //         //             },
            //         //         });
            //         //         if (!response.ok) {
            //         //             throw new Error(`HTTP error! status: ${response.status}`);
            //         //         } else {
            //         //             console.log("Si");
            //         //             fetchUrl(GET_RECOLECCIONES_URL)
            //         //         }
            //         //     });
            //         // });
            //     });
            // }
        });
    });
});
