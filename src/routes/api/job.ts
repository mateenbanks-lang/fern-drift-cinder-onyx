import { createFileRoute } from "@tanstack/react-router";
import { readJob } from "@/lib/mash/job-store";

export const Route = createFileRoute("/api/job")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id") ?? "";
        const job = readJob(id);
        if (!job) return Response.json({ error: "That reply finished or expired." }, { status: 404 });
        return Response.json({ text: job.text, done: job.done, error: job.error ?? null });
      },
    },
  },
});
