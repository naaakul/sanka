import { redis } from "@/lib/redis";
import { auth } from "@/utils/auth-helpers";

export async function POST(req: Request) {
  try {
    const { sessionId, role, content } = await req.json();

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return Response.json({ ok: false, reason: "Unauthorized" }, { status: 401 });
    }

    const key = `chat:${sessionId}`;
    const data = await redis.get<string>(key);

    let parsed: any;
    try {
      parsed = data ? JSON.parse(data) : { messages: [], version: 1, updatedAt: Date.now() };
    } catch {
      parsed = { messages: [], version: 1, updatedAt: Date.now() };
    }

    parsed.messages.push({
      role,
      content,
      createdAt: Date.now(),
    });
    parsed.updatedAt = Date.now();

    await redis.set(key, JSON.stringify(parsed), { ex: 60 * 60 * 24 });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Error sending chat:", err);
    return Response.json({ ok: false, reason: "Server error" }, { status: 500 });
  }
}




// import { redis } from "@/lib/redis";
// import { auth } from "@/utils/auth-helpers";

// export async function POST(req: Request) {
//   try {
//     const { chatId, role, prompt } = await req.json();

//     const session = await auth.api.getSession({ headers: req.headers });
//     if (!session?.user?.id) {
//       return Response.json(
//         { ok: false, reason: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const key = `chat:${chatId}`;
//     const data = await redis.get<string>(key);

//     let parsed: any;
//     try {
//       parsed = data
//         ? JSON.parse(data)
//         : { messages: [], version: 1, updatedAt: Date.now() };
//     } catch {
//       parsed = { messages: [], version: 1, updatedAt: Date.now() };
//     }

//     parsed.messages.push({
//       role,
//       prompt,
//       createdAt: Date.now(),
//     });
//     parsed.updatedAt = Date.now();

//     if (role === "user") {
//       const baseUrl =
//         process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//       const res = await fetch(`${baseUrl}/api/generate/code`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: prompt }),
//       });

//       let botReply = { messages: "Sorry, failed to generate.", code: [] };
//       try {
//         if (res.ok) {
//           const out = await res.json();
//           botReply = out; // shape: { messages, code }
//         }
//       } catch (e) {
//         console.error("Failed parsing code-gen response:", e);
//       }

//       parsed.messages.push({
//         role: "bot",
//         prompt: botReply,
//         createdAt: Date.now(),
//       });
//       parsed.updatedAt = Date.now();
//     }

//     await redis.set(key, JSON.stringify(parsed), { ex: 60 * 60 * 24 });

//     return Response.json({ ok: true, chat: parsed });
//   } catch (err) {
//     console.error("Error sending chat:", err);
//     return Response.json(
//       { ok: false, reason: "Server error" },
//       { status: 500 }
//     );
//   }
// }
