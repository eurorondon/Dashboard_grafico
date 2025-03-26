"use client";

import React, { useEffect } from "react";
import CreateCategory from "./CreateCategory";
import CategoriesTable from "./CategoriesTable";

const MainCategories = () => {
  const [editID, setEditID] = React.useState("");
  console.log(editID);
  return (
    <section className="mt-8">
      {/* {loading ? (
        <h1 className="text-danger">Cargando</h1>
      ) :  */}

      <div
        className="lg:p-10 grid-cols-1 md:grid-cols-8 lg:grid-cols-8"
        style={{
          display: "grid",
          gap: "2rem",
        }}
      >
        <div className="  md:col-span-4 lg:col-span-4 xl:col-span-5 order-last md:order-first">
          <CategoriesTable setEditID={setEditID} />
        </div>
        <div className=" m-5 md:col-span-4 lg:col-span-4 xl:col-span-3 ">
          <CreateCategory editID={editID} setEditID={setEditID} />
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
