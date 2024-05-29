import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import fetchApi from "@/commons/api";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import NoticeLogout from "./NoticeLogout";

interface Iprops {
    showModalChangePassword: boolean
    setShowModalChangePassword: (v: boolean) => void
    token: string
}
const ChangePassword = (props: Iprops) => {
    const { showModalChangePassword, setShowModalChangePassword, token } = props;
    const [oldPassword, setOldPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showModalNoticeLogout, setShowModalNoticeLogout] = useState(false);

    const handleCloseModal = () => {
        setShowModalChangePassword(false);
        setShowOldPassword(false);
        setShowPassword(false);
    }

    const togglePassword = (key: number) => {
        if(key === 1){
            setShowPassword((show) => !show);
        }else{
            setShowOldPassword((show) => !show);
        }
    }

    const handleSubmit = async () => {
        const data = await fetchApi.changePassword(token, { oldPassword: oldPassword, password: password });
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal();
            setShowModalNoticeLogout(true);
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
                            <Form.Label>Old password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showOldPassword ? "text" : "password"} placeholder="Old password..."
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                    <InputGroup.Text onClick={() => togglePassword(0)} style={{ cursor: 'pointer' }} >
                                        <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye}  style={{ fontSize: '14px' }} />
                                    </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} placeholder="New password..."
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                    <InputGroup.Text onClick={() => togglePassword(1)} style={{ cursor: 'pointer' }} >
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
            <NoticeLogout 
                showModalNoticeLogout={showModalNoticeLogout}
                setShowModalNoticeLogout={setShowModalNoticeLogout}
            />
        </>
    );
}

export default ChangePassword;