
import * as zod from "zod";

export const scheme = zod.object({
  fullname: zod.string()
    .nonempty('Name is required')
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
  
  email: zod.string()
    .nonempty('Email is required')
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email is invalid"),

  password: zod.string()
    .nonempty('Password is required')
    .min(5, "Password must be at least 5 characters long"),

  confirmPassword: zod.string()
    .nonempty('Confirm password is required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);