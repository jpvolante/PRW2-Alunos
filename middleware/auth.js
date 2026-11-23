import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization") || req.header("authorization");
  let token;
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Acesso negado. Token expirado." });
      }
      return res
        .status(403)
        .json({ message: "Acesso negado. Token inválido." });
    }
    req.user = decoded;
    next();
  });
};
