import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './GoogleSignIn.css';

const GoogleSignIn = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const signInButtonRef = useRef(null);

  // Google Client ID - this should match your .env file
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "your_google_client_id_here";

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        try {
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render the sign-in button
          if (signInButtonRef.current) {
            window.google.accounts.id.renderButton(signInButtonRef.current, {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 280
            });
          }

          setIsGoogleLoaded(true);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          setSignInError('Failed to initialize Google Sign-In. Please check your configuration.');
        }
      }
    };

    // Load Google Identity Services
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        setSignInError('Failed to load Google Sign-In. Please refresh the page and try again.');
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    setSignInError(null);
    clearError();

    try {
      const result = await login(response.credential);
      
      if (!result.success) {
        setSignInError(result.error || 'Sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setSignInError('An unexpected error occurred. Please try again.');
    }
  };

  const handleRetry = () => {
    setSignInError(null);
    clearError();
    if (!isGoogleLoaded) {
      window.location.reload(); // Reload page if Google script failed to load
    }
  };

  if (GOOGLE_CLIENT_ID === "your_google_client_id_here") {
    return (
      <div className="google-signin-container">
        <div className="google-signin-error">
          <h3>⚠️ Google Sign-In Not Configured</h3>
          <p>
            Please follow the setup instructions in <code>GOOGLE_OAUTH_SETUP.md</code> to configure Google OAuth.
          </p>
          <ol>
            <li>Create a Google Cloud project</li>
            <li>Enable Google+ API</li>
            <li>Create OAuth 2.0 credentials</li>
            <li>Update your .env file with the client ID</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="google-signin-container">
      <div className="google-signin-content">
        <h3>Sign in to enhance your experience</h3>
        <p>Save your voting preferences and get personalized news recommendations</p>
        
        {(error || signInError) && (
          <div className="signin-error">
            <p>{error || signInError}</p>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="signin-loading">
            <div className="loading-spinner"></div>
            <p>Signing you in...</p>
          </div>
        )}

        {!isLoading && (
          <div className="signin-button-container">
            {!isGoogleLoaded && !signInError && (
              <div className="loading-google">
                <div className="loading-spinner"></div>
                <p>Loading Google Sign-In...</p>
              </div>
            )}
            
            <div
              ref={signInButtonRef}
              className={`google-signin-button ${!isGoogleLoaded ? 'hidden' : ''}`}
            ></div>
          </div>
        )}

        <div className="signin-benefits">
          <h4>Benefits of signing in:</h4>
          <ul>
            <li>🗳️ Persistent voting across devices</li>
            <li>⚙️ Save your preferences and filters</li>
            <li>📊 Track your reading history</li>
            <li>🔒 Secure authentication with Google</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;