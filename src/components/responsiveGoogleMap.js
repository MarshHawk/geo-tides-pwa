import React from "react";
import GoogleMapReact from "google-map-react";
import {
    SearchedLocationIcon,
    SearchLocationIcon,
    ObservationLocationIcon
  } from "./icons";

export const ResponsiveGoogleMap = ({ searchLocation, responseLocation }) => (
  <div style={{ height: "24em", width: "100%" }}>
    <GoogleMapReact
      bootstrapURLKeys={{
        key: "AIzaSyB_YKziL1G-oY53F7WjK4AGqETIaSJMYkA"
      }}
      center={
        responseLocation.searchSuccess
          ? [responseLocation.responseLat, responseLocation.responseLon]
          : [searchLocation.latitude, searchLocation.longitude]
      }
      defaultZoom={7}
    >
      <ObservationLocationIcon
        lat={responseLocation.responseLat}
        lng={responseLocation.responseLon}
        text="Tidal observation nearest to searched location"
        responseLocation={responseLocation}
      />
      <SearchLocationIcon
        lat={searchLocation.latitude}
        lng={searchLocation.longitude}
        text="Location to search"
        responseLocation={responseLocation}
        searchLocation={searchLocation}
      />
      <SearchedLocationIcon
        lat={responseLocation.requestLat}
        lng={responseLocation.requestLon}
        text="Most recent searched location"
        responseLocation={responseLocation}
      />
    </GoogleMapReact>
  </div>
);
