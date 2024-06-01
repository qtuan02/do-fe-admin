"use client"
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from "next/dynamic";
import fetchApi from "@/commons/api";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import Cookies from 'js-cookie';
import Loading from "../loading/loading";
import { CloseOutlined } from "@ant-design/icons";

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
        image: "",
        product_name: "",
        brand_id: 0,
        category_id: 0,
        price: 0,
        quantity: 0,
        description: "",
        promotion: 0,
        quantity_sold: 0,
        status: "true",
        images: []
    });
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        const dataCategoryies = await fetchApi.categories();
        setCategories(dataCategoryies.data);
        const dataBrands = await fetchApi.brands();
        setBrands(dataBrands.data);
    }
    
    const handleFileChange = async (event: any) => {  
        const selectedImage = event.target.files[0];
        
        const data = await fetchApi.upload(selectedImage);
        if (data.status === 200) {
            setFormData(key => ({
                ...key,
                image: data.data.url
            }));
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    }

    const handleAddFileDescription = async (event: any) => {
        const selectedImage = event.target.files[0];

        const data = await fetchApi.upload(selectedImage);
        if (data.status === 200) {
            setFormData((key: any) => ({
                ...key,
                images: [...key.images, data.data.url]
            }));
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    }

    const handleRemoveFileDescription = async (index: number) => {
        setFormData((prevState) => {
            const updatedImages = [...prevState.images];
            updatedImages.splice(index, 1);
            return {
                ...prevState,
                images: updatedImages
            };
        });
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
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        const data = await fetchApi.createProduct(token, formData);
        if(data.status === 200){
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
                <Row>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload image</Form.Label>
                            <div className="upload-container">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e)}
                                        className="file-input" />
                                <div className="image-preview">
                                    {formData.image ? (
                                        <Image src={formData.image} alt="Preview" className="img-fluid" />
                                    ) : (
                                        <span>Choose an image</span>
                                    )}
                                </div>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Images description</Form.Label>
                            <div className="d-flex flex-wrap">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="upload-description">
                                        <div className="image-preview">
                                            <Image src={img} alt="Preview" className="img-fluid" />
                                        </div>
                                        <span className="remove-file-description" onClick={() => handleRemoveFileDescription(index)}><CloseOutlined /></span>
                                    </div>
                                ))}
                                <div className="upload-description">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleAddFileDescription(e)}
                                        className="file-input" />
                                    <div className="image-preview">
                                        <span>Add</span>
                                    </div>
                                </div>
                            </div>
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
                            <Form.Label>Category</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "category_id")}>
                                <option value="">--Categories</option> 
                                {categories.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "brand_id")}>
                                <option value="">--Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="100000" onChange={(e) => handleTextChange(e, "price")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" onChange={(e) => handleTextChange(e, "quantity")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Promotion</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" onChange={(e) => handleTextChange(e, "promotion")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Quantity sold</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" onChange={(e) => handleTextChange(e, "quantity")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select onChange={(e) => handleSelectChange(e, "status")}>
                                <option value="true">Acctive</option>
                                <option value="false">No Acctive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="editor-container">
                    <Form.Label>Description</Form.Label>
                    <div className="editor-container">
                        
                    </div>
                        <DynamicEditor
                            editorState={editorState}
                            onEditorStateChange={handleEditorStateChange}
                            editorClassName="editor-class" />
                </Form.Group>
            </Form>
            {isLoading && <Loading />}
        </>
    )
}