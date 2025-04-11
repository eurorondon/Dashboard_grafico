"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ajusta la ruta según tu proyecto
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ getValue }) => {
      const rawDate = getValue();
      if (!rawDate) return "Sin fecha";

      const date = new Date(rawDate);
      return new Intl.DateTimeFormat("es-VE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date); // Resultado: 09-04-2025
    },
  },
  {
    accessorKey: "id",
    header: "N Orden",
  },
  {
    accessorKey: "isPaid",
    header: "Pagado",
  },
  {
    accessorKey: "isDelivered",
    header: "Status",
  },

  {
    header: "Usuario",
    accessorFn: (row) => row.user?.name ?? "Sin nombre",
    id: "userName",
  },
  {
    header: "Correo",
    accessorFn: (row) => row.user?.email ?? "Sin correo",
    id: "Email",
  },
  {
    header: "Telefono",
    accessorFn: (row) => row.user?.phoneNumber ?? "Sin correo",
    id: "Telefono",
  },
  {
    accessorKey: "totalPrice",
    header: "Email",
  },

  {
    id: "actions",
    header: "Detalles",
    cell: ({ row }) => {
      const orderId = row.original.id; // o cualquier dato que necesites
      const router = useRouter(); // Hook de enrutamiento

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/orders/${orderId}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
