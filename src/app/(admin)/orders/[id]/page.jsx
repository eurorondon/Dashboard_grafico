"use client";

import { getOrderDetail } from "@/utils/graphqlFunctions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button"; // Asegúrate de tener este componente
import { Eye } from "lucide-react"; // Si quieres usar el ícono del ojo
import Loader from "../../../components/Loader";

const OrderDetailsPage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const { data, isLoading, error } = useQuery({
    queryKey: ["OrderDetail", id],
    queryFn: () => getOrderDetail(id), // Llamamos la función para obtener los detalles
    enabled: !!id, // Solo ejecuta la consulta si tenemos un id
  });

  // Si los datos están cargando, mostramos un loader
  if (isLoading) {
    return <Loader />;
  }

  // Si hay un error, mostramos un mensaje
  if (error) {
    return <div>Hubo un error al cargar los detalles de la orden</div>;
  }

  // Si los datos fueron obtenidos correctamente, mostramos la tabla de detalles
  const order = data; // Suponemos que data es el objeto con los detalles de la orden

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Detalles de la Orden</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
        <div className="mb-6">
          <p>
            <strong>Nombre:</strong> {order?.user?.name}
          </p>
          <p>
            <strong>Correo:</strong> {order?.user?.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {order?.user?.phoneNumber}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Productos de la Orden</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems?.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">${item.price}</td>
                <td className="px-4 py-2">${item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mt-6 mb-4">Resumen de la Orden</h2>
        <div className="space-y-4">
          <p>
            <strong>Total de la Orden:</strong> ${order?.totalPrice}
          </p>
          <p>
            <strong>Estado del Pago:</strong>{" "}
            {order?.isPaid ? "Pagado" : "No Pagado"}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>ID de la Orden:</strong> {order?.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
