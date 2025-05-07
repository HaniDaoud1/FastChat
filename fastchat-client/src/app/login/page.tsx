"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/state";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Pour afficher les erreurs

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error message before sending request
    setErrorMessage(null);

    try {
      const res = await fetch("https://fastchat-5.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Connexion réussie !");
        dispatch(
          setUser({
            token: data.token,
            userInfo: data.user || {},
          })
        );
        router.push("/");
      } else {
        setErrorMessage(data.message || "Échec de la connexion");
      }
    } catch (err) {
      setErrorMessage("Une erreur est survenue lors de la connexion.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-gray-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        {/* Message d'accueil */}
        <p className="text-center text-sm text-gray-500 tracking-wide">
          Bienvenue dans notre salon{" "}
          <span className={`${pacifico.className} text-green-600 text-lg`}>
            Fast Chat
          </span>{" "}
          By{" "}
          <span className={`${pacifico.className} text-blue-700 text-lg`}>
            Fast
          </span>
        </p>

        <h1 className="text-2xl font-bold text-center text-gray-700">
          Connexion
        </h1>

        {/* Affichage des erreurs */}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
        >
          Se connecter
        </button>

        <p className="text-center text-sm text-gray-500">
          Vous n&#39;avez pas de compte ?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Créez un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
