process.env.NODE_ENV = "test";

var mockery = require("mockery");
var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var geo = require('../util/geo.js');

describe("Geo", function() {

    it('should geocode an address', function(done) {
       geo.getCoords('49 Amroth Ave, Toronto, ON, Canada', function(coords) {
           coords[0].should.be.closeTo(-79.3, 0.1);
           coords[1].should.be.closeTo(43.7, 0.1);
           done();
       });
    });

});
