
const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas devem coincidir",
  path: ["confirmPassword"],
});

module.exports = { registerSchema };
