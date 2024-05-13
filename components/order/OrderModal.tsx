import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Constants from '@/commons/environment';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function OrderModal(props: any) {
  const {showModal, setShowModal, orderId, updateOrderList, content, value} = props;

  const handleConfirm = async () => {
    const token = await Cookies.get("token");
    const response = await fetch(Constants.URL_V1+`/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: `${value}` })
    })
    const data = await response.json();
      if(response.ok){
        toast.success(data.message);
        updateOrderList();
        handleClose();
      }else{
        toast.error(data.message);
        handleClose();
      }
  }

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"NOTICE!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want <span className='font-bold'>{content}</span> this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>No</Button>
          <Button color="success" onClick={() => handleConfirm()}>Yes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}