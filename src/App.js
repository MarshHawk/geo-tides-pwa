import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import GoogleMapReact from 'google-map-react';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import './App.css';
import Demo from './components/demo';

const latMarks = [
  {
    value: -90,
    label: '-90°',
  },
  {
    value: 90,
    label: '90°',
  }
]

function valuetext(value) {
  return `${value}°`;
}

const lonMarks = [
  {
    value: -180,
    label: '-180°',
  },
  {
    value: 180,
    label: '180°',
  },
];

function valueLabelFormat(x) {
  return `${Math.round(x)}°`;
}

function App() {
  const [currentLocation, setCurrentLocation] = useState({latitude: 43, longitude:-71});
  const geolocationSupported = window.navigator || window.navigator.geolocation
  let geoLocationProvider;
  if (geolocationSupported) window.navigator.geolocation.getCurrentPosition((s) => console.log(s))
  return (
    <React.Fragment >
    <div style={{ height: '50vh', width: '80%' }}>
    <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyB_YKziL1G-oY53F7WjK4AGqETIaSJMYkA" }}
          defaultCenter={{
            lat: currentLocation.latitude,
            lng: currentLocation.longitude
          }}
          defaultZoom={11}
        ></GoogleMapReact>
    <Container maxWidth="sm">
      
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
            onChange={(e) => setCurrentLocation({...currentLocation, latitude: e.target.value})}
            autoComplete="latitude"
          />
      <Slider
        defaultValue={currentLocation.latitude}
        getAriaValueText={valuetext}
        aria-labelledby="lat-slider"
        step={.001}
        marks={latMarks}
        valueLabelDisplay="on"
        valueLabelFormat={valueLabelFormat}
        min={-90}
        max={90}
      />
          <Typography id="lon-slider" gutterBottom>
        Longitude
      </Typography>
      <Slider
        defaultValue={88}
        getAriaValueText={valuetext}
        aria-labelledby="lon-slider"
        step={.001}
        marks={lonMarks}
        valueLabelDisplay="on"
        valueLabelFormat={valueLabelFormat}
        min={-180}
        max={180}
      />
    </Container>
    <Button variant="contained" color="primary" onClick={() => console.log("button click")}>
                    {'Search'}
                  </Button>
    </div>
    </React.Fragment>
  );
}

export default App;
