import { format } from 'date-fns';
import {
  BsPlusCircle, BsEye, BsCalendar3, BsTrash3,
  BsSearch, BsFilter, BsActivity, BsFileText, BsClockHistory
} from 'react-icons/bs';
import {
  Card, CardContent, CardHeader, CardTitle
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import Sidebar from '../../../components/Sidebar';
import dotenv from 'dotenv';
import { connectDB } from '../../../../app/db';
import Blog from '../../../../app/models/blogModel';
import Users from '../../../../app/models/userModel';
import  Link  from 'next/link';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { redirect } from 'next/navigation';
import {deleteBlogAction} from './actions';

dotenv.config();

export default async function AdminBlogPage() {
  

  await connectDB();
  const docs = await Blog.find().sort({ publishedAt: -1, createdAt: -1 }).populate('author', 'name').lean();
  const users = await Users.find().select('_id name').lean();
   

  const blogs = docs.map((b: any) => {

    let author: { _id?: any; name?: string } | null = null;
    if (b.author) {
      if (typeof b.author === 'object' && b.author.name) {
        author = { _id: b.author._id, name: b.author.name };
      } else {
        const u = users.find((u: any) => String(u._id) === String(b.author));
        if (u) author = { _id: u._id, name: u.name };
      }
    }

    return {
      _id: b._id,
      title: b.title,
      slug: b.slug,
      thumbnail: b.thumbnail,
      author,
      createdAt: b.createdAt,
      views: b.views || 0,
      isPublished: b.isPublished || false,
    };
  });
  
   const session: any = await getServerSession(authOptions as any);
  const totalPosts = blogs.length;
  const publishedPosts = blogs.filter(b => b.isPublished).length;
  const draftPosts = blogs.filter(b => !b.isPublished).length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
 
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-full ml-64 overflow-x-hidden">
     
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Blog Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage, create and track your blog content</p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: totalPosts, icon: BsFileText, color: "text-primary" },
            { label: "Published", value: publishedPosts, icon: BsActivity, color: "text-success" },
            { label: "Drafts", value: draftPosts, icon: BsClockHistory, color: "text-warning" },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: BsEye, color: "text-info" },
          ].map((item, i) => (
            <Card 
              key={i} 
              className="bg-card/90 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                  <item.icon className={`w-8 h-8 ${item.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

       
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/dashboard/admin/admin_blog/create_post" className="flex items-center gap-2">
              <BsPlusCircle className="w-5 h-5" />
              Create New Post
            </Link>
          </Button>
        </div>


        <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-2xl text-primary flex items-center justify-between">
              <span>All Posts ({blogs.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {blogs.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-6xl text-muted-foreground/20 mb-4">📝</div>
                <p className="text-lg text-muted-foreground">No blog posts yet. Create your first one!</p>
                <Button asChild className="mt-6">
                  <Link href="/dashboard/admin/admin_blog/create_post">Create Post</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/30 hover:bg-transparent">
                      <TableHead className="w-96">Post</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published Date</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((b: any) => (
                      <TableRow key={b._id} className="hover:bg-muted/40 transition-colors border-border/20">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                              {b.thumbnail ? (
                                <img 
                                  src={b.thumbnail} 
                                  alt={b.title} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <span className="text-3xl font-light text-muted-foreground">
                                  {b.title.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <Link href={`/blog/posts/${b.slug}`} className="font-semibold text-foreground line-clamp-1">{b.title}</Link>
                              <Link href={`/blog/posts/${b.slug}`} className="text-sm text-muted-foreground">/{b.slug}</Link>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-muted-foreground">{b.author?.name || '—'}</span>
                        </TableCell>

                        <TableCell>
                          {b.createdAt ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BsCalendar3 className="w-4 h-4 text-muted-foreground" />
                              {format(new Date(b.createdAt), 'PPP')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <BsEye className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">{b.views ?? 0}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {b.isPublished ? (
                            <Badge className="bg-success/15 text-success border border-success/30">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Draft
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-3">

                            <form action={deleteBlogAction} className="inline">
                              <input type="hidden" name="slug" value={b.slug} />
                              <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <BsTrash3 className="w-4 h-4" />
                                <span className="ml-1">Delete</span>
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      
        <div className="text-center text-xs text-muted-foreground">
          Page loaded at: {format(new Date(), 'PPpp')}
        </div>
      </main>
    </div>
  );
}