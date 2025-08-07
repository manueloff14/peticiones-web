const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Lista de sitios web que deseas comprobar
const websites = [
    "https://peticiones-web-kx9o.onrender.com/check",
    "https://ae-uniandes.onrender.com",
];

let isChecking = false;

// Función para hacer peticiones a los sitios web
async function checkWebsites() {
    if (isChecking) {
        console.log("Verificación ya en curso, se omite esta ejecución.");
        return [];
    }

    isChecking = true;

    const results = [];

    for (const website of websites) {
        try {
            const response = await axios.get(website, { timeout: 2000 }); // 2 segundos
            results.push({
                website,
                status: response.status,
                message: "Success",
            });
        } catch (error) {
            results.push({
                website,
                status: error.response?.status || "N/A",
                message: error.code === 'ECONNABORTED' ? "Timeout (2s)" : error.message,
            });
        }
    }

    console.log("Verificación realizada:", results);

    // Limpiar referencias y forzar GC si está disponible
    isChecking = false;
    global.gc?.(); // Esto solo funciona si Node se ejecuta con --expose-gc

    return results;
}

// Configurar la verificación periódica al arrancar el servidor
function startAutomaticChecking(intervalMinutes = 10) {
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    checkWebsites(); // Primera ejecución

    setInterval(async () => {
        await checkWebsites();
    }, intervalMilliseconds);

    console.log(`Verificación automática cada ${intervalMinutes} minutos.`);
}

app.get("/", (req, res) => {
    res.send("Hola Mundo");
});

app.get("/check", async (req, res) => {
    const results = await checkWebsites();
    res.json({ timestamp: new Date(), results });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    startAutomaticChecking(10);
});
