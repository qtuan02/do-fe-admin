import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import fetchApi from '@/commons/api';

interface Iprops {
    showModalUpdate: boolean
    setShowModalUpdate: (v: boolean) => void
    categoryItem: any | null
    updateCategoryList: () => void
}
const UpdateModal = (props: Iprops) => {
    const { showModalUpdate, setShowModalUpdate, categoryItem , updateCategoryList } = props;
    const [categoryName, setCategoryName] = useState<string>('');

    useEffect(() => {
        if(categoryItem){
            setCategoryName(categoryItem.category_name)
        }
    },[categoryItem])

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.updateCategory(token, categoryItem.category_id, categoryName);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal()
            updateCategoryList();
        }else{
            toast.error(data.message);
            handleCloseModal();
            updateCategoryList();
        }
    }

    const handleCloseModal = () => {
        setCategoryName('')
        setShowModalUpdate(false)
    }
    return (
        <>
            <Modal
                show={showModalUpdate}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update a Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Category name</Form.Label>
                            <Form.Control type="text" placeholder="..."
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>Edit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateModal;
