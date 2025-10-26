"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { stories, comments, favorites, stats } from "@/lib/api";

interface StoryDetailProps {
  id: string;
}

export default function StoryDetail({ id }: StoryDetailProps) {
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchStory();
    fetchComments();
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await stories.getById(id);
      setStory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching story:", error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await comments.getByStory(id);
      setCommentList(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Please login to post comments");
      router.push("/login");
      return;
    }
    
    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }
    
    try {
      await comments.create({ storyId: id, content: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Story not found</h2>
        <Link href="/" className="text-purple-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
        >
          ← Back to Stories
        </Link>
      </div>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {story.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span>By <strong className="text-purple-600 dark:text-purple-400">{story.username}</strong></span>
          <span>👁️ {story.views} views</span>
          <span>❤️ {story.like_count} likes</span>
          <span>📝 {commentList.length} comments</span>
        </div>

        {story.description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
            {story.description}
          </p>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {story.content}
          </div>
        </div>
      </article>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Comments
        </h2>

        {isLoggedIn ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300">
              Please <Link href="/login" className="font-semibold hover:underline">login</Link> to post comments
            </p>
          </div>
        )}

        <div className="space-y-4">
          {commentList.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {comment.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {comment.username}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
