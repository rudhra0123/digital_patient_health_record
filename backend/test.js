const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY_HERE');

async function listModels() {
  try {
    const models = await genAI.listModels();
    for await (const model of models) {
      console.log(model.name);
    }
  } catch (err) {
    console.log(err.message);
  }
}

listModels();