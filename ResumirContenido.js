require('dotenv').config();

const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION;
const textModel =  'gemini-1.5-flash-002';

const vertexAI = new VertexAI({project: project, location: location});

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generationConfig: {maxOutputTokens: 256},
    systemInstruction: {
      role: 'system',
      parts: [{"text": `Recibiras articulos periodisticos en diferentes idiomas directamente extraidos a partir de un documento HTML, por lo que estos pueden contener contenido irrelevante para el articulo, como enlaces a otras noticias o anuncios. Tu tarea es identificar la noticia principal y generar un resumen en el mismo idioma en el que fue escrita, no superior a las 6 oraciones. Es estrictamente obligatorio que cumplas esta ultima condicion, ya que el resumen no puede ser muy extenso. Asegurate en todo momento de que el resumen mantenga el mismo idioma del articulo principal.`}]
    },
});

async function generarResumen(textoAResumir) {
  const request = {
    contents: [{role: 'user', parts: [{text: 'Genera un resumen del siguiente articulo en el mismo idioma en el que fue escrito: '+textoAResumir}]}],
  };
  const result = await generativeModel.generateContent(request);
  const response = result.response.candidates[0].content.parts[0].text;
  
  return response;
};

module.exports = {generarResumen};