"use client"
import Table from 'react-bootstrap/Table';
import { Button, Form, Pagination } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import CreateModal from './CreateModal';
import DeleteModal from './DeleteModal';
import UpdateModal from './EditModal';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import fetchApi from '@/commons/api';
import Loading from '../loading/loading';

export default function CatagoriesList (){
    const [categories, setCategories] = useState<any []>([]);
    const [category, setCategory] = useState<ICategory | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm]);
    
    const fetchData = async () => {
        setIsLoading(true);
        const data = await fetchApi.categories(currentPage, searchTerm);
        setCategories(data.data);
        setIsLoading(false);
        setTotalPages(Math.ceil(data.message / 5));
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSubmit = () => {
        if (inputRef.current) {
            setCurrentPage(1);
            setSearchTerm(inputRef.current.value);
        }
    }

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
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(item => {
                        return (
                            <tr key={item.category_id}>
                                <td>{item.category_id}</td>
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
            <Pagination className="justify-end">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map(page =>
                        <Pagination.Item
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => handlePageChange(page + 1)}
                        >
                        {page + 1}
                        </Pagination.Item>
                    )}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
            {isLoading && <Loading />}
            <CreateModal
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                updateCategoryList={fetchData}
            />
            <DeleteModal
                showModalDelete={showModalDelete}
                setShowModalDelete={setShowModalDelete}
                category={category}
                updateCategoryList={fetchData}
            />
            <UpdateModal
                showModalUpdate={showModalUpdate}
                setShowModalUpdate={setShowModalUpdate}
                category={category}
                updateCategoryList={fetchData}

            />
        </>
    )
}