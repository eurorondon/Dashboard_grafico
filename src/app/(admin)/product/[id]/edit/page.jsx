import UpdateProduct from "@/app/components/UpdateProduct";

async function Edit({ params }) {
  const resolvedParams = await params;
  const idParam = resolvedParams?.id;
  const productId = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!productId) {
    return null;
  }

  return <UpdateProduct hasEdit productId={productId} />;
}

export default Edit;
