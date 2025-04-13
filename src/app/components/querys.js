import { updateProduct } from "@/graphql/mutations";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { Router } from "next/router";
import { toast } from "react-toastify";

Amplify.configure(amplifyconfig);
const client = generateClient();

export const handleSubmit = async (file) => {
  let photo = [];
  try {
    if (file && file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        const formData = new FormData();
        formData.append("file", file[i]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al subir archivo:", errorData.err);
          // Lanzar una excepción en caso de error
          throw new Error(errorData.err || "Upload failed");
        }

        const data = await response.json();

        photo.push({
          url: data.data.url,
          publicId: data.data.publicId,
        });
      }
    }
    return photo;
  } catch (error) {
    console.error("Error en handleSubmit:", error);
    // Lanzar el error para que sea capturado por el código que llama a handleSubmit
    throw error;
  }
};

export const handleUpdate = async (
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
  file,
  imageUrl,
  queryClient,
  inputFileRef,
  // setIsLoading,
  setFile
) => {
  // setIsLoading(true);
  // let photo = imageUrl;
  let photo = Array.isArray(imageUrl) ? [...imageUrl] : [];
  console.log("photo desde client", photo);
  console.log("Image desde client", imageUrl);

  if (file) {
    if (file && file.length > 0) {
      console.log("ENTRAMOS CON FOTO PAPA ");

      try {
        for (let i = 0; i < file.length; i++) {
          const formData = new FormData();
          formData.append("file", file[i]);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          console.log("this is new photo", data);

          photo.push({
            url: data.data.url,
            publicId: data.data.publicId, // OJO: aquí usas 'public_id' en el comentario pero en el backend devuelves 'publicId'
          });
        }

        console.log("entramos en el sgudno bloque");

        const result = await client.graphql({
          query: updateProduct,
          variables: {
            input: {
              id: productId,
              name,
              photo,
              bestSellers,

              // otros campos
            },
          },
        });

        queryClient.invalidateQueries(["GetProduct"]);
        setFile(null);
        inputFileRef.current.value = "";
      } catch (error) {
        console.log("ERROR EN EL SEGUNDO BLOQUE", error);
      }

      console.log("fotoooooooooooooo yeah", photo);
    } else {
      console.log("NO EXISTE FILE O ESTÁ VACÍO");
    }

    console.log("fotoooooooooooooo yeah", photo);
  }
  try {
    const result = await client.graphql({
      query: updateProduct,
      variables: {
        input: {
          id: productId,
          name,
          categories: category,
          price,
          priceMayor,
          description,
          countInStock,
          status,
          inOffer: toggle,
          discountPercentage,
          bestSellers,
        },
      },
    });
    // setIsLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteImage = async (
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
) => {
  try {
    const response = await fetch(`/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: [id] }),
    });
    // console.log(response);
  } catch (error) {
    console.error("Error de red al eliminar la imagen desde page", error);
  }

  const filtrando = imageUrl.filter((item) => item.publicId !== id);
  console.log("el id para filtrar = ", id);
  console.log("filtrando", filtrando);

  const filtrandoFormatted = filtrando.map((item) => ({
    url: item.url,
    publicId: item.publicId,
  }));
  try {
    const result = await client.graphql({
      query: updateProduct,
      variables: {
        input: {
          id: productId,
          name,
          categories: category,
          price,
          photo: filtrandoFormatted,
          inOffer: toggle,
          discountPercentage,
          bestSellers,
        },
      },
    });

    console.log(result);
    queryClient.invalidateQueries(["GetProduct"]);
  } catch (error) {
    console.log(error);
  }
};
