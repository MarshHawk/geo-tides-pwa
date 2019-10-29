import React, { useReducer, useEffect } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { InfoModal } from "./components/infoModal";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "./graphql/queries";
import {
  searchReducer,
  responseReducer,
  uiReducer,
  userPrefReducer
} from "./reducer";
import localforage from "localforage";
import { searchTides } from "./actions";
import { TidesTable } from "./components/tidesTable";
import { PlaceSearch } from "./components/placeSearch";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ResponsiveGoogleMap } from "./components/responsiveGoogleMap";

function App({ defaultState }) {
  const classes = useStyles();
  const [searchLocation, setSearchLocation] = useReducer(
    searchReducer,
    defaultState.search
  );

  const [responseLocation, setResponseLocation] = useReducer(
    responseReducer,
    defaultState.response
  );

  const [uiState, uiDispatch] = useReducer(uiReducer, defaultState.ui);

  const [userPref, userPrefDispatch] = useReducer(
    userPrefReducer,
    defaultState.userPref
  );

  useEffect(() => {
    //load the stored user preferences
    async function getUserPref() {
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: false
      });

      const cachedUserPref = await localforage.getItem(
        `tidalextremist${user.username}`
      );
      let result;
      if (!cachedUserPref) {
        const graphUsers = await API.graphql(
          graphqlOperation(listUsers, {
            filter: { name: { eq: user.username } }
          })
        );
        const item = graphUsers.data.listUsers.items[0];
        userPrefDispatch({ type: "UPDATE_ALL", payload: item });
        await localforage.setItem(`tidalextremist${user.username}`, item);
        result = item;
      } else {
        userPrefDispatch({ type: "UPDATE_ALL", payload: cachedUserPref });
        result = cachedUserPref;
      }
      if (
        result.useGeolocation &&
        (window.navigator || window.navigator.geolocation)
      ) {
        window.navigator.geolocation.getCurrentPosition(pos => {
          setSearchLocation({
            type: "UPDATE_MANY",
            payload: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          });
        });
      }
    }
    getUserPref();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <InfoModal
        uiState={uiState}
        uiDispatch={uiDispatch}
        userPrefState={userPref}
        userPrefDispatch={userPrefDispatch}
        searchDispatch={setSearchLocation}
      />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="primary"
            align="center"
            noWrap
            className={classes.toolbarTitle}
          >
            {"Search Predicted Tidal Extremes"}
          </Typography>
          <IconButton
            color="primary"
            onClick={() => uiDispatch({ type: "TOGGLE_OPEN_MODAL" })}
          >
            <InfoIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              Auth.signOut()
                .then(data => console.log(data))
                .catch(err => console.log(err))
            }
          >
            {"Sign-out"}
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.root} component="main" maxWidth="xl">
        <Paper className={classes.mainFeaturedPost}>
          <Grid container>
            <Grid item sm>
              <ResponsiveGoogleMap
                searchLocation={searchLocation}
                responseLocation={responseLocation}
              />
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <TidesTable
                responseLocation={responseLocation}
                userPrefs={userPref}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                align="center"
                gutterBottom
              >
                <EditLocationIcon color="primary" text="Location to search" />
                {" Search the Tides "}
                <EditLocationIcon color="primary" text="Location to search" />
              </Typography>
              <Snackbar
                open={responseLocation.error}
                autoHideDuration={6000}
                onClose={() => setResponseLocation({ type: "CLEAR_ERROR" })}
              >
                <SnackbarContent
                  className={classes.errorSnackbar}
                  aria-describedby="client-snackbar"
                  message={
                    <span id="client-snackbar" className={classes.message}>
                      {`Error with Search: ${responseLocation.errorMessage}.`}
                    </span>
                  }
                  action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={() =>
                        setResponseLocation({ type: "CLEAR_ERROR" })
                      }
                    >
                      <CloseIcon className={classes.icon} />
                    </IconButton>
                  ]}
                />
              </Snackbar>
              <Grid container spacing={8}>
                <Grid item xs={12} md={12}>
                  <Paper className={classes.paper}>
                    <PlaceSearch setSearchLocation={setSearchLocation} />
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6} md={6}>
                  <Paper className={classes.paper}>
                    <TextField
                      required
                      error={!searchLocation.isValidLocations["latitude"]}
                      id="country"
                      name="latitude"
                      label="Latitude"
                      value={searchLocation.latitude}
                      onChange={e =>
                        e.target.value.match(/^[-]?[0-9]+([.][0-9]+)?$/) &&
                        e.target.value >= -90 &&
                        e.target.value <= 90
                          ? setSearchLocation({
                              type: "UPDATE_MANY",
                              payload: {
                                latitude: e.target.value,
                                longitude: searchLocation.longitude
                              }
                            })
                          : setSearchLocation({
                              type: "UPDATE_ERROR",
                              payload: {
                                property: "latitude",
                                value: e.target.value
                              }
                            })
                      }
                      helperText={
                        searchLocation.isValid
                          ? "Latitude of the location to search"
                          : "Incorrect input format, must be a positive or negative decimal > -90 and < 90"
                      }
                      fullWidth
                    />
                  </Paper>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Paper className={classes.paper}>
                    <TextField
                      required
                      error={!searchLocation.isValidLocations["longitude"]}
                      id="country"
                      name="longitude"
                      label="Longitude"
                      value={searchLocation.longitude}
                      onChange={e =>
                        e.target.value.match(/^[-]?[0-9]+([.][0-9]+)?$/) &&
                        e.target.value >= -180 &&
                        e.target.value <= 180
                          ? setSearchLocation({
                              type: "UPDATE",
                              payload: {
                                property: "longitude",
                                value: e.target.value
                              }
                            })
                          : setSearchLocation({
                              type: "UPDATE_ERROR",
                              payload: {
                                property: "longitude",
                                value: e.target.value
                              }
                            })
                      }
                      helperText={
                        searchLocation.isValid
                          ? "Longitude of the location to search"
                          : "Incorrect input format, must be a positive or negative decimal > -90 and < 90"
                      }
                      fullWidth
                    />
                  </Paper>

                  <div className={classes.buttons}>
                    {responseLocation.searchPending ? (
                      <CircularProgress className={classes.button} />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={searchLocation.isValid ? false : true}
                        className={classes.button}
                        onClick={() =>
                          searchTides(searchLocation, setResponseLocation)
                        }
                      >
                        {"Search"}
                      </Button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

const themeCust = createMuiTheme();

export default withAuthenticator(App, {
  theme: {
    container: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    sectionHeader: {
      fontSize: 18,
      color: themeCust.palette.primary.main,
      textAlign: "center"
    },
    inputLabel: {
      fontSize: 14
    },
    a: {
      color: themeCust.palette.primary.light
    },
    button: {
      backgroundColor: themeCust.palette.primary.main,
      borderRadius: 4
    },
    toast: {
      backgroundColor: themeCust.palette.primary.main
    }
  }
});
