/* if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
} else {
    console.log("nO");
} */
/* 
if (window.location != 'http://localhost:8080/' || window.location != 'http://localhost:8080/index.html') {
    if (!localStorage.getItem('TOKEN')) {
        window.location.href = 'http://localhost:8080/';
    }
} */
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  