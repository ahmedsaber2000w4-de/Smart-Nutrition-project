
export const mapActivityLevel = (val) => {
  const map = {
    "sedentary":    "SEDENTARY",
    "light":        "LIGHT",
    "moderate":     "MODERATE",
    "active":       "ACTIVE",
    "extra active": "EXTRA_ACTIVE",
  };
  return map[val?.toLowerCase()] ?? val;
};
 
/** fitness_goal → FitnessGoal enum */
export const mapFitnessGoal = (val) => {
  const map = {
    "weight loss":  "LOSE_WEIGHT",
    "bodybuilding": "BODYBUILDING",
    "powerlifting": "POWERLIFTING",
    "maintenance":  "ATHLETICS",   // ← backend enum name
  };
  return map[val?.toLowerCase()] ?? val;
};
 
/** equipment → Equipment enum */
export const mapEquipment = (val) => {
  const map = {
    "gym":            "FULL_GYM",
    "at home":        "AT_HOME",
    "full equipment": "GARAGE_GYM",
  };
  return map[val?.toLowerCase()] ?? val;
};
 
/** experience_level → ExperienceLevel enum */
export const mapExperienceLevel = (val) => {
  const map = {
    "beginner":     "BEGINNER",
    "intermediate": "INTERMEDIATE",
    "advanced":     "ADVANCED",
  };
  return map[val?.toLowerCase()] ?? val;
};
 
/** gender → Gender enum */
export const mapGender = (val) => {
  const map = {
    "male":   "MALE",
    "female": "FEMALE",
  };
  return map[val?.toLowerCase()] ?? val;
};
 
/**
 * Maps a full profile object to Railway-compatible enum values.
 * Pass the raw localStorage profile, get back a POST-ready body.
 */
export const mapProfileToRailway = (p) => ({
  age:              p.age,
  gender:           mapGender(p.gender),
  height:           p.height,
  current_weight:   p.current_weight,
  target_weight:    p.target_weight,
  active_level:     mapActivityLevel(p.active_level),
  fitness_goal:     mapFitnessGoal(p.fitness_goal),
  experience_level: mapExperienceLevel(p.experience_level),
  equipment:        mapEquipment(p.equipment),
});