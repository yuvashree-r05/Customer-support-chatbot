
require("dotenv").config();

const { indexFaqs } = require("../services/ragService");

async function seedFaqs() {
  try {
    console.log("Starting FAQ indexing...");

    const result = await indexFaqs();

    console.log("FAQs indexed successfully!");
    console.log(`Number of FAQs: ${result.indexedCount}`);
    console.log(`Namespace: ${result.namespace}`);
  } catch (error) {
    console.error("FAQ indexing failed:", error.message);
    process.exitCode = 1;
  }
}

seedFaqs();
