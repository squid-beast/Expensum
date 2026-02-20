import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 w-full">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Expensum, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Use of Service</h2>
            <p>
              You may use Expensum for personal or household budgeting in accordance with these
              terms. You are responsible for maintaining the confidentiality of your account and
              for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. User Content</h2>
            <p>
              You retain ownership of the data you submit. By using our service, you grant us a
              limited license to store, process, and display your data as necessary to provide the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Prohibited Conduct</h2>
            <p>
              You may not misuse the service, attempt to gain unauthorized access, or use it for any
              illegal purpose. We reserve the right to suspend or terminate accounts that violate
              these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Disclaimer</h2>
            <p>
              Expensum is provided “as is.” We do not guarantee uninterrupted or error-free
              service. Financial decisions you make based on the app are your responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
            <p>
              For questions about these terms, please see our{" "}
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
