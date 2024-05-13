"use client"
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import BrandCreateModal from "./CreateModal";
import Loading from "../loading/loading";
import BrandEditModal from "./EditModal";
import BrandDeleteModal from "./DeleteModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import fetchApi from "@/commons/api";


export default function BrandListPage(){
    const [brands, setBrands] = useState<any []>([]);
    const [brand, setBrand] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setIsLoading(true);
        const data = await fetchApi.brands();
        setBrands(data.data);
        setIsLoading(false);
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
                                }}><EditOutlined /></Button>
                                <Button variant='danger' onClick={() => {
                                    setBrand(item)
                                    setShowModalDelete(true)
                                }}><DeleteOutlined /></Button>
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
            <BrandDeleteModal
                showModalDelete={showModalDelete}
                setShowModalDelete={setShowModalDelete}
                brandItem={brand}
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