import bcrypt from "bcryptjs";
import { mockUsers } from "../data/mockData.js";
import { createToken } from "../middleware/auth.js";
import { repositories } from "../services/repositories.js";

export async function loginController(req, res) {
  const { email, password } = req.body;
  const user = (await repositories.users.findOne({ email })) || mockUsers.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatches = user.password.startsWith("$2")
    ? await bcrypt.compare(password, user.password)
    : user.password === password;

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessPermissions: user.accessPermissions || [],
      responsibilities: user.responsibilities || "",
      phone: user.phone,
      campus: user.campus,
      avatar: user.avatar
    }
  });
}

export async function meController(req, res) {
  const user = (await repositories.users.getById(req.user.id)) || mockUsers.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessPermissions: user.accessPermissions || [],
    responsibilities: user.responsibilities || "",
    phone: user.phone,
    campus: user.campus,
    avatar: user.avatar
  });
}
