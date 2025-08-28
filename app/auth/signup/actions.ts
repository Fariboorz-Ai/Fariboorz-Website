"use server";
import { connectDB } from "@/app/db";
import userModel from "@/app/models/userModel";
import { zfd } from "zod-form-data";
import bcrypt from "bcrypt";
import { uid } from 'uid';

export async function signup(
  prevState: { message: string },
  formData: FormData
) {
  try {
    await connectDB();

    const formSchema = zfd.formData({
      name: zfd.text(),
      email: zfd.text(),
      password: zfd.text(),
    });

    const parsed = formSchema.safeParse(formData);
    if (!parsed.success) {
      return { message: "Please fill all required fields" };
    }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return { message: "Invalid email address" };
    }
    if (password.length < 6) {
      return { message: "Password must be at least 6 characters" };
    }
    if (!name) {
      return { message: "Name is required" };
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return { message: "Email already exists" };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      uid: uid(11),
      role: "MEMBER",
    });

    return { message: "user created successfully" };
  } catch (error: any) {
    if (error && error.code === 11000) {
      return { message: "Email already exists" };
    }
    return { message: "An unexpected error occurred" };
  }
}
