import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "Contact — Team Bahrain",
};

export default async function ContactPage() {
  const content = await getPageContent("contact");

  const details = [
    { icon: MapPin, label: "Address", value: content.address },
    { icon: Phone, label: "Phone", value: content.phone },
    { icon: Mail, label: "General enquiries", value: content.general_email },
  ];

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 lg:items-end">
          <div className="flex flex-col gap-5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              {content.eyebrow}
            </span>
            <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
              {content.headline}
            </h1>
          </div>
          <p className="m-0 text-lg leading-[1.5] text-ink-800 text-pretty">{content.intro}</p>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map((d) => (
              <div key={d.label} className="border-2 border-ink p-6 flex flex-col gap-3">
                <d.icon size={22} className="text-accent" />
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-ink-700">
                  {d.label}
                </span>
                <span className="text-lg font-bold whitespace-pre-line">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10">
          <div className="border-2 border-ink bg-white overflow-hidden min-h-[360px]">
            <iframe
              src={content.map_embed_url}
              title="BOC location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[360px] border-0"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="m-0 font-bold text-3xl uppercase">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
