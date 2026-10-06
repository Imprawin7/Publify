import Link from "next/link";
import { getPublishedBlogs } from "@/lib/api";

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();

  return (
    <div className="mx-auto max-w-page px-6 py-20">
      <h1 className="font-display text-4xl text-ink">Writing</h1>

      <div className="mt-12 divide-y divide-line">
        {posts.length === 0 && <p className="py-8 text-slate">No posts published yet.</p>}
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block py-6 transition-colors hover:bg-line/20"
          >
            <p className="text-sm text-slate">
              {post.publishedAt &&
                new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{post.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
