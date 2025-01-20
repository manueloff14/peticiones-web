const axios = require("axios");

// Lista de sitios web que deseas comprobar
const websites = [
    "https://cumbre-ui-buscador-pgam.onrender.com",
    "https://cumbre-server-la3g.onrender.com/api/blog/9363628683",
    "https://cumbre-empleo-73ys.onrender.com/9363628683",
    "https://cumbre-home.onrender.com",
];

// Función para hacer peticiones a los sitios web
async function checkWebsites() {
    for (const website of websites) {
        try {
            const response = await axios.get(website);
            console.log(`Sitio: ${website} - Estado: ${response.status}`);
        } catch (error) {
            console.error(`Error al acceder a ${website}:`, error.message);
        }
    }
}

// Función para configurar el intervalo de tiempo en minutos
function startChecking(intervalMinutes) {
    // Convierte los minutos en milisegundos
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    // Ejecutar la función cada `intervalMilliseconds` milisegundos
    setInterval(checkWebsites, intervalMilliseconds);

    // Realizar la primera verificación inmediatamente al ejecutar el script
    checkWebsites();
}

// Llamar a la función y pasar el número de minutos que deseas
// Por ejemplo, para ejecutar cada 10 minutos:
startChecking(10);
