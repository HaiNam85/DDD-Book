"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { stories } from "@/lib/api";

interface Story {
  id: number;
  title: string;
  description: string;
  username: string;
  views: number;
  like_count: number;
  created_at: string;
  category: string;
}

export default function StoryList() {
  const [storyList, setStoryList] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await stories.getAll({ search });
      setStoryList(response.data.stories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
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

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchStories()}
          className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={fetchStories}
          className="mt-4 w-full max-w-md mx-auto block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Search
        </button>
      </div>

      {storyList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No stories found. Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storyList.map((story) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <span className="text-6xl">📖</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {story.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {story.username}
                    </span>
                    <div className="flex gap-4">
                      <span>👁️ {story.views}</span>
                      <span>❤️ {story.like_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
