import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useSWRConfig } from "swr"
import Constants from '@/commons/environment';
import Cookies from 'js-cookie';


interface Iprops {
    showModalCreate: boolean
    setShowModalCreate: (v: boolean) => void
}
const CreateModal = (props: Iprops) => {
    const { showModalCreate, setShowModalCreate } = props
    const [categoryName, setCategoryName] = useState<string>('')
    const { mutate } = useSWRConfig()

    const handleSubmit = async () => {
        const token = await Cookies.get("token");
        const response = await fetch(Constants.URL_V1+'/category', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category_name: categoryName })
        })
        const data = await response.json();
        if(response.ok){
            toast.success(data.message);
            handleCloseModal()
            mutate(Constants.URL_V1+'/category')
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
