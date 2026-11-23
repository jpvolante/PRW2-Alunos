import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { authenticateJWT } from "./middleware/auth.js";
import {
  validateAlunoCreation,
  validateAlunoUpdate,
} from "./validators/alunoValidator.js";

dotenv.config();
const app = express();
app.use(express.json());

const users = [];
const alunos = [
  { id: 1, nome: "Ana Silva", ra: "2021001", nota1: 7.5, nota2: 8.0 },
  { id: 2, nome: "Bruno Souza", ra: "2021002", nota1: 5.0, nota2: 6.0 },
  { id: 3, nome: "Carla Mendes", ra: "2021003", nota1: 9.0, nota2: 9.5 },
];

const findAlunoIndexById = (id) => alunos.findIndex((a) => a.id === Number(id));
const isIdTaken = (id) => alunos.some((a) => a.id === Number(id));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username e password são obrigatórios." });

  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ message: "Usuário já existe." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  return res.status(201).json({ message: "Usuário criado!" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username e password são obrigatórios." });

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Login Incorreto!" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Login Incorreto!" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
  return res.json({
    message: `Login efetuado pelo usuário ${username}`,
    jwt: token,
  });
});

app.use("/alunos", authenticateJWT);

app.get("/alunos", (req, res) => {
  return res.json(alunos);
});

app.get("/alunos/medias", (req, res) => {
  const medias = alunos.map((a) => {
    const media = (Number(a.nota1) + Number(a.nota2)) / 2;
    return { nome: a.nome, media: Number(media.toFixed(2)) };
  });
  return res.json(medias);
});

app.get("/alunos/aprovados", (req, res) => {
  const lista = alunos.map((a) => {
    const media = (Number(a.nota1) + Number(a.nota2)) / 2;
    return { nome: a.nome, status: media >= 6 ? "aprovado" : "reprovado" };
  });
  return res.json(lista);
});

app.get("/alunos/:id", (req, res) => {
  const aluno = alunos.find((a) => a.id === Number(req.params.id));
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado!" });
  return res.json(aluno);
});

app.post("/alunos", validateAlunoCreation, (req, res) => {
  const { id, nome, ra, nota1, nota2 } = req.body;
  if (isIdTaken(id)) {
    return res.status(409).json({ message: "Já existe aluno com esse id." });
  }
  const novo = {
    id: Number(id),
    nome,
    ra,
    nota1: Number(nota1),
    nota2: Number(nota2),
  };
  alunos.push(novo);
  return res.status(201).json({ message: "Aluno criado com sucesso!" });
});

app.put("/alunos/:id", validateAlunoUpdate, (req, res) => {
  const idx = findAlunoIndexById(req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "Aluno não encontrado!" });

  const { nome, ra, nota1, nota2 } = req.body;
  if (nome !== undefined) alunos[idx].nome = nome;
  if (ra !== undefined) alunos[idx].ra = ra;
  if (nota1 !== undefined) alunos[idx].nota1 = Number(nota1);
  if (nota2 !== undefined) alunos[idx].nota2 = Number(nota2);

  return res.json(alunos[idx]);
});

app.delete("/alunos/:id", (req, res) => {
  const idx = findAlunoIndexById(req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "Aluno não encontrado!" });
  alunos.splice(idx, 1);
  return res.json({ message: "Aluno removido!" });
});

// Retorna JSON também para rotas inexistentes.
app.use((req, res) => {
  return res.status(404).json({ message: "Rota não encontrada!" });
});

// Centraliza o tratamento de erros sem retornar HTML nem detalhes internos.
app.use((err, req, res, next) => {
  console.error(err);
  if (err.status === 400 && err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido!" });
  }
  return res.status(500).json({ message: "Erro interno do servidor!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
