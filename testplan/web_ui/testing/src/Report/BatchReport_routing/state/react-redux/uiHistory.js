import { createHashHistory } from 'history';

// many different components take the history object as input so it
// should be in an independent module.
const uiHistory = createHashHistory({ basename: '/' });
export default uiHistory;
