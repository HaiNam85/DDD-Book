import StoryList from "@/components/StoryList";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Discover Amazing Stories
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Read, write, and share your favorite stories
        </p>
      </div>
      <StoryList />
    </div>
  );
}
