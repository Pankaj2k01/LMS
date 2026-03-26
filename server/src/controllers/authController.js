import bcrypt from "bcryptjs";
import { mockUsers } from "../data/mockData.js";
import { createToken } from "../middleware/auth.js";
import { repositories } from "../services/repositories.js";
import { sendPasswordResetOtp } from "../services/otpService.js";

export async function loginController(req, res) {
  const { email, password, mobileNumber } = req.body;
  const loginId = String(email || mobileNumber || "").trim();
  const user =
    (await repositories.users.findOne({ email: loginId })) ||
    (await repositories.users.findOne({ username: loginId })) ||
    (await repositories.users.findOne({ phone: loginId })) ||
    mockUsers.find((item) => item.email === loginId || item.username === loginId || item.phone === loginId);

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
      username: user.username || user.email,
      email: user.email,
      role: user.role,
      linkedStudentId: user.linkedStudentId || "",
      linkedStaffId: user.linkedStaffId || "",
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
    username: user.username || user.email,
    email: user.email,
    role: user.role,
    linkedStudentId: user.linkedStudentId || "",
    linkedStaffId: user.linkedStaffId || "",
    accessPermissions: user.accessPermissions || [],
    responsibilities: user.responsibilities || "",
    phone: user.phone,
    campus: user.campus,
    avatar: user.avatar
  });
}

export async function forgotPasswordController(req, res) {
  const loginId = String(req.body.email || req.body.username || req.body.mobileNumber || "").trim();
  if (!loginId) {
    return res.status(400).json({ message: "Email, username, or mobile number is required" });
  }

  const user =
    (await repositories.users.findOne({ email: loginId })) ||
    (await repositories.users.findOne({ username: loginId })) ||
    (await repositories.users.findOne({ phone: loginId })) ||
    mockUsers.find((item) => item.email === loginId || item.username === loginId || item.phone === loginId);

  if (!user) {
    return res.status(404).json({ message: "No account found for the provided email, username, or mobile number" });
  }

  const otpResult = await sendPasswordResetOtp({ user });
  return res.json({
    ok: true,
    ...otpResult
  });
}
