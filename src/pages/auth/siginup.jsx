import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../services/api";
import { FromRegister, handleGoogleSignIn } from "../../services/auth";


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Load Google API script
  useEffect(() => {
    if (document.querySelector('script#google-platform')) {
      setGoogleScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-platform';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleScriptLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      if (document.querySelector('script#google-platform')) {
        document.querySelector('script#google-platform').remove();
      }
    };
  }, []);

  useEffect(() => {
    if (googleScriptLoaded && window.google) {
        window.google.accounts.id.initialize({
          client_id: "251970702041-ps1c9tfso7cian4ouj89llg57qkceo7s.apps.googleusercontent.com",
          callback: (response) => {
            const googleToken = response
            handleGoogleSignIn(googleToken, navigate, toast);

          },
        });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'filled_blue', size: 'large', width: '100%', text: 'signup_with', shape: 'pill' }
      );
    }
  }, [googleScriptLoaded]);

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length >= 8) strength += 1;
    // Has uppercase
    if (/[A-Z]/.test(formData.password)) strength += 1;
    // Has lowercase
    if (/[a-z]/.test(formData.password)) strength += 1;
    // Has number
    if (/[0-9]/.test(formData.password)) strength += 1;
    // Has special character
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    try {
      console.log('Sending signup data:', dataToSend);
      const result = await FromRegister(dataToSend);
      console.log('Signup response:', result);

      if (result.ok || result.status === 201) {
        toast.success("Account created successfully!");

        // Check if there's booking data in sessionStorage
        const bookingData = sessionStorage.getItem('bookingData');
        if (bookingData) {
          navigate('/book-cleaning');
        } else {
          navigate("/login");
        }

        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
        });
        setStep(1);
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (formData.first_name && formData.last_name, formData.username)) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleGoogleSignIn = async (response) => {
    if (response.credential) {
      setLoading(true);

      try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const apiResponse = await fetch(`${API}/auth/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({access_token: response.credential}),
        });

        if (apiResponse.status != 200) {
          throw new Error(`API error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setLoading(false);
        toast.success(`Successfully signed in with Google as ${payload.email}`);
        const bookingData = sessionStorage.getItem('bookingData');
        if (bookingData) {
          navigate('/book-cleaning');
        } else {
          navigate("/");
          window.location.reload()
        }
      } catch (error) {
        console.error("Google auth error:", error);
        setLoading(false);
        toast.error("Error signing in with Google. Please try again.");
      }
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Very weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md max-w-md w-full mx-auto my-8 transition-all duration-300 hover:shadow-lg">
      {/* Progress indicator */}
      <div className="flex justify-center pt-6">
        <div className="flex space-x-3">
          <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {step === 1 ? "Create Account" : "Complete Registration"}
        </h2>
        <p className="text-gray-600 text-sm">
          {step === 1
            ? "Let's get started with your new account"
            : "Just a few more details to finish"}
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-5 transition-all duration-300 ease-in-out">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Google Sign-In Button */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div id="google-signin-button" className="w-full h-12 flex items-center justify-center"></div>
              </div>

              {/* Next Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.first_name || !formData.last_name}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center ${!formData.first_name || !formData.last_name
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                    }`}
                >
                  <span>Continue</span>
                  <FiChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Email & Password */}
          {step === 2 && (
            <div className="space-y-5 transition-all duration-300 ease-in-out">
              {/* Email */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex h-1.5 overflow-hidden bg-gray-200 rounded">
                      <div className={`transition-all duration-300 ${getPasswordStrengthClass()}`} style={{ width: `${passwordStrength * 20}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 flex justify-between">
                      <span>{getPasswordStrengthText()}</span>
                      {passwordStrength < 4 && <span>Use 8+ chars with mixed types</span>}
                    </p>
                  </div>
                )}
              </div>

              {/* Agree to terms */}
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="agreeToPolicy"
                  checked={agreeToPolicy}
                  onChange={() => setAgreeToPolicy((prev) => !prev)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="agreeToPolicy" className="ml-2 text-sm text-gray-600">
                  I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
                </label>
              </div>

              {/* Navigation Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-3 px-4 rounded-lg border border-gray-200 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 flex items-center justify-center"
                >
                  <FiChevronLeft size={18} className="mr-2" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading || !agreeToPolicy || !formData.email || !formData.password || passwordStrength < 3
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md focus:ring-blue-500'
                    }`}
                  disabled={loading || !agreeToPolicy || !formData.email || !formData.password || passwordStrength < 3}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Sign-In Link */}
      <div className="px-6 py-5 text-center border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;