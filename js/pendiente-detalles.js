async function getAlimentos() {
    const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/almacen/alimentos/${new URLSearchParams(window.location.search).get('alm')}`, {
        headers: {
            Accept: 'application/json'
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

let alimentos = [];
const id = new URLSearchParams(window.location.search).get('rec');

getAlimentos().then(data => {
    let body = '<div class="col-12"><div class="row">'
    let i = 0;
    alimentos = data.data;
    Object.entries(data.data).forEach(([key, value]) => {
        body += `<div class="container">
                    <div class="card mt-2">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-9 text-truncate">${value.nombre}</div>
                                <div class="col-3"><input type="checkbox" id="al${i}" name="alimentos" class="form-check-input" value="${value.id}"></div>
                            </div>
                        </div>
                    </div>
                </div>`
        i++;
    });
    document.getElementById("alimentos-lista").innerHTML = body;
});


function recolectarAlimentos() {
    console.log(alimentos);
    let i = 0;
    let seleccionados = [];
    Object.entries(alimentos).forEach(([key, value]) => {
        let tmpCB = document.getElementById(`al${i}`);
        let tmpTA = document.getElementById(`com${i}`);
        if (tmpCB.checked === true) {
            let fData = new FormData();
            fData.append("recoleccion_id", id);
            fData.append("alimento_id", tmpCB.value);
            //fData.append("comentarios", tmpTA.value);
            seleccionados.push(fData);
            sendData(fData);
        }
        i++;
    });
    if (seleccionados.length > 0) {
        updateStatus().then((res) => {
            window.location.href = '/pwa-integradora-alimentos/pages/listado-recolecciones.html';
        });
    } else {
        console.log("Selecciona uno");
    }

}

async function sendData(data) {
    const response = await fetch('https://recoleccion-api-production.up.railway.app/api/recoleccion_alimentos/store', {
        method: "POST",
        headers: { Accept: 'application/json' },
        body: data
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

async function updateStatus() {
    const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/actualizar-estatus-recoleccion/${id}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}