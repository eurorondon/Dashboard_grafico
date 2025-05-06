// components/OrderActionsCell.tsx
"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderActionsCell({ orderId }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push(`/orders/${orderId}`)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}
