import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email required" },
        { status: 400 }
      );
    }

    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "You are already on the waitlist",
      });
    }

    await prisma.waitlist.create({
      data: { email },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Sañka" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🎉 You’re on the Sanka Waitlist!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; background: #f9f9f9; color: #333;">
      <div style="text-align: center;">
        <img src="https://sanka.nakul.space/brand/mail-cover.png" alt="Sañka Logo" style="width: 120px; margin-bottom: 20px;" />
        <h2 style="color:#1271FF;">Welcome to Sañka </h2>
      </div>

      <p style="font-size: 16px; line-height: 1.5;">
        Thanks for joining our waitlist, <b>${email}</b>!
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        We’ll notify you with updates and early access soon.
      </p>

      <br/>
      <p style="font-size: 14px; color: #555; text-align: center;">
        — Team Sanka
      </p>
    </div>
  `,
    });

    return NextResponse.json({
      success: true,
      message: "You’ve been added to the waitlist",
    });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.waitlist.count();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to get count" },
      { status: 500 }
    );
  }
}
