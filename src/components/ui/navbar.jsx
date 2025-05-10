import { useState, useEffect, useRef } from "react";
import { RxCaretDown, RxChevronUp } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/images/new-fresh.svg";
import UKFlag from "../../assets/images/UnitedKingdom.png";
import Button from "./button";

import { authenticate } from "../../services/auth";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const isAuth = authenticate();
    setIsAuthenticated(isAuth);
  };

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuthStatus();
    
    // Set up event listener for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener("authChanged", handleAuthChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.clear();
    setIsAuthenticated(false);
    toast.success("You have been logged out!");
    setTimeout(() => navigate("/login"), 1000);
  };

  function getAvatarUrl(fullName) {
    let nameParts = fullName.trim().split(/\s+/);
    let initials = "";

    if (nameParts.length === 1) {
      initials = nameParts[0][0];
    } else if (nameParts.length >= 2) {
      initials = nameParts[0][0] + nameParts[1][0];
    }

    return `https://ui-avatars.com/api/?name=${initials}`;
  }

  const navLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About" },
    { path: "/review", text: "Reviews" },
    { path: "/faqs", text: "FAQs" },
    { path: "/membership", text: "Become a cleaner" }
  ];

  return (
    <nav className="bg-white px-4 py-4 relative">
      {/* Desktop Navigation */}
      <div className="flex justify-between items-center w-full md:max-w-6xl 2xl:max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="freshmclean logo" className="h-10" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex ml-4 space-x-1">
            {navLinks.map((link) => (
              <Link to={link.path} key={link.path}>
                <p className="px-3 py-2 text-sm rounded-lg hover:text-blue-500 duration-150">
                  {link.text}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100"
            >
              <p>{currentLang.toUpperCase()}</p>
              <img
                src={
                  currentLang === "en"
                    ? UKFlag
                    : "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg"
                }
                alt="language flag"
                className="w-6 h-4"
              />
              {isDropdownOpen ? (
                <RxChevronUp size={20} />
              ) : (
                <RxCaretDown size={20} />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  className={`flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 ${
                    currentLang === "en" ? "bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    setCurrentLang("en");
                    setDropdownOpen(false);
                  }}
                >
                  <img src={UKFlag} alt="UK flag" className="w-6 h-4" />
                  <span>English</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 ${
                    currentLang === "de" ? "bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    setCurrentLang("de");
                    setDropdownOpen(false);
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg"
                    alt="German flag"
                    className="w-6 h-4"
                  />
                  <span>Deutsch</span>
                </button>
              </div>
            )}
          </div>

          {/* Authentication Buttons or Profile */}
          <div className="hidden md:block" ref={profileRef}>
            {isAuthenticated ? (
              window.location.pathname.includes("/dashboard") ? (
                <>
                  <img
                    src={
                      customer.picture
                        ? customer.picture
                        : customer.name
                        ? getAvatarUrl(customer.name)
                        : getAvatarUrl("User")
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer object-cover"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  />
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                      <ul className="py-2 text-sm">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <Link to="/dashboard/profile" className="block">
                            Profile
                          </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/dashboard">
                  <button className="py-2 px-5 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Dashboard
                  </button>
                </Link>
              )
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  to="/login"
                >
                  Login
                </Button>

                <Button
                  variant="primary"
                  to="/signup"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <RxCross1 size={22} />
            ) : (
              <GiHamburgerMenu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 px-4 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                to={link.path}
                key={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <p className="px-3 py-2 rounded-lg hover:bg-gray-100">
                  {link.text}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2 px-5 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2 px-5 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2 px-5 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}