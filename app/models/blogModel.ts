import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  message: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  tags?: string[];
  isPublished: boolean;
  views: number;
  readingTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogsSchema = new Schema<IBlog>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: null },
    tags: [{ type: String }],

    isPublished: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);


BlogsSchema.index({ author: 1, isPublished: 1, publishedAt: -1 });


function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') 
    .replace(/-+/g, '-'); 
}


BlogsSchema.pre('validate', function (next) {
  const doc = this as IBlog;
  if (!doc.slug && doc.title) {
    doc.slug = slugify(doc.title).slice(0, 200);
  }

 
  try {
    const words = doc.message ? String(doc.message).split(/\s+/).length : 0;
    doc.readingTime = Math.max(1, Math.round(words / 200));
  } catch (e) {
    doc.readingTime = 1;
  }

  

  next();
});


BlogsSchema.statics.findPublished = function (page = 1, limit = 10) {
  const skip = (Math.max(1, page) - 1) * limit;
  return this.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name');
};

BlogsSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug }).populate('author', 'name');
};

const BlogsModel = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogsSchema);

export default BlogsModel;