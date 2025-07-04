// src/utils/auth.ts
import { betterAuth }          from "better-auth";
import { prismaAdapter }       from "better-auth/adapters/prisma";
import { PrismaClient }        from "@prisma/client";
import crypto                  from "crypto";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.action === "create" && (params.model === "Session" || params.model === "Account")) {
    const data: any = params.args.data;

    if (params.model === "Session") {
      data.sessionToken ||= crypto.randomUUID();
      data.expires      ||= new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      data.createdAt    ||= new Date();
      data.updatedAt    ||= new Date();
    }

    if (params.model === "Account") {
      data.provider           ||= data.providerId;
      data.providerAccountId  ||= data.accountId;
      data.createdAt          ||= new Date();
      data.updatedAt          ||= new Date();
    }
  }

  return next(params);
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId:     process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
