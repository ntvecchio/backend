const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { registerSchema } = require("../validations/userValidation");

const prisma = new PrismaClient();

async function registerUser(req, res) {
  try {
    // Validação dos dados de entrada
    const validatedData = registerSchema.parse(req.body);

    // ele ve se o usuario ja tem um email castrado
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validatedData.email }, { username: validatedData.username }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email ou nome de usuário já estão em uso" });
    }

    // Criptografiando a senhaaa
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // vai pro banco de dados cirado por min
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", userId: user.id });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao registrar o usuário" });
  }
}

module.exports = { registerUser };
