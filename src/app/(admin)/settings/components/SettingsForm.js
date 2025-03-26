"use client";
import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import {
  createCategories,
  updateCategories,
  updateSettings,
} from "@/graphql/mutations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newSettings, getAllSettings } from "@/utils/graphqlFunctions";
import { toast } from "react-toastify";

import { Spinner } from "flowbite-react";
import Switch from "../../../components/SwitchOffer";
import Image from "next/image";
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

const SettingsForm = ({ editID, setEditID }) => {
  // const dispatch = useDispatch();
  Amplify.configure(amplifyconfig);
  const [storeName, setStoreName] = useState("");
  const [logoImagefile, setLogoImageFile] = useState(null);
  const [coverImagefile, setCoverImageFile] = useState(null);
  const [settingsId, setSettingsId] = useState("");

  const [file, setFile] = useState(null);
  const [editItem, setEditItem] = useState("");
  const inputFileRef = React.useRef(null);
  const inputLogoRef = React.useRef(null);
  const inputCoverRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [SettingsData, setSettingsData] = useState([]);

  const { data } = useQuery({
    queryKey: ["SettingsData"], // Usamos un arreglo para queryKey
    queryFn: getAllSettings, // Especificamos la función que obtiene los datos
  });

  React.useEffect(() => {
    if (data) {
      setSettingsData(data);
    }
  }, [data]);

  console.log("setting data", SettingsData);

  const client = generateClient();

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (data) {
      setStoreName(data[0]?.storeName);
      setSettingsId(data[0]?.id);

      // setshowInCarousel(editItem.showInCarousel);
      // if (editItem.bgColor) {
      //   setbgColor(editItem.bgColor);
      // } else {
      //   setbgColor("");
      // }
    }
  }, [data]);

  // Changes the Store name
  const {
    mutate,
    data: dataMutation,
    status: statusMutation,
  } = useMutation({
    mutationFn: newSettings, // Especificamos la función para la mutación
    onSuccess: () => {
      // router.push("/productos");
      queryClient.invalidateQueries(["AllCategories"]); // Utilizamos un arreglo para el queryKey
    },
  });

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     let photo = [];

  //     if (logoImagefile) {
  //       try {
  //         const formData = new FormData();
  //         formData.append("file", logoImagefile);

  //         const response = await fetch("/api/upload", {
  //           method: "POST",
  //           body: formData,
  //         });

  //         if (!response.ok) {
  //           const errorData = await response.json();
  //           throw new Error(errorData.err || "Upload failed");
  //         }
  //         const data = await response.json();
  //         console.log(data);
  //         photo.push({
  //           url: data.data.url,
  //           publicId: data.data.publicId,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //         toast.error("Error al subir la imagen");
  //         setIsLoading(false); // Añade esto para parar la carga
  //         return; // Esto detiene la ejecución aquí si hay un error
  //       }
  //     }

  //     // Mueve la lógica de `mutate` fuera del bloque `try-catch` interior
  //     mutate({
  //       storeName,
  //       logoImage: file ? photo : undefined,
  //       coverImage: file ? photo : undefined,
  //     });

  //     // Restablecer los campos y estado
  //     setFile(null);
  //     inputFileRef.current.value = "";

  //     setIsLoading(false);

  //     toast.success("Store Name creada con éxito");
  //   } catch (error) {
  //     toast.error("Error al crear Nombre ");
  //     setIsLoading(false);
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let logoPhoto = [];
      let coverPhoto = [];

      // Subir el logo
      if (logoImagefile) {
        try {
          const formData = new FormData();
          formData.append("file", logoImagefile);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.err || "Upload failed");
          }
          const data = await response.json();

          logoPhoto.push({
            url: data.data.url,
            publicId: data.data.publicId,
          });
        } catch (error) {
          console.log(error);
          toast.error("Error al subir la imagen del logo");
          setIsLoading(false); // Añade esto para parar la carga
          return; // Esto detiene la ejecución aquí si hay un error
        }
      }

      // Subir la portada
      if (coverImagefile) {
        try {
          const formData = new FormData();
          formData.append("file", coverImagefile);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.err || "Upload failed");
          }
          const data = await response.json();
          console.log(data);
          coverPhoto.push({
            url: data.data.url,
            publicId: data.data.publicId,
          });
        } catch (error) {
          console.log(error);
          toast.error("Error al subir la imagen de la portada");
          setIsLoading(false); // Añade esto para parar la carga
          return; // Esto detiene la ejecución aquí si hay un error
        }
      }

      // Mueve la lógica de `mutate` fuera del bloque `try-catch` interior

      mutate({
        storeName,
        logoImage: logoImagefile ? logoPhoto : undefined,
        coverImage: coverImagefile ? coverPhoto : undefined,
      });

      // Restablecer los campos y estado
      setFile(null);

      setIsLoading(false);

      toast.success("Store Name creada con éxito");
    } catch (error) {
      toast.error("Error al crear Nombre ");
      setIsLoading(false);
    }
  };

  const handleStoreNameChange = (e) => {
    setStoreName(e.target.value);
  };

  console.log(storeName);

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

    let logoPhoto = [];
    let coverPhoto = [];

    if (logoImagefile) {
      try {
        const formData = new FormData();
        formData.append("file", logoImagefile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        logoPhoto.push({
          url: data?.data?.url,
          publicId: data?.data?.publicId,
        });
      } catch (error) {
        alert("error al subir nueva imagen");
        console.log(error);
        return;
      }

      try {
        const result = await client.graphql({
          query: updateSettings,
          variables: {
            input: {
              id: settingsId,
              storeName,
              logoImage: logoImagefile ? logoPhoto : undefined,
            },
          },
        });
      } catch (error) {
        console.log(error);
        toast.warn("Error al actualizar categoria");
      }
    }

    if (coverImagefile) {
      try {
        const formData = new FormData();
        formData.append("file", coverImagefile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        coverPhoto.push({
          url: data?.data?.url,
          publicId: data?.data?.publicId,
        });
      } catch (error) {
        alert("error al subir nueva imagen");
        console.log(error);
        return;
      }

      try {
        const result = await client.graphql({
          query: updateSettings,
          variables: {
            input: {
              id: settingsId,
              storeName,
              logoImage: logoImagefile ? logoPhoto : undefined,
              coverImage: coverImagefile ? coverPhoto : undefined,
            },
          },
        });
      } catch (error) {
        console.log(error);
        toast.warn("Error al actualizar categoria");
      }
    }

    const result = await client.graphql({
      query: updateSettings,
      variables: {
        input: {
          id: settingsId,
          storeName,
        },
      },
    });

    if (logoImagefile) {
      const publicIds = SettingsData[0].logoImage.map(
        (image) => image.publicId
      );
      try {
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: publicIds,
          }),
        });

        toast.success("Nueva imagen subida");
      } catch (error) {
        alert("Error al eliminar imagen");
        return;
      }
    }

    if (coverImagefile) {
      const publicIds = SettingsData[0].coverImage.map(
        (image) => image.publicId
      );
      try {
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: publicIds,
          }),
        });

        toast.success("Nueva imagen subida");
      } catch (error) {
        alert("Error al eliminar imagen");
        return;
      }
    }

    setIsLoading(false);
    toast.success("Settings actualizada");

    queryClient.invalidateQueries(["SettingsData"]);

    setFile(null);

    inputLogoRef.current.value = "";
    inputCoverRef.current.value = "";
  };

  return (
    <div className="">
      <div className="bg-white p-5 border rounded-lg shadow-lg ">
        <div className="m-5">
          <h1 className="text-xl text-center font-semibold">Configuracion</h1>
        </div>
        <form onSubmit={settingsId ? handleUpdate : submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="product_title"
              className="block   text-sm font-semibold mt-2"
            >
              Nombre de Tienda
            </label>
            <input
              type="text"
              placeholder="Escribir aqui"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              id="product_name"
              required
              value={storeName}
              onChange={handleStoreNameChange}
            />
          </div>

          {SettingsData && SettingsData[0] && SettingsData[0].logoImage && (
            <Image
              src={
                SettingsData[0].logoImage[0]?.url ||
                "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
              }
              width={150}
              height={150}
              alt="Imagen"
            />
          )}

          <div className="mb-4">
            <label
              htmlFor="product_title"
              className="block   text-sm font-semibold mt-2"
            >
              Logo
            </label>
            <input
              // required={!editItem}
              ref={inputLogoRef}
              className="bg-gray-100 rounded-md overflow-hidden text-ellipsis whitespace-nowrap px-2"
              multiple
              type="file"
              onChange={(e) => {
                setLogoImageFile(e.target.files[0]);
              }}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
          {SettingsData && SettingsData[0] && SettingsData[0].coverImage && (
            <Image
              src={
                (SettingsData &&
                  SettingsData[0] &&
                  SettingsData[0].coverImage &&
                  SettingsData[0].coverImage[0]?.url) ||
                "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
              }
              width={150}
              height={150}
              alt="Imagen"
            />
          )}

          <div className="mb-4">
            <label
              htmlFor="product_title"
              className="block   text-sm font-semibold mt-2"
            >
              Portada
            </label>
            <input
              // required={!editItem}
              ref={inputCoverRef}
              className="bg-gray-100 rounded-md overflow-hidden text-ellipsis whitespace-nowrap px-2"
              multiple
              type="file"
              onChange={(e) => {
                setCoverImageFile(e.target.files[0]);
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
              ) : settingsId ? (
                "Actualizar Configuracion"
              ) : (
                "Crear Configuracion"
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

export default SettingsForm;
