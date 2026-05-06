import { Navbar } from "@/components/layout/Navbar/Navbar";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect } from "react";

const SECTIONS = [
  { title: "1. Information We Collect", body: "We collect the information your OAuth provider shares on sign-in: your name, email address, and profile picture. We also store your submitted code and results for grading and leaderboard purposes." },
  { title: "2. How We Use It",          body: "Your information is used solely to operate the service — authenticating you, running your submissions, and displaying your profile and leaderboard position. We do not sell your data." },
  { title: "3. Analytics",              body: "We use Vercel Analytics to collect anonymous page-view data (no cookies, no cross-site tracking). This helps us understand how the site is used in aggregate." },
  { title: "4. Data Retention",         body: "Your account data and submissions are retained for as long as your account is active. You may request deletion by contacting us." },
  { title: "5. Third Parties",          body: "We use Google OAuth for authentication and Vercel for hosting. These providers have their own privacy policies. We do not share your data with any other third parties." },
  { title: "6. Security",               body: "We use HTTPS, hashed credentials, and industry-standard practices to protect your data. No system is perfectly secure — please use a strong, unique password on your OAuth provider account." },
];

export function Privacy() {
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);

  useEffect(() => {
    setNavbarCenter(<></>);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bb-red-grid">
      <Navbar />
      <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-14">
        <h1 className="bb-text-depth font-display text-3xl uppercase tracking-tight text-bb-ink mb-2">Privacy Policy</h1>
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
            <p>Questions or deletion requests? Reach us at <a href="mailto:ulibicalho9@gmail.com" className="text-bb-accent underline underline-offset-2 decoration-dashed hover:text-bb-accent-soft">ulibicalho9@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
