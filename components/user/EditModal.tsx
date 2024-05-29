import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import fetchApi from "@/commons/api";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

interface Iprops {
    showModalEdit: boolean
    setShowModalEdit: (v: boolean) => void
    userItem: any | null
    updateUserList: () => void
}
const EditModal = (props: Iprops) => {
    const { showModalEdit, setShowModalEdit, userItem, updateUserList } = props;
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "",
        email: "",
        phone: "",
        role: ""
    });

    useEffect(() => {
        if(userItem !== null){
            setFormData({
                ...formData,
                firstname: userItem?.firstname,
                lastname: userItem?.lastname,
                address: userItem?.address,
                birth: userItem?.birth,
                gender: userItem?.gender,
                email: userItem?.email,
                phone: userItem?.phone,
                role: userItem?.role
            });
        }
    }, [userItem]);
    
    const handleCloseModal = () => {
        setShowModalEdit(false)
    }

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.updateUser(token, userItem.user_id, formData);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal();
            updateUserList();
        }else{
            toast.error(data.message);
        }
    };

    return (
        <>
            <Modal
                show={showModalEdit}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update a User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            <Col xs={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control type="text" placeholder="Phone..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date of birth</Form.Label>
                                    <Form.Control type="date"
                                        value={formData.birth}
                                        onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
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
                        <Row>
                            <Col xs={9}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" placeholder="Email..." 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                            <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >   
                                        <option value="">--No role</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;