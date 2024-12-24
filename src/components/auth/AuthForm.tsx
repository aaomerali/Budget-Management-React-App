import React from 'react';
import { useAuth } from './useAuth';
import { AuthFormFields } from './AuthFormFields';

export function AuthForm() {
  const { isSignUp, loading, handleSubmit, toggleAuthMode } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
        <AuthFormFields
          isSignUp={isSignUp}
          loading={loading}
          onSubmit={handleSubmit}
          onToggleMode={toggleAuthMode}
        />
      </div>
    </div>
  );
}