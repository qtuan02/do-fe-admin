'use client'
import Layout from "@/components/dashboard/layout"
import CatagoriesList from "./catagoriesList"

const Category = () => {
    return (
        <Layout>
            <>
                <h2 className="font-bold mb-4">Categories</h2>
                <CatagoriesList />
            </>
        </Layout>
    )
}
export default Category
