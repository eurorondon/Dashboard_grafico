import { Sidebar } from "flowbite-react";
import Link from "next/link";
import React from "react";
import { HiChartPie, HiShoppingBag, HiUser, HiInbox } from "react-icons/hi";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

function SideBarComponent({ toggleMenu }) {
  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="w-full"
    >
      <div className="lg:hidden flex justify-end">
        <button
          className="border bg-white border-l-2 rounded-md p-1"
          onClick={toggleMenu}
        >
          <MdOutlineMenu size={30} />
        </button>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            href="/"
            icon={HiChartPie}
            onClick={toggleMenu}
          >
            Inicio
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/productos"
            icon={HiShoppingBag}
            onClick={toggleMenu}
          >
            Productos
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/borradores"
            icon={HiShoppingBag}
            onClick={toggleMenu}
          >
            Borradores
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/ordenes"
            icon={HiShoppingBag}
            onClick={toggleMenu}
          >
            Ordenes
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/add-product"
            icon={HiUser}
            onClick={toggleMenu}
          >
            Nuevo Producto
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/categorias"
            icon={HiShoppingBag}
            onClick={toggleMenu}
          >
            Categorias
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/categories"
            icon={HiInbox}
            onClick={toggleMenu}
          >
            Nueva Categoria
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            href="/settings"
            icon={IoMdSettings}
            onClick={toggleMenu}
          >
            Configuracion
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SideBarComponent;
