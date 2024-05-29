import { Button, Modal } from "react-bootstrap";
import Cookies from 'js-cookie';

interface Iprops {
    showModalNoticeLogout: boolean
    setShowModalNoticeLogout: (v: boolean) => void
}
const NoticeLogout = (props: Iprops) => {
    const { showModalNoticeLogout, setShowModalNoticeLogout } = props;
    const handleCloseModal = () => {
        setShowModalNoticeLogout(false);
    }

    const handleSubmit = async () => {
        Cookies.remove('token');
        window.location.replace('/login');
    };

    return (
        <>
            <Modal
                show={showModalNoticeLogout}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Notice!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Do you still want to log in or log out?</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>OK</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NoticeLogout;