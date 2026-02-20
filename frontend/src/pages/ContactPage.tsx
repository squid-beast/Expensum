import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 w-full">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question or feedback? We’d love to hear from you.
        </p>

        <div className="space-y-6 text-muted-foreground">
          <section className="flex gap-4 rounded-lg border border-border bg-muted/30 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Email</h2>
              <p>
                For support and general inquiries, reach us at{" "}
                <a
                  href="mailto:support@expensum.app"
                  className="text-primary underline hover:no-underline"
                >
                  support@expensum.app
                </a>
                . We typically respond within 1–2 business days.
              </p>
            </div>
          </section>

          <section className="flex gap-4 rounded-lg border border-border bg-muted/30 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Feedback</h2>
              <p>
                Suggestions and bug reports help us improve Expensum. Send them to{" "}
                <a
                  href="mailto:feedback@expensum.app"
                  className="text-primary underline hover:no-underline"
                >
                  feedback@expensum.app
                </a>
                .
              </p>
            </div>
          </section>

          <p className="text-sm">
            For legal or privacy-related requests, please refer to our{" "}
            <Link to="/privacy" className="text-primary underline hover:no-underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="text-primary underline hover:no-underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
