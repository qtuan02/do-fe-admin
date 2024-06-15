import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Cookies from 'js-cookie';
import { useState } from "react";
import Loading from '../loading/loading';

import { Avatar, Button } from '@mui/material';
import { CheckCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import OrderModal from './OrderModal';
import fetchApi from '@/commons/api';

interface IProps {
    key: any;
    row: any;
    updateOrderList: () => void;
}

export default function OrderDetail(props: IProps) {
    const { key, row, updateOrderList } = props;
    
    const [orderId, setOrderId] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [content, setContent] = React.useState("");
    const [value, setValue] = React.useState("");

    const [orderdetails, setOrderDetail] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchData = async () => {
        setIsLoading(true);
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.orderDetail(token, row.order_id);
        setIsLoading(false);
        setOrderDetail(data.data);
    };
    
    return (
        <>
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell className='w-10'>
                        <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            if(open === false){
                                setOpen(true)
                                fetchData()
                            }else{
                                setOpen(false)
                            }
                        }}
                        >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell >{row.order_id}</TableCell>
                    <TableCell>{row.fullname}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.order_address}</TableCell>
                    <TableCell>{row.order_date}</TableCell>
                    <TableCell>{row.total_price}</TableCell>
                    <TableCell>{row.payment_method}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell >
                        {row.status === "pending" ? (
                            <>
                                <Button variant="contained" color='error' className='mr-2' sx={{ minWidth: '40px' }} onClick={() => {
                                    setShowModal(true)
                                    setOrderId(row.order_id)
                                    setContent("cancel")
                                    setValue("cancel")
                                }}><MinusCircleOutlined /></Button>
                                <Button variant="contained" color='warning' sx={{ minWidth: '40px' }} onClick={() => {
                                    setShowModal(true)
                                    setOrderId(row.order_id)
                                    setContent("shipping")
                                    setValue("shipping")
                                }}><PlusCircleOutlined /></Button>
                            </>
                        ) : row.status === "shipping" ? (
                            <>
                                <Button variant="contained" color='error' className='mr-2' sx={{ minWidth: '40px' }} onClick={() => {
                                    setShowModal(true)
                                    setOrderId(row.order_id)
                                    setContent("cancel")
                                    setValue("cancel")
                                }}><MinusCircleOutlined /></Button>
                                <Button variant="contained" color='success' sx={{ minWidth: '40px' }} onClick={() => {
                                    setShowModal(true)
                                    setOrderId(row.order_id)
                                    setContent("complete")
                                    setValue("complete")
                                }}><CheckCircleOutlined /></Button>
                            </>
                        ) : null}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 4, paddingTop: 4 }} colSpan={10}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Order Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderdetails.map((item, index) => (
                                    <TableRow key={item}>
                                        <TableCell component="th" scope="row">{index+1}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                alt="..."
                                                src={item.product.image}
                                            />
                                        </TableCell>
                                        <TableCell>{item.product.product_name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
            <OrderModal
                showModal={showModal}
                setShowModal={setShowModal}
                orderId={orderId}
                updateOrderList={updateOrderList}
                content={content}
                value={value}
            />
            {isLoading && <Loading />}
        </>
    );
}