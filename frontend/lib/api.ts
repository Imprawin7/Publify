import type { About, Skill, Project, Blog, Experience, Testimonial, ServiceItem } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Thin fetch wrapper for the public, read-only CMS endpoints.
 * Every call fails soft (returns a fallback) so the site never crashes
 * to a blank page if the backend is briefly unreachable during a build.
 */
async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      // Revalidate content periodically rather than caching forever or on every request.
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getAbout = () => getJson<About>("/about", {});
export const getSkills = () => getJson<Skill[]>("/skills", []);
export const getProjects = (featuredOnly = false) =>
  getJson<Project[]>(`/projects${featuredOnly ? "?featured=true" : ""}`, []);
export const getExperience = () => getJson<Experience[]>("/experience", []);
export const getTestimonials = () => getJson<Testimonial[]>("/testimonials", []);
export const getServices = () => getJson<ServiceItem[]>("/services", []);
export const getPublishedBlogs = () =>
  getJson<Blog[]>("/blogs?status=PUBLISHED", []);
export const getBlogBySlug = (slug: string) =>
  getJson<Blog | null>(`/blogs/${slug}`, null);

export async function submitContactForm(data: { name: string; email: string; message: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to send message");
  }
  return res.json();
}
