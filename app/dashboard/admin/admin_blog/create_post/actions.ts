"use server";

import mongoose from "mongoose";
import { connectDB } from "@/app/db";
import BlogsModel from "@/app/models/blogModel"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

const createBlogSchema = zfd.formData({
  title: zfd.text(z.string().min(1, "Title is required")),
  slug: zfd.text(z.string().optional()),
  message: zfd.text(z.string().min(10, "Content must be at least 10 characters")),
  description: zfd.text(z.string().optional()),
  thumbnail: zfd.text(z.string().url("Invalid image URL").or(z.literal(""))).optional(),
  tags: zfd.text(z.string().optional()),
  isPublished: zfd.checkbox(),
});

export async function createBlogAction(
  prevState: { message: string },
  formData: FormData
) {
  await connectDB();
  const session: any = await getServerSession(authOptions as any);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const validated = createBlogSchema.safeParse(formData);

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0] || "Invalid input";
    return { message: firstError };
  }

  const data = validated.data;

  const tagsArray = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  try {
    await BlogsModel.create({
      author: session.user.id,
      title: data.title.trim(),
      slug: data.slug?.trim() || undefined,
      message: data.message,
      description: data.description || undefined,
      thumbnail: data.thumbnail || null,
      tags: tagsArray,
      isPublished: data.isPublished,

    });
 
    try {
      revalidatePath("/dashboard/admin/admin_blog");
      revalidatePath("/blog");
    } catch (e) {
    
      console.warn('revalidatePath failed', e);
    }
    redirect("/dashboard/admin/admin_blog");

  } catch (error: any) {
    const digest: string | undefined = (error && (error.digest || error.message)) as any;
    if (typeof digest === 'string' && digest.startsWith && digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Error creating blog:", error);
    return { message: error?.message || "Failed to create post" };
  }

}