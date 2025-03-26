"use client";
import Image from "next/image";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";

const Product = (props) => {
  const { product, url, handleDelete, id, photo, name } = props;

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const nameCapital = capitalizeFirstLetter(name);

  // console.log(url);

  // function agregarTransformacion(url) {
  //   const uploadIndex = url.indexOf("/upload/");
  //   if (uploadIndex !== -1) {
  //     const transformedUrl =
  //       url.slice(0, uploadIndex + "/upload/".length) +
  //       "q_auto:low/" +
  //       url.slice(uploadIndex + "/upload/".length);
  //     return transformedUrl;
  //   } else {
  //     console.log("La URL no contiene '/upload/'");
  //     return url;
  //   }
  // }

  // const urlOriginal = url;
  // const urlTransformada = agregarTransformacion(urlOriginal);
  // console.log(urlTransformada);

  const MAX_DESCRIPTION_LENGTH = 100;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      {/* <div className=" flex flex-col justify-center items-center z-0"> */}
      <div
        className="  flex justify-center items-center relative  "
        style={{ padding: "5px" }}
      >
        {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-80 relative overflow-hidden"> */}
        <div style={{ width: "100%", height: "auto", position: "relative" }}>
          <Link href={`/product/${id}/edit`}>
            {url ? (
              <Image
                src={url}
                alt="Product"
                width={180} // Anchura específica de la imagen
                height={180} // Altura específica de la imagen
                layout="responsive" // Establecer diseño responsivo
                objectFit="scale-down" // Ajustar el contenido de la imagen al contenedor
                placeholder="blur"
                blurDataURL="/images/loadingImages.png"
                loading="lazy"
              />
            ) : (
              <Image
                src={
                  "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                }
                alt="Product"
                width={180} // Anchura específica de la imagen
                height={180} // Altura específica de la imagen
                layout="responsive" // Establecer diseño responsivo
                objectFit="scale-down" // Ajustar el contenido de la imagen al contenedor
                placeholder="blur"
                blurDataURL="/images/loadingImages.png"
              />
            )}
          </Link>
          <div className="p-2" style={{ backgroundColor: "" }}>
            <h5
              className="name"
              style={{ fontWeight: "bold", color: "#00789D" }}
            >
              {nameCapital}
            </h5>
            <div
              className=""
              // style={
              //   window.innerWidth > 767 ? { height: "50px" } : { height: "40px" }
              // }
            >
              {props.description ? (
                <p className="description">
                  {props.description.length > MAX_DESCRIPTION_LENGTH
                    ? props.description.substring(0, MAX_DESCRIPTION_LENGTH) +
                      "..."
                    : props.description}
                </p>
              ) : (
                <p className="description"> Sin Descripcion</p>
              )}
            </div>

            {props.offer ? (
              <div className="price d-flex gap-4 " style={{}}>
                <p style={{ color: "#3b83bd", fontWeight: "bold" }}>
                  {props.price - props.price * (props.discountPercentage / 100)}{" "}
                  USD{" "}
                </p>
                <p
                  style={{
                    textDecoration: "line-through",
                    fontSize: "16px",
                    color: "gray",
                  }}
                >
                  {" "}
                  {props.price} USD
                </p>
              </div>
            ) : (
              <p
                className="price"
                style={{ color: "#3b83bd", fontWeight: "bold" }}
              >
                {props.price} $
              </p>
            )}
            <div className="absolute top-2 right-3 flex justify-end ">
              <Link
                href={`/product/${id}/edit`}
                className="bg-green-500 mr-2 text-white  flex items-center justify-center px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-green-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <MdEdit className="size-4 " />
              </Link>
              <button
                onClick={() => handleDelete(id, photo)}
                className="bg-red-400 text-white  px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-red-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <MdDelete className="size-4 " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
