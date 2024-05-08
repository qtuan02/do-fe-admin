import Constants from "@/commons/environment";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

interface IProps {
    showModalEdit: boolean;
    setShowModalEdit: (status: boolean) => void;
    brandItem: IBrand | null;
    updateBrandList: () => void;
}

export default function BrandEditModal(props: IProps) {
    const {showModalEdit, brandItem, setShowModalEdit, updateBrandList} = props;
    const [brandName, setBrandName] = useState('');

    const handleCloseModal = () => {
        setShowModalEdit(false);
    };
    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+`/brand/${brandItem?.brand_id}`, {
            method: 'PUT',
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
            updateBrandList();

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
                    <Modal.Title>Edit Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand name</Form.Label>
                            <Form.Control type="text" placeholder={brandItem?.brand_name}
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>Edit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}