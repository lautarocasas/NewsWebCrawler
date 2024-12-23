const {extraerArticulo} = require('./ExtraerContenido');
const {generarResumen} = require('./ResumirContenido');
const express = require('express');
const app = express();

const PORT = 3000;
const REQUEST_INTERVAL = 30 * 1000; 
const MAX_CACHE_SIZE = 3;

let requestQueue = [];
let cache = [];

let isProcessing = false;

async function procesarSolicitud(url)
{
    const articulo = await extraerArticulo(url);
    const resumen = await generarResumen(articulo);
    
    return resumen;
}

function verificarURL(url)
{
    const dominiosValidos = ["bbc.com","clarin.com"];
    const regex = new RegExp(dominiosValidos.join("|"), "i");

    return regex.test(url);
}

app.post('/', (req, res) => {
    const url = req.query.productUrl;

    if (!url) {
        return res.status(400).send({ error: 'Falta el parámetro productUrl' });
    }

    if(!verificarURL(url)){
        return res.status(400).send({ error: 'URL no valida, por favor ingrese una URL valida.' });
    }

    console.log(`Solicitud recibida para: ${url}`);
    const index = cache.findIndex(entry => entry.url === url);

    if (index !== -1) {
        console.log(`URL ya procesada, obteniendo resumen de la caché: ${url}`);
        return res.status(200).send({ summary: cache[index].resumen });  
    }

    // Agregar la solicitud a la cola
    requestQueue.push({url,res});
});

// Función que procesa la cola
setInterval(async () => {
    if (requestQueue.length > 0 && !isProcessing) {
        isProcessing = true;

        // Tomar la primera solicitud de la cola
        const { url, res } = requestQueue.shift();

        try {
            console.log(`Procesando URL: ${url}`);
            const resumen = await procesarSolicitud(url);
            //Llegados a este punto, es porque el resumen no esta almacenado en cache
            if (cache.length >= MAX_CACHE_SIZE) {
                cache.shift();
            }
            cache.push({ url, resumen }); 
            res.status(200).send({ summary: resumen });
        } catch (err) {
            console.log(`Error al procesar la URL: ${url}`);
            console.log(err.message);
            res.status(500).send({ error: 'Error al procesar la URL, intente de nuevo mas tarde.' });
        } finally {
            isProcessing = false;
        }
    }
}, REQUEST_INTERVAL);



app.listen(PORT,()=>{console.log(`Servidor corriendo en http://localhost:${PORT}`)});