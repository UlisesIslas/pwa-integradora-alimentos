import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

import { storage } from "./firestore.js";

const saveImageFirestore = async() => {
    const image = document.getElementById("fotografia").files[0];
    const hola = document.getElementById("imagencita");

    console.log(image);
    const storageRef = ref(storage, "imagenes/" + image.name);
    const metadata = { contentType: "img/jpeg" };
    await uploadBytes(storageRef, image, metadata).then(async() => {
        await getDownloadURL(ref(storage, storageRef.fullPath)).then(async(url) => {
            console.log(url);
            const card = document.createElement("div");
            console.log(card);
            hola.innerHTML = 
            `<div>
                    <img src="${url}" alt="AAAAA">
                  </div>`;
            localStorage.setItem("imgUrl", url);
            return "Si esto se lee, es porque si sirve";
        });
    });
};

const boton = document.getElementById("btnFoto");
boton.addEventListener("click", saveImageFirestore);