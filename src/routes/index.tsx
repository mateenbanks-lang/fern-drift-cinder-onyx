import { createFileRoute } from "@tanstack/react-router";
import { MashApp } from "@/components/mash/ui";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MashApp />;
}
