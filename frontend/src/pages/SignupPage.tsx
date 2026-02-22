import { useState, useMemo, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { authService } from "@/services/authService";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One special character (@, $, %, etc.)", test: (pw: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw) },
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );
  const allPasswordChecksPassed = passwordChecks.every((c) => c.passed);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allPasswordChecksPassed) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.signup({
        email,
        password,
        fullName,
        phoneNumber: phoneNumber ? `${phoneCode}${phoneNumber}` : undefined,
      });
      setShowSuccessDialog(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center text-3xl">
            <span className="tracking-tight text-foreground mr-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Join Expen</span>
            <span className="tracking-tight text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>Sum</span>
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="flex gap-2">
                  <span className="flex h-10 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground w-16 sm:w-20 shrink-0">
                    +1 US
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="5551234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength checklist */}
                {password.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1 pt-1"
                  >
                    {passwordChecks.map((check) => (
                      <li key={check.label} className="flex items-center gap-2 text-xs">
                        {check.passed ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={check.passed ? "text-green-600" : "text-muted-foreground"}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Passwords match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !allPasswordChecksPassed || !passwordsMatch}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Success alert dialog (shadcnblocks-style alert-dialog-success-3) */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader className="flex flex-col items-center text-center sm:text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-xl">Account created</DialogTitle>
              <DialogDescription className="text-base">
                Your account has been created successfully. Sign in to continue to Expensum.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-center">
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate("/login");
                }}
                className="w-full sm:w-auto"
              >
                Go to Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
