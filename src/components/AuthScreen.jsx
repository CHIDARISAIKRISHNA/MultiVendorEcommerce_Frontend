import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Leaf, Eye, EyeOff } from "lucide-react";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default function AuthScreen() {

  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

  // Save temporary frontend profile
function saveUserProfile(firebaseUser, customerName = "") {

  const email = firebaseUser.email?.toLowerCase();

  let role = "customer";

  if (email === "admin@gmail.com") {
    role = "admin";
  } 
  else if (email === "vendor@gmail.com") {
    role = "vendor";
  }

  const profile = {
    uid: firebaseUser.uid,
    name: customerName || firebaseUser.displayName || "User",
    email: firebaseUser.email,
    role: role,
    status: "active"
  };

  updateProfile(profile);

  return role;
}
  async function handleSubmit(e) {

    e.preventDefault();
    setMessage("");
    setError("");

    if (!isLogin && !strongPassword.test(password)) {
      setError(
        "Password must have 8+ characters, uppercase, lowercase, a digit, and a special character."
      );
      return;
    }

    setLoading(true);

    try {

      let firebaseUser;

      if (isLogin) {

        const result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        firebaseUser = result.user;

      } else {

        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        firebaseUser = result.user;

        if (name.trim()) {
          await updateFirebaseProfile(firebaseUser, {
            displayName: name.trim()
          });
        }
      }

   const role = saveUserProfile(firebaseUser, name.trim());

if (role === "admin") {
  navigate("/admin/dashboard", { replace: true });
} else if (role === "vendor") {
  navigate("/vendor/dashboard", { replace: true });
} else {
  navigate("/customer/dashboard", { replace: true });
}

    } catch (err) {

      setError(
        err.code?.replace("auth/", "").replaceAll("-", " ") ||
        "Authentication failed."
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleGoogle() {

    setLoading(true);
    setMessage("");
    setError("");

    try {

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      saveCustomerProfile(result.user);

      setMessage("Google sign-in successful.");

      navigate("/customer/dashboard", {
        replace: true
      });

    } catch (err) {

      setError(
        err.code?.replace("auth/", "").replaceAll("-", " ") ||
        "Google sign-in failed."
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="auth-page">

      <section className="auth-brand">
        <div className="auth-brand-content">

          <div className="brand">
            <Leaf /> SHOPSTACK
          </div>

          <h1>
            Shop better.
            <br />
            Live greener.
          </h1>

          <p>
            Discover products from responsible brands and
            make every purchase count.
          </p>

        </div>
      </section>

      <section className="auth-panel">

        <form className="auth-form" onSubmit={handleSubmit}>

          <span className="eyebrow">
            {isLogin ? "WELCOME BACK" : "JOIN SHOPSTACK"}
          </span>

          <h2>
            {isLogin
              ? "Sign in to your account"
              : "Create your account"}
          </h2>

          <p className="auth-subtitle">
            Continue your sustainable shopping journey.
          </p>

          {!isLogin && (
            <label>
              FULL NAME
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </label>
          )}

          <label>
            EMAIL ADDRESS
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            PASSWORD

            <div className="password-field">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>

            </div>
          </label>

          <button
            className="btn-buy auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogle}
            disabled={loading}
          >
            <b>G</b> Sign in with Google
          </button>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <p className="auth-switch">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setError("");
              }}
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>

          </p>

        </form>

      </section>

    </div>
  );
}