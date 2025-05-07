import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { verifyToken } from "../middleware/auth";
import {upload} from "../cloudinary"

const router = Router();

// REGISTER
router.post("/register", upload.single("picture"), async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "Email ou nom d'utilisateur déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const picturePath = req.file?.path || "";

    const user = new User({
      username,
      email,
      password: hashedPassword,
      picturePath,
    });

    await user.save();

    // Crée le token JWT
    const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET as string, // ta clé secrète dans le fichier .env
      { expiresIn: "7d" }
    );

    // Supprime le mot de passe de la réponse
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      picturePath: user.picturePath,
      // ajoute d'autres champs si nécessaires
    };

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user:userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Supprime le mot de passe avant d'envoyer les données utilisateur
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      picturePath: user.picturePath,
      // ajoute d'autres champs si nécessaires
    };

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});


// GET ME
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = await User.findById(userId).select("username");
  res.json({ user });
});



export default router;
