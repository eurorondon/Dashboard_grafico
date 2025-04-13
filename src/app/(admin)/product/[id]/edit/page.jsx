"use client";
import UpdateProduct from "@/app/components/UpdateProduct";
import React from "react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

function Edit({ params }) {
  const { id } = useParams();
  const path = usePathname();
  const hasEdit = path.includes("edit");

  //   console.log(props);
  return <UpdateProduct hasEdit={hasEdit} productId={id} />;
}

export default Edit;
