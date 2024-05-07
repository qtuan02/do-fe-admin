'use client'
import Layout from "@/components/dashboard/layout"
import CatagoriesList from "./components/catagoriesList"
import useSWR from "swr";

const Category = () => {

    const fetcher = async (url: string) => {
        const response = await fetch(url);
        return response.json();
    };

    const { data, error, isLoading } = useSWR(
        'http://localhost:8081/v1/category',
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await fetch('http://localhost:8081/v1/category')
    //         const data = await res.json()
    //         console.log('>>> check data: ', data);

    //     }
    //     fetchData()
    // }, [])

    if (isLoading)
        return (
            <Layout>
                <div>loading...</div>
            </Layout >
        )
    return (
        <Layout>
            <CatagoriesList categories={data.data} />
        </Layout >
    )
}
export default Category
