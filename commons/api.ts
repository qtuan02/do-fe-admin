import Constants from "./environment";

const fetchApi = {
    brands: async (page: string = "", limit: string = "", brand_name: string = "") => {
        try{
            const response = await fetch(Constants.URL_V1+`/brand?page=${page}&limit=${limit}&brand_name=${brand_name}`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    categories: async (page: string = "", limit: string = "", category_name: string = "") => {
        try{
            const response = await fetch(Constants.URL_V1+`/category?page=${page}&limit=${limit}&category_name=${category_name}`);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return [];
        }
    },
    products: async (page: string = "", limit: string = "", category_id: string = "", brand_id: string = "", product_name: string = "", status: string = "") => {
        try {
            const url = Constants.URL_V1+`/product?page=${page}&limit=${limit}&category_id=${category_id}&brand_id=${brand_id}&product_name=${product_name}&status=${status}`;
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },
    users: async (token: string, page: string = "", limit: string = "", phone: string = "", status: string = "", role: string = "") => {
        try {
            const url = Constants.URL_V1+`/user?page=${page}&limit=${limit}&phone=${phone}&status=${status}&role=${role}`;
            const response = await fetch( url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}
            );
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },
    orders: async (token: string, page: string = "", limit: string = "", status: string = "", search: string = "") => {
        try {
            const url = Constants.URL_V1+`/order?page=${page}&limit=${limit}&status=${status}&search=${search}`;
            const response = await fetch( url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}
            );
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },
    createBrand: async (token: string, brand_name: string) => {
        const response = await fetch(Constants.URL_V1+'/brand', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ brand_name: brand_name })
        });
        return response.json();
    },
    deleteBrand: async (token: string, brand_id: number) => {
        const response = await fetch(Constants.URL_V1+`/brand/${brand_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },
    updateBrand: async (token: string, brand_id: number, brand_name: string) => {
        const response = await fetch(Constants.URL_V1+`/brand/${brand_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ brand_name: brand_name })
        });
        return response.json();
    },
    createCategory: async (token: string, category_name: string) => {
        const response = await fetch(Constants.URL_V1+'/category', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category_name: category_name })
        });
        return response.json();
    },
    deleteCategory: async (token: string, category_id: number) => {
        const response = await fetch(Constants.URL_V1+`/category/${category_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.json();
    },
    updateCategory: async (token: string, category_id: number, category_name: string) => {
        const response = await fetch(Constants.URL_V1+`/category/${category_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category_name: category_name })
        });
        return response.json();
    },
    upload: async (file: any) => {
        try{
            const formData = new FormData();
            formData.append("image", file);
            const response = await fetch(Constants.URL_V1+"/upload", {
                method: "POST",
                body: formData
            });
            return response.json();
        }catch(error){
            console.log(error);
        }
    },
    createProduct: async (token: string, formData: any) => {
        const response = await fetch(Constants.URL_V1+'/product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        return response.json();
    },
    updateStatusProduct: async (token: string, product_id: number, status: string) => {
        const response = await fetch(Constants.URL_V1+`/product/${product_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        });
        return response.json();
    },
    findOneProduct: async (product_id: number) => {
        try{
            const url = Constants.URL_V1+`/product/${product_id}`;
            const response = await fetch(url);
            return response.json();
        }catch(error){
            console.error('Error fetching data:', error);
            return {};
        }
    },
    deleteImageDescription: async (token: string, image_id:number) => {
        const response = await fetch(Constants.URL_V1+`/product/image/${image_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.json();
    },
    addImageDescription: async (token: string, url: string, product_id: number) => {
        const response = await fetch(Constants.URL_V1+`/product/image`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url: url, product_id: product_id })
        });
        return response.json();
    },
    updateProduct: async (token: string, product_id: number, formData: any) => {
        const response = await fetch(Constants.URL_V1+`/product/${product_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },
    createUser: async (token: string, formData: any) => {
        const response = await fetch(Constants.URL_V1+'/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },
    updateUser: async (token: string, user_id: number, formData: any) => {
        const response = await fetch(Constants.URL_V1+`/user/${user_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },
    profile: async (token: string) => {
        const response = await fetch(Constants.URL_V2+'/user/profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },
    changeProfile: async (token: string, formData: any) => {
        const response = await fetch(Constants.URL_V2+'/user/changeProfile', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },
    changePassword: async (token: string, formData: any) => {
        const response = await fetch(Constants.URL_V2+'/user/changePassword', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },
    orderDetail: async (token: string, order_id: number) => {
        try {
            const url = Constants.URL_V1+`/order/${order_id}`;
            const response = await fetch( url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}
            );
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },
    changeStatusOrder: async (token: string, order_id: number, status: string) => {
        const response = await fetch(Constants.URL_V1+`/order/${order_id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: `${status}` })
        });
        return response.json();
    }
}

export default fetchApi;