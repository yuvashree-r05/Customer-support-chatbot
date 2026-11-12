
const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const { Document } = require("@langchain/core/documents");

const { getEmbeddings } = require("./embeddingService");
const faqs = require("../data/faqs");

const FAQ_NAMESPACE = "customer-support-faqs";

let pineconeClient;
let vectorStore;

function getPineconeIndex() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!apiKey) {
    throw new Error("PINECONE_API_KEY is missing from .env");
  }

  if (!indexName) {
    throw new Error("PINECONE_INDEX_NAME is missing from .env");
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey });
  }

  return pineconeClient.Index(indexName);
}

async function getFaqVectorStore() {
  if (vectorStore) {
    return vectorStore;
  }

  const embeddings = getEmbeddings();
  const pineconeIndex = getPineconeIndex();

  vectorStore = new PineconeStore(embeddings, {
    pineconeIndex,
    namespace: FAQ_NAMESPACE,
    maxConcurrency: 5,
  });

  return vectorStore;
}

function createFaqDocuments() {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    throw new Error("No FAQ records found in data/faqs.js");
  }

  return faqs.map((faq) => {
    if (!faq.id || !faq.question || !faq.answer) {
      throw new Error(
        "Every FAQ must contain id, question, and answer fields."
      );
    }

    const keywords = Array.isArray(faq.keywords)
      ? faq.keywords.join(", ")
      : "";

    const pageContent = [
      `Question: ${faq.question}`,
      `Answer: ${faq.answer}`,
      keywords ? `Related keywords: ${keywords}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return new Document({
      pageContent,
      metadata: {
        faqId: String(faq.id),
        category: String(faq.category || "General"),
        question: String(faq.question),
        answer: String(faq.answer),
      },
    });
  });
}

async function indexFaqs() {
  const store = await getFaqVectorStore();
  const documents = createFaqDocuments();

  const ids = faqs.map((faq) => String(faq.id));

  await store.addDocuments(documents, { ids });

  return {
    indexedCount: documents.length,
    namespace: FAQ_NAMESPACE,
  };
}

async function retrieveFaqs(query, limit = 3) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("A non-empty FAQ search query is required.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
    throw new Error("FAQ retrieval limit must be between 1 and 10.");
  }

  const store = await getFaqVectorStore();

  const matches = await store.similaritySearchWithScore(
    query.trim(),
    limit
  );

  return matches.map(([document, score]) => ({
    score,
    pageContent: document.pageContent,
    metadata: document.metadata,
  }));
}

module.exports = {
  indexFaqs,
  retrieveFaqs,
};
