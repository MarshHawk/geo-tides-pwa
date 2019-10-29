import { API } from "aws-amplify";

export function searchTides(currentSearch, dispatch) {
    dispatch({ type: "SEARCH_PENDING" });
    return API.get(
      "tidesapi",
      `/tides/${currentSearch.latitude}-${currentSearch.longitude}`
    ).then(res => {
      if (!res.error) {
        dispatch({ type: "SEARCH_SUCCESS", payload: res.tides });
        return;
      }
      dispatch({ type: "SEARCH_ERROR", payload: res.error });
    });
    //todo: error handling
  }
