import { useState } from 'react';
import { signIn, signUp } from '../../lib/auth';

export function useAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await (isSignUp ? signUp(email, password) : signIn(email, password));
      if (!response.success) {
        throw new Error(response.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => setIsSignUp(!isSignUp);

  return {
    isSignUp,
    loading,
    handleSubmit,
    toggleAuthMode,
  };
}