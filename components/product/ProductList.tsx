"use client"
import Constants from "@/commons/environment";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Form, Table } from "react-bootstrap";
import Loading from "../loading/loading";
import { EditOutlined, EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import fetchApi from "@/commons/api";
import { useRouter } from "next/navigation";

export default function ProductListPage(){
    const router = useRouter();
    const [products, setProducts] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async (status: any = null) => {
        setIsLoading(true);
        const data = await fetchApi.products(status);
        setProducts(data.data);
        setIsLoading(false);
    };

    const handleChangeStatus = async (product_id: any, status: any) => {
        const token = await Cookies.get("token");
        if(status === "true"){
            status = "false";
        }else{
            status = "true";
        }
        setIsLoading(true);
        const response = await fetch(Constants.URL_V1+`/product/${product_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        })
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
            fetchData();
        }else{
            toast.error(data.message);
        }
    }

    const isChecked = (status: any) => {
        if(status === "true"){
            return true;
        }
        return false;
    }

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Products</h3>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="danger" className="mr-1" onClick={() => fetchData("false")}><EyeInvisibleFilled /></Button>
                    <Button variant="warning" onClick={() => fetchData("true")}><EyeFilled /></Button>
                </ButtonGroup>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(item => (
                        <tr key={item.product_id}>
                            <td>{item.product_id}</td>
                            <td> <Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={item.image_1} /></td>
                            <td>{item.product_name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.category.category_name}</td>
                            <td>{item.brand.brand_name}</td>
                            <td><Form.Check 
                                type="switch"
                                checked={isChecked(item.status)}
                                onChange={() => handleChangeStatus(item.product_id, item.status)}/>
                            </td>
                            <td>
                                <Button variant='success' className='mr-3' onClick={() => router.push(`/dashboard/product/edit/${item.product_id}`)}><EditOutlined /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {isLoading && <Loading />}
        </>
    )
}