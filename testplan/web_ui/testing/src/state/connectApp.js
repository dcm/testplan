import connect from 'react-redux/es/connect/connect';
import AppContext from './AppContext';

const connectApp = (mapStateToProps, mapDispatchToProps, mergeProps) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      context: AppContext
    },
  );

export default connectApp;
