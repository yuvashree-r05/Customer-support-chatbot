
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const faqs = require("../data/faqs");

const searchFaq = tool(
  async ({ query }) => {
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

    const results = faqs.filter((faq) => {
      const faqText =
        `${faq.question} ${faq.answer}`.toLowerCase();

      return searchTerms.some((term) =>
        faqText.includes(term)
      );
    });

    if (results.length === 0) {
      return JSON.stringify({
        found: false,
        message: "No matching FAQ was found.",
      });
    }

    return JSON.stringify({
      found: true,
      results: results.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    });
  },
  {
    name: "search_faq",
    description:
      "Search the company's FAQ data for answers about refunds, order tracking, customer support, and other listed policies. Use this tool when the customer asks a question that may be answered by an FAQ.",
    schema: z.object({
      query: z
        .string()
        .min(2)
        .max(200)
        .describe("The customer's question or search topic"),
    }),
  }
);

module.exports = searchFaq;
