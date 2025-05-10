import "aos/dist/aos.css";
import AOS from "aos";
import React, { useState, useEffect } from "react";
import Navigation from "../components/ui/navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer";
import AuthModal from "../components/AuthModal";
import { authenticate } from "../services/auth";

const WebLayout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // start as true to block UI until check completes
  const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- fixed missing state

  // Moved outside so it's reusable
  const checkAuth = () => {
    const needAuth = authenticate();
    setIsAuthenticated(needAuth);
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkAuth(); // Initial check

    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChanged", handleAuthChange);

    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // const authHandled = handleGoogleRedirect();
    // if (!authHandled) {
    //   checkAuth();
    // } else {
    //   setCheckingAuth(false);
    // }
  }, []);

  if (checkingAuth) return null; // You could return a loader here instead

  return (
    <>
      <Navigation />
      <main className="px-4">
        <div className="w-full md:max-w-6xl 2xl:max-w-7xl mx-auto">
          <Outlet />
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </main>
      <Footer />
    </>
  );
};

export default WebLayout;
