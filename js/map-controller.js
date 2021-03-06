import { mapService } from './services/map-service.js'
var gMap;

window.onload = () => {
    initMap();
    renderPlaces();
}

function initMap(lat = 35.6804, lng = 139.7690) {
    return _connectGoogleApi().then(() => {
        //// locate map at user's position
        getPosition().then(pos => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;

            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
            addMarker({ lat: lat, lng: lng });
            addMapMarkers();

            gMap.addListener("click", (mapsMouseEvent) => {
                let placeName = prompt('name of this place?')
                let lat = mapsMouseEvent.latLng.lat();
                let lng = mapsMouseEvent.latLng.lng();
                mapService.addPlace(placeName, lat, lng);
                renderPlaces();
                addMarker({ lat: lat, lng: lng });
            });
        })
    });
}


function renderPlaces() {
    let places = mapService.getPlaces()
    let strHTMLs;
    if (places.length) {
        strHTMLs = places.map(place => {
            return `<ul>
        <li>${place.placeName}</li>
        <button type="button" class="delete-btn" onclick="onDeletePlace('${place.id}')">X</button>
        <button type="button" class="goto-btn" onclick="panTo(${place.lat}, ${place.lng})">GO</button>
        </ul>`;
        }).join('');
    }
    else strHTMLs = 'add some places to your list!'
    document.querySelector('.saved-places').innerHTML = strHTMLs;
}

function addMapMarkers() {
    let places = mapService.getPlaces()
    places.forEach(place => {
        addMarker({ lat: place.lat, lng: place.lng });
    });
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

window.onDeletePlace = onDeletePlace;
function onDeletePlace(id) {
    mapService.deletePlace(id);
    renderPlaces();
}

window.panTo = panTo;
function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    const mapKey = 'AIzaSyDybHbeB5pYRgieSHfH9OiwV0U-ltDdNWs'
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
