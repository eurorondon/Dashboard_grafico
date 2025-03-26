import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request) {
  const data = await request.json();

  console.log("el data es= ", JSON.stringify(data, null, 2));

  try {
    // Verificar si data.publicId es un arreglo antes de intentar iterar sobre él

    // Iterar sobre cada publicId y eliminar las imágenes correspondientes
    const responses = await Promise.all(
      data.publicId.map(async (publicId) => {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
      })
    );

    console.log("respuesta success backend", responses); // Las respuestas de Cloudinary para cada eliminación

    return NextResponse.json({
      message: "Imágenes eliminadas correctamente",
      data: responses,
    });
  } catch (error) {
    console.error("Error al eliminar las imágenes:", error);
    return NextResponse.json({
      error: "Error al eliminar las imágenes",
    });
  }
}
