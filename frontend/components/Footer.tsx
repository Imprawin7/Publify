export default function Footer({ email }: { email?: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-2 px-6 py-10 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Pravin Yadav.</p>
        {email && (
          <a href={`mailto:${email}`} className="text-slate transition-colors hover:text-ink">
            {email}
          </a>
        )}
      </div>
    </footer>
  );
}
