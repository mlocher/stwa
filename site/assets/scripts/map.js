import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoibWxvY2hlciIsImEiOiJjazVmcG40dnowdGgyM2xtY3RxY2k3dm5oIn0.d13YAqiMPFPRtYBK7hJLSQ';

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    // configuration for the base map
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [16.7776, 47.8650],
        zoom: 10
    });

    map.on('load', function () {
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            fitBoundsOptions: {
                maxZoom: map.getZoom()
            },
            trackUserLocation: true
        }));
        map.fitBounds([[16.6102,47.6294],[16.9419,47.99]]);
    });

    // STWA data & styling
    map.on('load', function() {
        var stwa = {
            url: 'https://stwa.locher.at/api/stwa',
            updater: null
        }

        map.addSource('stwa', {
            type: 'geojson',
            cluster: false,
            clusterRadius: 10,
            clusterMaxZoom: 12,
            data: stwa.url,
            attribution: 'STWA data &copy; <a href="https://www.lsz-b.at/">LSZ Burgenland</a>'
        });
        stwa.updater = window.setInterval(function() {
            map.getSource('stwa').setData(stwa.url);
        }, 60000);

        map.addLayer({
            'id': 'stwa-status',
            'type': 'circle',
            'source': 'stwa',
            'layout': {
                'circle-sort-key': ['case',
                    ['==', ['get', 'state'], 'gale_warning'], 8,
                    ['==', ['get', 'state'], 'advance_warning'], 4,
                    ['==', ['get', 'state'], 'standby'], 2,
                    ['==', ['get', 'state'], 'out_of_order'], 1,
                    0 ],
            },
            'paint': {
                'circle-color': ['case',
                    ['==', ['get', 'state'], 'standby'], '#28a745',
                    ['==', ['get', 'state'], 'advance_warning'], '#ffc107',
                    ['==', ['get', 'state'], 'gale_warning'], '#dc3545',
                    ['==', ['get', 'state'], 'out_of_order'], '#343a40',
                    '#f8f9fa' ],
                'circle-radius': 10
            }
        });

        map.addLayer({
            'id': 'stwa-marker',
            'type': 'symbol',
            'source': 'stwa',
            'layout': {
                'symbol-sort-key': ['case',
                    ['==', ['get', 'state'], 'gale_warning'], 0,
                    ['==', ['get', 'state'], 'advance_warning'], 1,
                    ['==', ['get', 'state'], 'standby'], 2,
                    ['==', ['get', 'state'], 'out_of_order'], 4,
                    8 ],
                'icon-image': 'monument-11',
                'icon-allow-overlap': true,
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Semibold'],
                'text-size': 9,
                'text-variable-anchor': ['left', 'right'],
                'text-justify': 'auto',
                'text-radial-offset': 1,
                'text-optional': true
            },
            'paint': {
                'icon-color': ['case',
                    ['==', ['get', 'state'], 'standby'], '#28a745',
                    ['==', ['get', 'state'], 'advance_warning'], '#ffc107',
                    ['==', ['get', 'state'], 'gale_warning'], '#dc3545',
                    ['==', ['get', 'state'], 'out_of_order'], '#343a40',
                    '#f8f9fa' ],
            }
        });
    });
}
