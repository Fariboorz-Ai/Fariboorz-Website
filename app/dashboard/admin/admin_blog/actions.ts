import { connectDB} from "@/app/db";
import Blog from "@/app/models/blogModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";


  export async function deleteBlogAction(formData: FormData) {
    'use server';
    await connectDB();
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      redirect('/auth/signin');
    }

  const slug = String(formData.get('slug') || '').trim();
  if (!slug) throw new Error('Missing slug');

    try {
      await Blog.findOneAndDelete({ slug });
      try {
        revalidatePath('/dashboard/admin/admin_blog');
        revalidatePath('/blog');
      } catch (e) {
        console.warn('revalidatePath failed', e);
      }
      redirect('/dashboard/admin/admin_blog');
    } catch (err: any) {
      console.error('delete error', err);
      throw new Error(err?.message || 'Failed to delete post');
    }
  }
