import React from 'react';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import Modal from 'reactstrap/lib/Modal';
import Button from 'reactstrap/lib/Button';
import connect from 'react-redux/es/connect/connect';
import { mkGetUIIsShowInfoModal } from '../state/uiSelectors';
import { setShowInfoModal } from '../state/uiActions';
import InfoTable from './InfoTable';

const connector = connect(
  () => {
    const getIsShowInfoModal = mkGetUIIsShowInfoModal();
    return state => ({
      isShowInfoModal: getIsShowInfoModal(state),
    });
  },
  {
    setShowInfoModal,
  },
  (stateProps, dispatchProps) => {
    const { isShowInfoModal } = stateProps;
    const { setShowInfoModal } = dispatchProps;
    return {
      isShowInfoModal,
      toggleInfo: () => setShowInfoModal(!isShowInfoModal),
    };
  },
);

export default connector(({ isShowInfoModal, toggleInfo }) => (
  <Modal isOpen={isShowInfoModal}
         toggle={toggleInfo}
         size='lg'
         className='infoModal'
  >
    <ModalHeader toggle={toggleInfo}>Information</ModalHeader>
    <ModalBody>
      <InfoTable/>
    </ModalBody>
    <ModalFooter>
      <Button color='light' onClick={toggleInfo}>Close</Button>
    </ModalFooter>
  </Modal>
));
