
export const mkGetApiHeaders = () => state => state.app.apiHeaders;
export const getApiHeaders = mkGetApiHeaders();

export const mkGetApiBaseURL = () => state => state.app.apiBaseURL;
export const getApiBaseURL = mkGetApiBaseURL();

export const mkGetIsTesting = () => state => state.app.isTesting;
export const getIsTesting = mkGetIsTesting();

export const mkGetIsDevel = () => state => state.app.isDevel;
export const getIsDevel = mkGetIsDevel();

export const mkGetDocumentationURL = () => state => state.app.apiBaseURL;
export const getDocumentationURL = mkGetDocumentationURL();
