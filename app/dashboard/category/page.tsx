'use client'
import NavbarLayout from "@/components/dashboard/layout"
import useSWR from "swr";
import Constants from "@/commons/environment";
import CatagoriesList from "@/components/category/CategoryList";
import Loading from "@/components/loading/loading";

const Category = () => {

    const fetcher = async (url: string) => {
        const response = await fetch(url);
        return response.json();
    };

    const { data, error, isLoading } = useSWR(
        Constants.URL_V1 + '/category',
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
            <Loading />
        )
    return (
        <NavbarLayout>
            <CatagoriesList categories={data.data} />
        </NavbarLayout >
    )
}
export default Category
