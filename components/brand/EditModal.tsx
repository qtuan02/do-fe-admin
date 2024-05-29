import Constants from "@/commons/environment";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import fetchApi from "@/commons/api";

interface IProps {
    showModalEdit: boolean;
    setShowModalEdit: (status: boolean) => void;
    brandItem: any | null;
    updateBrandList: () => void;
}

export default function BrandEditModal(props: IProps) {
    const {showModalEdit, brandItem, setShowModalEdit, updateBrandList} = props;
    const [brandName, setBrandName] = useState('');
    
    useEffect(() => {
        if(brandItem){
            setBrandName(brandItem.brand_name)
        }
    },[brandItem])

    const handleCloseModal = () => {
        setShowModalEdit(false);
    };
    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.updateBrand(token, brandItem.brand_id, brandName);
        if(data.status === 200){
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
                            <Form.Control type="text" placeholder="..."
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