import StoryDetail from "@/components/StoryDetail";

interface PageProps {
  params: {
    id: string;
  };
}

export default function StoryPage({ params }: PageProps) {
  return <StoryDetail id={params.id} />;
}
