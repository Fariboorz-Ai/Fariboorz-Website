import React from "react";
import Header from "../header";
import Footer from "../footer";
import { connectDB } from "../db";
import Blog from "../models/blogModel";
import Link from "next/link";
import { format } from "date-fns";
import { FaCalendarAlt, FaClock, FaArrowRight, FaFire, FaBookOpen, FaEye } from "react-icons/fa";

type BlogItem = {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  slug?: string;
  createdAt?: string;
  views: number;
  readingTime?: number;
  tags?: string[];
};

async function getBlogs(): Promise<BlogItem[]> {
  await connectDB();

  const docs = await Blog.find()
    .sort({ createdAt: -1, isPublished: -1 })
    .lean();

  return docs.map((d: any) => ({
    id: String(d._id),
    slug: d.slug,
    title: d.title,
    description: d.description,
    thumbnail: d.thumbnail || undefined,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
    views: d.views || 0,
    readingTime: d.readingTime || 5,
    tags: d.tags || [],
  }));
}

function BlogCard({ blog, index }: { blog: BlogItem; index: number }) {
  const isFeatured = index < 2;
  
  return (
    <Link href={`/blog/posts/${blog.slug}`} className="group block h-full">
      <article className={`relative overflow-hidden rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 flex flex-col h-full`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-secondary/5 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10" />
        
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            <FaFire className="text-xs" />
            <span>Featured</span>
          </div>
        )}
        
        {blog.views > 1000 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            <span>Trending</span>
          </div>
        )}

        <div className={`flex flex-col ${isFeatured ? 'md:flex-row' : ''} h-full`}>
          {blog.thumbnail ? (
            <div className={`relative ${isFeatured ? 'md:w-2/5 h-40 md:h-auto' : 'h-40'} overflow-hidden flex-shrink-0`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10" />
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="absolute bottom-2 left-2 z-20 flex flex-wrap gap-1">
                  {blog.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`${isFeatured ? 'md:w-2/5' : 'w-full'} h-40 bg-muted/30 flex items-center justify-center flex-shrink-0`}>
              <div className="text-center">
                <FaBookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">{blog.title}</span>
              </div>
            </div>
          )}

          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full">
                  <FaCalendarAlt className="text-[10px]" />
                  <time>{blog.createdAt ? format(new Date(blog.createdAt), "MMM d") : ''}</time>
                </div>
                <div className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full">
                  <FaClock className="text-[10px]" />
                  <span>{blog.readingTime} min</span>
                </div>
                {blog.views > 0 && (
                  <div className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full">
                    <FaEye className="text-[10px]" />
                    <span>{blog.views > 999 ? `${(blog.views/1000).toFixed(1)}k` : blog.views}</span>
                  </div>
                )}
              </div>

              <h3 className={`font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors ${isFeatured ? 'text-lg' : 'text-base'}`}>
                {blog.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {blog.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between">
              {blog.tags && blog.tags.length > 2 && (
                <div className="flex items-center gap-1 overflow-hidden">
                  {blog.tags.slice(2, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{blog.tags.length - 4}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                <span>Read</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-base-200 to-backgroundtext-foreground">
      <Header />

      <main className="w-full max-w-7xl mx-auto flex-1 p-4 md:p-6 lg:p-8">
        <header className="relative mb-10 md:mb-12 pt-6 md:pt-8">
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10" />
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore insightful articles, tutorials, and latest updates from our team.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{blogs.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary">
                  {blogs.reduce((acc, blog) => acc + (blog.views || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Views</div>
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="blog-list" className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="blog-list" className="text-xl md:text-2xl font-bold">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Latest Articles
                </span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Sorted by newest first</p>
            </div>
          </div>

          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBookOpen className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                We're working on creating amazing content for you. Check back soon!
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}