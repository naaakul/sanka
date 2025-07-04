// utils/auth.ts (or lib/auth.ts)

import { betterAuth } from "better-auth";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";

// 1) Create your Kysely instance as usual
const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});

// 2) Pass *that* directly to betterAuth()
//    No import from "better-auth/adapters/kysely" is needed
export const auth = betterAuth({
  database: db,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  cookies: nextCookies(), // if you’re on Next.js App Router
});
