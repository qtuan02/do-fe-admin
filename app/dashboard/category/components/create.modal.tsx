import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useSWRConfig } from "swr"
import Constants from '@/commons/environment';

interface Iprops {
    showModalCreate: boolean
    setShowModalCreate: (v: boolean) => void
}
const CreateModal = (props: Iprops) => {
    const { showModalCreate, setShowModalCreate } = props
    const [categoryName, setCategoryName] = useState<string>('')
    const { mutate } = useSWRConfig()

    const handleSubmit = async () => {
        const res = await fetch(Constants.URL_V1+'/category', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category_name: categoryName })
        })
        const data = await res.json();
        if (data) {
            toast.success('Create succeed')
            handleCloseModal()
            mutate(Constants.URL_V1+'/category')
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
