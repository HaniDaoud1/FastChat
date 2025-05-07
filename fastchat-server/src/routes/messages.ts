import { Router, Request, Response } from "express";
import messages from "../models/messages";

export const deleteMessage = async (req:Request, res:Response) => {
    try {
      const { id } = req.params; // Récupération de l'identifiant du post
  
      // Vérification de la validité de l'ID
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID invalide." });
      }
  
      // Rechercher le post par ID
      const message = await messages.findById(id);
  
      // Si aucun post n'est trouvé
      if (!message) {
        return res
          .status(404)
          .json({ message: "Aucun post trouvé avec cet ID." });
      }
  
      // Suppression du post
      await message.deleteOne();
  
      // Réponse au client
      res.status(200).json({ message: "Post supprimé avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Message delete error" });
    }
  };
  