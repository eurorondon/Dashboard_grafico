import React from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, getAllCategories } from "@/utils/graphqlFunctions";
import Link from "next/link";
import Image from "next/image";
import { Table } from "flowbite-react";
import { toast } from "react-toastify";

Amplify.configure(amplifyconfig);

const CategoriesTable = ({ setEditID }) => {
  const { data } = useQuery({
    queryKey: ["AllCategories"], // Especificamos el queryKey como un arreglo
    queryFn: getAllCategories, // Especificamos la función de consulta en queryFn
  });

  const queryClient = useQueryClient();

  const { mutate, isSuccess } = useMutation({
    mutationFn: deleteCategory, // Especificamos la función de mutación en mutationFn
    onSuccess: () => {
      queryClient.invalidateQueries(["AllCategories"]); // Especificamos queryKey como un arreglo
      toast.warn("Categoria eliminada");
    },
  });

  const deletehandler = async (id) => {
    const filter = data.filter((item) => item.id === id);
    const categoriaFiltrada = filter[0];

    if (categoriaFiltrada && window.confirm("¿Eliminar Categoria?")) {
      if (categoriaFiltrada.photo) {
        try {
          const response = await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicId: [filter[0].photo[0].publicId] }),
          });

          mutate(id);
        } catch (error) {
          console.error("Error de red al eliminar la imagen desde page", error);
        }
      } else {
        mutate(id);
      }
    }
  };

  const edithandler = (id) => {
    setEditID(id);
    window.scroll(0, 0);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            {/* <Table.HeadCell>Description</Table.HeadCell> */}
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data?.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Image
                    src={
                      category &&
                      category.photo &&
                      category.photo[0] &&
                      category.photo[0].url
                        ? category.photo[0].url
                        : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                    }
                    alt="img"
                    width={120}
                    height={120}
                  />
                </Table.Cell>
                <Table.Cell>
                  <b>{category.categoryName}</b>
                </Table.Cell>
                {/* <Table.Cell>{category.description}</Table.Cell> */}
                <Table.Cell className="flex justify-end gap-2">
                  <button
                    onClick={() => deletehandler(category.id)}
                    className="btn btn-danger bg-red-500 text-white py-1 px-2 rounded-md"
                  >
                    <MdDelete size={24} />
                  </button>
                  <button
                    onClick={() => edithandler(category.id)}
                    className="btn btn-success bg-green-500 text-white py-1 px-2 rounded-md"
                  >
                    <FaEdit size={24} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default CategoriesTable;
