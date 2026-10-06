import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-20">
      <h1 className="font-display text-4xl text-ink">Contact</h1>
      <p className="mt-4 max-w-prose text-slate">
        Have a project in mind, or just want to say hello? Send a message below.
      </p>
      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
