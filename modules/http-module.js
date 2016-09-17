function handle_GET_request(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Get action was requested');
}

function handle_bad_request(request, response) {
    response.writeHead(400, {
        'Content-Type': 'text/plain'
    });
    response.end('Bad request');
}

exports.handle_request = function (request, response) {
    switch (request.method) {
        case 'GET':
            handle_GET_request(request, response);
            break;
        default:
            handle_bad_request(request, response);
            break;
    }
}