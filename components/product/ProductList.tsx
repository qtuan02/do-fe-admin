"use client"
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, Form, Pagination, Table } from "react-bootstrap";
import Loading from "../loading/loading";
import { EditOutlined, EyeFilled, EyeInvisibleFilled, UndoOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import fetchApi from "@/commons/api";
import { useRouter } from "next/navigation";
import usePusher from "@/hooks/usePusher";
import PaginationComponent from "../layout/PaginationComponent";

export default function ProductListPage(){
    const router = useRouter();
    const [products, setProducts] = useState<any []>([]);
    const [categories, setCategories] = useState<any []>([]);
    const [brands, setBrands] = useState<any []>([]);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [chooseCategory, setChooseCategory] = useState('');
    const [chooseBrand, setChooseBrand] = useState('');
    const [limit, setLimit] = useState<any>(5);
    

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, status, searchTerm, chooseCategory, chooseBrand, limit]);
    
    const fetchData = async () => {
        try{
            const data = await fetchApi.products(currentPage, limit, chooseCategory, chooseBrand, searchTerm, status);
            const dataCategoryies = await fetchApi.categories();
            const dataBrands = await fetchApi.brands();
            setTotalPages(Math.ceil(data.message / limit));
            setProducts(data.data);
            setCategories(dataCategoryies.data);
            setBrands(dataBrands.data);
        }catch(err){
            toast.error("Đã có lỗi xảy ra!");
        }finally{
            setIsLoading(false);
        }
    };

    const handleChangeStatus = async (product_id: any, status: any) => {
        const token = await Cookies.get("token") as string;
        if(status === "true"){
            status = "false";
        }else{
            status = "true";
        }
        setIsLoading(true);
        const data = await fetchApi.updateStatusProduct(token, product_id, status);
        if(data.status === 200){
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

    const handleLimitChange = (e: any) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    usePusher('product', 'product-add', fetchData);
    usePusher('product', 'product-delete', fetchData);
    usePusher('product', 'product-update', fetchData);

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
                        setChooseCategory("")
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
                        <th>Stock</th>
                        <th>Sale</th>
                        <th>Sold</th>
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
                            <td> <Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={item.image} /></td>
                            <td>{item.product_name}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                            <td>{item.quantity}</td>
                            <td>{item.promotion === 0 ? item.promotion : `${item.promotion}%`}</td>
                            <td>{item.quantity_sold}</td>
                            <td>{item.category_name}</td>
                            <td>{item.brand_name}</td>
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
    )
}