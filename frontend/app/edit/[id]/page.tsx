import EditStory from "@/components/EditStory";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPage({ params }: PageProps) {
  return <EditStory id={params.id} />;
}
