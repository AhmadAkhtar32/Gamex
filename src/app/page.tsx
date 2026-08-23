import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee, ScrollProgress } from "@/components/ui";
import { Stats } from "@/components/Stats";
import { Products } from "@/components/Products";
import { Builds } from "@/components/Builds";
import { Features } from "@/components/Features";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getBlogPosts();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Products />
        <Builds />
        <Features />
        <Marquee reverse />
        <Blog posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
