import UpdateProduct from "@/app/components/UpdateProduct";

function Edit({ params }) {
  const idParam = params?.id;
  const productId = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!productId) {
    return null;
  }

  return <UpdateProduct hasEdit productId={productId} />;
}

export default Edit;
