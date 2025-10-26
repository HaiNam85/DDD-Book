"use client";

import { useState, useEffect } from "react";
import { stats } from "@/lib/api";

export default function UserProfile() {
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const response = await stats.getUserStats(parsedUser.id);
        setUserStats(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
          <a href="/login" className="text-purple-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {userStats?.storiesCount || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Stories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {userStats?.followersCount || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {userStats?.followingCount || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Following</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {userStats?.favoritesCount || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Favorites</div>
          </div>
        </div>
      </div>
    </div>
  );
}
