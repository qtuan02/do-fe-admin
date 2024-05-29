import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import fetchApi from '@/commons/api';

interface Iprops {
    showModalDelete: boolean
    setShowModalDelete: (v: boolean) => void
    categoryItem: any | null
    updateCategoryList: () => void
}
const DeleteModal = (props: Iprops) => {
    const { showModalDelete, setShowModalDelete, categoryItem, updateCategoryList } = props

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.deleteCategory(token, categoryItem.category_id);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal();
            updateCategoryList();
        }else{
            toast.error(data.message);
            handleCloseModal();
            updateCategoryList();
        }
    }

    const handleCloseModal = () => {
        setShowModalDelete(false)
    }
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
                            <Form.Label>Do you want to delete category {categoryItem?.category_name}</Form.Label>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleSubmit()}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;
