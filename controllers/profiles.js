// API for the profile model

// exports.remove = function(model, _primarycontactnumber, response) {
//     console.log('Deleting contact with primary number: ' + _primarycontactnumber);
//     model.findOne(
//         {primarycontactnumber: _primarycontactnumber},
//         function(error, data) {
//         }
//     );
// };
var geo = require('../util/geo.js');

function geocode(model, userId, address, res) {
    geo.getCoords(address, function (coords) {
        if ('error' in coords) {
            handleError(res, coords.error, "Failed to geocode address", 500);
        }
        model.update({user_id: userId}, {$set: {'location.geo': coords}})
            .then(function () {
                console.log("Updated geolocation to: " + JSON.stringify(coords));
            })
            .catch(function (err) {
                handleError(res, err.message, "Failed to geolocate address");
            });
    });
}

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

exports.update = function(model, userId, reqBody, res) {
    model.findOne({user_id: userId}, function(err, profile) {
        if (err) {
            handleError(res, err.message, "Failed to update user profile", 500);
        } else if (!profile) {
            handleError(res, "No profile found", "Failed to update user profile", 404);
        } else {
            if (!reqBody.name) {
                handleError(res, "Invalid profile", "Must provide a name", 400);
            }
            if (!userId) {
                handleError(res, "Invalid User ID", "Something wrong with token", 500);
            }

            profile.name = reqBody.name;
            profile.description = reqBody.description || '';
            var address = reqBody.address || '';
            profile.location = {address: address};
            profile.services = reqBody.services || [];
            profile.tags = reqBody.tags || [];
            profile.hourly_rate = reqBody.hourly_rate || '';

            profile.save()
                .then(function () {
                    res.status(200).json(profile);
                    geocode(model, userId, address, res);
                }).catch(function (err) {
                    handleError(res, err.message, "Failed to save new profile");
                });
        }
    });
};

exports.create = function(model, userId, reqBody, res) {

    if (!reqBody.name) {
        handleError(res, "Invalid profile", "Must provide a name", 400);
    }

    if (!userId) {
        handleError(res, "Invalid User ID", "Something wrong with token", 500);
    }

    model.findOne({user_id: userId}, function(err, profile) {
        if (err) handleError(res, err.message, "Failed to create profile", 500);

        var newProfile = {
            name: reqBody.name,
            client_type : reqBody.client_type || "",
            user_id : userId,
            description : reqBody.description || "",
            location : {address: reqBody.address || ""},
            services : reqBody.services || [],
            tags : reqBody.tags || [],
            hourly_rate : reqBody.hourly_rate || ""
        };

        if (profile) {
            model.update({_id: profile.id}, newProfile)
                .then(function(createdProfile) {
                    res.status(200).json(createdProfile);
                    if (reqBody.address !== newProfile.address) {
                        geocode(model, userId, reqBody.address, res);
                    }
                })
                .catch(function(err) {
                    handleError(res, err.message, "Failed to update profile", 500);
                });
        } else {
            model.create(newProfile)
                .then(function(createdProfile) {
                    res.status(201).json(createdProfile);
                    geocode(model, userId, reqBody.address, res);
                })
                .catch(function(err) {
                    handleError(res, err.message, "Failed to create profile", 500);
                });
        }
    });

};
//
// exports.findByNumber = function(model, _primarycontactnumber, response) {
//     model.findOne({primarycontactnumber: _primarycontactnumber}, function(error, result) {
//         if (error) {
//             console.error(error);
//             response.writeHead(500, {'Content-Type': 'text/plain'});
//             response.end('Internal Server Error');
//             return;
//         } else {
//             if (!result) {
//                 if (response != null) {
//                     response.writeHead(404, {'Content-Type': 'text/plain'});
//                     response.end('Not Found');
//                 }
//                 return;
//             }
//
//             if (response != null) {
//                 response.setHeader('Content-Type', 'application/json');
//                 response.send(result);
//             }
//             console.log(result);
//         }
//     });
// };
//
// exports.list = function(model, response) {
//     model.find({}, function(error, result) {
//         if (error) {
//             console.error(error);
//             return null
//         }
//         if (response != null) {
//             response.setHeader('Content-Type', 'application/json');
//             response.end(JSON.stringify(result));
//         }
//         return JSON.stringify(result);
//     });
// };
//
// exports.query_by_args = function(model, args, response) {
//
//     model.find(args, function(error, result) {
//         if (error) {
//             console.error(error);
//             response.writeHead(500, {'Content-Type': 'text/plain'});
//             response.end('Internal server error');
//             return;
//         } else {
//             if (!result) {
//                 if (response != null) {
//                     response.writeHead(404, {'Content-Type': 'text/plain'});
//                     response.end('Not Found');
//                 }
//                 return;
//             }
//             if (response != null) {
//                 response.setHeader('Content-Type', 'application/json');
//                 response.send(result);
//             }
//         }
//     });
// };
//
//
// exports.updateImage = function(gfs, request, response) {
//     var _primarycontactnumber = request.params.primarycontactnumber;
//     console.log('Updating image for primary contact number: ' + _primarycontactnumber);
//     request.pipe(gfs.createWriteStream({
//         _id: _primarycontactnumber,
//         filename: 'image',
//         mode: 'w'
//     }));
//     response.send("Successfully uploaded image from primary contact number: " + _primarycontactnumber);
// };
//
// exports.getImage = function(gfs, _primarycontactnumber, response) {
//     console.log('Requesting image for primary contact number: ' + _primarycontactnumber);
//     var imageStream = gfs.createReadStream({
//         _id: _primarycontactnumber,
//         filename: 'image',
//         mode: 'r'
//     });
//
//     imageStream.on('error', function(error) {
//         response.send('404', 'Not found');
//         return;
//     });
//
//     response.setHeader('Content-Type', 'image/jpeg');
//     imageStream.pipe(response);
// };
//
//
// exports.deleteImage = function(gfs, _primarycontactnumber, response) {
//     console.log('Deleting image for primary contact number: ' + _primarycontactnumber);
//     gfs.exist({_id: _primarycontactnumber}, function(error, found) {
//         if (found) {
//             console.log('Found image for primary contact number: ' + _primarycontactnumber);
//             gfs.remove({ _id: _primarycontactnumber }, function(error) {
//                 if (error) {
//                     console.log(error);
//                 }
//                 response.send('Successfully deleted image for primary contact number: ' + _primarycontactnumber);
//             });
//         }
//     });
// };
//
// exports.paginate = function(model, request, response) {
//     model.paginate(request.body,
//         {"page": request.query.page,
//         "limit": request.query.limit},
//         function(error, result) {
//             if (error) {
//                 console.error(error);
//                 response.writeHead(500, {'Content-Type': 'text/plain'});
//                 response.end('Internal server error');
//                 return;
//             }
//             response.json({
//                 object: 'contacts',
//                 page_count: result.page,
//                 search_params: request.body,
//                 result: result.docs
//             });
//         }
//     );
// };
// //
//
// function toContact(body, Contact) {
//     return new Contact(
//     {
//         firstname: body.firstname,
//         lastname: body.lastname,
//         title: body.title,
//         company: body.company,
//         jobtitle: body.jobtitle,
//         primarycontactnumber: body.primarycontactnumber,
//         primaryemailaddress: body.primaryemailaddress,
//         emailaddresses: body.emailaddresses,
//         groups: body.groups,
//         othercontactnumbers: body.othercontactnumbers
//     });
// }