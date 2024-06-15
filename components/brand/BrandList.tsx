"use client"
import Table from 'react-bootstrap/Table';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import fetchApi from '@/commons/api';
import Loading from '../loading/loading';
import BrandCreateModal from './CreateModal';
import BrandDeleteModal from './DeleteModal';
import BrandEditModal from './EditModal';
import usePusher from '@/hooks/usePusher';
import PaginationComponent from '../layout/PaginationComponent';
import { toast } from 'react-toastify';


export default function BrandListPage() {
    const [brands, setBrands] = useState<any []>([]);
    const [brand, setBrand] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<any>(1);
    const [limit, setLimit] = useState<any>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, limit]);
    
    const fetchData = async () => {
        try{
            const data = await fetchApi.brands(currentPage, limit, searchTerm);
            setBrands(data.data);
            setTotalPages(Math.ceil(data.message / limit));
        }catch(err){
            toast.error("Đã có lỗi xảy ra!");
        }finally{
            setIsLoading(false);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSubmit = () => {
        if (inputRef.current) {
            setCurrentPage(1);
            setSearchTerm(inputRef.current.value);
        }
    };

    const handleLimitChange = (e: any) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    usePusher('brand', 'brand-add', fetchData);
    usePusher('brand', 'brand-delete', fetchData);
    usePusher('brand', 'brand-update', fetchData);

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Brands</h3>
                <Button variant='primary' onClick={() => setShowModalCreate(true)}>Add new</Button>
            </div>

            <Form.Group className="mb-4 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Filter by name..."
                    className='mr-3'
                    style={{ width: '200px' }}
                    ref={inputRef}
                />
                <Button variant="primary" onClick={() => handleSubmit()}>Apply</Button>
            </Form.Group>
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
            <div className="flex justify-between items-center">
                <Form.Select style={{ width: '70px' }} value={limit} onChange={handleLimitChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </Form.Select>
                <div className="flex-grow" />
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
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