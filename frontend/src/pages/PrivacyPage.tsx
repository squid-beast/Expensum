import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 w-full">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>
              We collect information you provide when you register, such as your name, email address,
              and household preferences. We also collect expense and budget data you enter to provide
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>
              We use your information to operate and improve Expensum, personalize your
              experience, send service-related communications, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Your Rights</h2>
            <p>
              You may access, correct, or delete your personal data through your account settings.
              You may also request a copy of your data or withdraw consent where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Contact Us</h2>
            <p>
              For privacy-related questions, please visit our{" "}
              <Link to="/contact" className="text-primary underline hover:no-underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
