import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import fetchApi from "@/commons/api";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface Iprops {
    showModalChangePassword: boolean
    setShowModalChangePassword: (v: boolean) => void
    user_id: number
}
const ChangePassword = (props: Iprops) => {
    const { showModalChangePassword, setShowModalChangePassword, user_id } = props;
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const handleCloseModal = () => {
        setShowModalChangePassword(false);
        setShowPassword(false);
    }

    const togglePassword = () => {
        setShowPassword((show) => !show);
    }

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.updateUser(token, user_id, { password: password });
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal();
        }else{
            toast.error(data.message);
        }
    };

    return (
        <>
            <Modal
                show={showModalChangePassword}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>New password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} placeholder="New password..."
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                    <InputGroup.Text onClick={togglePassword} style={{ cursor: 'pointer' }} >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}  style={{ fontSize: '14px' }} />
                                    </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Change</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangePassword;