import Constants from "./environment";

const fetchApi = {
    brands: async () => {
        try{
            const response = await fetch(Constants.URL_V1+"/brand");
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    categories: async () => {
        try{
            const response = await fetch(Constants.URL_V1+"/category");
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    products: async (status: any = null, product_id: any = null) => {
        try {
            let url = Constants.URL_V1+"/product";
            if(status !== null){
                url += `?status=${status}`
            }
            if(product_id !== null){
                url += `?product_id=${product_id}`
            }
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
}

export default fetchApi;