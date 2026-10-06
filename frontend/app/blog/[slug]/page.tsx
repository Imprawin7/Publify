import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/api";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-prose px-6 py-20">
      <p className="text-sm text-slate">
        {post.publishedAt &&
          new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-ink">{post.title}</h1>
      {/* Content is stored as plain text/markdown source from the CMS; render raw for now —
          swap in a markdown renderer (e.g. react-markdown) if posts are authored in markdown. */}
      <div className="prose-content mt-10 whitespace-pre-wrap leading-relaxed text-ink">
        {post.content}
      </div>
    </article>
  );
}
