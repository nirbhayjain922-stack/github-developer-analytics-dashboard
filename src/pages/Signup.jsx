import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthFormFields from "../components/AuthFormFields";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/authStorage";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await signup(trimmedEmail, password);
      navigate("/dashboard/octocat", { replace: true });
    } catch (signupError) {
      setError(signupError.message || "Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create account"
      subtitle="Sign up with email and password only. You will land on the GitHub analytics dashboard right away."
      footer={
        <p className="text-github-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-github-link hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthFormFields
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmChange={setConfirmPassword}
          showConfirm
          error={error}
          submitLabel="Sign up and open dashboard"
          isSubmitting={isSubmitting}
        />
      </form>
    </AuthLayout>
  );
}
