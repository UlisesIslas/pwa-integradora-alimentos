(function getInformation(){
    refreshInfo();
})()

function refreshInfo(){
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
                            Details
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

let image ="";
function setData(id,categoria, alimento,comentarios,foto){
    console.log(id,"-",categoria,"-", alimento)
    document.getElementById("idHide").value=id;
    document.getElementById("titleModal").innerHTML = 'Detalles del produto "'+alimento+'"';
    if(comentarios != 'null' || foto != 'null'){
        if(comentarios)
        document.getElementById("comments").value = comentarios
        if(foto!='null'){
            document.getElementById("photo").hidden = false;
            document.getElementById("photo").setAttribute("src",foto)
            image = foto
        }else{
            document.getElementById("btnTakePhoto").innerText = 'Capturar'
        }
    }
}