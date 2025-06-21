'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeAuthToken } from '@/lib/auth';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMobile } from '@/hooks/useMobile';

export default function Navbar({ user }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMobile();

  // Extract name from email
  const getName = (email) => {
    if (!email) return 'User';
    const name = email.split('@')[0];
    return name
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleLogout = () => {
    removeAuthToken();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="fixed top-2 right-2 p-4 z-50">
      <div className="relative">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          onClick={toggleDropdown}
          className="flex items-center space-x-1"
        >
          <User className="w-8 h-8" />
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <p className="font-medium truncate">{getName(user?.email)}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
