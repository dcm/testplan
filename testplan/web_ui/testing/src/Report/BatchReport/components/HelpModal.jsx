import React from 'react';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import Modal from 'reactstrap/lib/Modal';
import Button from 'reactstrap/lib/Button';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux/es/redux';

import { actionTypes, actionCreators } from '../state';

const { APP_BATCHREPORT_SHOW_HELP_MODAL } = actionTypes;
const connector = connect(
  state => ({
    isShowHelpModal: state[APP_BATCHREPORT_SHOW_HELP_MODAL],
  }),
  dispatch => bindActionCreators({
    setShowHelpModal: actionCreators.setAppBatchReportShowHelpModal,
  }, dispatch),
);

/**
 * Return the help modal.
 * @returns {React.FunctionComponentElement}
 */
export default connector(({ isShowHelpModal, setShowHelpModal }) => {
  const toggle = () => setShowHelpModal(!isShowHelpModal);
  return (
    <Modal isOpen={isShowHelpModal} toggle={toggle} className='HelpModal'>
      <ModalHeader toggle={toggle}>Help</ModalHeader>
      <ModalBody>
        This is filter box help!
      </ModalBody>
      <ModalFooter>
        <Button color='light' onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
});
