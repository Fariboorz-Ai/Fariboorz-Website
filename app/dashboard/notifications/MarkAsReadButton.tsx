"use client";

import { useTransition } from "react";
import { markAsRead } from "./actions";

export default function MarkAsReadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await markAsRead(id).then((res) => {
          if (!res.success) {
           alert("Failed to mark as read");
          }else{
            alert("Marked as read ✅");
          }
        });
      } catch (err) {
        console.error(err);
        alert("Failed to mark as read");
      }
    });
  };

  return (
    <button
      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-sm rounded-lg transition-all text-white disabled:opacity-50"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Processing..." : "Mark as Read"}
    </button>
  );
}
