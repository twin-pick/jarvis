import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <h1 className="text-3xl bg-red-500">Hello Twin Pick!</h1>
    </div>
  );
}
