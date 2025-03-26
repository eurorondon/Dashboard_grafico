"use client";
import { getAllCategories } from "@/utils/graphqlFunctions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";

function Page() {
  const { data } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: getAllCategories,
  });

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2 md:p-5 lg:p-10">
      {data?.map((category) => (
        <Link
          key={category.id}
          href={`/categorias/${category.categoryName}`}
          className="bg-blue-100 flex flex-col p-5 rounded-md justify-center items-center"
        >
          <div className="rounded-full overflow-hidden w-44 h-44 relative">
            <Image
              src={
                category?.photo?.[0]?.url ??
                "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
              }
              alt={`Imagen de ${category.categoryName}`}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <span className="font-semibold mt-2">{category.categoryName}</span>
        </Link>
      ))}
    </div>
  );
}

export default Page;
