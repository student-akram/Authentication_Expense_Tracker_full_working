const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function categorizeExpense(description) {

  const prompt = `
  Categorize this expense into ONE category only:
  Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other.

  Expense: "${description}"

  Return only one word.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
    console.log("OpenAI failed. Using fallback logic.");

    // 🔥 SMART FALLBACK (so demo never fails)
    const text = description.toLowerCase();

    if (text.includes("food") || text.includes("pizza") || text.includes("mutton") || text.includes("kfc"))
      return "Food";

    if (text.includes("uber") || text.includes("bus") || text.includes("travel"))
      return "Travel";

    if (text.includes("amazon") || text.includes("shopping"))
      return "Shopping";

    if (text.includes("bill") || text.includes("electricity"))
      return "Bills";

    return "Other";
  }
}

module.exports = { categorizeExpense };