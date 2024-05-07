import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useSWRConfig } from "swr"

interface Iprops {
    showModalUpdate: boolean
    setShowModalUpdate: (v: boolean) => void
    category: ICategory | null
    setCategory: (value: ICategory | null) => void
}
const UpdateModal = (props: Iprops) => {
    const { showModalUpdate, setShowModalUpdate, category, setCategory } = props

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
        const res = await fetch(`http://localhost:8081/v1/category/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category_name: categoryName })
        })
        const data = await res.json();
        if (data) {
            toast.warning('Update succeed')
            handleCloseModal()
            mutate('http://localhost:8081/v1/category')
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
                    <Button variant="primary" onClick={() => handleSubmit()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateModal;
