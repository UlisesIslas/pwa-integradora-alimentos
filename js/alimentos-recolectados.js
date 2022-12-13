
(function getInformation(){
    refreshInfo();
})()

function refreshInfo(){
    async function fetchUrl() {
        const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/recolectados/${new URLSearchParams(window.location.search).get('id')}`, {
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

    fetchUrl().then(data => {
        let body = "";
        console.log(data.data);
        Object.entries(data.data).forEach(([key, value]) => {
            body += `
            <div class="card mt-2">
            <div class="card-body">
                <div class="row" >
                    <div class="col-12">
                        Categoria: ${value.categoria}
                    </div>
                    <div class="col-6">
                        <h5 class="card-title">${value.alimento}</h5>
                    </div>
                    <div class="col-6 text-end">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="setData('${value.id}','${value.categoria}','${value.alimento}','${value.comentarios}','${value.foto}')">
                            Add commets
                        </button>    
                    </div>                
                </div>
            </div>
        </div>
            `;
        document.getElementById("listaAlimentos").innerHTML = body
        });
        
    })
}
const STATUS_THREE_BADGE = `<span class="badge bg-success">Realizada</span></div><div class="col-3 col-md-2"><a href="../pages/detalles-recoleccion.html" class="btn btn-secondary btn-sm">Detalles</a></div></div></div></div>`
const GET_RECOLECCIONES_URL = 'https://recoleccion-api-production.up.railway.app/api/recolecciones-usuario';
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
let image ="";
function setData(id,categoria, alimento,comentarios,foto){
    console.log(id,"-",categoria,"-", alimento)
    document.getElementById("idHide").value=id;
    document.getElementById("titleModal").innerHTML = alimento;
    if(comentarios != 'null' || foto != 'null'){
        if(comentarios)
        document.getElementById("comments").value = comentarios
        if(foto!='null'){
            document.getElementById("photo").hidden = false;
            document.getElementById("photo").setAttribute("src",foto)
            document.getElementById("btnTakePhoto").innerText = 'Tomar otra foto'
            image = foto
        }else{
            document.getElementById("btnTakePhoto").innerText = 'Capturar'
        }
    }
    camera.power()
}


document.getElementById("saveInformation").addEventListener("click",async function(){
    
    let comment = document.getElementById("comments").value;
    console.log(comment,"-",image)
    if(comment && image){
       let id = document.getElementById("idHide").value;
       console.log(id);
       
       let resp = await updateObservations(id,comment,image);
        if(resp.message.includes("successfully")){
            /* Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
              }) */
            
            document.getElementById("closeModal").click()
            image = ""
            camera.off()
            refreshInfo()
        }
    }else{
        /* Toast.fire({
            icon: 'warning',
            title: 'Ingresa todos los datos.'
          }) */
    }
    //document.getElementById("closeModal").click();
})

document.getElementById("closeModal").addEventListener("click", function(){
    reset();
})

document.getElementById("btnX").addEventListener("click", function(){
    reset();
})

document.getElementById("btnFinish").addEventListener("click", async function(){
         const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/actualizar-estatus-recoleccion/${new URLSearchParams(window.location.search).get('id')}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log("Si"+response);
                fetchUrl(GET_RECOLECCIONES_URL).then(data => {
                    console.log(data)
                    let body = '<div class = "col-12"><div class="row">'
                    Object.entries(data.data).forEach(([key, value]) => {
                        body += `<div class="card mt-3">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-6 col-md-8 text-truncate" id="cc${value.id}">${value.nombre}</div>
                                                <div class="col-3 col-md-2">${value.status === 1 ? `<span class="badge rounded-pill bg-warning">Pendiente</span></div>
                                                <div class="col-3 col-md-2"><a href="../pages/pendiente-detalles.html?alm=${value.almacen}&rec=${value.id}" class="btn btn-info btn-sm">Recolectar</a></div>
                                            </div>
                                        </div></div>` : value.status === 2 ? `<span class="badge rounded-pill bg-info">En camino</span></div><div class="col-3 col-md-2"><button data-id="${value.id}" class="btn btn-primary btn-sm entregar">Entregado</button></div></div></div></div>` : STATUS_THREE_BADGE}`
                    });
                    window.location.href = `/pwa-integradora-alimentos/pages/listado-recolecciones.html`;

                    // document.querySelectorAll('.entregar').forEach(x => {
                    //     x.addEventListener('click', async function () {
                    //         const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/actualizar-estatus-recoleccion/${x.dataset.id}`, {
                    //             method: "GET",
                    //             headers: {
                    //                 Accept: 'application/json',
                    //                 Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
                    //             },
                    //         });
                    //         if (!response.ok) {
                    //             throw new Error(`HTTP error! status: ${response.status}`);
                    //         } else {
                    //             console.log("Si");
                    //             fetchUrl(GET_RECOLECCIONES_URL)
                    //         }
                    //     });
                    // });
                });
            }
});

function reset(){
    camera.off()
    document.getElementById("photo").hidden = true
    document.getElementById("comments").value="";
}

async function updateObservations(id,comment,image) {
    //console.log(id,comment,image)
    // let formData = new FormData();
    // formData.append("comentarios", "jeje");
    // formData.append("foto", "prueba")  
    let object = {
        "comentarios":comment,
        "foto":image
    }
    console.log(object)
    const response = await fetch(`https://recoleccion-api-production.up.railway.app/api/recoleccion_alimentos/update/${id}`, {
        method:'PUT',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(object)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }else{

    }
    return await response.json();
}

const btnCamera = document.getElementById("btnCamera")
const btnTakePhoto = document.getElementById("btnTakePhoto")
const video = document.getElementById("video")
const photo = document.getElementById("photo")

let arrayPhoto = []
const camera = new Camera(video)



btnTakePhoto.addEventListener("click",()=>{
    console.log("toma foto")
    let picture = camera.takePhoto()
    image = camera.takePhoto()
    
    camera.off();
    photo.setAttribute('src',picture)
    arrayPhoto.push(picture)
    
})