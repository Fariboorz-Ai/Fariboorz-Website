import NextAuth, { AuthOptions } from "next-auth";

import { authOptions } from "@/utils/authOptions";


const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
