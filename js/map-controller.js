import {
    mapService
}

    from './services/map-service.js'

var gMap;

window.onload = () => {

    // document.querySelector('.btn').addEventListener('click', (ev) => {
    //     console.log('Aha!', ev.target);
    //     panTo(35.6895, 139.6917);
    // }) /// that button, not relevant for now

    initMap().then(() => {
        addMarker({
            lat: 32.0749831, lng: 34.9120554
        }

        );
    }

    ).catch(() => console.log('INIT MAP ERROR'));
}

function initMap(lat = 35.6804, lng = 139.7690) {
    return _connectGoogleApi().then(() => {

        //// locate map at user's position
        getPosition().then(pos => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;

            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: {
                    lat, lng
                }

                ,
                zoom: 15
            }

            );

            addMarker({
                lat: lat, lng: lng
            }

            );


            // gMap.addListener("click", (mapsMouseEvent) => {
            // let placeName = prompt('name of this place?')
            // let lat = mapsMouseEvent.latLng.lat();
            // let lng = mapsMouseEvent.latLng.lng();
            // mapService.addPlace(placeName, lat, lng);
            // renderLocations();
            // });
        }

        )
    }

    );
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    }

    );
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    }

    )
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDzJ7_PLAzauKMz0ArOzeM68DU9i85rXRo'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}