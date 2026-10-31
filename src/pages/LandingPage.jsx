import React, { useRef } from "react";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Card,
  CardBody
} from "@heroui/react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import { Utensils, Dumbbell, LineChart } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const featuresRef = useRef(null);

  const goToLogin = (e) => {
    if (e) e.preventDefault(); 
    console.log("Navigating to login..."); 
    navigate("/login");
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const services = [
    {
      title: "Smart Meal Plans",
      desc: "Customized nutrition plans based on your body metrics and fitness goals.",
      icon: <Utensils className="text-green-600" size={32} />
    },
    {
      title: "Professional Workouts",
      desc: "Access to a wide range of exercises with clear video guidance.",
      icon: <Dumbbell className="text-green-600" size={32} />
    },
    {
      title: "Progress Tracking",
      desc: "Monitor your weight and body transformations with detailed charts.",
      icon: <LineChart className="text-green-600" size={32} />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans overflow-x-hidden">
      
      {/* --- Header --- */}
      <Navbar maxWidth="xl" isBordered onMenuOpenChange={setIsMenuOpen} className="py-1">
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
          <NavbarBrand>
            <p className="font-black text-xl md:text-2xl tracking-tighter text-green-600">
              SMART <span className="text-black">Nutrition</span>
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          <NavbarItem>
            <button className="font-bold text-gray-900 hover:text-green-600 transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              Home
            </button>
          </NavbarItem>
          <NavbarItem>
            <button className="font-bold text-gray-900 hover:text-green-600 transition-colors" onClick={scrollToFeatures}>
              Features
            </button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2 md:gap-4">
          <NavbarItem className="hidden xs:flex">
            <Button variant="light" className="font-bold text-green-600" onClick={() => navigate("/register")}>
              Signup
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button 
              color="success" 
              className="font-bold bg-green-600 text-white rounded-xl px-4 md:px-8 shadow-lg"
              onClick={goToLogin}
            >
              Login
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="pt-6">
          <NavbarMenuItem><button className="w-full text-left text-gray-900 font-bold text-xl py-2" onClick={() => { window.scrollTo({top: 0}); setIsMenuOpen(false); }}>Home</button></NavbarMenuItem>
          <NavbarMenuItem><button className="w-full text-left text-gray-900 font-bold text-xl py-2" onClick={scrollToFeatures}>Features</button></NavbarMenuItem>
          <NavbarMenuItem className="mt-4">
             <Button className="w-full bg-green-600 text-white font-bold h-14 rounded-2xl" onClick={goToLogin}>Get Started</Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      {/* --- Hero Section --- */}
      <main className="flex-grow flex flex-col items-center">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-10 py-12 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Welcome to <br className="hidden sm:block" />
              <span className="text-green-600 relative inline-block">
                Smart Nutrition
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-green-100 -z-10 rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium max-w-3xl mx-auto px-4">
              "Listening is the foundation of my coaching approach. First tell me what do you want to achieve? I will give you the guidance to achieve your goal."
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-6">
            <Button 
              size="lg" 
              className="w-full sm:w-80 bg-black text-white px-12 h-16 text-xl font-bold rounded-2xl hover:bg-gray-800 shadow-2xl active:scale-95" 
              onClick={goToLogin}
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="bordered" 
              className="w-full sm:w-60 border-2 border-gray-200 h-16 text-lg font-bold rounded-2xl hover:bg-gray-50 active:scale-95" 
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </motion.div>
        </section>

        {/* --- Features Section --- */}
        <section ref={featuresRef} className="w-full bg-gray-50 py-24 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Why Choose Smart Nutrition?</h2>
              <p className="text-gray-500 text-lg font-medium">Everything you need to reach your fitness peak in one place.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div key={idx} whileHover={{ y: -10 }}>
                  <Card className="border-none shadow-xl rounded-[2rem] p-4 h-full">
                    <CardBody className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-green-50 rounded-2xl">{service.icon}</div>
                      <h3 className="text-2xl font-black">{service.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{service.desc}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-100 bg-white py-12 md:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left space-y-2">
            <p className="font-black text-2xl text-green-600 tracking-tighter">SMART Nutrition</p>
            <p className="text-gray-500 text-base max-w-sm font-medium">
              A comprehensive platform built to transform your lifestyle through AI-driven nutrition.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Contact Us</p>
            <a href="tel:01068901389" className="text-gray-900 font-black text-2xl md:text-3xl hover:text-green-600">01068901389</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
