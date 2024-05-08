import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useSWRConfig } from "swr"
import Constants from '@/commons/environment';
import Cookies from 'js-cookie';

interface Iprops {
    showModalDelete: boolean
    setShowModalDelete: (v: boolean) => void
    category: ICategory | null
    setCategory: (value: ICategory | null) => void
}
const DeleteModal = (props: Iprops) => {
    const { showModalDelete, setShowModalDelete, category, setCategory } = props
    const [categoryId, setCategoryId] = useState<number>(0)
    const [categoryName, setCategoryName] = useState<string>('')
    const { mutate } = useSWRConfig()

    useEffect(() => {
        if (category && category.category_id) {
            setCategoryId(category.category_id)
            setCategoryName(category.category_name)
        }
    }, [category])

    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+`/category/${categoryId}`, {
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
            handleCloseModal()
            mutate(Constants.URL_V1+'/category')
        }else{
            toast.error(data.message);
            handleCloseModal();
            mutate(Constants.URL_V1+'/category')
        }
    }

    const handleCloseModal = () => {
        setCategoryName('')
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
                            <Form.Label>Do you want to delete category {categoryName}</Form.Label>
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
