import { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import fetchApi from "@/commons/api";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

interface Iprops {
    showModalCreate: boolean
    setShowModalCreate: (v: boolean) => void
    updateUserList: () => void
}
const CreateModal = (props: Iprops) => {
    const { showModalCreate, setShowModalCreate , updateUserList } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "",
        email: "",
        phone: "",
        password: "",
        status: "",
        role: ""
    });
    
    const handleCloseModal = () => {
        setShowModalCreate(false)
    }

    const togglePassword = () => {
        setShowPassword((show) => !show);
    }

    const initialFormData = {
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "",
        email: "",
        phone: "",
        password: "",
        status: "",
        role: ""
    }

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.createUser(token, formData);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal();
            setFormData(initialFormData);
            updateUserList();
        }else{
            toast.error(data.message);
        }
    };

    return (
        <>
            <Modal
                show={showModalCreate}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add new a User</Modal.Title>
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
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >   
                                        <option value="">--Default</option>
                                        <option value="1">Active</option>
                                        <option value="0">No Active</option>
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
                        <Row>
                            <Col xs={9}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type={showPassword ? "text" : "password"} placeholder="Password..."
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <InputGroup.Text onClick={togglePassword} style={{ cursor: 'pointer' }} >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}  style={{ fontSize: '14px' }} />
                                        </InputGroup.Text>
                                    </InputGroup>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateModal;