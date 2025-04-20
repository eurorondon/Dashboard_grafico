"use client";
import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { createCategories, updateCategories } from "@/graphql/mutations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategoria,
  getAllCategories,
  newCategory,
} from "@/utils/graphqlFunctions";
import { toast } from "react-toastify";

import { Spinner } from "flowbite-react";
import Switch from "../SwitchOffer";
// import { createCategory } from "../../Redux/Actions/CategoryActions";
// import { useDispatch, useSelector } from "react-redux";
// import { CATEGORY_CREATE_RESET } from "../../Redux/Constants/CategoryConstants";
// import { toast } from "react-toastify";
// import Loading from "../LoadingError/Loading";
// import { listCategory } from "../../Redux/Actions/CategoryActions";

// const ToastObjects = {
//   pauseOnFocusLoss: false,
//   draggable: false,
//   pauseOnHover: false,
//   autoClose: 2000,
// };

const CreateCategory = ({ editID, setEditID }) => {
  // const dispatch = useDispatch();
  Amplify.configure(amplifyconfig);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editItem, setEditItem] = useState("");
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInCarousel, setshowInCarousel] = useState(false);
  const [bgColor, setbgColor] = useState("#ffffff");
  const { data } = useQuery({
    queryKey: ["AllCategories"], // queryKey debe ser un arreglo
    queryFn: getAllCategories, // Especificamos la función de consulta en queryFn
  });

  React.useEffect(() => {
    if (data) {
      const resFilter = data?.filter((item) => item.id === editID);

      setEditItem(resFilter[0]);
    }
  }, [editID, data]);

  const client = generateClient();

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (editItem) {
      setCategoryName(editItem.categoryName);
      setDescription(editItem.description);
      setshowInCarousel(editItem.showInCarousel);
      if (editItem.bgColor) {
        setbgColor(editItem.bgColor);
      } else {
        setbgColor("");
      }
    }
  }, [editItem]);

  // New category React Query
  const {
    mutate,
    data: dataMutation,
    status: statusMutation,
  } = useMutation({
    mutationFn: newCategory, // Especificamos la función de mutación en mutationFn
    onSuccess: () => {
      // router.push("/productos");
      queryClient.invalidateQueries(["AllCategories"]);
    },
  });

  // const { data, status, error } = useQuery(
  //   [`GetCategory-${editID}`],
  //   () => getCategoria(editID),
  //   {
  //     enabled: !!editID,
  //     onSuccess: (data) => {
  //       console.log(data);
  //       setCategoryName(data.categoryName);
  //       setDescription(data.description);
  //       // setEditID("");
  //     },
  //   }
  // );

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     let photo = [];

  //     if (file) {
  //       try {
  //         const formData = new FormData();
  //         formData.append("file", file);

  //         const response = await fetch("/api/upload", {
  //           method: "POST",
  //           body: formData,
  //         });

  //         if (!response.ok) {
  //           const errorData = await response.json();
  //           throw new Error(errorData.err || "Upload failed");
  //         }
  //         const data = await response.json();
  //         photo.push({
  //           url: data?.data?.url,
  //           publicId: data?.data?.public_id,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //         toast.error("Error");
  //         return;
  //       }

  //       if (data) {
  //         mutate({
  //           categoryName,
  //           photo,
  //           description,
  //         });
  //       } else {
  //         console.log("no existe data");
  //       }
  //     } else {
  //       mutate({
  //         categoryName,
  //         description,
  //       });
  //     }

  //     setFile(null);
  //     inputFileRef.current.value = "";

  //     setDescription(""), setCategoryName("");
  //     setIsLoading(false);
  //     toast.success("categoria creada");
  //   } catch (error) {
  //     toast.error("Error al crear categoria");
  //     setIsLoading(false);
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let photo = [];

      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.err || "Upload failed");
          }
          const data = await response.json();
          photo.push({
            url: data.data.url,
            publicId: data.data.publicId,
          });
        } catch (error) {
          console.log(error);
          toast.error("Error al subir la imagen");
          setIsLoading(false); // Añade esto para parar la carga
          return; // Esto detiene la ejecución aquí si hay un error
        }
      }

      // Mueve la lógica de `mutate` fuera del bloque `try-catch` interior
      mutate({
        categoryName,
        photo: file ? photo : undefined,
        showInCarousel,
        bgColor,
      });

      // Restablecer los campos y estado
      setFile(null);
      inputFileRef.current.value = "";
      setDescription("");
      setCategoryName("");
      setIsLoading(false);
      // setbgColor("");
      toast.success("Categoría creada con éxito");
    } catch (error) {
      toast.error("Error al crear categoría");
      setIsLoading(false);
    }
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setDescription(e.target.value);
  };

  // const categoryCreate = useSelector((state) => state.categoryCreate);
  const categoryCreate = "hola";

  // useEffect(() => {
  //   if (categoryCreate.success) {
  //     toast.success("Category Added", ToastObjects);
  //     dispatch({ type: CATEGORY_CREATE_RESET }, listCategory());
  //     setCategoryName("");
  //     setDescripcion("");
  //     dispatch(listCategory());
  //   }
  // }, [categoryCreate.success, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let photo = [];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        photo.push({
          url: data?.data?.url,
          publicId: data?.data?.publicId,
        });
      } catch (error) {
        alert("error al subir nueva imagen");
        return;
      }

      try {
        const result = await client.graphql({
          query: updateCategories,
          variables: {
            input: {
              id: editItem.id,
              categoryName,
              photo,
              showInCarousel,
              bgColor,
            },
          },
        });
      } catch (error) {
        console.log(error);
        toast.warn("Error al actualizar categoria");
      }
    }

    const result = await client.graphql({
      query: updateCategories,
      variables: {
        input: {
          id: editID,
          categoryName,
          showInCarousel,
          bgColor,
        },
      },
    });
    try {
      const response = await fetch(`/api/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: [editItem.photo[0].publicId] }),
      });

      toast.success("Nueva imagen subida");
    } catch (error) {
      alert("Error al eliminar imagen");
      return;
    }

    setIsLoading(false);
    toast.success("Categoria actualizada");

    queryClient.invalidateQueries(["AllCategories"]);
    setCategoryName("");
    setDescription(" ");
    setEditID("");
    setFile(null);
    setbgColor("");
    inputFileRef.current.value = "";
  };

  return (
    <div className="">
      <div className="bg-white p-5 border rounded-lg shadow-lg ">
        <div className="m-5">
          <h1 className="text-xl text-center font-semibold">Nueva Categoria</h1>
        </div>
        <form onSubmit={editID ? handleUpdate : submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="product_title"
              className="block   text-sm font-semibold mt-2"
            >
              Nombre de Categoria
            </label>
            <input
              type="text"
              placeholder="Escribir aqui"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              id="product_name"
              required
              value={categoryName}
              onChange={handleCategoryNameChange}
            />
          </div>

          <div>
            <div className="mb-3">
              <label
                htmlFor="product_title"
                className="block   text-sm font-semibold mt-2"
              >
                Mostrar Carrucel en Home
              </label>
              <Switch toggle={showInCarousel} setToggle={setshowInCarousel} />
            </div>
            {/* <label className="block   text-sm font-bold mt-2">
              Descripcion
            </label> */}
            {/* <textarea
              placeholder="Escribir aqui"
              className="border border-gray-500 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              rows="2"
              // required
              value={description}
              onChange={handleDescripcionChange}
            /> */}
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block   text-sm font-semibold mt-2">
              Color de Fondo Carousel
            </label>
            <input
              type="text"
              placeholder=" #f2f2f2 Ejemplo"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              id=""
              required
              value={bgColor}
              onChange={(e) => setbgColor(e.target.value)}
              style={{ backgroundColor: bgColor }}
            />
          </div>

          <div className="mb-4">
            <input
              required={!editItem}
              ref={inputFileRef}
              className="bg-gray-100 rounded-md overflow-hidden text-ellipsis whitespace-nowrap px-2"
              multiple
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>

          <div className="mt-16">
            <button
              disabled={isLoading}
              className="bg-green-500 text-white px-5 py-2 rounded-md flex justify-center items-center"
              style={{ minWidth: 100 }}
            >
              {isLoading ? (
                <Spinner />
              ) : editItem ? (
                "Update category"
              ) : (
                "Create Category"
              )}
            </button>
            {editItem && (
              <div
                className="mt-3 text-primary"
                style={{ textAlign: "center" }}
              >
                <button
                  onClick={() => {
                    setEditID(null);
                  }}
                >
                  New Category
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
