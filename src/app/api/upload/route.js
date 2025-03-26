import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request) {
  // const image = data.get("file");
  const data = await request.formData();
  const image = data.get("file");
  const fileBuffer = await image.arrayBuffer();

  var mime = image.type;
  var encoding = "base64";
  var base64Data = Buffer.from(fileBuffer).toString("base64");
  var fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

  // if (!image) {
  //   return NextResponse.json("no se ha encontrado ninguna imagen", {
  //     status: 400,
  //   });
  // }

  // const bytes = await image.arrayBuffer();
  // const buffer = Buffer.from(bytes);
  // const response = await new Promise((resolve, reject) => {
  //   cloudinary.uploader
  //     .upload_stream({ folder: "Next.js" }, (err, result) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(result);
  //     })
  //     .end(buffer);
  // });

  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        var result = cloudinary.uploader
          .upload(fileUri, {
            folder: "Grafico",
            invalidate: true,
            transformation: [{ fetch_format: "auto" }],
            // quality_analysis: true,

            // base64: true,
          })
          .then((result) => {
            // console.log(result);
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    const result = await uploadToCloudinary();

    let imageUrl = result.secure_url;

    // Modificar la URL para incluir f_auto,q_auto, esto para que clodinary optimice la imagen
    const parts = imageUrl.split("/upload/");
    if (parts.length === 2) {
      imageUrl = `${parts[0]}/upload/f_auto,q_auto:low/${parts[1]}`;
    }

    const res = {
      url: imageUrl,
      publicId: result.public_id,
    };

    return NextResponse.json({ success: true, data: res }, { status: 200 });
  } catch (error) {
    console.log("server err", error);
    return NextResponse.json(
      { err: error.message, info: "Internal Server Error " },
      { status: 500 }
    );
  }
}
