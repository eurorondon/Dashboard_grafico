"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getAllOrders } from "@/utils/graphqlFunctions";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useRouter } from "next/navigation";
import { CircleDollarSign, ShoppingBag, ShoppingBasket } from "lucide-react";

// Esta función es usada por React Query
async function getDataMock() {
  return [
    {
      id: "728ed52f",
      amount: 100,
      statussss: "pending",
      email: "m@example.com",
    },
    // más datos si quieres
  ];
}

const Page = () => {
  const router = useRouter();
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const {
    data: dataProductos,
    isLoading: isLoadingProductos,
    error: errorProductos,
  } = useQuery({
    queryKey: ["AllProductos"],
    queryFn: getProducts,
  });

  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    error: errorOrders,
  } = useQuery({
    queryKey: ["AllOrders"],
    queryFn: getAllOrders,
  });

  console.log(dataOrders);

  const {
    data: dataMock,
    isLoading: isLoadingMock,
    error: errorMock,
  } = useQuery({
    queryKey: ["MockData"],
    queryFn: getDataMock,
  });

  if (isLoadingProductos || isLoadingOrders || isLoadingMock) {
    return <div>Cargando...</div>;
  }

  if (errorProductos || errorOrders || errorMock) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="container pt-5 mx-auto">
      <div className="flex gap-4 mb-8">
        {/* Tarjeta para productos */}
        <div
          className="p-6 bg-white shadow-md rounded-lg flex-1 cursor-pointer"
          onClick={() => router.push("/productos")}
        >
          <div className="flex items-center  gap-5">
            <h5 className="text-xl font-semibold mb-2">Total Productos</h5>
            <div className="bg-blue-100 flex justify-center items-center rounded-full p-1">
              <ShoppingBasket size={40} className="text-blue-400" />
            </div>
          </div>

          <p className="text-lg">{dataProductos?.length} productos</p>
        </div>

        {/* Tarjeta para órdenes */}

        <div
          className="p-6 bg-white shadow-md rounded-lg flex-1 cursor-pointer"
          onClick={() => router.push("/ordenes")}
        >
          <div className="flex items-center  gap-5">
            <h5 className="text-xl font-semibold mb-2">Total Órdenes</h5>
            <div className="bg-green-200 flex justify-center items-center rounded-full p-2">
              <ShoppingBag size={35} className="text-green-400" />
            </div>
          </div>

          <p className="text-lg">{dataOrders?.length} órdenes</p>
        </div>

        {/* Tarjeta para total venta */}
        <div className="p-6 bg-white shadow-md rounded-lg flex-1">
          <div className="flex items-center  gap-5">
            <h5 className="text-xl font-semibold mb-2">Total Venta</h5>
            <div className="bg-yellow-200 flex justify-center items-center rounded-full p-1">
              <CircleDollarSign size={40} className="text-yellow-400" />
            </div>
          </div>

          <p className="text-lg">
            ${dataOrders?.reduce((total, order) => total + order.totalPrice, 0)}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <p className="text-xl mb-2 ms-2">Ultimas Ordenes</p>
        <DataTable columns={columns} data={dataOrders} />
      </div>
    </div>
  );
};

export default Page;
