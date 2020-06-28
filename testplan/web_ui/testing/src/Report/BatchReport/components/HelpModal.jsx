import React from 'react';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import Modal from 'reactstrap/lib/Modal';
import Button from 'reactstrap/lib/Button';
import connect from 'react-redux/es/connect/connect';
import { mkGetUIIsShowHelpModal } from '../state/uiSelectors';
import { setShowHelpModal } from '../state/uiActions';

const connector = connect(
  () => {
    const getIsShowHelpModal = mkGetUIIsShowHelpModal();
    return state => ({
      isShowHelpModal: getIsShowHelpModal(state),
    });
  },
  {
    setShowHelpModal,
  },
  (stateProps, dispatchProps) => {
    const { isShowHelpModal } = stateProps;
    const { setShowHelpModal } = dispatchProps;
    return {
      isShowHelpModal,
      toggleModal: () => setShowHelpModal(!isShowHelpModal),
    };
  },
);

export default connector(({ isShowHelpModal, toggleModal }) => (
  <Modal isOpen={isShowHelpModal} toggle={toggleModal} className='HelpModal'>
    <ModalHeader toggle={toggleModal}>Help</ModalHeader>
    <ModalBody>
      This is filter box help!
    </ModalBody>
    <ModalFooter>
      <Button color='light' onClick={toggleModal}>Close</Button>
    </ModalFooter>
  </Modal>
));
