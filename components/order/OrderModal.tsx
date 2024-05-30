import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import fetchApi from '@/commons/api';
import Loading from '../loading/loading';

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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    const token = await Cookies.get("token") as string;
    setIsLoading(true);
    const data = await fetchApi.changeStatusOrder(token, orderId, value);
    setIsLoading(false);
    if(data.status === 200){
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
    <>
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
      {isLoading && <Loading />}
    </>
  );
}