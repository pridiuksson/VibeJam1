import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-8rem)]">
      <Spinner size="large" />
    </div>
  );
}
