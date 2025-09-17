import { NextResponse } from "next/server";
import { auth } from "@/utils/auth-helpers";
import { getChatSessions } from "@/lib/actions/getChatSessions";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessions = await getChatSessions(session.user.id);
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("Error fetching chat sessions:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
