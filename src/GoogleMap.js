import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

// const { REACT_APP_GOOGLE_API_KEY } = process.env
// Google Maps api and Google Places api must be activated in the Google Cloud Platform
const REACT_APP_GOOGLE_API_KEY = 'bazzingaApiKey';

const style = {
  width: '100%',
  height: '100%',
};

const containerStyle = {
  position: 'relative',
  width: '600px',
  height: '400px',
};

const initialPosition = {
  lat: 51.165691,
  lng: 10.451526,
};

class OfficesGoogleMap extends Component {
  state = {
    position: initialPosition,
  };

  handleMarkerClick = () => {
    console.log('Marker has been clicked');
  };

  componentDidMount () {
    this.renderAutoComplete()
  }

  // componentDidUpdate(prevProps) {
  //   const { address } = this.props;
  //   if (address !== prevProps.address) {
  //     this.renderAutoComplete();
  //   }
  // }

  renderAutoComplete = () => {
    const { google } = this.props;
    if (!google) return;
    
    const { map } = this.googleMap;
    // const sydney = new google.maps.LatLng(-33.867, 151.195)
    // const map = new google.maps.Map(document.getElementById('map'), {
    //   center: sydney,
    //   zoom: 17,
    // })

    const request = {
      query: 'Theatinerstraße 8 80333 München',
      fields: ['name', 'geometry'],
    };
    const service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results[0]);
        const googleCoords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        map.setCenter(googleCoords);
        map.setZoom(17);
        this.setState({ position: googleCoords });
      }
    });
  };

  render() {
    const { position } = this.state;
    return (
      <div className='ims-offices__google-map-container'>
        <Map
          ref={(ref) => {
            this.googleMap = ref;
          }}
          google={this.props.google}
          style={style}
          containerStyle={containerStyle}
          initialCenter={position}
          zoom={6}
          // onClick={this.onMapClicked}
        >
          {position !== initialPosition ? (
            <Marker
              position={position}
              onClick={this.handleMarkerClick}
              name='Current location'
            />
          ) : null}

          {/* <InfoWindow onClose={onInfoWindowClose}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow> */}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: REACT_APP_GOOGLE_API_KEY,
  language: 'ru',
  libraries: ['places'],
})(OfficesGoogleMap);
