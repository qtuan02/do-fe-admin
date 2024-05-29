import Constants from "@/commons/environment";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import fetchApi from "@/commons/api";

interface IProps {
    showModalDelete: boolean;
    setShowModalDelete: (status: boolean) => void;
    brandItem: any | null;
    updateBrandList: () => void;
}

export default function BrandDeleteModal(props: IProps) {
    const {showModalDelete, brandItem, setShowModalDelete, updateBrandList} = props;

    const handleCloseModal = () => {
        setShowModalDelete(false);
    };
    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.deleteBrand(token, brandItem.brand_id);
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