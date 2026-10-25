import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthFormFields from "../components/AuthFormFields";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/authStorage";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(trimmedEmail, password);
      const next = location.state?.from || "/dashboard/octocat";
      navigate(next, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Use your email and password. No OTP is required."
      footer={
        <p className="text-github-muted">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-github-link hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthFormFields
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          error={error}
          submitLabel="Log in and open dashboard"
          isSubmitting={isSubmitting}
        />
      </form>
    </AuthLayout>
  );
}
