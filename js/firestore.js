import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {getStorage} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbZ5cdifuN61F3DgsPnoZM0ZrMw-u_H6Y",
    authDomain: "chatgrupoautez.firebaseapp.com",
    databaseURL: "https://chatgrupoautez-default-rtdb.firebaseio.com",
    projectId: "chatgrupoautez",
    storageBucket: "chatgrupoautez.appspot.com",
    messagingSenderId: "827124229807",
    appId: "1:827124229807:web:a29791d1f92fc209cd965a",
    measurementId: "G-28SQJ60WQW"
  };
  
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  export{app, storage};