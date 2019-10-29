export const defaultState = {
    response: {
      requestLat: 42.336164,
      requestLon: -71.001141,
      extremes: [],
      error: false,
      searchPending: false,
      defaultSearchPending: false,
      searchSuccess: false,
      isDefault: false
    },
    search: {
      latitude: 42.336164,
      longitude: -71.001141,
      searchUpdate: true,
      isValid: true,
      isValidLocations: { latitude: true, longitude: true }
    },
    userPref: {
      useGeolocation: false,
      //useLocationTracking: false,
      //disableCache: false,
      preferredTimezone: "EST"
    },
    ui: {
      openModal: false,
      lonMarks: [
        {
          value: -180,
          label: "-180°"
        },
        {
          value: 180,
          label: "180°"
        }
      ],
      latMarks: [
        {
          value: -90,
          label: "-90°"
        },
        {
          value: 90,
          label: "90°"
        }
      ]
    }
  };