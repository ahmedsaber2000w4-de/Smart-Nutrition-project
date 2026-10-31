import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    
  password: zod.string()
    .nonempty("Password is required")
    .min(5, "Password must be at least 5 characters long"),
});