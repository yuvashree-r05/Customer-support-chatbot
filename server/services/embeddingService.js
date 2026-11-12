
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

let embeddingsInstance;

function getEmbeddings() {
  if (embeddingsInstance) {
    return embeddingsInstance;
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is missing from .env");
  }

  embeddingsInstance = new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: "gemini-embedding-001",
    outputDimensionality: 768,
  });

  return embeddingsInstance;
}

module.exports = { getEmbeddings };
