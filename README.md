# NewsWebCrawler
## Descripcion general
Este sistema se encarga de recibir solicitudes a un endpoint REST con URLs de articulos de noticias.
Si la URL pertenece a un dominio valido, se extraera el contenido del articulo y se enviara a una API de una IA para que realice un resumen sobre este y lo devuelva en formato JSON.
Ejemplo:
`curl -X POST "localhost:3000/?productUrl=https://www.bbc.com/mundo/articles/cn879x2pwq3o"`

## Requisitos para ejecutar
- Node.js instalado en el sistema
- Es necesario tener instalado y configurado Google CLI en el sistema. [Instrucciones](https://cloud.google.com/vertex-ai/generative-ai/docs/reference/nodejs/latest)
- Paquetes de node utilizados: Axios, Cheerio, @google-cloud/vertexai. Utiliza el siguiente comando en la terminal del proyecto para instalarlos:  `npm install axios cheerio @google-cloud/vertexai`

## Consideraciones adicionales
- Por cuestiones de limite de solicitudes a la API, las solicitudes se procesan en forma secuencial cada 30 segundos.
- Los resumenes se generan principalmente en español, rara vez en el idioma de la noticia.
- Se almacenan en memoria los ultimos 3 resumenes generados para evitar procesar varias veces una misma solicitud en un corto periodo de tiempo.

## Technical Details

- ❌ Scalability: You can assume that the load of the requests is about 1/sec, but make sure that your design can support a load several orders of magnitude larger than that.
- ✅ Other providers: The system should be able to escalate to other news providers easily (Clarin, La Nacion, etc). If the User inputs a URL that is not from a supported news provider, the system should respond with an error message that the provider has not yet been implemented.
- ❗ URL Handling: URLs might repeat themselves, and as with any good engineering system, we would like to avoid fetching and processing the same page over and over again.
- ✅ Content Extraction: News articles come from various websites with different HTML structures. Your system should reliably extract the main content of the article, excluding navigation menus, ads, comments, and other non-essential elements.
- ❗ Summarization: Implement an efficient way to generate a concise summary of the article's content. You can use any method or tool you prefer to perform the summarization.
- ❌ Error Handling: If the site cannot access the news article because it requires an account or log in to view it, your service should return a custom error indicating that the article cannot be accessed.
- ✅ Performance Optimization: Assume the corpus can be very large, so naive methods may not be quick enough to render results promptly. You will need to address this through your choice of algorithms, data structures, or technologies.
- ✅ Output Format: The summaries should be returned in a JSON format. This is not a front-end development assignment, so you don't need to focus on making the output pretty.
- ❗ Caching and Storage: Implement caching to store processed articles to avoid redundant fetching and processing, thereby improving performance

