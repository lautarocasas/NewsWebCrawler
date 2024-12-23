const axios = require('axios');
const cheerio = require('cheerio');

async function extraerArticulo(url) {
  try {
    // Obtengo unicamente la propiedad data del objeto
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Selectores para encontrar el contenido principal
    const contentSelectors = [
      'article',
      'main',
      'section',
      'div.content',
      'div.post',
      'div.article-content'
    ];

    let contenido = '';

    // Intentar extraer contenido de los selectores comunes
    for (const selector of contentSelectors) {
      const content = $(selector).text();
      if (content && content.length > 200) {
        contenido = content;
        break; // Si encontramos un bloque grande, terminamos la búsqueda
      }
    }

    if (!contenido) 
      throw new Error('No se encontró contenido en el artículo');
    return contenido;    
  } catch (error) {
    console.error('Error al obtener el contenido:', error.message);
    throw error;
  }
}

module.exports = {extraerArticulo};