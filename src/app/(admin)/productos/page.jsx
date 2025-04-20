"use client";

import Product from "../../components/Product";
import { deleteProductFunction, getProducts } from "@/utils/graphqlFunctions";

import DrawerMenu from "../../components/DrawerMenu";
import { useParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { Table } from "flowbite-react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { IoGridOutline } from "react-icons/io5";
import { IoListOutline } from "react-icons/io5";

import Loader from "../../components/Loader";
import { ProductsByDate } from "@/graphql/queries";
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";

function Productos() {
  Amplify.configure(amplifyconfig);
  const client = generateClient();
  const queryClient = useQueryClient();
  const [mosaico, setMosaico] = React.useState(false);

  React.useEffect(() => {
    if (window.innerWidth > 800) {
      setMosaico(true);
    }
  }, []);

  const { category, search } = useParams();

  React.useEffect(() => {
    if (window.innerWidth < 800) {
      setMosaico(false);
    }
  }, []);

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    const lowerCasedStr = str.toLowerCase();
    return lowerCasedStr.charAt(0).toUpperCase() + lowerCasedStr.slice(1);
  };

  const { data, isLoading, hasNextPage, fetchNextPage, refetch, isFetching } =
    useInfiniteQuery({
      queryKey: [
        category ? `infinity-products-${category}` : "infinity-products",
      ],
      queryFn: async ({ pageParam }) => {
        console.log("this is page param = ", pageParam);
        try {
          let filter;
          if (category) {
            filter = { categories: { contains: category } };
          }

          if (search) {
            filter = { name: { contains: search } };
          }

          const productsData = await client.graphql({
            query: ProductsByDate,
            variables: {
              type: "Producto",
              sortDirection: "DESC",
              limit: 20,
              filter,
              nextToken: pageParam,
            },
          });

          return productsData.data.ProductsByDate;
        } catch (err) {
          console.error("Error fetching products", err.errors);
          throw err;
        }
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextToken || null;
      },
    });

  console.log(data);

  const products =
    data?.pages.reduce(
      (prevProducts, page) => prevProducts.concat(page.items),
      []
    ) ?? [];

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation({
    mutationFn: deleteProductFunction, // Función de la mutación
    onSuccess: () => {
      queryClient.invalidateQueries(["AllProducts"]); // Invalida la caché para refrescar los productos
    },
  });

  const handleDelete = async (id, photo) => {
    const publicId = photo.map((item) => item.publicId);

    const userConfirmed = window.confirm("¿Seguro de Eliminar este Producto?");
    if (userConfirmed) {
      try {
        // Elimina la imagen de la API
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: publicId }),
        });

        toast.success("Producto Eliminado");

        // Llama a la mutación para eliminar el producto de la base de datos
        mutate(id);

        // Refresca la lista de productos
        queryClient.invalidateQueries(["AllProducts"]);
      } catch (error) {
        console.error("Error de red al eliminar la imagen desde page", error);
      }
    }
  };

  console.log(isLoading);
  if (isLoading) return <Loader />;
  return (
    <>
      <div className=" flex justify-end items-center  bg-white ">
        <span className="font-bold">View Options</span>
        {mosaico ? (
          <IoListOutline
            size={40}
            className="m-5 bg-slate-600 text-white p-1 rounded-md"
            onClick={() => setMosaico(false)}
          />
        ) : (
          <IoGridOutline
            size={40}
            className="m-5 bg-slate-600 text-white p-1 rounded-md"
            onClick={() => setMosaico(true)}
          />
        )}
      </div>
      <InfiniteScroll
        dataLength={products ? products.length : 0}
        hasMore={hasNextPage}
        next={() => fetchNextPage()}
        // loader={
        //   <div className="mx-auto">
        //     <CircularProgress />
        //   </div>
        // }
      >
        {mosaico ? (
          <div className=" grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-4 xl:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0   ">
            {products?.map((product) => (
              <div key={product.id}>
                <div
                  style={{ cursor: "pointer" }}
                  className=""
                  // onClick={() => handleNavigate(product.id)}
                  //  to={`/products/${product.id}`}
                >
                  <Product
                    id={product.id}
                    url={product?.photo[0]?.url}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    mayor={product.priceMayor}
                    offer={product.inOffer}
                    discountPercentage={product.discountPercentage}
                    photo={product.photo}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <Table.Body className="divide-y">
              {products?.map((product) => (
                <Table.Row
                  key={product.id}
                  className="flex justify-between relative items-center "
                >
                  <Table.Cell>
                    <span className=" absolute font-bold left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      {capitalizeFirstLetter(product.name)}
                    </span>
                    <Image
                      src={
                        product &&
                        product.photo &&
                        product.photo[0] &&
                        product.photo[0].url
                          ? product.photo[0].url
                          : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                      }
                      alt="img"
                      width={80}
                      height={80}
                      style={{ width: "auto", height: "auto" }} // Mantén la proporción
                      // loading="lazy"
                      priority="false"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-extrabold">
                    {product.price} $
                  </Table.Cell>
                  <Table.Cell className="flex   justify-center  gap-2">
                    <button
                      onClick={() => handleDelete(product.id, product.photo)}
                      className="btn btn-danger bg-red-500 text-white py-1 px-2 rounded-md"
                    >
                      <MdDelete size={24} />
                    </button>

                    <Link
                      href={`/product/${product.id}/edit`}
                      className="bg-green-500 mr-2 text-white  flex items-center justify-center px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-green-600 p-2 pb-3 col-span-6 md:col-span-3"
                    >
                      <FaEdit size={24} />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </InfiniteScroll>
    </>
  );
}

export default Productos;
