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
import Constants from '@/commons/environment';
import Cookies from 'js-cookie';
import { Button, ButtonGroup } from '@mui/material';

export default function OrderListPage() {
    const [orders, setOrders] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (status: any = null) => {
        setIsLoading(true);
        const token = await Cookies.get("token");
        let url = Constants.URL_V1+"/order";
        try {
            if(status !== null){
                url = url+"?status="+status;
            }
            const response = await fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            setOrders(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Orders</h3>
                <ButtonGroup aria-label="Basic button group">
                    <Button variant="outlined" className='font-bold' onClick={() => fetchData('pending')}>Pending</Button>
                    <Button variant="outlined" color='warning' className='font-bold' onClick={() => fetchData('waiting')}>Waiting</Button>
                    <Button variant="outlined" color='error' className='font-bold' onClick={() => fetchData('cancel')}>Cancel</Button>
                    <Button variant="outlined" color='success' className='font-bold' onClick={() => fetchData('complete')}>Complete</Button>
                </ButtonGroup>
            </div>
            <TableContainer component={Paper}>
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
            {isLoading && <Loading />}
        </>
    );
}