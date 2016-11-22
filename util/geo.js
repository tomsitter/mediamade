var Profile = require('../models/profile');
var NodeGeocoder = require('node-geocoder');

var options = {
    //provider: 'geocodio',
    //apiKey: '84b82c8e258d65467ad8b8b428c8bed225c648e'

    provider: 'locationiq',
    apiKey: '13326ba91c097ffc756d'
};

var geocoder = NodeGeocoder(options);

function getLonLat(geoLoc) {
    if (geoLoc) {
        return [geoLoc.longitude, geoLoc.latitude];
    } else {
        return [];
    }
}

function getPrettyAddress(geoLoc) {
    return geoLoc.streetName + ", " + geoLoc.city + " " + geoLoc.state + ", " + geoLoc.county;
}

module.exports = {
    getCoords: function(addr, done) {
        geocoder.geocode(addr, function (err, res) {
            if (err) {
                console.log("Error! " + err.message);
                return done({"error": err.message});
            }
            else {
                console.log('Got coords!');
                var coords = getLonLat(res[0]);
                return done(coords);
            }
        });
    }
    //         .then(function (res) {
    //             console.log('Done geocoding!');
    //             var coords = getLonLat(res[0]);
    //             console.log('Coords: ' + coords);
    //             return done(coords);
    //         })
    //         .catch(function (err) {
    //             console.log("Error geocoding: " + err.message);
    //             return done({"error": "Could not geocode address"});
    //         });
    // },

};


        // var limit = req.query.limit || 10;
        //
        // // get the max distance or set it to 8 kilometers
        // var maxDistance = req.query.distance || 8;
        //
        // // we need to convert the distance to radians
        // // the raduis of Earth is approximately 6371 kilometers
        // maxDistance /= 6371;
        //
        // // get coordinates [ <longitude> , <latitude> ]
        // var coords = [];
        // coords[0] = req.query.longitude;
        // coords[1] = req.query.latitude;
        //
        // // find a location
        // Profile.location.find({
        //     geo: {
        //         $near: coords,
        //         $maxDistance: maxDistance
        //     }
        // }).limit(limit).exec(function (err, locations) {
        //     if (err) {
        //         return res.json(500, err);
        //     }
        //
        //     res.json(200, locations);
        // });

