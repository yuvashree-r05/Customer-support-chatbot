
require("dotenv").config();

const { Pinecone } = require("@pinecone-database/pinecone");

const INDEX_NAME = "customer-support-chatbot-768";
const DIMENSION = 768;
const METRIC = "cosine";

async function createPineconeIndex() {
  try {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is missing from .env");
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const existingIndexes = await pinecone.listIndexes();

    const indexExists = existingIndexes.indexes?.some(
      (index) => index.name === INDEX_NAME
    );

    if (indexExists) {
      console.log(`Index "${INDEX_NAME}" already exists.`);
      return;
    }

    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: DIMENSION,
      metric: METRIC,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      waitUntilReady: true,
    });

    console.log("Pinecone index created successfully!");
    console.log(`Name: ${INDEX_NAME}`);
    console.log(`Dimensions: ${DIMENSION}`);
    console.log(`Metric: ${METRIC}`);
  } catch (error) {
    console.error("Failed to create Pinecone index:", error.message);
    process.exitCode = 1;
  }
}

createPineconeIndex();
