import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const { message, assets } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!assets || !Array.isArray(assets)) {
      return NextResponse.json({ error: "Assets data is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Calculate real-time statistics
    const totalAssets = assets.length
    const assetsInUse = assets.filter((asset: any) => asset.status === "In Use").length
    const inRepair = assets.filter((asset: any) => asset.status === "In Repair").length
    const inStorage = assets.filter((asset: any) => asset.status === "In Storage").length
    const decommissioned = assets.filter((asset: any) => asset.status === "Decommissioned").length

    // Calculate category breakdown
    const categoryBreakdown = assets.reduce((acc: any, asset: any) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1
      return acc
    }, {})

    // Get recent assets (last 5 added)
    const recentAssets = assets
      .sort((a: any, b: any) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, 5)

    // Enhanced system prompt with markdown formatting instructions
    const systemPrompt = `You are an AI assistant for an Asset Management System. You help users manage, track, and get insights about their company assets.

CURRENT REAL-TIME ASSET DATABASE (${new Date().toLocaleString()}):
- Total Assets: ${totalAssets}
- Assets In Use: ${assetsInUse}
- In Storage: ${inStorage}
- In Repair: ${inRepair}
- Decommissioned: ${decommissioned}

ASSET CATEGORIES BREAKDOWN:
${Object.entries(categoryBreakdown)
  .map(([category, count]) => `- ${category}: ${count} assets`)
  .join("\\n")}

COMPLETE ASSET LIST:
${assets
  .map(
    (asset: any) =>
      `- ${asset.id}: "${asset.name}" | Category: ${asset.category} | Status: ${asset.status} | Assigned: ${asset.assignedTo} | Value: $${asset.value} | Location: ${asset.location || "Not specified"} | Purchase: ${asset.purchaseDate}`,
  )
  .join("\\n")}

RECENT ASSETS (Last 5 by purchase date):
${recentAssets
  .map(
    (asset: any) =>
      `- ${asset.id}: "${asset.name}" (${asset.category}, ${asset.status}, purchased ${asset.purchaseDate})`,
  )
  .join("\\n")}

FORMATTING INSTRUCTIONS:
1. ALWAYS format your responses using Markdown for better readability
2. Use headers (# ## ###) to organize information
3. Use **bold** for important information like asset names, IDs, and key metrics
4. Use *italics* for emphasis and notes
5. Use bullet points (-) and numbered lists (1.) for structured data
6. Use tables when showing multiple assets with similar data
7. Use code blocks (\\\`\\\`\\\`) for asset IDs and technical information
8. Use blockquotes (>) for important warnings or recommendations
9. Use emojis sparingly but effectively for visual appeal (📊 📈 🔍 ⚠️ ✅ ❌)
10. Structure responses with clear sections and good spacing

RESPONSE GUIDELINES:
1. Use ONLY the real-time data provided above - this is the current, live asset database
2. When users ask about specific assets, search through the complete asset list
3. Provide accurate counts and information based on the live data
4. If an asset exists in the list, provide detailed information about it
5. If an asset doesn\'t exist, clearly state it\'s not found in the current database
6. Be helpful with suggestions for asset management and optimization
7. Use a professional but friendly tone
8. Always reference the actual asset IDs and names from the live data
9. When showing multiple assets, use tables or structured lists
10. Include relevant statistics and insights when appropriate

User Question: ${message}`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
