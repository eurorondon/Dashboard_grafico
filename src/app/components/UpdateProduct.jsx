"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  newProduct,
  productDetails,
} from "@/utils/graphqlFunctions";
import SwitchOffer from "./SwitchOffer";
import SwitchSellers from "./SwitchOffer";
import {
  handleDeleteImage,
  handleSubmit,
  handleUpdate,
} from "../components/querys";

import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "flowbite-react";

export const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string") {
    console.warn("[UpdateProduct] capitalizeFirstLetter recibió un valor no válido", str);
    return "";
  }
  if (str.length === 0) return str;
  const res = str.charAt(0).toUpperCase() + str.slice(1);
  console.log("[UpdateProduct] capitalizeFirstLetter result", res);
  return res;
};

export const toLowerCase = (str) => {
  return str.toLowerCase();
};

function UpdateProduct({ hasEdit, productId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [priceMayor, setPriceMayor] = useState(0);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(5);
  const [file, setFile] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [publicIdCloudinary, setPublicIdCloudinary] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [bestSellers, setBestSellers] = useState(false);
  const [description, setDescription] = useState("");
  const [descripcion, setDescripcion] = useState(false);
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoArray, setPhotoArray] = useState(null);
  const [Status, setStatus] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("[UpdateProduct] Props received", { hasEdit, productId });
  }, [hasEdit, productId]);

  const populateProductFields = React.useCallback(
    (productData) => {
      if (!productData) {
        console.warn("[UpdateProduct] populateProductFields sin datos", productData);
        return;
      }

      console.log("[UpdateProduct] Populating form with product data", {
        productId,
        hasEdit,
        productName: productData?.name,
      });

      const normalizedName = capitalizeFirstLetter(productData?.name ?? "");
      setName(normalizedName);

      const firstCategory =
        Array.isArray(productData?.categories) && productData.categories.length > 0
          ? productData.categories[0]
          : "";
      setCategory(firstCategory);

      const parsedPrice =
        typeof productData?.price === "number"
          ? productData.price
          : Number(productData?.price ?? 0);
      setPrice(Number.isFinite(parsedPrice) ? parsedPrice : 0);

      const parsedPriceMayor =
        typeof productData?.priceMayor === "number"
          ? productData.priceMayor
          : Number(productData?.priceMayor ?? 0);
      setPriceMayor(Number.isFinite(parsedPriceMayor) ? parsedPriceMayor : 0);

      setDescription(productData?.description ?? "");

      const photosInicio = Array.isArray(productData?.photo)
        ? productData.photo
            .filter((item) => item && item.url)
            .map((item) => ({
              url: item.url,
              publicId: item.publicId,
            }))
        : [];

      setImageUrl(photosInicio);
      setPublicIdCloudinary(productData?.photo?.[0]?.publicId || "");

      const parsedCountInStock =
        typeof productData?.countInStock === "number"
          ? productData.countInStock
          : Number(productData?.countInStock ?? 0);
      setCountInStock(Number.isFinite(parsedCountInStock) ? parsedCountInStock : 0);

      setToggle(!!productData?.inOffer);
      setDiscountPercentage(productData?.discountPercentage ?? 0);
      setBestSellers(!!productData?.bestSellers);
      setStatus(productData?.status ?? null);
      setDescripcion(!!productData?.description);
    },
    [hasEdit, productId]
  );

  // get product
  const { data, status, error: productError } = useQuery({
    queryKey: ["GetProduct", productId],
    queryFn: () => productDetails(productId),
    enabled: Boolean(hasEdit && productId),
    onSuccess: (productData) => {
      console.log("[UpdateProduct] Query success", { productId, hasEdit });
      populateProductFields(productData);
    },
    onError: (fetchError) => {
      console.error("[UpdateProduct] Query error", { productId, error: fetchError });
    },
  });

  useEffect(() => {
    if (data) {
      console.log("[UpdateProduct] Query data changed", { productId, hasEdit });
      populateProductFields(data);
    }
  }, [data, hasEdit, populateProductFields, productId]);

  useEffect(() => {
    console.log("[UpdateProduct] Query status updated", { status, productError });
  }, [status, productError]);

  // New Product React Query
  const {
    mutate,
    data: dataMutation,
    status: statusMutation,
    isPending: isPendingCreate,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: newProduct,
    onSuccess: () => {
      setIsLoading(false);
      setName("");
      setPrice(0.0);
      setPriceMayor(0.0);
      setCategory("");
      setCountInStock(5);
      setToggle(false);
      setDescripcion(false);
      setBestSellers(false);
      toast.success("Producto publicado con éxito");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    },
    onError: (error) => {
      setIsLoading(false);
      // puedes agregar un toast aquí si quieres notificar del error
    },
  });

  // UPDATE PRODUCT REACT QUERY

  const {
    mutate: updateProduct, // así renombras la función `mutate` para más claridad
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    isSuccess: isSuccesUpdate,
    error: errorUpdate,
    data: dataUpdate,
  } = useMutation({
    mutationFn: async () => {
      const lowerCaseName = toLowerCase(name);
      await handleUpdate(
        productId,
        lowerCaseName,
        category,
        price,
        priceMayor,
        status,
        countInStock,
        description,
        toggle,
        discountPercentage,
        bestSellers,
        file,
        imageUrl,
        queryClient,
        inputFileRef,
        setIsLoading,
        setFile
      );
    },
    onSuccess: () => {
      toast.success("Producto Actualizado");
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Error al actualizar producto");
    },
  });

  React.useEffect(() => {
    if (isSuccess === "false") {
      // toast.error(errorMutate.errors[0].message);
      alert(error?.errors[0].message);
    }
  }, [isError, error, isSuccess]);

  // Get ALl Categories
  const { data: dataCategories } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: getAllCategories,
  });

  //En esta funcion conviven dos funciones , handlesubmit que sube la imagen a cloudinary, y esta
  // mutate , que es la funcion que sube los datos a la tabla dynamo
  const handleClickForm = async () => {
    setIsLoading(true);
    if (!name) {
      toast.error("Inserte un titulo para el producto");
      setIsLoading(false);
      return;
    }
    if (!price) {
      toast.error("Inserte un precio para el producto");
      setIsLoading(false);
      return;
    }

    if (!file) {
      toast.error("Inserte una Imagen para el producto");
      setIsLoading(false);
      return;
    }
    const lowerCase = toLowerCase(name);
    console.log(lowerCase);

    try {
      const result = await handleSubmit(file);
      console.log(result);
      const photo = result;

      mutate(
        {
          name: lowerCase,
          price,
          priceMayor,
          countInStock,
          categories: [category],
          description,
          toggle,
          discountPercentage,
          bestSellers,
          photo,
        },

        {
          onError: (error) => {
            toast.error(error.errors[0].message);
            return;
          },
        }
      );
      if (photo && Array.isArray(photo) && photo.length > 0) {
        const publicIds = photo.map((item) => item.publicId);
        console.log(publicIds);
        const array = {
          publicId: publicIds,
        };
        setPhotoArray(array);
      }

      if (isError || error) {
        try {
          console.log(publicIds);

          alert.message("Buscando Eliminar imagen");
          const response = await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(array),
          });
          // console.log(response);
        } catch (error) {
          console.error("Error de red al eliminar la imagen desde page", error);
        }
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Error al subir producto";
      toast.error(errorMessage, {
        autoClose: false,
      });
      console.error("Error:", error);
    }
  };

  React.useEffect(() => {
    if (isError && photoArray) {
      (async () => {
        console.log("entrando en efect");
        if (photoArray) {
          await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(photoArray),
          });
          alert("Imagen eliminada");
          setPhotoArray(null);
        }
      })();
    }
    if (isError) {
      console.log(error);
    }
  }, [isError, photoArray, error]);

  // const handleClickUpdate = async () => {
  //   const lowerCaseName = toLowerCase(name);
  //   console.log("📂 Archivos seleccionados:", file);

  //   try {
  //     await handleUpdate(
  //       productId,
  //       lowerCaseName,
  //       category,
  //       price,
  //       priceMayor,
  //       status,
  //       countInStock,
  //       description,
  //       toggle,
  //       discountPercentage,
  //       bestSellers,
  //       file,
  //       imageUrl,
  //       queryClient,
  //       inputFileRef,
  //       setIsLoading,
  //       setFile
  //     );

  //     toast.success("Producto Actualizado");
  //   } catch (error) {
  //     setIsLoading(false);
  //     toast.error("Error al actualizar producto");
  //   }

  //   // router.push("/productos");
  // };
  const handleClickUpdate = async () => {
    console.log("[UpdateProduct] Triggering update", {
      productId,
      name,
      category,
      price,
      priceMayor,
      status,
      countInStock,
      description,
      toggle,
      discountPercentage,
      bestSellers,
      imageUrlLength: Array.isArray(imageUrl) ? imageUrl.length : 0,
    });
    // setIsLoading(true);
    updateProduct();
  };
  const handleClickDeleteImage = async (id) => {
    const userConfirmed = window.confirm("¿Seguro de Eliminar esta Imagen?");
    if (userConfirmed) {
      try {
        await handleDeleteImage(
          id,
          imageUrl,
          productId,
          name,
          category,
          price,
          toggle,
          discountPercentage,
          bestSellers,
          queryClient
        );
        toast.warning("Producto Eliminado");
      } catch (error) {
        console.log(error);
        toast.error("Error al eliminar producto");
      }
    }
  };

  // React.useEffect(() => {
  //   if (isSuccess) {
  //     setIsLoading(false);
  //   }
  //   if (isError) {
  //     setIsLoading(false);
  //   }
  // }, [isSuccess, isError]);

  if (hasEdit && status === "pending") {
    return (
      <div
        className="bg-white p-5 border shadow-lg flex items-center justify-center"
        style={{ minHeight: "90vh" }}
      >
        <Spinner aria-label="Cargando producto" size="xl" />
      </div>
    );
  }

  if (hasEdit && status === "error") {
    return (
      <div
        className="bg-white p-5 border shadow-lg flex items-center justify-center"
        style={{ minHeight: "90vh" }}
      >
        <p className="text-red-600 font-semibold text-center">
          No se pudo cargar la información del producto. Intenta nuevamente.
        </p>
      </div>
    );
  }

  if (hasEdit && status === "success" && !data) {
    return (
      <div
        className="bg-white p-5 border shadow-lg flex items-center justify-center"
        style={{ minHeight: "90vh" }}
      >
        <p className="text-gray-600 font-semibold text-center">
          No encontramos información para este producto.
        </p>
      </div>
    );
  }

  return (
    <div className="   ">
      <div
        className="bg-white  p-5  border  shadow-lg "
        style={{ minHeight: "90vh" }}
      >
        <div className="card  ">
          <div className="card-body">
            <div className="">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2"
              >
                Titulo de Producto
              </label>
              <input
                type="text"
                placeholder="Escribir aqui"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                id="product_title"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {name === data?.name && "🔴"}
            <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2 "
              >
                Categoria
              </label>
              <div className="  ">
                <select
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {category ? (
                    <option value={category}>{category}</option>
                  ) : (
                    <option value="">Seleccione una categoría</option>
                  )}
                  {dataCategories?.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold mt-2"
              >
                Precio
              </label>
              <input
                type="number"
                placeholder="Type here"
                className="border border-gray-300 p-2 rounded-md focus:outline-none  focus:ring-1 focus:border-blue-500"
                id="product_price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold mt-2"
              >
                Precio al mayor
              </label>
              <input
                type="number"
                placeholder="Type here"
                className="border border-gray-300 p-2 rounded-md focus:outline-none  focus:ring-1 focus:border-blue-500"
                id="product_price_mayor"
                required
                value={priceMayor}
                onChange={(e) => setPriceMayor(e.target.value)}
              />
            </div>
            <div className="mb-4 ">
              <div className="flex items-center  gap-3">
                <SwitchOffer toggle={toggle} setToggle={setToggle} />
                <label
                  htmlFor="product_price"
                  className="block   text-sm font-bold "
                >
                  En oferta
                </label>
              </div>
              {toggle && (
                <div className="flex gap-4 items-center">
                  <label htmlFor="discountInput" className="form-label">
                    % de oferta:
                  </label>
                  <input
                    id="discountInput"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="form-input border px-3 py-2 rounded-md w-24"
                    value={discountPercentage === 0 ? "" : discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex items-center  gap-3">
              <SwitchSellers toggle={bestSellers} setToggle={setBestSellers} />
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold "
              >
                Incluir en productos mas vendidos
              </label>
            </div>

            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold mt-2"
              >
                Cantidad en Stock
              </label>
              <input
                type="number"
                placeholder="Type here"
                className="border border-gray-300 p-2 rounded-md  focus:outline-none focus:ring-1 focus:border-blue-500"
                id="product_price"
                // required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            <div className="flex items-center  mt-3 mb-3 gap-3">
              <SwitchSellers toggle={descripcion} setToggle={setDescripcion} />
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold "
              >
                Agregar Descripcion
              </label>
            </div>
            {descripcion && (
              <div className="mb-4 ">
                <label className="block   text-sm font-bold mt-2">
                  Descripcion
                </label>
                <textarea
                  placeholder="Escribir aqui"
                  className="border border-gray-500 p-2 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                  rows="2"
                  // required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            )}

            <div className="flex">
              {imageUrl &&
                imageUrl.map((item) => (
                  <div
                    className="relative"
                    key={item?.publicId}
                    onClick={() => console.log(item?.publicId)}
                  >
                    <div className="bg-red-600 absolute right-2  font-extrabold text-white z-10 rounded-full w-5 h-5 flex justify-center items-center">
                      <button
                        className=" "
                        onClick={() => handleClickDeleteImage(item?.publicId)}
                      >
                        X
                      </button>
                    </div>

                    <Image
                      src={item.url}
                      width={150}
                      height={150}
                      alt="Imagen"
                    />
                  </div>
                ))}
            </div>

            <div className="mb-4">
              <input
                ref={inputFileRef}
                className="bg-gray-100 rounded-md overflow-hidden text-ellipsis whitespace-nowrap px-2"
                multiple
                type="file"
                onChange={(e) => {
                  setFile(e.target.files);
                }}
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>

            <button
              disabled={isPendingCreate || isPendingUpdate}
              className="bg-slate-950 text-white px-5 py-2 rounded-md flex justify-center items-center"
              onClick={hasEdit ? handleClickUpdate : handleClickForm}
              style={{ minWidth: 100 }}
            >
              {isPendingCreate || isPendingUpdate ? (
                <Spinner />
              ) : hasEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
      {/* {isError && alert(errorMutate.message)} */}
    </div>
  );
}

export default UpdateProduct;
