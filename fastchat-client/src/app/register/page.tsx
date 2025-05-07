"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/app/store/state";
import Image from "next/image";

// Type explicite pour FormData
type FormDataType = {
  username: string;
  email: string;
  password: string;
  picture: File | null;
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Gestion des erreurs
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    password: "",
    picture: null,
  });

  // Gestion des modifications d'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion du changement d'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.split("/")[0];

      // Vérifier si le fichier est une image
      if (fileType === "image") {
        setFormData({ ...formData, picture: file });
        setImagePreview(URL.createObjectURL(file)); // Prévisualisation de l'image
      } else {
        setErrorMessage("Veuillez télécharger un fichier image.");
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser l'erreur
    setErrorMessage(null);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.picture) {
      data.append("picture", formData.picture);
    }

    try {
      const res = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        body: data,
      });

      const response = await res.json();

      if (res.ok) {
        alert("Utilisateur enregistré !");
        dispatch(setUser({
          token: response.token,
          userInfo: response.user || {},
        }));
        router.push("/");
      } else {
        setErrorMessage(response.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue, veuillez réessayer.");
      console.error("Erreur serveur :", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white text-gray-600 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-700">
          Créer un compte
        </h2>

        {/* Affichage des erreurs */}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom d'utilisateur */}
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Adresse e-mail */}
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Mot de passe */}
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sélecteur d'image */}
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

          {/* Prévisualisation de l'image */}
          {imagePreview && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Aperçu de l&apos;image :</p>
              <Image
                src={imagePreview}
                alt="Aperçu"
                width={128}
                height={128}
                className="object-cover rounded-full mx-auto shadow"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData({ ...formData, picture: null });
                }}
                className="mt-2 text-red-500 hover:underline text-sm"
                aria-label="Supprimer l'image"
              >
                Supprimer l&apos;image
              </button>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
          >
            S&apos;inscrire
          </button>
        </form>

        {/* Lien vers la page de connexion */}
        <p className="text-center text-sm text-gray-500">
          Vous n&apos;avez pas de compte ?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
