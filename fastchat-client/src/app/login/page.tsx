"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import { setUser } from "@/app/store/state";
import { RootState } from "@/app/store/store"; // adapte le chemin selon ton arborescence
import { Pacifico } from "next/font/google";


const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});



export default function LoginPage() {
  const dispatch=useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      

      if (res.ok) {
        alert("Login successful!");
        dispatch(setUser({
          token: data.token,         // si le backend renvoie un token
          userInfo: data.user || {}, // si le backend renvoie l'utilisateur
        }))
        router.push("/"); // redirect to the chat page
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };
  const user = useSelector((state: RootState) => state.user);
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-gray-600">
    <form
      onSubmit={handleLogin}
      className="bg-white p-10 rounded-xl shadow-md w-full max-w-md space-y-6"
    >
      {/* Texte de bienvenue dans le formulaire */}
      <p className="text-center text-sm text-gray-500 tracking-wide">
  Bienvenue dans notre salon{" "}
  <span
    className={`${pacifico.className} text-md font-bold `}
  >
    Fast Chat
  </span>{" "}
  propulsé par{" "}
  <span className="  font-bold text-lg"
  style={{ fontFamily: "'Pacifico', cursive" }}>Fast</span>
</p>
  
      <h1 className="text-2xl font-bold text-center text-gray-700">Connexion</h1>
  
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
        Vous n'avez pas de compte ?{" "}
        <a href="/register" className="text-blue-600 hover:underline font-medium">
          Créez un compte
        </a>
      </p>
    </form>
  </div>
  
  );
}
