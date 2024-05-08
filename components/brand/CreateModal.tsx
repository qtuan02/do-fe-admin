import Constants from "@/commons/environment";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

interface IProps {
    showModalCreate: boolean;
    setShowModalCreate: (show: boolean) => void;
    updateBrandList: () => void;
}

export default function BrandCreateModal(props: IProps) {
    const {showModalCreate, setShowModalCreate, updateBrandList} = props;
    const [brandName, setBrandName] = useState('');

    const handleCloseModal = () => {
        setShowModalCreate(false);
    };
    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+'/brand', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ brand_name: brandName })
        })
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
            handleCloseModal();
            updateBrandList();
        }else{
            toast.error(data.message);
            handleCloseModal();
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
                    <Modal.Title>Add new Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand name</Form.Label>
                            <Form.Control type="text" placeholder="..."
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}