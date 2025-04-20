"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Product from "../../components/Product";
import { deleteProductFunction } from "@/utils/graphqlFunctions";
import { toast } from "react-toastify";
import { Table } from "flowbite-react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import Loader from "../../components/Loader";

function Page() {
  // Mover useSearchParams dentro del Suspense
  const [mosaico, setMosaico] = React.useState(false);
  const [cargando, setCargando] = React.useState(true);

  const queryClient = useQueryClient();

  // Fetch search params within Suspense
  const SearchParamsWithSuspense = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    return <ProductsList search={search} />;
  };

  // Función para manejar la lista de productos
  const ProductsList = ({ search }) => {
    Amplify.configure(amplifyconfig);
    const client = generateClient();

    // Query para obtener productos
    const { data, refetch, isLoading } = useQuery({
      queryKey: ["Keywords"],
      queryFn: async () => {
        try {
          const res = await client.graphql({
            query: listProducts,
            variables: { limit: 500, filter: { name: { contains: search } } },
          });
          return res.data.listProducts.items;
        } catch (error) {
          console.error("Error fetching products data:", error);
          return null;
        }
      },
      enabled: false, // Disabled until search value changes
    });

    console.log("data search", data);

    const { mutate } = useMutation({
      mutationFn: deleteProductFunction,
      onSuccess: () => {
        queryClient.invalidateQueries(["Keywords"]);
        refetch();
      },
    });

    React.useEffect(() => {
      refetch({ search });
    }, [search, refetch]);

    if (isLoading) return <Loader />;

    return (
      <div>
        {data?.length === 0 ? (
          <div className="flex justify-center items-center h-80 mb-10">
            <span className="text-4xl">Sin resultados</span>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-4 xl:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0">
            {data?.map((product) => (
              <div key={product.id}>
                <Product
                  id={product.id}
                  url={
                    product?.photo &&
                    Array.isArray(product.photo) &&
                    product.photo[0]
                      ? product.photo[0].url
                      : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                  }
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  offer={product.inOffer}
                  discountPercentage={product.discountPercentage}
                  photo={product.photo}
                  handleDelete={mutate}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white" style={{ minHeight: "100vh" }}>
      <Suspense fallback={<Loader />}>
        <SearchParamsWithSuspense />
      </Suspense>
    </div>
  );
}

export default Page;
