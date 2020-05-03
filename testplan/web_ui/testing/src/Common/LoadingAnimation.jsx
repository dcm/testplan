import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';

// Used to center spinner on page,suggested by
// github.com/davidhu2000/react-spinners/issues/53#issuecomment-472369554
const divStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const defaultProps = {
  height: 15,
  width: 5,
  radius: 10,
};

export default props => (
  <div style={divStyle}>
    <FadeLoader { ...{ ...defaultProps, ...props } } />
  </div>
);
