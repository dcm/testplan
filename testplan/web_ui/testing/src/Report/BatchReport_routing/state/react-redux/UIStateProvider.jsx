import React from 'react';
import { compose } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import Provider from 'react-redux/es/components/Provider';
import immerStructure from '../../../../state/struct/immerStructure';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
import store from './store';
import uiHistory from './uiHistory';

const __DEV__ = 'production' !== process.env.NODE_ENV;

export const ConnectedRouter = createConnectedRouter(immerStructure);

class CatchError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errName: '<none>',
      errMsg: '<none>',
      errMiscEntries: {},
    };
  }
  static getDerivedStateFromError(error) {
    const { name: errName, message: errMsg } = error,
      nonMiscProps = ['name', 'message'];
    let errMiscEntries = '';
    try {
      errMiscEntries = compose(
        Object.fromEntries,
        filtered => filtered.map(entry => [entry[0], entry[1].value]),
        entries => entries.filter(entry => !nonMiscProps.includes(entry[0])),
        Object.entries,
        Object.getOwnPropertyDescriptors(error),
      );
      // errMiscEntries =
      //   Object.fromEntries(
      //   Object.entries(
      //     Object.getOwnPropertyDescriptors(error)
      //   ).filter(entry => !nonMiscProps.includes(entry[0]))
      //     .map(entry => [entry[0], entry[1].value])
      // );
    } catch(err2) { console.error(err2); }
    return { hasError: true, errName, errMsg, errMiscEntries };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      if(__DEV__) {
        const headline = `A ${this.state.errName} was thrown` + (
          this.props.level ? ` from the ${this.props.level} level:` : ':'
        );
        const preBlocks = Array.isArray(this.state.errMiscEntries) ? (
          this.state.errMiscEntries.map(([attr, val], idx) => (
            <div key={`${idx}`}>
              <h3>{attr}</h3>
              <pre>{val}</pre>
            </div>
          ))
        ) : null;
        return (
          <>
            <h1>{headline}</h1>
            <h2>{this.state.errMsg}</h2>
            {preBlocks}
          </>
        );
      }
      return (
        <h2>An unexpected error occurred. Please try refreshing the page.</h2>
      );
    }
    return this.props.children;
  }
}

// https://github.com/supasate/connected-react-router/blob/master/FAQ.md#how-to-stop-initial-location-change
export default ({ children }) => (
  <CatchError level='store provider'>
    <Provider store={store}>
      <CatchError level='router'>
        <ConnectedRouter history={uiHistory}>
          <CatchError level='UI'>
            {children}
          </CatchError>
        </ConnectedRouter>
      </CatchError>
    </Provider>
  </CatchError>
);
