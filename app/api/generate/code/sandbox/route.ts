import { NextResponse } from "next/server";
import { Sandbox } from "e2b";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { files } = body; 
    // console.log("data --->", files)

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid files" },
        { status: 400 }
      );
    }

    const sandbox = await Sandbox.create("mk6klmser1ctnxf0d9ed", {
      apiKey: process.env.E2B_API_KEY!,
      timeoutMs: 5 * 60 * 1000,
    });

    await Promise.all(
      files.map((f: any) =>
        sandbox.files.write(`/home/user/box/${f.path}`, f.content)
      )
    );

    await sandbox.commands.run("npm install", { cwd: "/home/user/box" });
    await sandbox.commands.run("npm run dev", {
      cwd: "/home/user/box",
      background: true,
    });

    const host = sandbox.getHost(3000);
    const url = `https://${host}`;

    return NextResponse.json({ success: true, previewUrl: url });
  } catch (err: any) {
    console.error("Sandbox error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}