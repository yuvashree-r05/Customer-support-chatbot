
require("dotenv").config();

const { retrieveFaqs } = require("../services/ragService");

const FAQ_SIMILARITY_THRESHOLD = 0.60;

const testCases = [
  {
    query: "I received a broken product. Can I get my money back?",
    expectedFaqId: "refund-policy",
  },
  {
    query: "Where can I find my shipment tracking details?",
    expectedFaqId: "order-tracking",
  },
  {
    query: "Which payment options are available?",
    expectedFaqId: "payment-methods",
  },
  {
    query: "My package has not arrived on time. What should I do?",
    expectedFaqId: "delivery-delay",
  },
  {
    query: "I received an incorrect item in my package.",
    expectedFaqId: "wrong-item",
  },
  {
    query: "How do I get in touch with your support team?",
    expectedFaqId: "contact-support",
  },
];

async function testFaqRetrieval() {
  let passed = 0;

  try {
    console.log("Starting FAQ retrieval evaluation...\n");

    for (const testCase of testCases) {
      console.log("-----------------------------------");
      console.log("Query:", testCase.query);

      const results = await retrieveFaqs(testCase.query, 3);

      const expectedResult = results.find(
        (result) =>
          result.metadata.faqId === testCase.expectedFaqId
      );

      results.forEach((result, index) => {
        console.log(`\nResult ${index + 1}`);
        console.log("FAQ:", result.metadata.question);
        console.log("Score:", result.score.toFixed(4));
        console.log(
          "Above threshold:",
          result.score >= FAQ_SIMILARITY_THRESHOLD
        );
      });

      const isCorrect =
        expectedResult &&
        expectedResult.score >= FAQ_SIMILARITY_THRESHOLD;

      if (isCorrect) {
        passed++;
        console.log("\nEvaluation: PASS");
      } else {
        console.log("\nEvaluation: CHECK");
      }
    }

    console.log("\n===================================");
    console.log("Evaluation completed");
    console.log(`Passed: ${passed}/${testCases.length}`);
    console.log(`Needs review: ${testCases.length - passed}`);
    console.log("===================================");
  } catch (error) {
    console.error("FAQ retrieval evaluation failed:", error.message);
  }
}

testFaqRetrieval();
