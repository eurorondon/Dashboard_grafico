"use client";

import { getOrderDetail, updateSingleOrder } from "@/utils/graphqlFunctions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button"; // Asegúrate de tener este componente
import { CreditCard, Eye, Truck, User } from "lucide-react"; // Si quieres usar el ícono del ojo
import Loader from "../../../components/Loader";

const formatDate = (rawDate) => {
  const date = new Date(rawDate);

  // Formateamos la fecha (sin hora)
  const datePart = new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  // Formateamos la hora
  const timePart = new Intl.DateTimeFormat("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Si prefieres 24 horas
  }).format(date);

  // Concatenamos fecha y hora sin la coma
  return `${datePart} ${timePart}`;
};

const OrderDetailsPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [loadingDelivered, setLoadingDelivered] = React.useState(false);
  const { id } = useParams(); // Obtenemos el ID de la URL
  const { data, isLoading, error } = useQuery({
    queryKey: ["OrderDetail", id],
    queryFn: () => getOrderDetail(id), // Llamamos la función para obtener los detalles
    enabled: !!id, // Solo ejecuta la consulta si tenemos un id
  });

  const handleMarkAsPaid = async () => {
    setLoading(true);
    try {
      await updateSingleOrder({
        id: order?.id,
        isPaid: true,
        paidAt: new Date().toISOString(),
      });
      // alert("¡Pagado!");
      window.location.reload(); // O refetch()
    } catch (error) {
      console.log("Error");
      // Ya hay alerta detallada en updateSingleOrder
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setLoading(true);
    try {
      await updateSingleOrder({
        id: order?.id,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      });
      // alert("¡Entregado!");
      window.location.reload(); // O refetch()
    } catch (error) {
      // Ya hay alerta detallada en updateSingleOrder
    } finally {
      setLoading(false);
    }
  };

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
    <div
      className={
        order.isPaid
          ? "container mx-auto p-4 bg-green-100 rounded-md"
          : "container mx-auto p-4 bg-red-100 rounded-md"
      }
    >
      <h1 className="text-2xl font-semibold mb-4">Detalles de la Orden</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          {/* Tarjeta: Información del Usuario */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
              <span className="bg-red-100 p-2 rounded-full">
                <User size={20} />
              </span>
              Información del Usuario
            </h2>
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

          {/* Tarjeta: Dirección de Envío */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <span className="bg-blue-100 p-2 rounded-full">
                <Truck size={20} />
              </span>
              Dirección de Envío
            </h2>
            <p>
              <strong>Dirección:</strong>{" "}
              {order?.shippingAddress?.address || "No especificada"}
            </p>
            <p>
              <strong>Ciudad:</strong>{" "}
              {order?.shippingAddress?.city || "No especificada"}
            </p>
            <p>
              <strong>Código Postal:</strong>{" "}
              {order?.shippingAddress?.postalCode || "No especificado"}
            </p>
          </div>

          {/* Tarjeta: Acciones */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
              <span className="bg-green-100 p-2 rounded-full">
                <CreditCard size={20} />
              </span>
              Acciones
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {order?.isPaid ? (
                <button className="w-full bg-green-500 text-white px-2 py-1 rounded">
                  Pagado {formatDate(order.paidAt)}
                </button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleMarkAsPaid}
                  disabled={loadingDelivered}
                >
                  {loadingDelivered ? "Actualizando..." : "Marcar Pagado"}
                </Button>
              )}
              {order?.isDelivered ? (
                <button className="w-full bg-green-500 text-white px-2 py-1 rounded">
                  Entregado {formatDate(order.deliveredAt)}
                </button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleMarkAsDelivered}
                  disabled={loadingDelivered}
                >
                  {loadingDelivered ? "Actualizando..." : "Marcar Entregado"}
                </Button>
              )}
            </div>
          </div>
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
            {order?.isPaid ? (
              <button className="text-green-600 font-semibold">Pagado</button>
            ) : (
              <button className="bg-red-100 text-red-500 px-2 py-1 rounded ">
                No pagado
              </button>
            )}
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
