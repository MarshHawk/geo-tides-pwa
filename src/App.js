import React, { useState, useReducer, Component } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import GoogleMapReact from "google-map-react";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { API } from "aws-amplify";
//import "./App.css";
import MapMarkerQuestion from "mdi-material-ui/MapMarkerQuestion";
import { withAuthenticator } from "aws-amplify-react";
import Demo from "./components/demo";

const useStyles = makeStyles(theme => ({
  root: {
    //background: "rgb(2,0,36)",
    //background:
    //"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(180,180,193,1) 35%, rgba(45,60,62,1) 87%)",
    //height: "100%"
    marginTop: theme.spacing(1)
  },
  appBar: {
    position: "relative"
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flex: 1
  },
  mainFeaturedPost: {
    position: "relative",
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4)
  },
  errorSnackbar: {
    backgroundColor: `${theme.palette.error.dark}`,
    margin: theme.spacing(1)
  },
  paper1: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const latMarks = [
  {
    value: -90,
    label: "-90°"
  },
  {
    value: 90,
    label: "90°"
  }
];

function valuetext(value) {
  return `${value}°`;
}

const lonMarks = [
  {
    value: -180,
    label: "-180°"
  },
  {
    value: 180,
    label: "180°"
  }
];

function valueLabelFormat(x) {
  return `${Math.round(x)}°`;
}

class SearchResult extends Component {
  state = {};
  async componentDidMount() {
    const data = await API.get("tidesapi", `/tides/43--71`);
    console.log(data);
    this.setState({ ...this.state, data });
  }

  render() {
    return <div>Nothing to sing!</div>;
  }
}

const defaultState = {
  current: {
    latitude: 43,
    longitude: -71
  },
  response: {
    requestLat: 43,
    requestLon: -71,
    extremes: [],
    error: false,
    searchPending: false,
    defaultSearchPending: false,
    searchSuccess: false,
    isDefault: false
  },
  search: { latitude: 43, longitude: -71 },
  userPrefs: {
    defaultZoom: 10,
    useCurrentLocation: true,
    useLocationTracking: false,
    defaultLocation: false,
    cacheLastResponse: false,
    simulateResponseError: false,
    timezone: "NaN"
  },
  ui: {
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

function searchReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.payload.property]: action.payload.value };
    default:
      throw new Error();
  }
}

function responseReducer(state, action) {
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
      return { ...state, error: true, errorMessage: action.payload.message, searchPending: false };
    case "CLEAR_ERROR":
      
      return { ...state, error: false, searchPending: false };
    default:
      throw new Error();
  }
}

async function searchTides(currentSearch, dispatch) {
  dispatch({ type: "SEARCH_PENDING" });
  return API.get(
    "tidesapi",
    `/tides/${currentSearch.latitude}-${currentSearch.longitude}`
  ).then(res => {
    //TODO: lastSearched cache
    if (!res.error) {
      dispatch({ type: "SEARCH_SUCCESS", payload: res.tides });
      return;
    }
    dispatch({ type: "SEARCH_ERROR", payload: res.error });
  });
  //todo: error handling
}

const emptyRes = {
  extremes: []
};

const TidalObservationIcon = ({ text, responseLocation }) =>
  responseLocation.searchSuccess ? (
    <LocationOnIcon color="primary" text={text} />
  ) : (
    <React.Fragment />
  );

const TidalSearchIcons = ({ responseLocation, searchLocation }) =>
  responseLocation.searchSuccess ? (
    responseLocation.requestLat != searchLocation.latitude &&
    responseLocation.requestLon != searchLocation.longitude ? (
      <React.Fragment>
        <NotListedLocationIcon
          color="primary"
          lat={responseLocation.requestLat}
          lng={responseLocation.requestLon}
          text="Most recent searched location"
        />
        <EditLocationIcon
          color="primary"
          lat={searchLocation.latitude}
          lng={searchLocation.longitude}
          text="Location to search"
        />
      </React.Fragment>
    ) : (
      <NotListedLocationIcon
        color="primary"
        lat={responseLocation.requestLat}
        lng={responseLocation.requestLon}
        text="Most recent searched location"
      />
    )
  ) : (
    <EditLocationIcon
      color="primary"
      lat={searchLocation.latitude}
      lng={searchLocation.longitude}
      text="Location to search"
    />
  );

function App() {
  const classes = useStyles();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 43,
    longitude: -71
  });

  //const [searchResponse, setSearchResponse] = useState({});
  const [searchLocation, setSearchLocation] = useReducer(
    searchReducer,
    defaultState.search
  );

  const [responseLocation, setResponseLocation] = useReducer(
    responseReducer,
    defaultState.response
  );

  const geolocationSupported = window.navigator || window.navigator.geolocation;
  let geoLocationProvider;
  if (geolocationSupported)
    window.navigator.geolocation.getCurrentPosition(s => console.log(s));
  return (
    <React.Fragment>
      <CssBaseline />
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
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.root} component="main" maxWidth="xl">
        <Paper className={classes.mainFeaturedPost}>
          <Grid container>
            <Grid item sm>
              <div style={{ height: "24em", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyB_YKziL1G-oY53F7WjK4AGqETIaSJMYkA"
                  }}
                  center={
                    responseLocation.searchSuccess
                      ? [
                          responseLocation.responseLat,
                          responseLocation.responseLon
                        ]
                      : [searchLocation.latitude, searchLocation.longitude]
                  }
                  defaultZoom={10}
                >
                  <TidalObservationIcon
                    lat={responseLocation.responseLat}
                    lng={responseLocation.responseLon}
                    text="Tidal observation nearest to searched location"
                    responseLocation={responseLocation}
                  />
                </GoogleMapReact>
              </div>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper1}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                align="center"
                gutterBottom
              >
                {"Predicted Tidal extremes"}
              </Typography>
              <Typography component="h4" gutterBottom>
                {`Nearest Data center location: Lat° ${responseLocation.responseLat}° Lon°: ${responseLocation.responseLon}° icon`}
              </Typography>
              <Typography component="h4" gutterBottom>
                {`Current search location: Lat: ${responseLocation.requestLat}° Lon: ${responseLocation.requestLon}° icon`}
              </Typography>
              <Table size="small" align="center">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Height</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseLocation.extremes.map(x => (
                    <TableRow key={x.dt}>
                      <TableCell>{x.type}</TableCell>
                      <TableCell>{new Date(x.dt).toString()}</TableCell>
                      <TableCell>{x.height + " meters"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper1}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                align="center"
                gutterBottom
              >
                {"Search the Tides"}
              </Typography>
              <Snackbar open={responseLocation.error} autoHideDuration={6000} onClose={() =>
                        setResponseLocation({ type: "CLEAR_ERROR" })}>
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

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper1}>
                    <TextField
                      required
                      id="country"
                      name="latitude"
                      label="Latitude"
                      value={searchLocation.latitude}
                      onChange={e =>
                        setSearchLocation({
                          type: "UPDATE",
                          payload: {
                            property: "latitude",
                            value: e.target.value
                          }
                        })
                      }
                      helperText="Latitude of the location to search"
                      fullWidth
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper1}>
                    <TextField
                      required
                      id="country"
                      name="longitude"
                      label="Longitude"
                      value={searchLocation.longitude}
                      onChange={e =>
                        setSearchLocation({
                          type: "UPDATE",
                          payload: {
                            property: "longitude",
                            value: e.target.value
                          }
                        })
                      }
                      helperText="Longitude of the location to search"
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
        {/*<Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Select your location
          </Typography>
        </Box>
        <Typography id="lat-slider" gutterBottom>
          Latitude:
        </Typography>
        <TextField
          required
          id="country"
          name="latitude"
          label="latitude"
          value={currentLocation.latitude}
          onChange={e =>
            setCurrentLocation({
              ...currentLocation,
              latitude: e.target.value
            })
          }
          autoComplete="latitude"
        />
        <Slider
          defaultValue={currentLocation.latitude}
          getAriaValueText={valuetext}
          aria-labelledby="lat-slider"
          step={0.001}
          marks={latMarks}
          valueLabelDisplay="on"
          valueLabelFormat={valueLabelFormat}
          min={-90}
          max={90}
        />
        <Typography id="lon-slider" gutterBottom>
          Longitude
        </Typography>
        <TextField
          required
          id="longitude"
          name="longitude"
          label="longitude"
          value={currentLocation.longitude}
          onChange={e =>
            setCurrentLocation({
              ...currentLocation,
              longitude: e.target.value
            })
          }
          autoComplete="longitude"
        />
        <Slider
          defaultValue={currentLocation.longitude}
          getAriaValueText={valuetext}
          aria-labelledby="lon-slider"
          step={0.001}
          marks={lonMarks}
          valueLabelDisplay="on"
          valueLabelFormat={valueLabelFormat}
          min={-180}
          max={180}
        />
        </Container>*/}
      </Container>
    </React.Fragment>
  );
}

export default withAuthenticator(App);
