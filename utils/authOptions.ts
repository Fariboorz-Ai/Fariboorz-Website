import NextAuth, { AuthOptions } from "next-auth";
import userModel from "@/app/models/userModel";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/db";
import clientPromise from "./MongoDbClient";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectDB();
        const email = (credentials?.email || "").toString().trim().toLowerCase();
        const password = (credentials?.password || "").toString();
        if (!email || !password) {
          throw new Error("CREDENTIALS_REQUIRED");
        }
        const findedUser = await userModel
          .findOne({ email })
          .select("+password");
        if (!findedUser) throw new Error("USER_NOT_FOUND");

        const successCompare = await bcrypt.compare(
          password,
          findedUser.password
        );
        if (!successCompare) throw new Error("CREDENTIALS_MATCH_ERROR");

        return {
          id: findedUser._id,
          email: findedUser.email,
          name: findedUser.name,
          role: findedUser.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },

  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Accounts: "account",
      Sessions: "session",
      Users: "user",
      VerificationTokens: "token",
    },
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
