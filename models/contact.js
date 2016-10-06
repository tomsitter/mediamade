var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var ContactSchema = new mongoose.Schema({  
  primarycontactnumber: {
    type: String, 
    index: {unique: true}
  }, 
  firstname: String, 
  lastname: String, 
  title: String, 
  company: String, 
  jobtitle: String, 
  othercontactnumbers: [String], 
  primaryemailaddress: String, 
  emailaddresses: [String], 
  groups: [String] 
});


ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', ContactSchema);