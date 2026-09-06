import Image from "next/image";
import { FOOTER_COLUMNS } from "@/lib/site.config";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,0.8fr)] gap-10">
        <div className="flex flex-col gap-4.5">
          <div className="flex items-center gap-3.5">
            <span className="bg-white p-1.5 flex items-center justify-center flex-none">
              <Image
                src="/boc-logo.png"
                alt="Bahrain Olympic Committee"
                width={56}
                height={56}
                className="h-14 w-auto block"
              />
            </span>
            <span className="font-heading font-semibold text-2xl leading-none capitalize whitespace-nowrap text-white">
              Team Bahrain
            </span>
          </div>
          <span className="text-sm leading-relaxed text-ink-400">
            Bahrain Olympic Committee
            <br />
            Kingdom of Bahrain
          </span>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3.5">
            <span className="font-semibold text-[10px] tracking-[0.18em] uppercase text-ink-500">
              {col.title}
            </span>
            {col.title === "Committee" && (
              <>
                <a
                  href="https://boc.bh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-white hover:text-[#ff9783]"
                >
                  BOC
                </a>
                <a href="/contact" className="text-[15px] text-white hover:text-[#ff9783]">
                  Contact
                </a>
              </>
            )}
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[15px] text-white hover:text-[#ff9783]"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-ink-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5.5 flex justify-between gap-6 flex-wrap">
          <span className="text-xs tracking-[0.1em] uppercase text-ink-500">
            © 2026 Bahrain Olympic Committee
          </span>
          <span className="text-xs tracking-[0.1em] uppercase text-ink-500">
            Privacy · Accessibility · Media enquiries
          </span>
        </div>
      </div>
    </footer>
  );
}
