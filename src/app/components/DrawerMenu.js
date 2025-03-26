"use client";
import { Sidebar } from "flowbite-react";
import React, { useState } from "react";
import {
  HiArrowSmRight,
  HiInbox,
  HiOutlineChartPie,
  HiOutlineShoppingBag,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import SideBarComponent from "./SideBarComponent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllSettings } from "@/utils/graphqlFunctions";
import { useQuery } from "@tanstack/react-query";

function DrawerMenu() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { data } = useQuery({
    queryKey: ["Settings"],
    queryFn: getAllSettings,
  });

  const [searchInput, setSearchInput] = React.useState("");
  const router = useRouter();

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const toLowerCase = (str) => {
    return str.toLowerCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerCaseName = toLowerCase(searchInput);
    router.push(`/keyword?search=${lowerCaseName}`);
    setSearchInput("");
  };

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <div className="sticky top-0 z-10 lg:hidden ">
      {/* <FlowNavbar /> */}
      <div className=" bg-white flex flex-row items-center  px-3 md:px-5 py-3">
        <div className=" basis-2/12 md:basis-3/12">
          <button
            className="border bg-white border-l-2 rounded-md p-1 "
            onClick={toggleMenu}
          >
            <MdOutlineMenu size={30} />
          </button>
        </div>

        <div className=" basis-8/12 md:basis-6/12 ">
          <form className="input-group " onSubmit={(e) => handleSubmit(e)}>
            <input
              type="search"
              className="form-control rounded-left search w-11/12 "
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-button w-1/12 p-2">
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="basis-2/12 md:basis-3/12 flex justify-end ">
          <Image
            src={
              Array.isArray(data) &&
              data.length > 0 &&
              data[0]?.logoImage &&
              data[0].logoImage.length > 0
                ? data[0].logoImage[0].url
                : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
            }
            width={50}
            height={50}
            alt="Multitienda"
            className="rounded-full"
            priority
          />
        </div>

        <div
          className={` absolute
           top-0 left-0 ${
             mostrarMenu ? "translate-x-0" : "-translate-x-full"
           } transition-transform duration-300 z-10`}
        >
          <div className="h-screen z-50 ">
            <SideBarComponent toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerMenu;
