import { storageService } from './storage-service.js'

export const mapService = {
    getPlaces,
    addPlace,
    deletePlace
}

let gPlaces;

function getPlaces() {
    var places = storageService.loadFromStorage('places');
    if (!places) places = [];
    gPlaces = places;
    _updateStorage();
    return places;
}

function addPlace(placeName, lat, lng) {
    gPlaces.push({ placeName, lat, lng, id: lat + lng });
    _updateStorage();
}

function deletePlace(id) {
    var deleteIdx = gPlaces.findIndex(place => place.id === id);
    gPlaces.splice(deleteIdx, 1);
    _updateStorage();
}

function _updateStorage() {
    storageService.saveToStorage('places', gPlaces);
}