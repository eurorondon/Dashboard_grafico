"use client";
import UpdateProduct from "@/app/components/UpdateProduct";
import React from "react";
import { usePathname } from "next/navigation";

function Edit({ params }) {
  const id = params.id;
  const path = usePathname();
  const hasEdit = path.includes("edit");

  //   console.log(props);
  return <UpdateProduct hasEdit={hasEdit} productId={id} />;
}

export default Edit;

// import React from "react";

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
