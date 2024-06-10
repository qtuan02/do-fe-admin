"use client"

import fetchApi from "@/commons/api";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Col, Form, Image, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import Loading from "../loading/loading";

export default function BannerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [banners, setBanners] = useState<any []>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        const data = await fetchApi.banners(token);
        setIsLoading(false);
        setBanners(data.data);
    }

    const handleAddBanner = async (event: any) => {
        setIsLoading(true);
        const selectedFiles = event.target.files;
        const token = await Cookies.get("token") as string;

        for (const file of selectedFiles) {
            const upload = await fetchApi.upload(file);
            const data = await fetchApi.createBanner(token, upload.data.url);
            if (data.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
                break;
            }
        }
        fetchData();
    }

    const handleRemoveImage = async (banner_id: number, index: number) => {
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        const data = await fetchApi.deleteBanner(token, banner_id);
        setIsLoading(false);
        if(data.status === 200){
            banners.splice(index, 1);
            toast.success(data.message);
        }else {
            toast.error(data.message);
        }
    }

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Banners</h3>
            </div>
            <Form>
                <Row>
                    {banners.map((item, index) => (
                        <Col md={6} key={index}>
                            <Form.Group className="mb-3">
                                <div className="upload-container">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleAddBanner(e)}
                                        className="file-input" />
                                    <div className="image-preview">
                                        <Image src={item.banner_image} alt="Preview" className="img-fluid" />
                                    </div>
                                    <span className="remove-file-description p-3" onClick={() => handleRemoveImage(item.banner_id, index)}><CloseOutlined /></span>
                                </div>
                            </Form.Group>
                        </Col>
                    ))}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            
                            <div className="upload-container">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleAddBanner(e)}
                                    className="file-input" />
                                <div className="image-preview">
                                    <span>Choose an image</span>
                                </div>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {isLoading && <Loading />}
        </>
    );
}