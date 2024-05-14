import Constants from "./environment";

const fetchApi = {
    brands: async (page: number = 1, name: string = "") => {
        try{
            const response = await fetch(Constants.URL_V1+`/brand/page?page=${page}&brand_name=${name}`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    categories: async (page: number = 1, name: string = "") => {
        try{
            const response = await fetch(Constants.URL_V1+`/category/page?page=${page}&category_name=${name}`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    products: async (status: any = null, product_id: any = null, page: number = 1, name: string = '', category_id: string = '', brand_id: string = '') => {
        try {
            let url = Constants.URL_V1+`/product/page?page=${page}&product_name=${name}&category_id=${category_id}&brand_id=${brand_id}`;
            if(status !== null){
                url += `&status=${status}`
            }
            if(product_id !== null){
                url += `&product_id=${product_id}`
            }
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },
    allCategories: async () => {
        try{
            const response = await fetch(Constants.URL_V1+`/category`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    allBrands: async () => {
        try{
            const response = await fetch(Constants.URL_V1+`/brand`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    }
}

export default fetchApi;