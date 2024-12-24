import React from 'react';
import { User } from 'lucide-react';
import { signOut } from '../lib/auth';

interface UserProfileProps {
  email: string;
}

export function UserProfile({ email }: UserProfileProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
      >
        Sign Out
      </button>
    </div>
  );
}