"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (when login happens in another tab/window)
    window.addEventListener('storage', checkAuth);
    
    // Also check periodically (every 1 second) for client-side login
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/profile"
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline text-sm font-medium">
          {user?.username}
        </span>
      </Link>
    </div>
  );
}
