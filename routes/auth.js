// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Función para crear nuestro JWT
function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/google
router.post("/google", async (req, res, next) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ message: "Falta id_token" });
    }

    // Verificar token con Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, hd } = payload;

    // Si quieres FORZAR correo institucional, puedes validar dominio
    // Por ejemplo si tu correo es @miuni.edu.mx:
    // if (!email.endsWith("@miuni.edu.mx")) {
    //   return res.status(401).json({ message: "Solo correos institucionales" });
    // }

    // Buscar o crear usuario
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // Crear nuestro token
    const token = createToken(user);

    res.json({
      message: "Login con Google exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Error en /api/auth/google", error);
    return res.status(401).json({ message: "Token de Google inválido" });
  }
});

export default router;
