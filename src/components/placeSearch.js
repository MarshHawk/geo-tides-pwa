import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => {
  return (
    <React.Fragment>
      <TextField
        label="Search Places"
        value={getInputProps().value || ""}
        onChange={e => getInputProps().onChange(e)}
      />
      {suggestions.map(suggestion => (
        <MenuItem
          key={suggestion.id}
          component="div"
          onClick={e => getSuggestionItemProps(suggestion).onClick(e)}
        >
          {suggestion.description}
        </MenuItem>
      ))}
    </React.Fragment>
  );
};

export class PlaceSearch extends React.Component {
  constructor(props) {
    super(props);
    this.searchLocationDispatch = props.setSearchLocation;
    this.state = { address: "" };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.searchLocationDispatch({
          type: "UPDATE_MANY",
          payload: {
            latitude: latLng.lat,
            longitude: latLng.lng
          }
        });
      })
      .catch(error => console.error("Error", error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address || ""}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {renderFunc}
      </PlacesAutocomplete>
    );
  }
}
