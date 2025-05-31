import { type NextRequest, NextResponse } from "next/server"
import { readdir, readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const SITES_DIR = path.join(process.cwd(), "data", "premium-sites")

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug do servidor iniciado...")

    const debugInfo: any = {
      sitesDir: SITES_DIR,
      dirExists: existsSync(SITES_DIR),
      files: [],
      totalSites: 0,
      sampleSite: null,
    }

    if (debugInfo.dirExists) {
      try {
        const files = await readdir(SITES_DIR)
        debugInfo.files = files
        debugInfo.totalSites = files.filter((f) => f.endsWith(".json") && f !== "index.json").length

        // Ler um site de exemplo
        const siteFiles = files.filter((f) => f.endsWith(".json") && f !== "index.json")
        if (siteFiles.length > 0) {
          const samplePath = path.join(SITES_DIR, siteFiles[0])
          const sampleData = await readFile(samplePath, "utf-8")
          debugInfo.sampleSite = {
            filename: siteFiles[0],
            data: JSON.parse(sampleData),
          }
        }
      } catch (readError) {
        debugInfo.readError = readError.message
      }
    }

    console.log("📊 Debug info:", debugInfo)

    return NextResponse.json({
      success: true,
      debug: debugInfo,
    })
  } catch (error) {
    console.error("❌ Erro no debug:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
