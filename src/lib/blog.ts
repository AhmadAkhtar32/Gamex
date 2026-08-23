import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts as blogPostsTable } from "@/db/schema";
import { seedBlogPosts, type BlogPost } from "./data";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.publishedAt));

    if (rows.length > 0) {
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        excerpt: row.excerpt,
        image: row.image,
        readTime: row.readTime,
        date: new Date(row.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));
    }
  } catch (err) {
    console.error("Blog query failed, falling back to seed data:", err);
    return seedBlogPosts;
  }

  // First run — seed the table with starter posts (best effort).
  try {
    await db
      .insert(blogPostsTable)
      .values(
        seedBlogPosts.map((p) => ({
          title: p.title,
          slug: p.slug,
          category: p.category,
          excerpt: p.excerpt,
          image: p.image,
          readTime: p.readTime,
          publishedAt: new Date(p.date),
        })),
      )
      .onConflictDoNothing();
  } catch (err) {
    console.error("Blog seed failed:", err);
  }

  return seedBlogPosts;
}
