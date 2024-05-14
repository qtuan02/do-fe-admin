"use client"
import Constants from "@/commons/environment";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, Form, Pagination, Table } from "react-bootstrap";
import Loading from "../loading/loading";
import { EditOutlined, EyeFilled, EyeInvisibleFilled, UndoOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import fetchApi from "@/commons/api";
import { useRouter } from "next/navigation";

export default function ProductListPage(){
    const router = useRouter();
    const [products, setProducts] = useState<any []>([]);
    const [categories, setCategories] = useState<any []>([]);
    const [brands, setBrands] = useState<any []>([]);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [chooseCategory, setChooseCategory] = useState('');
    const [chooseBrand, setChooseBrand] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, status, searchTerm, chooseCategory, chooseBrand]);
    
    const fetchData = async () => {
        setIsLoading(true);
        const data = await fetchApi.products(status, null, currentPage, searchTerm, chooseCategory, chooseBrand);
        const dataCategoryies = await fetchApi.allCategories();
        const dataBrands = await fetchApi.allBrands();
        setIsLoading(false);
        setCategories(dataCategoryies.data);
        setBrands(dataBrands.data);
        setProducts(data.data);
        setTotalPages(Math.ceil(data.message / 5));
    };

    const handleChangeStatus = async (product_id: any, status: any) => {
        const token = await Cookies.get("token");
        if(status === "true"){
            status = "false";
        }else{
            status = "true";
        }
        setIsLoading(true);
        const response = await fetch(Constants.URL_V1+`/product/${product_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        })
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
            fetchData();
        }else{
            toast.error(data.message);
        }
    }

    const isChecked = (status: any) => {
        if(status === "true"){
            return true;
        }
        return false;
    }
    
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    
    const handleSubmit = () => {
        setCurrentPage(1)
        if (inputRef.current) {
            setCurrentPage(1);
            setSearchTerm(inputRef.current.value);
        }
        setChooseCategory(selectedCategory);
        setChooseBrand(selectedBrand);
    }

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Products</h3>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="danger" className="mr-1" onClick={() => {
                        setStatus("false")
                        setCurrentPage(1)
                        setSearchTerm("")
                        setChooseBrand("")
                    }}><EyeInvisibleFilled /></Button>
                    <Button variant="warning" className="mr-1" onClick={() => {
                        setStatus("true");
                        setCurrentPage(1)
                        setSearchTerm("")
                        setChooseBrand("")
                    }}><EyeFilled /></Button>
                    <Button variant="primary" onClick={() => {
                        setStatus("")
                        setCurrentPage(1)
                        setSearchTerm("")
                        setChooseBrand("")
                    }}><UndoOutlined /></Button>
                </ButtonGroup>
            </div>

            <Form.Group className="mb-4 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Filter by name..."
                    className='mr-3'
                    style={{ width: '300px' }}
                    ref={inputRef}
                />
                <Form.Select style={{ width: '150px' }} className="mr-3"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">--Categories</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                    ))}
                </Form.Select>
                <Form.Select  style={{ width: '120px' }} className="mr-3"
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    value={selectedBrand}
                >
                    <option value="">--Brands</option>
                    {brands.map((brand) => (
                        <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                    ))}
                </Form.Select>
                <Button variant="primary" onClick={() => handleSubmit()}>Apply</Button>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(item => (
                        <tr key={item.product_id}>
                            <td>{item.product_id}</td>
                            <td> <Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={item.image_1} /></td>
                            <td>{item.product_name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.category.category_name}</td>
                            <td>{item.brand.brand_name}</td>
                            <td><Form.Check 
                                type="switch"
                                checked={isChecked(item.status)}
                                onChange={() => handleChangeStatus(item.product_id, item.status)}/>
                            </td>
                            <td>
                                <Button variant='success' className='mr-3' onClick={() => router.push(`/dashboard/product/edit/${item.product_id}`)}><EditOutlined /></Button>
                            </td>
                        </tr>
                    ))}
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
        </>
    )
}