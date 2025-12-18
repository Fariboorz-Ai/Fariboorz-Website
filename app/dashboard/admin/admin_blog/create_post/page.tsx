"use client";

import React, { useActionState, useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { Label } from "../../../../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import Sidebar from "../../../../components/Sidebar";
import { createBlogAction } from "./actions";
import { useSession } from "next-auth/react";
import Image from "next/image";


const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function CreatePostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  
  if(!session || !session.user || session.user.role !== 'ADMIN') {
    router.push('/auth/signin');
  }

  const [state, formAction ,isPending] = useActionState(createBlogAction, {
    message: "",
    
  });

  useEffect(() => {
    if (title && !slug) {
      setSlug(slugify(title).slice(0, 120));
    }
  }, [title, slug]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80 text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-full ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Create New Blog Post
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Craft something awesome and share it with the world
            </p>
          </div>

          <Card className="backdrop-blur-md bg-card/90 border-border/50 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-2xl text-foreground">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form action={formAction} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter an epic title..."
                      className="h-12 text-lg text-foreground border-border/50 focus-visible:ring-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="auto-generated-slug"
                      className="h-12 text-lg text-foreground border-border/50 focus-visible:ring-primary/50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Thumbnail URL</Label>
                      <Input
                        name="thumbnail"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="h-12 text-foreground border-border/50 focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input
                        name="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="react, tailwind, nextjs"
                        className="h-12 text-foreground border-border/50 focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description / Excerpt</Label>
                      <Input
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short teaser for your post..."
                        className="h-12 text-foreground border-border/50 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Thumbnail Preview</Label>
                    {thumbnail ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="relative rounded-xl overflow-hidden shadow-xl border border-border/30"
                      >
                        <Image
                          src={thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-2xl font-bold">{title || "Your Title Here"}</p>
                          <p className="text-sm opacity-90">{description || "Preview description..."}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="w-full h-96 bg-muted/30 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center text-muted-foreground">
                        <p className="text-center">Enter a thumbnail URL to see preview</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label className="text-base font-medium mb-3 block">Content (Markdown)</Label>
                  <div className="border border-border/50 rounded-xl overflow-hidden shadow-lg">
                    <MDEditor value={content} onChange={(v) => setContent(v || "")} height={600} />
                 
                    <input type="hidden" name="message" value={content} />
                  </div>
                </motion.div>

                    <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer font-medium">
                    Publish immediately
                  </Label>
                </div>

           
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-end items-center gap-6 pt-8 border-t border-border/30"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-8 py-6 text-base"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-10 py-6 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all"
                  >
                    {isPending ? "Publishing..." : "Publish Post"}
                  </Button>
                </motion.div>

              
                {state?.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-center text-lg font-medium bg-destructive/10 py-4 rounded-lg"
                  >
                    {state.message}
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}