import { useState, useEffect, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '../services/api';

function AuthModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const modalRef = useRef(null);
  const googleBtnRef = useRef(null);
  const invisibleBtnRef = useRef(null);

  // Define initGoogleSignIn
  const initGoogleSignIn = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error("Google Identity Services not loaded.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: '251970702041-ps1c9tfso7cian4ouj89llg57qkceo7s.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    // Render Google button inside the invisible container
    if (invisibleBtnRef.current) {
      window.google.accounts.id.renderButton(invisibleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "300",
      });
    }
  };

  const handleCredentialResponse = (response) => {
    setIsLoading(true);
    setAuthStatus(null);

    const token = response.credential;

    apiCall('auth/google-auth', {
      access_token: token,
      username: ''
    }, 'POST')
      .then(data => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_id', data.user_id);

        setAuthStatus('success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      })
      .catch(error => {
        console.error('Error:', error);
        setAuthStatus('error');
        setTimeout(() => {
          setAuthStatus(null);
        }, 5000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    if (invisibleBtnRef.current) {
      const googleBtn = invisibleBtnRef.current.querySelector('div[role=button]');
      if (googleBtn) {
        googleBtn.click();
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadGoogleScript = () => {
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignIn();
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-end justify-end z-50 p-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="pointer-events-auto"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, duration: 0.2 }}
            ref={modalRef}
          >
            <div className="w-80 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl dark:shadow-gray-900/80 border border-gray-100 dark:border-gray-700">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Continue with FreshMclean</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sign in to book cleaning services</p>
                  </div>
                  <motion.button 
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </motion.button>
                </div>

                {/* Google Sign In button */}
                <motion.button 
                  ref={googleBtnRef}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-70 mt-3"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.span 
                      className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <FcGoogle className="text-xl" />
                  )}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </motion.button>

                <div ref={invisibleBtnRef} className="g_id_signin hidden"></div>

                {/* Status messages */}
                <AnimatePresence>
                  {authStatus === 'success' && (
                    <motion.div 
                      className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg mt-4 flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.svg 
                        className="w-5 h-5 mr-2 text-green-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </motion.svg>
                      <span><strong>Success!</strong> Signing you in...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
