import React from "react";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import moment from 'moment-timezone';

export const TidesTable = ({ responseLocation, userPrefs }) => (
  <React.Fragment>
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      align="center"
      gutterBottom
    >
      {"Predicted Tidal Extremes"}
    </Typography>
    {responseLocation.searchSuccess && (
      <React.Fragment>
        <Typography component="h4" gutterBottom>
          <LocationOnIcon
            color="primary"
            text={"Tidal observation nearest to searched location"}
          />
          {`Nearest Data center location: Lat° ${responseLocation.responseLat}° Lon°: ${responseLocation.responseLon}°`}
        </Typography>
        <Typography component="h4" gutterBottom>
          <NotListedLocationIcon
            color="primary"
            text="Most recent searched location"
          />
          {`Current search location: Lat: ${responseLocation.requestLat}° Lon: ${responseLocation.requestLon}°`}
        </Typography>
      </React.Fragment>
    )}
    <Table size="small" align="center">
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Timezone</TableCell>
          <TableCell>Height</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {responseLocation.extremes.map(x => (
          <TableRow key={x.dt}>
            <TableCell>{x.type}</TableCell>
            <TableCell>{moment.unix(x.dt).tz(userPrefs.preferredTimezone).format("dddd, MMMM Do YYYY, h:mm:ss a")}</TableCell>
            <TableCell>{userPrefs.preferredTimezone}</TableCell>
            <TableCell>{x.height + " meters"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </React.Fragment>
);
