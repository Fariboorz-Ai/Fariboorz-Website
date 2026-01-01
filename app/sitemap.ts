import type { MetadataRoute } from 'next';
import BlogsModel from '@/app/models/blogModel'; 
import { connectDB } from '@/app/db';

const baseUrl = 'https://fariboorzai.com'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

 
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/free-signals`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/performance`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
   
  ];

 
  const blogPosts = await BlogsModel.find({ isPublished: true })
    .select('slug updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const blogRoutes = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/posts/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  
  return [...staticRoutes, ...blogRoutes];
}


export const revalidate = 3600; 