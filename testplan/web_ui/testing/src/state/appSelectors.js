
export const mkGetApiHeaders = () => st => st.app.apiHeaders;
export const getApiHeaders = mkGetApiHeaders();

export const mkGetApiBaseURL = () => st => st.app.apiBaseURL;

export const mkGetIsTesting = () => st => st.app.isTesting;
export const getIsTesting = mkGetIsTesting();

export const mkGetIsDevel = () => st => st.app.isDevel;
export const getIsDevel = mkGetIsDevel();

export const mkGetDocumentationURL = () => st => st.app.apiBaseURL;
