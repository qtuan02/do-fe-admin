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
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import Loading from '../loading/loading';
import Constants from '@/commons/environment';
import { Avatar } from '@mui/material';
import { CheckCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import OrderModal from './OrderModal';

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
        const token = await Cookies.get("token");
        try {
            const response = await fetch(Constants.URL_V1+`/order?order_id=${row.order_id}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            setOrderDetail(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };
    
    return (
        <>
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
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
                <TableCell component="th" scope="row">
                    {row.customer.customer_lastname + " " + row.customer.customer_firstname}
                </TableCell>
                <TableCell>{row.customer.phone}</TableCell>
                <TableCell>{row.order_address}</TableCell>
                <TableCell>{row.order_date}</TableCell>
                <TableCell>{row.total_price}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell >
                    {row.status === "pending" ? (
                        <>
                            <Button variant='danger' className='mr-2' onClick={() => {
                                setShowModal(true)
                                setOrderId(row.order_id)
                                setContent("cancel")
                                setValue("cancel")
                            }}><MinusCircleOutlined /></Button>
                            <Button variant='warning' className='mr-2' onClick={() => {
                                setShowModal(true)
                                setOrderId(row.order_id)
                                setContent("waiting")
                                setValue("waiting")
                            }}><PlusCircleOutlined /></Button>
                        </>
                    ) : row.status === "waiting" ? (
                        <>
                            <Button variant='danger' className='mr-2' onClick={() => {
                                setShowModal(true)
                                setOrderId(row.order_id)
                                setContent("cancel")
                                setValue("cancel")
                            }}><MinusCircleOutlined /></Button>
                            <Button variant='success' onClick={() => {
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Detail
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
                            {orderdetails.map((item) => (
                                <TableRow key={item}>
                                    <TableCell component="th" scope="row">{item.order_details_id}</TableCell>
                                    <TableCell>
                                        <Avatar
                                            alt="..."
                                            src={item.product.image_1}
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