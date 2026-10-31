import { z } from "zod";
 
export const onboardingSchema = z.object({
  // ── Step 1 ──────────────────────────────────────────────────────────────
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  age: z.string().nonempty("Age is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 15 && Number(v) <= 80, {
      message: "Age must be between 15 and 80",
    }),
  currentWeight: z.string().nonempty("Current weight is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 30 && Number(v) <= 250, {
      message: "Weight must be between 30 and 250 kg",
    }),
  targetWeight: z.string().nonempty("Target weight is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 30 && Number(v) <= 250, {
      message: "Weight must be between 30 and 250 kg",
    }),
  height: z.string().nonempty("Height is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 100 && Number(v) <= 230, {
      message: "Height must be between 100 and 230 cm",
    }),
  // ✅ القيم بالظبط زي الـ API: active_level
  activity: z.enum(["sedentary", "light", "moderate", "active", "extra active"], {
    required_error: "Activity level is required",
  }),
 
  // ── Step 2 ──────────────────────────────────────────────────────────────
  // ✅ القيم بالظبط زي الـ API: fitness_goal
  goal: z.enum(["weight loss", "maintenance", "bodybuilding", "powerlifting"], {
    required_error: "Goal is required",
  }),
 
  // ── Step 3 ──────────────────────────────────────────────────────────────
  // ✅ القيم بالظبط زي الـ API: equipment
  equipment: z.enum(["gym", "at home", "full equipment"], {
    required_error: "Equipment preference is required",
  }),
 
  // ── Step 4 ──────────────────────────────────────────────────────────────
  // ✅ القيم بالظبط زي الـ API: experience_level
  experience_level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Experience level is required",
  }),
});
 
