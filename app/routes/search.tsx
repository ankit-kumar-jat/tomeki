import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Search Millions of Books Instantly | Novalla" },
    {
      name: "description",
      content:
        "Search, discover, and dive into millions of books with ease. Find your next favorite read on Novalla!",
    },
  ];
};

export default function Index() {
  return (
    <div className="text-lg">
      Search
      <Outlet />
    </div>
  );
}
