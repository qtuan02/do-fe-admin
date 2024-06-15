"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OrderDetail from './OrderDetail';
import { useEffect, useState } from "react";
import Loading from '../loading/loading';
import Cookies from 'js-cookie';
import { Button, ButtonGroup } from '@mui/material';
import fetchApi from '@/commons/api';
import { Form, Pagination } from 'react-bootstrap';
import PaginationComponent from '../layout/PaginationComponent';
import usePusher from '@/hooks/usePusher';
import { toast } from 'react-toastify';

export default function OrderListPage() {
    const [orders, setOrders] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [status, setStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [limit, setLimit] = useState<any>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const inputRef = React.useRef<HTMLInputElement>(null);


    useEffect(() => {
        fetchData();
    }, [currentPage, limit, status, searchTerm]);

    const fetchData = async () => {
        const token = await Cookies.get("token") as string;
        try{
            const data = await fetchApi.orders(token, currentPage, limit, status, searchTerm);
            setTotalPages(Math.ceil(data.message / limit));
            setOrders(data.data);
        }catch(err){
            toast.error("Đã có lỗi xảy ra!");
        }finally{
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (inputRef.current) {
            setCurrentPage(1);
            setSearchTerm(inputRef.current.value);
        }
        setStatus(selectedStatus);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleLimitChange = (e: any) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    usePusher('order', 'order-add-user', fetchData);
    usePusher('order', 'order-add-public', fetchData);
    usePusher('order', 'order-update', fetchData);

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Orders</h3>
                <div>
                    <span>NOTE: </span>
                    <ButtonGroup aria-label="Basic button group">
                        <Button variant="contained" color='error' className='font-bold'>Cancel</Button>
                        <Button variant="contained" color='warning' className='font-bold'>Shipping</Button>
                        <Button variant="contained" color='success' className='font-bold'>Complete</Button>
                    </ButtonGroup>
                </div>
            </div>
            <Form.Group className="mb-4 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Filter by fullname or phone..."
                    className='mr-3'
                    style={{ width: '250px' }}
                    ref={inputRef}
                />
                <Form.Select style={{ width: '150px' }} className="mr-3"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={selectedStatus}
                >
                    <option value="">--Status</option>
                    <option value="cancel">Cancel</option>
                    <option value="pending">Pending</option>
                    <option value="shipping">Shipping</option>
                    <option value="complete">Complete</option>
                </Form.Select>
                <Button variant="contained" className='h-9' onClick={() => handleSubmit()}>Apply</Button>
            </Form.Group>
            <TableContainer component={Paper} className='mb-3'>
                <Table aria-label="collapsible table">
                    <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((row) => (
                            <OrderDetail key={row} row={row} updateOrderList={fetchData} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
        </>
    );
}