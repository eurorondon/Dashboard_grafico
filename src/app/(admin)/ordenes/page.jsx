"use client";
import { getAllOrders } from "@/utils/graphqlFunctions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "../_components/columns";

const Page = () => {
  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    error: errorOrders,
  } = useQuery({
    queryKey: ["AllOrders"],
    queryFn: getAllOrders,
  });

  console.log(dataOrders);
  return (
    <div>
      <div className="container mx-auto py-10">
        {dataOrders && <DataTable columns={columns} data={dataOrders} />}
      </div>
    </div>
  );
};

export default Page;
