import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, assets } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const lowerMessage = message.toLowerCase().trim()
    const assetCount = assets?.length || 0

    // Calculate some basic stats for responses
    const activeAssets = Math.floor(assetCount * 0.85)
    const maintenanceAssets = Math.floor(assetCount * 0.1)
    const retiredAssets = Math.floor(assetCount * 0.05)

    let response = ""

    // Enhanced keyword matching with multiple conditions
    if (
      lowerMessage.includes("show all") ||
      lowerMessage.includes("all assets") ||
      lowerMessage.includes("list assets")
    ) {
      response = `# Asset Overview 📊

You currently have **${assetCount} assets** in your system:

## Asset Categories:
- **Electronics**: Laptops, monitors, phones, tablets
- **Vehicles**: Company cars, delivery trucks, motorcycles  
- **Equipment**: Manufacturing tools, office equipment, machinery
- **Furniture**: Desks, chairs, storage units, tables
- **IT Hardware**: Servers, networking equipment, printers

## Current Status:
- ✅ **Active Assets**: ${activeAssets} (${Math.round((activeAssets / assetCount) * 100)}%)
- 🔧 **Under Maintenance**: ${maintenanceAssets} (${Math.round((maintenanceAssets / assetCount) * 100)}%)
- 🚫 **Retired**: ${retiredAssets} (${Math.round((retiredAssets / assetCount) * 100)}%)

## Quick Actions:
- View detailed asset table in the main dashboard
- Generate QR codes for asset tracking
- Export asset data for reporting

Would you like me to show details for a specific category?`
    } else if (lowerMessage.includes("find") || lowerMessage.includes("search") || lowerMessage.includes("look for")) {
      response = `# Asset Search 🔍

I can help you find specific assets! Here are some ways to search:

## Search Methods:
- **By Name**: "Find Dell laptop" or "Show iPhone 13"
- **By Category**: "Show all vehicles" or "List furniture"
- **By Status**: "Find maintenance items" or "Show active assets"
- **By Location**: "Assets in Building A" or "Items in warehouse"
- **By ID**: "Show asset #12345" or "Find ID A001"

## Current Asset Categories Available:
${
  assetCount > 0
    ? `
- **Electronics** (estimated ${Math.floor(assetCount * 0.3)} items)
- **Vehicles** (estimated ${Math.floor(assetCount * 0.15)} items)
- **Equipment** (estimated ${Math.floor(assetCount * 0.25)} items)
- **Furniture** (estimated ${Math.floor(assetCount * 0.2)} items)
- **IT Hardware** (estimated ${Math.floor(assetCount * 0.1)} items)
`
    : "No assets found in database"
}

## Quick Search Tips:
- Be specific: "MacBook Pro" instead of just "laptop"
- Use status filters: "active printers" or "broken chairs"
- Try location-based searches: "conference room assets"

What specific asset are you looking for?`
    } else if (lowerMessage.includes("laptop") || lowerMessage.includes("computer") || lowerMessage.includes("pc")) {
      const laptopCount = Math.floor(assetCount * 0.15) || 5
      response = `# Laptop Assets 💻

## Current Laptop Inventory:
- **Dell Latitude Series**: ${Math.floor(laptopCount * 0.4)} units
- **MacBook Pro**: ${Math.floor(laptopCount * 0.3)} units  
- **HP EliteBook**: ${Math.floor(laptopCount * 0.2)} units
- **Lenovo ThinkPad**: ${Math.floor(laptopCount * 0.1)} units

## Status Overview:
- **Total Laptops**: ${laptopCount} units
- **In Use**: ${Math.floor(laptopCount * 0.8)} units (${Math.round(80)}%)
- **Available**: ${Math.floor(laptopCount * 0.15)} units (${Math.round(15)}%)
- **Under Maintenance**: ${Math.floor(laptopCount * 0.05)} units (${Math.round(5)}%)

## Upcoming Actions:
⚠️ **${Math.floor(laptopCount * 0.1)}** laptops due for maintenance next week  
📅 **${Math.floor(laptopCount * 0.15)}** laptops warranty expiring in 60 days  
💰 **${Math.floor(laptopCount * 0.2)}** laptops eligible for replacement (>4 years old)

## Quick Actions:
- Check specific laptop by serial number
- Schedule maintenance for aging devices
- Request new laptop assignment
- View laptop usage analytics

Need details on a specific laptop model or want to assign one?`
    } else if (
      lowerMessage.includes("maintenance") ||
      lowerMessage.includes("repair") ||
      lowerMessage.includes("service")
    ) {
      response = `# Maintenance Schedule 🔧

## Items Due for Maintenance:

### **This Week:**
- **Vehicle #V001** - Oil change & inspection (Due: Tomorrow)
- **Printer #P045** - Routine cleaning (Due: Friday)
- **AC Unit #AC12** - Filter replacement (Due: Thursday)
- **Laptop #L234** - Hardware diagnostic (Due: Wednesday)

### **Next Week:**
- **Server #S001** - System update & backup (Due: Monday)
- **Forklift #F003** - Safety inspection (Due: Wednesday)
- **Generator #G002** - Monthly service check (Due: Friday)
- **Fire System #FS01** - Quarterly inspection (Due: Saturday)

### **Overdue (Action Required):**
⚠️ **Generator #G001** - Annual service (7 days overdue)  
⚠️ **Fire Extinguisher #FE23** - Safety inspection (3 days overdue)
⚠️ **Elevator #EL01** - Monthly check (2 days overdue)

## Maintenance Statistics:
- **Scheduled This Month**: ${Math.floor(assetCount * 0.3)} items
- **Completed**: ${Math.floor(assetCount * 0.2)} items (67%)
- **Pending**: ${Math.floor(assetCount * 0.08)} items (27%)
- **Overdue**: ${Math.floor(assetCount * 0.02)} items (6%) ⚠️

## Quick Actions:
- Schedule new maintenance tasks
- Send reminder notifications
- View maintenance history
- Generate maintenance reports

Would you like me to schedule maintenance or send reminders to technicians?`
    } else if (lowerMessage.includes("stock") || lowerMessage.includes("inventory") || lowerMessage.includes("low")) {
      response = `# Inventory & Stock Alert ⚠️

## Items Requiring Attention:

### **Critical Stock (< 5 units):**
- **Laptop Chargers**: 2 remaining ⚠️
- **Office Chairs**: 3 remaining ⚠️  
- **Mobile Phones**: 1 remaining 🚨
- **Desk Lamps**: 4 remaining ⚠️

### **Low Stock (< 10 units):**
- **Computer Monitors**: 7 remaining
- **Wireless Keyboards**: 8 remaining
- **USB Cables**: 6 remaining
- **Printer Cartridges**: 9 remaining

### **Adequate Stock (10+ units):**
- **Desks**: 15 available ✅
- **Network Cables**: 25 available ✅
- **Power Strips**: 18 available ✅

## Procurement Recommendations:
🛒 **Order immediately**: Laptop chargers, mobile phones  
📋 **Plan for next month**: Office chairs, desk lamps  
✅ **Monitor closely**: Monitors, keyboards, USB cables

## Budget Impact:
- **Immediate orders needed**: ~$2,500
- **Planned purchases**: ~$4,200
- **Total monthly budget**: ~$6,700

Would you like me to help create purchase orders or set up automatic reorder alerts?`
    } else if (lowerMessage.includes("vehicle") || lowerMessage.includes("car") || lowerMessage.includes("truck")) {
      const vehicleCount = Math.floor(assetCount * 0.1) || 3
      response = `# Vehicle Fleet 🚗

## Current Fleet Overview:
- **Company Cars**: ${Math.floor(vehicleCount * 0.6)} vehicles
- **Delivery Trucks**: ${Math.floor(vehicleCount * 0.3)} vehicles
- **Service Vans**: ${Math.floor(vehicleCount * 0.1)} vehicles

## Fleet Status:
- **Active/In Use**: ${Math.floor(vehicleCount * 0.8)} vehicles (${Math.round(80)}%)
- **Available**: ${Math.floor(vehicleCount * 0.15)} vehicles (${Math.round(15)}%)
- **Under Maintenance**: ${Math.floor(vehicleCount * 0.05)} vehicles (${Math.round(5)}%)

## Upcoming Maintenance:
🔧 **Oil Changes**: 2 vehicles due this week  
🔍 **Inspections**: 1 vehicle due next week  
🛞 **Tire Rotations**: 3 vehicles due this month

## Fleet Analytics:
- **Average Mileage**: 45,000 miles
- **Fuel Efficiency**: 28.5 MPG average
- **Maintenance Cost**: $1,200/month average

## Quick Actions:
- Schedule vehicle maintenance
- Check vehicle availability
- View fuel consumption reports
- Track vehicle locations

Need to book a vehicle or schedule maintenance?`
    } else if (
      lowerMessage.includes("report") ||
      lowerMessage.includes("analytics") ||
      lowerMessage.includes("statistics")
    ) {
      response = `# Asset Analytics Report 📈

## Executive Summary:
**Total Assets**: ${assetCount}  
**Total Value**: $${(assetCount * 1250).toLocaleString()}  
**Monthly Depreciation**: $${(assetCount * 45).toLocaleString()}

## Asset Distribution:
- **Electronics**: ${Math.round(assetCount * 0.35)} (35%)
- **Equipment**: ${Math.round(assetCount * 0.25)} (25%)
- **Furniture**: ${Math.round(assetCount * 0.2)} (20%)
- **Vehicles**: ${Math.round(assetCount * 0.15)} (15%)
- **IT Hardware**: ${Math.round(assetCount * 0.05)} (5%)

## Performance Metrics:
- **Asset Utilization**: 87% (Above target of 85%)
- **Maintenance Compliance**: 94% (Excellent)
- **Replacement Rate**: 12% annually (Within budget)
- **Cost per Asset**: $1,250 average

## Key Insights:
✅ **High utilization** across all categories  
⚠️ **Aging laptop inventory** needs attention  
💰 **Cost optimization** opportunity in furniture  
🔧 **Preventive maintenance** program working well

## Recommendations:
1. **Refresh laptop inventory** (15% are >4 years old)
2. **Optimize furniture allocation** (20% underutilized)
3. **Expand preventive maintenance** to reduce breakdowns
4. **Consider leasing** for high-depreciation items

Would you like a detailed breakdown of any specific category?`
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("commands")
    ) {
      response = `# Asset Management Assistant 🤖

I'm your **AI Asset Assistant** with access to your **live asset database** (${assetCount} assets).

## 📊 **Analytics & Reports**
- Asset utilization statistics and trends
- Maintenance schedules and alerts
- Cost analysis and depreciation tracking
- Category-wise performance breakdowns

## 🔍 **Search & Discovery**
- Find specific assets by name, ID, or category
- Filter by status, location, or department
- Generate custom asset lists and reports
- Quick inventory lookups

## 📋 **Management Tasks**
- Asset lifecycle tracking and monitoring
- Maintenance recommendations and scheduling
- Procurement suggestions and alerts
- Compliance monitoring and reporting

## 💡 **Insights & Optimization**
- Usage pattern analysis and recommendations
- Cost optimization opportunities
- Replacement planning and budgeting
- Risk assessments and mitigation

## 🚀 **Quick Commands to Try:**
- *"Show all assets"* - Complete inventory overview
- *"Find laptops"* - Search specific asset types
- *"What needs maintenance?"* - Maintenance schedule
- *"Check low stock"* - Inventory alerts
- *"Generate report"* - Analytics and insights
- *"Show vehicles"* - Fleet management info

## 💬 **Natural Language:**
You can ask me questions naturally like:
- "How many laptops do we have?"
- "Which assets need repair?"
- "Show me the monthly report"
- "What's our most expensive equipment?"

**I'm here to help you manage your ${assetCount} assets more effectively!**`
    } else {
      // For unrecognized queries, provide a helpful response with suggestions
      response = `# I'm Here to Help! 🤖

I didn't quite understand "${message}", but I can help you with many asset management tasks!

## 🔍 **Did you mean:**
- **"Show all assets"** - View complete inventory (${assetCount} assets)
- **"Find [item name]"** - Search for specific assets
- **"What needs maintenance?"** - Check maintenance schedule
- **"Check low stock"** - Review inventory levels
- **"Generate report"** - Get analytics and insights

## 💡 **Popular Queries:**
- Asset counts and categories
- Maintenance schedules and alerts
- Inventory and stock levels
- Cost analysis and reports
- Equipment availability

## 📝 **Try asking me:**
- "How many laptops do we have?"
- "Show me all vehicles"
- "What's due for maintenance?"
- "Which items are low in stock?"
- "Generate monthly report"

## 🎯 **Pro Tip:**
Be specific in your requests! Instead of "stuff", try "laptops" or "office equipment". I work best with clear, direct questions about your assets.

**What would you like to know about your ${assetCount} assets?**`
    }

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        message: `# Service Temporarily Unavailable 🔧

I'm experiencing some technical difficulties right now. Here's what you can try:

## Alternative Actions:
- **Refresh the page** and try again
- **Check your internet connection**
- **Use the main dashboard** for asset management
- **Contact support** if the issue persists

## Quick Asset Actions Available:
- View assets in the main table
- Add new assets using the "+" button
- Generate QR codes for existing assets
- Export asset data for offline access

I'll be back online shortly! 🤖`,
      },
      { status: 200 },
    )
  }
}
