"use client"
import Constants from "@/commons/environment";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import BrandCreateModal from "./CreateModal";
import Loading from "../loading/loading";
import BrandEditModal from "./EditModal";


export default function BrandListPage(){
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [brand, setBrand] = useState<IBrand | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(Constants.URL_V1+"/brand");
            const data = await response.json();
            setBrands(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    const handleDeleteBrand = async (brand_id: number) => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+`/brand/${brand_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
            fetchData();
        }else{
            toast.error(data.message);
            fetchData();
        }
    };

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Brands</h3>
                <Button variant='primary' onClick={() => setShowModalCreate(true)}>Add new</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(item => (
                        <tr key={item.brand_id}>
                            <td>{item.brand_id}</td>
                            <td>{item.brand_name}</td>
                            <td>
                                <Button variant='warning' className='mr-3' onClick={() => {
                                    setBrand(item)
                                    setShowModalEdit(true)
                                }}>Edit</Button>
                                <Button variant='danger' onClick={() => handleDeleteBrand(item.brand_id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {isLoading && <Loading />}
            <BrandCreateModal
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                updateBrandList={fetchData}
            />
            <BrandEditModal
                showModalEdit={showModalEdit}
                setShowModalEdit={setShowModalEdit}
                brandItem={brand}
                updateBrandList={fetchData}
            />
        </>
    )
}