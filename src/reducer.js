const geolocationProvider = typeof window.navigator !== "undefined" &&
        window.navigator.geolocation

export function geolocation(state = {isSupported: geolocationProvider ? true: false, 
  geolocationProvider: geolocationProvider}, action) {
    switch (action.type) {
      default:
        return state;
    }
  }

export function search(state = {}, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
  
  export function current(state = {}, action) {
    switch (action.type) {
      default:
        return state;
    }
  }