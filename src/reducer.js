export function searchReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.payload.property]: action.payload.value,
        searchUpdate: true,
        isValid: true,
        isValidLocations: {
          ...state.isValidLocations,
          [action.payload.property]: true
        }
      };
    case "UPDATE_MANY":
      return {
        ...state,
        ...action.payload,
        searchUpdate: true,
        isValid: true,
        isValidLocations: { latitude: true, longitude: true }
      };
    case "UPDATE_ERROR":
      return {
        ...state,
        [action.payload.property]: action.payload.value,
        searchUpdate: false,
        isValid: false,
        isValidLocations: {
          ...state.isValidLocations,
          [action.payload.property]: false
        }
      };
    default:
      throw new Error();
  }
}

export function responseReducer(state, action) {
  switch (action.type) {
    case "SEARCH_PENDING":
      return { ...state, searchPending: true };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        ...action.payload,
        searchPending: false,
        searchSuccess: true
      };
    case "SEARCH_ERROR":
      return {
        ...state,
        error: true,
        errorMessage: action.payload.message,
        searchPending: false
      };
    case "CLEAR_ERROR":
      return { ...state, error: false, searchPending: false };
    default:
      throw new Error();
  }
}

export function uiReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_OPEN_MODAL":
      return { ...state, openModal: !state.openModal };
    default:
      return state;
  }
}

export function userPrefReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.payload.property]: action.payload.value };
    case "UPDATE_ALL":
      return { ...action.payload };
    case "SAVE_PENDING":
      return { ...state, savePending: true };
    case "SAVE_SUCCESS":
      return { ...state, savePending: false, userSaveSuccess:true };
    case "SAVE_ERROR":
      return state;
    default:
      return state;
  }
}
