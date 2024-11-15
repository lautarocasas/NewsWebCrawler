const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const project = 'genial-moon-441716-h9';
const location = 'us-central1';
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
      parts: [{"text": `Recibiras articulos periodisticos directamente extraidos a partir de un documento HTML, por lo que estos pueden contener contenido irrelevante para el articulo, como enlaces a otras noticias o anuncios. Tu tarea es identificar la noticia principal y generar un resumen no superior a las 6 oraciones sobre esta. Es estrictamente obligatorio que cumplas esta ultima condicion, ya que el resumen no puede ser muy extenso.`}]
    },
});

async function generarResumen(textoAResumir) {
  const request = {
    contents: [{role: 'user', parts: [{text: 'Genera un resumen del siguiente articulo: '+textoAResumir}]}],
  };
  const result = await generativeModel.generateContent(request);
  const response = result.response.candidates[0].content.parts[0].text;
  console.log('Response: ', JSON.stringify(response));
};

module.exports = {generarResumen};