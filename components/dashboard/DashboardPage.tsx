"use client"
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Loading from "../loading/loading";
import fetchApi from "@/commons/api";
import Cookies from 'js-cookie';
import Constants from "@/commons/environment";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [brandsCount, setBrandsCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setIsLoading(true);
        const dataCategories = await fetchApi.categories();
        const dataBrands = await fetchApi.brands();
        const dataProducts = await fetchApi.products();
        const token = await Cookies.get("token");
        try {
            const response = await fetch(Constants.URL_V2+"/customer/all",{
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}
            );
            const data = await response.json();
            setCustomersCount(data.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        try {
            const response = await fetch(Constants.URL_V1+"/order",{
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            setOrdersCount(data.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setCategoriesCount(dataCategories.data.length);
        setBrandsCount(dataBrands.data.length);
        setProductsCount(dataProducts.data.length);
        setIsLoading(false);
    };

    return (
        <>
            <Row xs={1} md={2} lg={4}>
                <Col className="mb-4">
                    <Card
                        bg="primary"
                        text="light"
                        className="mb-2"
                        style={{ height: '10rem' }} >
                        <Card.Body>
                            <Card.Title>Brand</Card.Title>
                            <Card.Text className="text-end">Count: {brandsCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="mb-4">
                    <Card
                        bg="secondary"
                        text="light"
                        className="mb-2"
                        style={{ height: '10rem' }} >
                        <Card.Body>
                            <Card.Title>Category</Card.Title>
                            <Card.Text className="text-end">Count: {categoriesCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="mb-4">
                    <Card
                        bg="success"
                        text="light"
                        className="mb-2"
                        style={{ height: '10rem' }} >
                        <Card.Body>
                            <Card.Title>Product</Card.Title>
                            <Card.Text className="text-end">Count: {productsCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="mb-4">
                    <Card
                        bg="danger"
                        text="light"
                        className="mb-2"
                        style={{ height: '10rem' }} >
                        <Card.Body>
                            <Card.Title>Customer</Card.Title>
                            <Card.Text className="text-end">Count: {customersCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="mb-4">
                    <Card
                        bg="warning"
                        text="light"
                        className="mb-2"
                        style={{ height: '10rem' }} >
                        <Card.Body>
                            <Card.Title>Order</Card.Title>
                            <Card.Text className="text-end">Count: {ordersCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {isLoading && <Loading />}
        </>
    )
}