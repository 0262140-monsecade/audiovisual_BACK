import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios"; // 👈 Agregamos esto
import User from "../models/user.js";

const router = express.Router();

// Función auxiliar para crear tu JWT (esto NO cambia, solo la encapsulé para orden)
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    // 1. Recibimos el token simple desde el Front
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Falta el token de acceso" });
    }

    // 2. CONSULTA A GOOGLE: Usamos el token para pedir los datos del usuario
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Google nos responde con los datos
    const { sub: googleId, email, name, picture } = googleRes.data;

    // 4. Lógica de base de datos (Igual que antes: buscar o crear)
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId,
        role: "student" // Rol por defecto
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // 5. Respondemos al front con tu token de sesión
    const myToken = createToken(user);

    res.json({
      message: "Login exitoso",
      token: myToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role
      },
    });

  } catch (error) {
    console.error("Error verificando con Google:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});

export default router;