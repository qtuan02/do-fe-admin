"use client"
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
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

export default function EditProductForm(product: any) {
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
        status: "",
        images: []
    });
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setIsLoading(true);
        const dataCategoryies = await fetchApi.categories();
        const dataBrands = await fetchApi.brands();
        const dataProduct = await fetchApi.findOneProduct(product.product_id);
        setIsLoading(false);
        if (dataProduct.data) {
            setFormData({
                ...formData,
                image: dataProduct.data.image,
                product_name: dataProduct.data.product_name,
                brand_id: dataProduct.data.brand.brand_id,
                category_id: dataProduct.data.category.category_id,
                price: dataProduct.data.price,
                quantity: dataProduct.data.quantity,
                description: dataProduct.data.description,
                promotion: dataProduct.data.promotion,
                quantity_sold: dataProduct.data.quantity_sold,
                status: dataProduct.data.status,
                images: dataProduct.data.images
            });
            
            const contentBlocks: any = convertFromHTML(dataProduct.data.description);
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            const newEditorState = EditorState.createWithContent(contentState);
            setCategories(dataCategoryies.data);
            setBrands(dataBrands.data);
            setEditorState(newEditorState);
        }
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
        const token = await Cookies.get("token") as string;
        const selectedImage = event.target.files[0];
        setIsLoading(true);
        const data = await fetchApi.upload(selectedImage);
        if (data.status === 200) {
            const addImage = await fetchApi.addImageDescription(token, data.data.url, product.product_id);
            if(addImage.status === 200){
                fetchData();
                setIsLoading(false);
                toast.success(addImage.message);
            }else{
                toast.error(addImage.message);
            }
        } else {
            toast.error(data.message);
        }
        setIsLoading(false);
    }

    const handleRemoveFileDescription = async (image_id: number, index: number) => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.deleteImageDescription(token, image_id);
        if(data.status === 200){
            setFormData((key: any) => {
                const updatedImages = [...key.images];
                updatedImages.splice(index, 1);
                return {
                    ...key,
                    images: updatedImages
                };
            });
            toast.success(data.message);
        }else{
            toast.error(data.message);
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
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        
        const data = await fetchApi.updateProduct(token, product.product_id, formData);
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
                <h3>Edit Product</h3>
                <Button variant='success' onClick={handleSubmit}>EDIT</Button>
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
                                {formData.images.map((img: any, index) => (
                                    <div key={index} className="upload-description">
                                        <div className="image-preview">
                                            <Image src={img.url} alt="Preview" className="img-fluid" />
                                        </div>
                                        <span className="remove-file-description" onClick={() => handleRemoveFileDescription(img.image_id, index)}><CloseOutlined /></span>
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
                            <Form.Control size="sm" placeholder="Name" value={formData.product_name} onChange={(e) => handleTextChange(e, "product_name")}/>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={formData.category_id} onChange={(e) => handleSelectChange(e, "category_id")}>
                                {categories.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Select value={formData.brand_id} onChange={(e) => handleSelectChange(e, "brand_id")}>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col  xs={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="100000" value={formData.price} onChange={(e) => handleTextChange(e, "price")}/>
                        </Form.Group>
                    </Col>
                    <Col  xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Promotion</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" value={formData.promotion} onChange={(e) => handleTextChange(e, "promotion")}/>
                        </Form.Group>
                    </Col>
                    <Col  xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity sold</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" value={formData.quantity_sold} onChange={(e) => handleTextChange(e, "quantity_sold")}/>
                        </Form.Group>
                    </Col>
                    <Col  xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control size="sm" type="number" placeholder="0" value={formData.quantity} onChange={(e) => handleTextChange(e, "quantity")}/>
                        </Form.Group>
                    </Col>
                    <Col  xs={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={formData.status} onChange={(e) => handleSelectChange(e, "status")}>
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