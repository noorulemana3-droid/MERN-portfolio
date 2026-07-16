import { NextResponse } from "next/server";
import { fetchGithubDashboard } from "@/services/github";

export async function GET() {
  try {
    const data = await fetchGithubDashboard();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        profile: null,
        repos: [],
        languages: {},
        error:
          "GitHub data unavailable. Set NEXT_PUBLIC_GITHUB_USERNAME to a valid public username.",
      },
      { status: 200 },
    );
  }
}
