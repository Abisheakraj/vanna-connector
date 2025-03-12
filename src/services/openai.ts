
import OpenAI from "openai";

// Initialize OpenAI - in a real app, you would use environment variables
// Note: In production, this should be handled server-side to protect your API key
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // This is a placeholder. In a real app, use env variables
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export async function generateSQLFromText(
  text: string, 
  databaseType: string,
  tables: Array<{ name: string, columns: Array<{ name: string, type: string }> }>
): Promise<string> {
  try {
    // Generate schema information from tables
    const schemaInfo = tables.map(table => {
      const columns = table.columns.map(col => `${col.name} (${col.type})`).join(', ');
      return `Table: ${table.name} (${columns})`;
    }).join('\n');
    
    const prompt = `
I have a ${databaseType} database with the following schema:

${schemaInfo}

Convert the following natural language query to SQL:
"${text}"

Respond with ONLY the SQL query - no explanations or additional text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a SQL expert that converts natural language to SQL queries. Provide only the SQL query with no other text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    return response.choices[0].message.content?.trim() || "SELECT * FROM users LIMIT 10; -- Failed to generate SQL";
  } catch (error) {
    console.error("Error generating SQL:", error);
    return "-- Error generating SQL query";
  }
}

// Function to get mockup response when OpenAI key isn't available
export function getMockSQLResponse(text: string): string {
  // Detect keywords to determine intent
  const textLower = text.toLowerCase();
  
  if (textLower.includes("user") || textLower.includes("customer")) {
    if (textLower.includes("all") || textLower.includes("list")) {
      return "SELECT * FROM users LIMIT 100;";
    }
    if (textLower.includes("count")) {
      return "SELECT COUNT(*) AS user_count FROM users;";
    }
    if (textLower.includes("email")) {
      return "SELECT id, name, email FROM users WHERE email LIKE '%gmail%';";
    }
  }
  
  if (textLower.includes("order") || textLower.includes("purchase")) {
    if (textLower.includes("recent")) {
      return "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;";
    }
    if (textLower.includes("total") || textLower.includes("sum")) {
      return "SELECT SUM(amount) AS total_sales FROM orders;";
    }
  }

  if (textLower.includes("product") || textLower.includes("item")) {
    if (textLower.includes("popular") || textLower.includes("top")) {
      return "SELECT product_id, COUNT(*) AS purchase_count FROM order_items GROUP BY product_id ORDER BY purchase_count DESC LIMIT 5;";
    }
    if (textLower.includes("inventory") || textLower.includes("stock")) {
      return "SELECT id, name, inventory_count FROM products WHERE inventory_count < 10;";
    }
  }

  // Default query if no pattern is matched
  return "SELECT * FROM users LIMIT 10;";
}
