import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import fetchApi from '@/commons/api';
import { Col, Image } from 'react-bootstrap';


interface Iprops {
    showModalCreate: boolean
    setShowModalCreate: (v: boolean) => void
    updateCategoryList: () => void
}
const CreateModal = (props: Iprops) => {
    const { showModalCreate, setShowModalCreate, updateCategoryList } = props
    const [categoryImage, setCategoryImage] = useState<string>('')
    const [categoryName, setCategoryName] = useState<string>('')

    const handleFileChange = async (event: any) => {  
        const selectedImage = event.target.files[0];
        
        const data = await fetchApi.upload(selectedImage);
        if (data.status === 200) {
            setCategoryImage(data.data.url);
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    }

    const handleSubmit = async () => {
        const token = await Cookies.get("token") as string;
        const data = await fetchApi.createCategory(token, categoryImage, categoryName);
        if(data.status === 200){
            toast.success(data.message);
            handleCloseModal()
            updateCategoryList();
        }else{
            toast.error(data.message);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setCategoryImage('');
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
                        <Col xs={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category image</Form.Label>
                                <div className="upload-container-modal">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e)}
                                            className="file-input" />
                                    <div className="image-preview">
                                        {categoryImage ? (
                                            <Image src={categoryImage} alt="Preview" className="img-fluid" />
                                        ) : (
                                            <span className='text-[14px]'>Choose an image</span>
                                        )}
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
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
