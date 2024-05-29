"use client"
import Table from 'react-bootstrap/Table';
import { useEffect, useRef, useState } from 'react';
import Loading from '../loading/loading';
import Cookies from 'js-cookie';
import fetchApi from '@/commons/api';
import { Button, ButtonGroup, Form, Pagination } from 'react-bootstrap';
import { EditOutlined, EyeFilled, EyeInvisibleFilled, SelectOutlined, UndoOutlined } from '@ant-design/icons';
import CreateModal from './CreateModal';
import { toast } from 'react-toastify';
import EditModal from './EditModal';
import ChangePassword from './ChangePasswordModal';

export default function UserList () {
    const [user, setUser] = useState<any>();
    const [users, setUsers] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    const [showModalChangePassword, setShowModalChangePassword] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<any>(1);
    const [limit, setLimit] = useState<any>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, limit, searchTerm, role, status]);
    
    const fetchData = async () => {
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        const data = await fetchApi.users(token, currentPage, limit, searchTerm, status, role);
        setIsLoading(false);
        setUsers(data.data);
        setTotalPages(Math.ceil(data.message / limit));
    };

    const isChecked = (status: any) => {
        if(status === true){
            return true;
        }
        return false;
    };

    const handleChangeStatus = async (user_id: any, status: any) => {
        const token = await Cookies.get("token") as string;
        if(status === true){
            status = false;
        }else{
            status = true;
        }
        setIsLoading(true);
        const data = await fetchApi.updateUser(token, user_id, {status: status});
        if(data.status === 200){
            toast.success(data.message);
            fetchData();
        }else{
            toast.error(data.message);
        }
    }

    const handleSubmit = () => {
        setCurrentPage(1)
        if (inputRef.current) {
            setCurrentPage(1);
            setSearchTerm(inputRef.current.value);
        }
        setRole(selectedRole);
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        const pageItems = [];
        const pageRange = 2;
        const ellipsis = <Pagination.Ellipsis />;
        
        if (totalPages <= 10) {
            for (let page = 1; page <= totalPages; page++) {
                pageItems.push(
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }
        } else {
            const startPage = Math.max(1, currentPage - pageRange);
            const endPage = Math.min(totalPages, currentPage + pageRange);
            
            if (startPage > 2) {
                pageItems.push(ellipsis);
            }

            for (let page = startPage; page <= endPage; page++) {
                pageItems.push(
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }

            if (endPage < totalPages) {
                pageItems.push(ellipsis);
            }
        }

        return pageItems;
    };


    const handleLimitChange = (e: any) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };
    
    return (
        <>
            <div className="mb-3 d-flex justify-between">
                <h3>Users</h3>
                <Button variant="primary" className="ml-2" onClick={() => setShowModalCreate(true)}>Add new</Button>
            </div>


            <div className="mb-3 d-flex justify-between">
                <Form.Group className="mb-4 d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Filter by phone..."
                        className='mr-3'
                        style={{ width: '300px' }} 
                        ref={inputRef}/>
                    <Form.Select  style={{ width: '120px' }} className="mr-3" 
                    onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
                        <option value="">--No role</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                    <Button variant="primary" onClick={handleSubmit}>Apply</Button>
                </Form.Group>

                <ButtonGroup aria-label="Basic example" className='h-10'>
                    <Button variant="danger" className="mr-1" onClick={() => setStatus("0")}><EyeInvisibleFilled /></Button>
                    <Button variant="warning" className="mr-1" onClick={() => setStatus("1")}><EyeFilled /></Button>
                    <Button variant="primary" onClick={() => {
                        setCurrentPage(1)
                        setRole("")
                        setStatus("")
                        setSearchTerm("")
                    }}><UndoOutlined /></Button>
                </ButtonGroup>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(item => (
                        <tr key={item.user_id}>
                            <td>{item.user_id}</td>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.address}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td><Form.Check 
                                type="switch"
                                checked={isChecked(item.status)}
                                onChange={() => handleChangeStatus(item.user_id, item.status)}
                                />
                            </td>
                            <td>{item.role}</td>
                            <td>
                                <Button variant='info' className='mr-2' onClick={() => {
                                    setShowModalEdit(true)
                                    setUser(item)
                                    }}><EditOutlined /></Button>
                                <Button variant='success' onClick={() => {
                                    setShowModalChangePassword(true)
                                    setUser(item)
                                    }}
                                ><SelectOutlined /></Button>
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
                <Pagination className="m-0">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {renderPaginationItems()}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
            {isLoading && <Loading />}
            <CreateModal 
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                updateUserList={fetchData}
            />
            <EditModal 
                showModalEdit={showModalEdit}
                setShowModalEdit={setShowModalEdit}
                userItem={user}
                updateUserList={fetchData}
            />
            <ChangePassword 
                showModalChangePassword={showModalChangePassword}
                setShowModalChangePassword={setShowModalChangePassword}
                user_id={user?.user_id}
            />
        </>
    )
}