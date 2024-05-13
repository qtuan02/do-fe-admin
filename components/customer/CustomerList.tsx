"use client"
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Loading from '../loading/loading';
import Constants from '@/commons/environment';
import Cookies from 'js-cookie';

export default function CustomerList () {
    
    const [customers, setCustomers] = useState<any []>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = await Cookies.get("token");
            const response = await fetch(Constants.URL_V2+"/customer/all",{
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}
            );
            const data = await response.json();
            setCustomers(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };
    
    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Customers</h3>
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
                        <th>Birth</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(item => (
                        <tr key={item.customer_id}>
                            <td>{item.customer_id}</td>
                            <td>{item.customer_firstname}</td>
                            <td>{item.customer_lastname}</td>
                            <td>{item.address}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.birth}</td>
                            <td>{item.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {isLoading && <Loading />}
        </>
    )
}