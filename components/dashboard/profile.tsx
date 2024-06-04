"use client"

import { useEffect, useState } from "react";
import Loading from "../loading/loading";
import Cookies from 'js-cookie';
import { Button, Col, Form, Row } from "react-bootstrap";
import fetchApi from "@/commons/api";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword";

export default function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [isToken, setToken] = useState<string>("");

    const [showModalChangePassword, setShowModalChangePassword] = useState(false);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = await Cookies.get("token") as string;
        if(!isToken){
            setToken(token);
        }
        setIsLoading(true);
        const data = await fetchApi.profile(token);
        setIsLoading(false);
        if(data.status === 200){
            setFormData({
                ...formData,
                firstname: data.data.firstname,
                lastname: data.data.lastname,
                address: data.data.address,
                birth: data.data.birth,
                gender: data.data.gender,
                email: data.data.email,
                phone: data.data.phone
            });
        };
    };

    const handleEdit = async () => {
        const token = await Cookies.get("token") as string;
        setIsLoading(true);
        const data = await fetchApi.changeProfile(token, formData);
        setIsLoading(false);
        if(data.status === 200){
            toast.success(data.message);
            fetchData();
        }else{
            toast.error(data.message);
        }
    };

    return (
        <>
            <div className="mb-3 text-center">
                <h2>PROFILE</h2>
            </div>
            <Form>
                <Row>
                    <Col xs={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control type="text" placeholder="Firstname..."
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" placeholder="Lastname..."
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" placeholder="Phone..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of birth</Form.Label>
                            <Form.Control type="date"
                                value={formData.birth}
                                onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
                            />
                        </Form.Group>
                    </Col>                       
                </Row>
                <Row>
                    <Col xs={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Email..." readOnly disabled
                                value={formData.email}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select 
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">--Default</option>
                                <option value="nam">Nam</option>
                                <option value="nu">Nữ</option>
                                <option value="khac">Khác</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </Form.Group>
                <div className="d-flex justify-end">
                    <Button variant="warning" className="mr-3" onClick={() => setShowModalChangePassword(true)}>Change password</Button>
                    <Button variant="primary" onClick={handleEdit}>Edit</Button>
                </div>
            </Form>
            <ChangePassword 
                showModalChangePassword={showModalChangePassword}
                setShowModalChangePassword={setShowModalChangePassword}
                token={isToken}
            />
            {isLoading && <Loading />}
        </>
    );
}