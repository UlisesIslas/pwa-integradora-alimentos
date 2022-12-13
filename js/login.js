const LOGIN_URL = 'https://recoleccion-api-production.up.railway.app/api/login';
async function fetchUrl(data) {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { Accept: 'application/json' },
        body: data
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

activeSesion = () => {
    if (localStorage.getItem('TOKEN')) {
        window.location.href = '/pwa-integradora-alimentos/pages/listado-recolecciones.html';
    } 
}

login = () => {
    let fData = new FormData();
    fData.append('email', document.getElementById('email').value);
    fData.append('password', document.getElementById('password').value)
    /* const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; */
    if (email !== '' && password !== '') {
        fetchUrl(fData).then(data => {
            localStorage.setItem('TOKEN', data.access_token);
            window.location.href = '/pwa-integradora-alimentos/pages/listado-recolecciones.html';
        })
    }
}