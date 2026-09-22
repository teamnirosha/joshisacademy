import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/youtube")({
  component: () => <Outlet />,
});
