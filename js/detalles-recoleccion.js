async function fetchUrl() {
    const response = await fetch(`http://localhost:8000/api/recolectados/${new URLSearchParams(window.location.search).get('rec')}`, {
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

async function fetchInfo() {
    const response = await fetch(`http://localhost:8000/api/recoleccion/detalles/${new URLSearchParams(window.location.search).get('rec')}`, {
        headers: { 
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

fetchUrl().then(data => {
    let body = "";
    console.log(data.data);
    Object.entries(data.data).forEach(([key, value]) => {
        body += `<li class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold">${value.alimento}</div>${value.categoria}<br>${value.comentarios}</div></li>`;
    });
    document.getElementById('alimentos-seleccionados').innerHTML = body;
})

fetchInfo().then(data => {
    document.getElementById('origen'). innerHTML = `<b>Almacen (Origen): </b>${data.data[0].cadena}`
    document.getElementById('destino').innerHTML = `<b>Banco (Destino): </b>${data.data[0].banco}`
})