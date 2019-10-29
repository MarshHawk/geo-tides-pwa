import React from "react";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";

export const ObservationLocationIcon = ({ text, responseLocation }) =>
  responseLocation.searchSuccess ? (
    <LocationOnIcon color="primary" text={text} />
  ) : (
    <React.Fragment />
  );

export const SearchLocationIcon = ({ responseLocation, searchLocation }) =>
  !responseLocation.searchSuccess ||
  (searchLocation.searchUpdate &&
    (responseLocation.requestLat !== searchLocation.latitude ||
      responseLocation.requestLon !== searchLocation.longitude)) ? (
    <EditLocationIcon color="primary" text="Location to search" />
  ) : (
    <React.Fragment />
  );

export const SearchedLocationIcon = ({ responseLocation }) =>
  responseLocation.searchSuccess ? (
    <NotListedLocationIcon
      color="primary"
      text="Most recent searched location"
    />
  ) : (
    <React.Fragment />
  );


