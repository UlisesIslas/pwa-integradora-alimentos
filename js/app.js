if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
} else {
    console.log("nO");
}