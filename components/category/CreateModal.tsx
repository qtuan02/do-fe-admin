import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import fetchApi from '@/commons/api';


interface Iprops {
    showModalCreate: boolean
    setShowModalCreate: (v: boolean) => void
    updateCategoryList: () => void
}
const CreateModal = (props: Iprops) => {
    const { showModalCreate, setShowModalCreate, updateCategoryList } = props
    const [categoryName, setCategoryName] = useState<string>('')

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.createCategory(token, categoryName);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal()
            updateCategoryList();
        }else{
            toast.error(data.message);
            handleCloseModal();
        }
    }

    const handleCloseModal = () => {
        setCategoryName('')
        setShowModalCreate(false)
    }
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
                    <Modal.Title>Add new a Category</Modal.Title>
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
                    <Button variant="primary" onClick={() => handleSubmit()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateModal;
