import React from "react";
import Header from "@/app/header";
import Footer from "@/app/footer";
import { connectDB } from "@/app/db";
import Blog, { IBlog } from "@/app/models/blogModel";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Icon from "@/app/components/Icon";
import mongoose from "mongoose";
import Image from "next/image";
import { Metadata } from 'next';


interface Props {
  params: Promise<{ slug: string }>;
}


type BlogItem = {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  slug?: string;
  createdAt?: Date | string;
  author?: { name?: string } | null;
  message?: string;
};

type PopulatedAuthor = { _id: mongoose.Types.ObjectId; name?: string } | null;
type PopulatedBlog = Omit<IBlog, 'author'> & { author: PopulatedAuthor };

type RecommendedItem = {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  publishedAt?: Date;
  views?: number;
};

async function getPostBySlug(slug: string): Promise<PopulatedBlog | null> {
  await connectDB();
  const post = await Blog.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name");
  return post;
}

async function getRecommended(slug: string, limit = 3): Promise<RecommendedItem[]> {
  await connectDB();
  const docs = await Blog.find<IBlog>({ slug: { $ne: slug } })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select("title slug description thumbnail publishedAt views")
    .lean();
  return docs as unknown as RecommendedItem[];
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug); 

  if (!post || !post.isPublished) {
    return {
      title: 'Article Not Found',
      description: 'The requested blog post could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title} | Fariboorz AI Blog`;
  const description = post.description || 'In-depth trading and AI signals analysis from Fariboorz AI experts.';

  return {
    title,
    description,
    alternates: { canonical: `/blog/posts/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `https://fariboorzai.com/blog/posts/${post.slug}`,
      type: 'article',
      publishedTime: post.createdAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      images: post.thumbnail ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }] : ['/og-image.jpg'],
      authors: [post.author?.name || 'Fariboorz AI'],
      section: 'Trading Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : ['/og-image.jpg'],
    },
  };
}

const BlogPost = async({ params }: Props) => {
 const { slug } = await params;
  const postDoc = await getPostBySlug(slug);

  if (!postDoc) {
    notFound();
  }

  const recommended = await getRecommended(slug, 3);

  const post: BlogItem = {
    id: String(postDoc._id),
    slug: postDoc.slug,
    title: postDoc.title,
    description: postDoc.description,
    thumbnail: postDoc.thumbnail || undefined,
    createdAt: postDoc.createdAt,
    author: postDoc.author || null,
    message: postDoc.message || "",
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-base-200 to-background text-foreground overflow-hidden">
      <Header />

      <main className="w-full max-w-6xl mx-auto flex-1 p-4 md:p-6 lg:p-8">
  

        <div className="relative mb-12">
          {post.thumbnail && (
            <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
              <Image
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-۴ md:p-12 z-20">
                <div className="max-w-3xl">
              
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                    {post.description}
                  </p>
                      <div className="flex flex-wrap items-center gap-4 text-white/80 mb-4">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:user" className="text-sm" />
                      <span className="text-sm font-medium">
                        {post.author?.name || "Admin"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:calendar-alt" className="text-sm" />
                      <time className="text-sm">
                        {post.createdAt
                          ? format(new Date(post.createdAt), "PPP")
                          : ""}
                      </time>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:clock" className="text-sm" />
                      <span className="text-sm">
                        {postDoc.readingTime
                          ? `${postDoc.readingTime} min read`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:eye" className="text-sm" />
                      <span className="text-sm">{postDoc.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!post.thumbnail && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full">
                  <Icon icon="fa-solid:user" className="text-sm" />
                  <span className="text-sm font-medium">
                    {post.author?.name || "Fariboorz"}
                  </span>
                </div>
                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:calendar-alt" className="text-sm" />
                  <time className="text-sm">
                    {post.createdAt
                      ? format(new Date(post.createdAt), "PPP")
                      : ""}
                  </time>
                </div>
                <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:clock" className="text-sm" />
                  <span className="text-sm">
                    {postDoc.readingTime
                      ? `${postDoc.readingTime} min read`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full">
                      <Icon icon="fa-solid:eye" className="text-sm" />
                  <span className="text-sm">{postDoc.views || 0} views</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                {post.description}
              </p>
            </div>
          )}
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
          <article className="lg:col-span-8 space-y-8">
            <div className="prose prose-lg dark:prose-invert max-w-none bg-base-100 p-6 md:p-8 rounded-3xl shadow-lg border border-base-300">
              <div className="prose-headings:font-black prose-headings:tracking-tight 
                            prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                            prose-a:text-primary hover:prose-a:text-primary/80
                            prose-blockquote:border-l-4 prose-blockquote:border-primary 
                            prose-blockquote:pl-4 prose-blockquote:italic
                            prose-code:bg-base-200 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg
                            prose-pre:bg-base-300 prose-pre:border prose-pre:border-base-300
                            prose-img:rounded-2xl prose-img:shadow-lg
                            prose-strong:text-foreground prose-strong:font-bold">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {post.message}
                </ReactMarkdown>
              </div>
            </div>

          
          </article>

       
          <aside className="lg:col-span-4 space-y-8">
        

         
            <div className="sticky top-8">
              <div className="bg-base-100 p-6 rounded-3xl shadow-lg border border-base-300">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Recommended Reads
                  </span>
                </h2>
                <div className="space-y-4">
                  {recommended.map((r: RecommendedItem) => (
                    <Link
                      key={String(r._id)}
                      href={`/blog/posts/${r.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-base-200 transition-all duration-300 border border-transparent hover:border-base-300">
                        {r.thumbnail && (
                          <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                            <Image
                              src={r.thumbnail}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Icon icon="fa-solid:calendar-alt" />
                            <time>
              {r.publishedAt ? format(new Date(r.publishedAt), "MMM d") : ""}
                            </time>
                            {r.views && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Icon icon="fa-solid:eye" className="text-xs" />
                                  <span>{r.views}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

       
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                More from the blog
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover more insightful articles that might interest you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommended.map((r: RecommendedItem) => (
              <Link
                key={String(r._id)}
                href={`/blog/posts/${r.slug}`}
                className="group"
              >
                <div className="bg-base-100 rounded-3xl shadow-lg overflow-hidden border border-base-300 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {r.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={r.thumbnail}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                          <Icon icon="fa-solid:calendar-alt" className="text-xs" />
                        <time>
                          {r.publishedAt
                            ? format(new Date(r.publishedAt), "MMM d, yyyy")
                            : ""}
                        </time>
                      </div>
                      {r.views && (
                        <div className="flex items-center gap-1">
                          <Icon icon="fa-solid:eye" className="text-xs" />
                          <span>{r.views}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {r.description}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        Read article
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BlogPost;