import { NextRequest, NextResponse } from "next/server";
import { getDivisionMatches } from "@/lib/data";

export async function GET(req: NextRequest) {
  const divisionId = req.nextUrl.searchParams.get("divisionId");
  if (!divisionId) {
    return NextResponse.json({ error: "divisionId is required" }, { status: 400 });
  }
  const matches = await getDivisionMatches(divisionId);
  return NextResponse.json({ matches, fetchedAt: new Date().toISOString() });
}
