import Layout from "@/components/dashboard/layout";
import EditProductForm from "@/components/product/EditProductForm";

export default function EditProduct({ params }: { params: { product_id: any } }) {
    return (
        <Layout>
            <EditProductForm product_id={params.product_id} />
        </Layout>
    )
}
