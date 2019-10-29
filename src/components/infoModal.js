import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import moment from 'moment-timezone';
import MenuItem from "@material-ui/core/MenuItem";
import { API, graphqlOperation } from "aws-amplify";
import localforage from "localforage";
import { updateUser } from "../graphql/mutations";
import {timezoneFallback} from '../model';

export function InfoModal({
  uiState,
  uiDispatch,
  userPrefState,
  userPrefDispatch
}) {
  const handleGeoChange = e => {
    userPrefDispatch({
      type: "UPDATE",
      payload: {
        property: "useGeolocation",
        value: e.target.checked
      }
    });
  };

  const handleTimezoneChange = e => {
    userPrefDispatch({
      type: "UPDATE",
      payload: {
        property: "preferredTimezone",
        value: e.target.value
      }
    });
  };
  const handleSave = e => {
    userPrefDispatch({
      type: "SAVE_PENDING"
    });
    async function saveUserPrefs() {
      await API.graphql(
        graphqlOperation(updateUser, {
          input: {
            id: userPrefState.id,
            name: userPrefState.name,
            useGeolocation: userPrefState.useGeolocation,
            preferredTimezone: userPrefState.preferredTimezone
          }
        })
      );
      await localforage.setItem(`tidalextremist${userPrefState.name}`, {
        ...userPrefState,
        userSaveSuccess: false
      });

      userPrefDispatch({
        type: "SAVE_SUCCESS"
      });
    }
    saveUserPrefs();
  };

  return (
    <Dialog
      open={uiState.openModal}
      onClose={() => uiDispatch({ type: "TOGGLE_OPEN_MODAL" })}
    >
      <DialogTitle variant="h6" color="primary" align="center">
        About This Site
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This site allows users to authenticate and search high and low tides
          for any location. It uses the World Tides API (www.worldtide.info) for
          tidal data. If the searched location is not within one degree of
          latitude or longitude from an observation station, an error alert will
          display. The location of the observation station for the most recent
          search, the actual searched location, and the location to be searched are
          represented on the map with pins. The app can also store user
          preferences. Currently supported preferences are whether
          to use your current location as the initial search parameter and the
          preferred timezone for displaying the times of the tides. These are
          configured in the form below:
        </DialogContentText>
        {!userPrefState.savePending && (
          <React.Fragment>
            <Typography
              align="center"
              variant="h6"
              color="primary"
              component="h4"
              gutterBottom
            >
              {"User Preferences"}
            </Typography>
            <Table size="small" align="center">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Use Geolocation For Default Search</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={userPrefState.useGeolocation}
                      onChange={handleGeoChange}
                      value="useGeolocation"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Preferred Display Timezone</TableCell>
                  <TableCell>
                    <Select
                      value={timezoneFallback(userPrefState)}
                      onChange={handleTimezoneChange}
                      autoWidth
                    >
                      {moment.tz.names().map((n,i) => <MenuItem key={i} value={n}>{n}</MenuItem>)}
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => uiDispatch({ type: "TOGGLE_OPEN_MODAL" })}
          color="primary"
        >
          Exit
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
