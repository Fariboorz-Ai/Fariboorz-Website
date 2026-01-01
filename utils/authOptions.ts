import { AuthOptions } from "next-auth";
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
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const email = (credentials?.email || "").toString().trim().toLowerCase();
        const password = (credentials?.password || "").toString();

        if (!email || !password) {
          throw new Error("CREDENTIALS_REQUIRED");
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) throw new Error("USER_NOT_FOUND");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("CREDENTIALS_MATCH_ERROR");

      
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          national_code: user.national_code,
        };
      },
    }),
  ],

  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Accounts: "account",
      Sessions: "session",
      Users: "user",
      VerificationTokens: "token",
    },
  }),

  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      return !!user;
    },

   
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.national_code = user.national_code;
      }
      return token;
    },

  
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          national_code: token.national_code as string,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};