import { Navbar } from "@/components/layout/Navbar/Navbar";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect } from "react";

const SECTIONS = [
  { title: "1. Acceptance",            body: "By accessing or using EliteCode you agree to these Terms. If you do not agree, do not use the service." },
  { title: "2. Use of the Service",    body: "EliteCode is provided for personal, educational use. You may not use the service to attempt to disrupt, overload, or gain unauthorized access to any system. You are responsible for any code you submit." },
  { title: "3. Accounts",              body: "You must authenticate via a supported OAuth provider. You are responsible for keeping your account secure. We reserve the right to suspend accounts that violate these Terms." },
  { title: "4. Intellectual Property", body: "Problem statements, test cases, and runner harnesses are owned by EliteCode. Your submitted solutions remain yours; by submitting you grant us a license to execute and store them for grading purposes." },
  { title: "5. Disclaimer",            body: "The service is provided \"as is\" without warranties of any kind. We do not guarantee uptime, correctness of results, or fitness for any particular purpose." },
  { title: "6. Changes",               body: "We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms." },
];

export function Terms() {
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);

  useEffect(() => {
    setNavbarCenter(<></>);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bb-red-grid">
      <Navbar />
      <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-14">
        <h1 className="bb-text-depth font-display text-3xl uppercase tracking-tight text-bb-ink mb-2">Terms of Service</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong mb-10">Last updated: April 29, 2025</p>

        <div className="space-y-7 font-sans text-sm text-bb-muted-strong leading-relaxed">
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-display uppercase text-bb-ink text-base tracking-tight mb-2">{title}</h2>
              <p>{body}</p>
            </section>
          ))}

          <section>
            <h2 className="font-display uppercase text-bb-ink text-base tracking-tight mb-2">7. Contact</h2>
            <p>Questions? Reach us at <a href="mailto:ulibicalho9@gmail.com" className="text-bb-accent underline underline-offset-2 decoration-dashed hover:text-bb-accent-soft">ulibicalho9@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
