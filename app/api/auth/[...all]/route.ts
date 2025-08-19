import { auth } from "@/utils/auth-helpers.ts";
import { toNextJsHandler } from "better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth.handler);