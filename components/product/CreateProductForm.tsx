"use client"
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from "next/dynamic";
import fetchApi from "@/commons/api";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import Cookies from 'js-cookie';
import Constants from "@/commons/environment";
import Loading from "../loading/loading";
import Link from 'next/link';

const DynamicEditor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
);

export default function CreateProductForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [categories, setCategories] = useState<any []>([]);
    const [brands, setBrands] = useState<any []>([]);
    const [formData, setFormData] = useState({
        image_1: "",
        image_2: "",
        image_3: "",
        image_4: "",
        image_5: "",
        image_6: "",
        product_name: "",
        brand_id: 1,
        category_id: 1,
        price: 0,
        quantity: 0,
        description: "",
        status: "true"
    });
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        const dataCategoryies = await fetchApi.allCategories();
        setCategories(dataCategoryies.data);
        const dataBrands = await fetchApi.allBrands();
        setBrands(dataBrands.data);
    }
    
    const handleFileChange = async (event: any, keyImage: string) => {  
        const selectedImage = event.target.files[0];
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        try {
            const response = await fetch("https://nguyenkim-be.onrender.com/v3/uploads", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            if (response.ok) {
                setFormData(key => ({
                    ...key,
                    [keyImage]: data.data.url
                }));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Trang có lỗi xảy ra!");
        }
    }
    
    const handleEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);
        const contentState = editorState.getCurrentContent();
        const html = draftToHtml(convertToRaw(contentState));
        const content = html.replace(/\n/g, '<br>');
        setFormData(prevState => ({
            ...prevState,
            description: content
        }));
    }
    
    const handleSelectChange = (event: any, keyName: string) => {
        const selectedValue = event.target.value;
        setFormData(key => ({
            ...key,
            [keyName]: selectedValue
        }));
    }

    const handleTextChange = (event: any, keyName: string) => {
        const { value } = event.target;
        let parsedValue: any = value;
    
        if (keyName === "price" || keyName === "quantity") {
            parsedValue = parseInt(value);
            if (isNaN(parsedValue)) {
                parsedValue = 0;
            }
        }
    
        setFormData(prevState => ({
            ...prevState,
            [keyName]: parsedValue
        }));
    }

    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        setIsLoading(true);
        const response = await fetch(Constants.URL_V1+'/product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
        setIsLoading(false);
    }

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Add Product</h3>
                <Button variant='success' onClick={handleSubmit}>CREATE</Button>
            </div>
            <Form>
            <Row className="mb-4">
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>1.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_1} /></Link>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>2.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_2} /></Link>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>3.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_3} /></Link>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>4.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_4} /></Link>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>5.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_5} /></Link>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>6.</Form.Label>
                            <Link href={formData.image_1} target="_blank"><Card.Img style={{ maxWidth: '50px', maxHeight: '50px' }} src={formData.image_6} /></Link>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 1</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_1")}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 2</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_2")} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 3</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_3")} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 4</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_4")} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 5</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_5")}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Image 6</Form.Label>
                            <Form.Control size="sm" type="file" onChange={(e) => handleFileChange(e, "image_6")}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name of product</Form.Label>
                            <Form.Control size="sm" placeholder="Name" onChange={(e) => handleTextChange(e, "product_name")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "brand_id")}>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "category_id")}>
                                {categories.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="100000" onChange={(e) => handleTextChange(e, "price")}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" onChange={(e) => handleTextChange(e, "quantity")}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "status")}>
                                <option value="true">Acctive</option>
                                <option value="false">No Acctive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <DynamicEditor
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        editorClassName="editor-class"/>
                </Form.Group>
            </Form>
            {isLoading && <Loading />}
        </>
    )
}