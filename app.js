const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Lista de sitios web que deseas comprobar
const websites = [
    "https://cumbre-ui-buscador-pgam.onrender.com",
    "https://cumbre-server-la3g.onrender.com/api/blog/9363628683",
    "https://cumbre-empleo-73ys.onrender.com/9363628683",
    "https://cumbre-home.onrender.com",
    "https://peticiones-web-mplw.onrender.com",
    "https://ae-uniandes.onrender.com",
    "https://rendaz-shop.onrender.com",
    "https://peliculas-frontend-zdmj.onrender.com",
    "https://school-frontend-oa18.onrender.com",
    "https://school-backend-o6b4.onrender.com",
    "https://lunna-home.onrender.com",
    "https://lunna-backend.onrender.com",
    "https://panel.lunna.lat",
    "https://cumbre-home.lunna.lat"
];

// Función para hacer peticiones a los sitios web
async function checkWebsites() {
    const results = [];

    for (const website of websites) {
        try {
            const response = await axios.get(website);
            results.push({
                website,
                status: response.status,
                message: "Success",
            });
        } catch (error) {
            results.push({
                website,
                status: error.response?.status || "N/A",
                message: error.message,
            });
        }
    }

    console.log("Verificación realizada:", results);
    return results;
}

// Configurar la verificación periódica al arrancar el servidor
function startAutomaticChecking(intervalMinutes = 10) {
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    // Ejecutar la primera verificación al iniciar
    checkWebsites();

    // Configurar el intervalo
    setInterval(async () => {
        await checkWebsites();
    }, intervalMilliseconds);

    console.log(
        `Verificación automática configurada cada ${intervalMinutes} minutos.`
    );
}

app.get("/", (req, res) => {
    res.send("Hola Mundo");
});

// Endpoint para verificar los sitios web manualmente
app.get("/check", async (req, res) => {
    const results = await checkWebsites();
    res.json({ timestamp: new Date(), results });
});

// Iniciar el servidor y la verificación automática
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    startAutomaticChecking(10); // Configura la verificación automática cada 10 minutos
});
