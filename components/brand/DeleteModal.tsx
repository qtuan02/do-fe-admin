import Constants from "@/commons/environment";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

interface IProps {
    showModalDelete: boolean;
    setShowModalDelete: (status: boolean) => void;
    brandItem: IBrand | null;
    updateBrandList: () => void;
}

export default function BrandDeleteModal(props: IProps) {
    const {showModalDelete, brandItem, setShowModalDelete, updateBrandList} = props;

    const handleCloseModal = () => {
        setShowModalDelete(false);
    };
    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+`/brand/${brandItem?.brand_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
                show={showModalDelete}
                onHide={() => handleCloseModal()}
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Do you want to delete category {brandItem?.brand_name}</Form.Label>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="danger" onClick={() => handleSubmit()}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}