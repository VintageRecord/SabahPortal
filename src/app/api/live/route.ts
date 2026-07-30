import { NextResponse } from "next/server";
import { getLiveMatches } from "@/lib/data";

export async function GET() {
  const matches = await getLiveMatches();
  return NextResponse.json({ matches, fetchedAt: new Date().toISOString() });
}
