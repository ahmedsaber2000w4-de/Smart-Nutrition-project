import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Camera, User, Target, Activity, Pencil, X, Check } from "lucide-react";

// ✅ تم التعديل: Railway هو الـ backend الشغال مش Vercel
const AUTH_API = "https://trying-task.vercel.app";
const GP_API   = "https://gp-backend-production-7b9a.up.railway.app/api";

// ─── Default shape يتطابق مع الـ API ─────────────────────────────────────────
const DEFAULT_PROFILE = {
  age: "",
  gender: "male",
  height: "",
  current_weight: "",
  target_weight: "",
  active_level: "light",
  fitness_goal: "bodybuilding",
  experience_level: "beginner",
  equipment: "at home",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  // نسخة احتياطية نرجعلها لو اليوزر ألغى التعديل
  const [savedProfile, setSavedProfile] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const userData  = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName  = userData.fullname || "User";
  const firstName = fullName.split(" ")[0];

  // ─── تحميل البروفايل ──────────────────────────────────────────────────────
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserImage(savedUser.image || null);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      // أول حاجة: نعرض البيانات المحلية فوراً عشان مفيش loading طويل
      const localData = localStorage.getItem("userProfile");
      if (localData) {
        const parsed = JSON.parse(localData);
        setProfile(parsed);
        setSavedProfile(parsed);
      }

      // ✅ الـ endpoint الصح من الـ Postman — الآن على Railway
      const res = await axios.get(`${AUTH_API}/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Response: { status, data: { profile: {...}, hasProfile } }
      const fetched =
        res.data?.data?.profile ||
        res.data?.profile ||
        (res.data?.age ? res.data : null);

      if (fetched) {
        setProfile(fetched);
        setSavedProfile(fetched);
        localStorage.setItem("userProfile", JSON.stringify(fetched));
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      if (!localStorage.getItem("userProfile")) {
        toast.error("Failed to load profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── حفظ التعديلات ────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      setIsSaving(true);

      // ✅ بنبعت uppercase عشان Vercel و Railway بيشاركوا نفس الـ DB
      const profileToSend = {
        ...profile,
        gender:           profile.gender?.toUpperCase(),
        active_level:     { "sedentary":"SEDENTARY","light":"LIGHT","moderate":"MODERATE","active":"ACTIVE","extra active":"EXTRA_ACTIVE" }[profile.active_level?.toLowerCase()]     ?? profile.active_level?.toUpperCase().replace(/ /g,"_"),
        fitness_goal:     { "weight loss":"LOSE_WEIGHT","maintenance":"ATHLETICS","bodybuilding":"BODYBUILDING","powerlifting":"POWERLIFTING" }[profile.fitness_goal?.toLowerCase()]  ?? profile.fitness_goal?.toUpperCase().replace(/ /g,"_"),
        experience_level: profile.experience_level?.toUpperCase(),
        equipment:        { "gym":"FULL_GYM","at home":"AT_HOME","full equipment":"GARAGE_GYM" }[profile.equipment?.toLowerCase()]                                                     ?? profile.equipment?.toUpperCase().replace(/ /g,"_"),
      };

      await axios.patch(`${AUTH_API}/updateProfile`, profileToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedProfile(profile);
      localStorage.setItem("userProfile", JSON.stringify(profile));
      toast.success("Profile updated successfully! 🚀");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── إلغاء التعديل ────────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    setProfile(savedProfile); // نرجع للبيانات الأصلية
    setIsEditing(false);
  };

  // ─── تغيير الصورة ─────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setUserImage(base64String);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentUser.image = base64String;
      localStorage.setItem("user", JSON.stringify(currentUser));
      toast.success("Photo updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  // ─── Helper: تغيير قيمة في الـ profile ───────────────────────────────────
  const updateField = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));

  // ─── Loading Screen ───────────────────────────────────────────────────────
  if (isLoading && !profile.age) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-green-600">
        Loading Profile Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-24 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Card className="p-4 md:p-8 rounded-[2.5rem] border-none shadow-2xl shadow-gray-200">

          {/* ── Header ── */}
          <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              {/* Avatar */}
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <Avatar
                  src={userImage}
                  className="w-28 h-28 border-4 border-white shadow-xl"
                  isBordered
                  color="success"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Camera className="text-white" size={20} />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                  Welcome, {firstName}!
                </h1>
                <p className="text-gray-400 font-bold">Manage all your fitness metrics</p>
              </div>
            </div>

            {/* ── Edit / Save / Cancel Buttons ── */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  {/* Cancel */}
                  <Button
                    onClick={handleCancelEdit}
                    isDisabled={isSaving}
                    className="font-black px-6 h-14 rounded-2xl bg-gray-100 text-gray-700"
                    startContent={<X size={16} />}
                  >
                    Cancel
                  </Button>
                  {/* Save */}
                  <Button
                    onClick={handleUpdate}
                    isLoading={isSaving}
                    className="font-black px-10 h-14 rounded-2xl bg-green-600 text-white shadow-lg shadow-green-100"
                    startContent={!isSaving && <Check size={16} />}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="font-black px-10 h-14 rounded-2xl bg-black text-white shadow-lg"
                  startContent={<Pencil size={16} />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <Divider className="my-8" />

          {/* ── Body ── */}
          <CardBody className="space-y-10">

            {/* Physical Metrics */}
            <section>
              <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-green-600" /> Physical Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Input
                  label="Age"
                  type="number"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  value={profile.age?.toString() || ""}
                  onChange={(e) => updateField("age", e.target.value)}
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  value={profile.height?.toString() || ""}
                  onChange={(e) => updateField("height", e.target.value)}
                />
                <Select
                  label="Gender"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  selectedKeys={profile.gender ? [profile.gender] : ["male"]}
                  onSelectionChange={(keys) => updateField("gender", Array.from(keys)[0])}
                >
                  <SelectItem key="male">Male</SelectItem>
                  <SelectItem key="female">Female</SelectItem>
                </Select>
              </div>
            </section>

            {/* Weight & Goals */}
            <section>
              <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                <Target size={20} className="text-green-600" /> Weight & Goals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Current Weight (kg)"
                  type="number"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  value={profile.current_weight?.toString() || ""}
                  onChange={(e) => updateField("current_weight", e.target.value)}
                />
                <Input
                  label="Target Weight (kg)"
                  type="number"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  value={profile.target_weight?.toString() || ""}
                  onChange={(e) => updateField("target_weight", e.target.value)}
                />
              </div>
            </section>

            {/* Lifestyle & Training */}
            <section>
              <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-green-600" /> Lifestyle & Training
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Select
                  label="Fitness Goal"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  selectedKeys={profile.fitness_goal ? [profile.fitness_goal] : ["bodybuilding"]}
                  onSelectionChange={(keys) => updateField("fitness_goal", Array.from(keys)[0])}
                >
                  {/* ✅ القيم دي بالضبط اللي الـ API بيتوقعها */}
                  <SelectItem key="bodybuilding">Build Muscle</SelectItem>
                  <SelectItem key="weight loss">Lose Weight</SelectItem>
                  <SelectItem key="maintenance">Maintain Weight</SelectItem>
                  <SelectItem key="powerlifting">Powerlifting</SelectItem>
                </Select>

                <Select
                  label="Activity Level"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  selectedKeys={profile.active_level ? [profile.active_level] : ["light"]}
                  onSelectionChange={(keys) => updateField("active_level", Array.from(keys)[0])}
                >
                  {/* ✅ القيم بالضبط زي ما الـ Postman بيبعت */}
                  <SelectItem key="sedentary">Sedentary</SelectItem>
                  <SelectItem key="light">Lightly Active</SelectItem>
                  <SelectItem key="moderate">Moderate</SelectItem>
                  <SelectItem key="active">Active</SelectItem>
                  <SelectItem key="extra active">Extra Active</SelectItem>
                </Select>

                <Select
                  label="Experience Level"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  selectedKeys={profile.experience_level ? [profile.experience_level] : ["beginner"]}
                  onSelectionChange={(keys) => updateField("experience_level", Array.from(keys)[0])}
                >
                  <SelectItem key="beginner">Beginner</SelectItem>
                  <SelectItem key="intermediate">Intermediate</SelectItem>
                  <SelectItem key="advanced">Advanced</SelectItem>
                </Select>

                <Select
                  label="Equipment"
                  variant="bordered"
                  radius="xl"
                  isDisabled={!isEditing}
                  selectedKeys={profile.equipment ? [profile.equipment] : ["at home"]}
                  onSelectionChange={(keys) => updateField("equipment", Array.from(keys)[0])}
                >
                  {/* ✅ القيم بالضبط زي ما الـ Postman بيبعت */}
                  <SelectItem key="at home">At Home</SelectItem>
                  <SelectItem key="gym">Gym</SelectItem>
                  <SelectItem key="full equipment">Full Equipment</SelectItem>
                </Select>
              </div>
            </section>

            {/* ── Unsaved Changes Indicator ── */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between"
              >
                <p className="text-sm font-bold text-yellow-700">
                  ✏️ You have unsaved changes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs font-black text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="text-xs font-black text-white bg-green-600 px-4 py-1.5 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Now"}
                  </button>
                </div>
              </motion.div>
            )}

          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
