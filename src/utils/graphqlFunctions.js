import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "../aws-exports";
import { useParams } from "next/navigation";
import {
  listProducts,
  getProduct,
  listCategories,
  getCategories,
  ProductsByDate,
  listSettings,
  listOrders,
  getOrder,
} from "@/graphql/queries";
import {
  createCategories,
  createProduct,
  createSettings,
  deleteCategories,
  deleteProduct,
} from "@/graphql/mutations";

Amplify.configure(amplifyconfig);
const client = generateClient();

export async function newProduct({
  name,
  price,
  priceMayor,
  countInStock,
  description,
  categories,
  photo,
  inOffer,
  discountPercentage,
  bestSellers,
  status,
}) {
  // if (typeof price !== "number" || isNaN(price)) {
  //   console.error('Error: El valor de "price" no es un número válido.');
  //   throw new Error('Error: El valor de "price" no es un número válido.');
  // }
  const res = await client.graphql({
    query: createProduct,
    variables: {
      input: {
        name,
        price,
        priceMayor,
        countInStock,
        description,
        categories,
        photo,
        inOffer,
        discountPercentage,
        bestSellers,
        type: "Producto",
        status,
      },
    },
  });
  return res;
}

export async function getProducts() {
  const res = await client.graphql({
    query: listProducts,
    variables: {},
  });

  return res.data.listProducts.items;
}

export async function ListProductsByDate() {
  const res = await client.graphql({
    query: ProductsByDate,
    // variables: { type: "Producto", sortDirection: "DESC", limit: 10 },
  });
  return res.data.ProductsByDate.items;
}

export async function productDetails(id) {
  const res = await client.graphql({
    query: getProduct,
    variables: {
      id,
    },
  });
  return res.data.getProduct;
}

export async function deleteProductFunction(id) {
  try {
    const res = await client.graphql({
      query: deleteProduct,
      variables: { input: { id } },
    });

    if (res && res.data) {
      return res.data; // Esto es lo que React Query manejará
    } else {
      throw new Error("No data returned from deleteProduct mutation");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Re-lanzamos el error para que React Query lo maneje
  }
}

export async function newCategory({
  categoryName,
  description,
  photo,
  showInCarousel,
}) {
  // if (typeof price !== "number" || isNaN(price)) {
  //   console.error('Error: El valor de "price" no es un número válido.');
  //   throw new Error('Error: El valor de "price" no es un número válido.');
  // }
  const res = await client.graphql({
    query: createCategories,
    variables: {
      input: {
        categoryName,
        description,
        photo,
        showInCarousel,
      },
    },
  });
  return res;
}

export async function getAllCategories() {
  const res = await client.graphql({
    query: listCategories,
    variables: {},
  });

  return res.data.listCategories.items;
}

export async function deleteCategory(id) {
  const res = await client.graphql({
    query: deleteCategories,
    variables: { input: { id } },
  });
  return res;
}

export async function getCategoria(id) {
  const res = await client.graphql({
    query: getCategories,
    variables: { id },
  });

  return res.data.getCategories;
}

export async function newSettings({ storeName, logoImage, coverImage }) {
  console.log(storeName);
  try {
    const res = await client.graphql({
      query: createSettings,
      variables: {
        input: {
          storeName,
          logoImage,
          coverImage,
        },
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error creating settings:", error);
    throw error;
  }
}

export async function getAllSettings() {
  const res = await client.graphql({
    query: listSettings,
    variables: {},
  });

  return res.data.listSettings.items;
}

export async function getAllOrders() {
  const res = await client.graphql({
    query: listOrders,
    variables: {},
  });

  return res.data.listOrders.items;
}

export async function getOrderDetail(id) {
  const res = await client.graphql({
    query: getOrder,
    variables: { id },
  });

  return res.data.getOrder;
}
