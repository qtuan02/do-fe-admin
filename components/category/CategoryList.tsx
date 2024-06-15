"use client"
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, Pagination } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import CreateModal from './CreateModal';
import DeleteModal from './DeleteModal';
import UpdateModal from './EditModal';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import fetchApi from '@/commons/api';
import Loading from '../loading/loading';
import usePusher from '@/hooks/usePusher';
import PaginationComponent from '../layout/PaginationComponent';
import { toast } from 'react-toastify';

export default function CatagoriesList (){
    const [categories, setCategories] = useState<any []>([]);
    const [category, setCategory] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
    
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
            const data = await fetchApi.categories(currentPage, limit, searchTerm);
            setCategories(data.data);
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

    usePusher('category', 'category-add', fetchData);
    usePusher('category', 'category-delete', fetchData);
    usePusher('category', 'category-update', fetchData);

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Categories</h3>
                <Button variant="primary" className="ml-2" onClick={() => setShowModalCreate(true)}>Add new</Button>
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
                        <th>Imgae</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(item => {
                        return (
                            <tr key={item.category_id}>
                                <td>{item.category_id}</td>
                                <td> <Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={item.category_image} alt="..."/></td>
                                <td>{item.category_name}</td>
                                <td>
                                    <Button variant='warning' className='mr-3'
                                        onClick={() => {
                                            setCategory(item)
                                            setShowModalUpdate(true)
                                        }}
                                    ><EditOutlined /></Button>
                                    <Button variant='danger'
                                        onClick={() => {
                                            setCategory(item)
                                            setShowModalDelete(true)
                                        }}
                                    ><DeleteOutlined /></Button>
                                </td>
                            </tr>
                        )
                    })}

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
            <CreateModal
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                updateCategoryList={fetchData}
            />
            <DeleteModal
                showModalDelete={showModalDelete}
                setShowModalDelete={setShowModalDelete}
                categoryItem={category}
                updateCategoryList={fetchData}
            />
            <UpdateModal
                showModalUpdate={showModalUpdate}
                setShowModalUpdate={setShowModalUpdate}
                categoryItem={category}
                updateCategoryList={fetchData}
            />
        </>
    )
}