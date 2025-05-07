"use client";

import { useState } from "react";
import { useDispatch, UseSelector } from "react-redux";
import { UseDispatch } from "react-redux";
import { setUser } from "../store/state";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export default function RegisterPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const dispatch=useDispatch();
  const router=useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    picture: null as File | null, // For storing the profile picture
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, picture: file });
  
      // Crée une URL temporaire pour l'image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.picture) {
      data.append("picture", formData.picture); // Append the picture file
    }

    try {
      const res = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        body: data, // Send the FormData object
      });

      const response = await res.json();
      if (res.ok) {
        alert("Utilisateur enregistré !");
       
        router.push("/"); // redirect to the chat page
        dispatch(setUser({
          token: response.token,         // si le backend renvoie un token
          userInfo: response.user || {}, // si le backend renvoie l'utilisateur
        }))
      } else {
        alert(response.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white text-gray-600 px-4">
  <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
    <h2 className="text-3xl font-semibold text-center text-gray-700">Créer un compte</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom d'utilisateur */}
      <input
        type="text"
        name="username"
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Adresse e-mail */}
      <input
        type="email"
        name="email"
        placeholder="Adresse e-mail"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Mot de passe */}
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Choisir une image de profil */}
      <label
        htmlFor="picture"
        className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 bg-white cursor-pointer hover:bg-gray-50 text-center"
      >
        {formData.picture ? formData.picture.name : "Choisir une image"}
      </label>
      <input
        id="picture"
        type="file"
        name="picture"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Aperçu de l'image */}
      {imagePreview && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Aperçu de l'image :</p>
          <img
            src={imagePreview}
            alt="Aperçu"
            className="w-32 h-32 object-cover rounded-full mx-auto shadow"
          />
          <button
            type="button"
            onClick={() => {
              setImagePreview(null);
              setFormData({ ...formData, picture: null });
            }}
            className="mt-2 text-red-500 hover:underline text-sm"
          >
            Supprimer l'image
          </button>
        </div>
      )}

      {/* Bouton d'inscription */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
      >
        S'inscrire
      </button>
    </form>

    {/* Lien vers la page de connexion */}
    <p className="text-center text-sm text-gray-500 mt-4">
      Vous avez déjà un compte ?{" "}
      <a href="/login" className="text-blue-600 hover:underline font-medium">
        Connectez-vous
      </a>
    </p>
  </div>
</div>

  );
}
