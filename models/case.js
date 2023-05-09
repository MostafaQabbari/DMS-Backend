const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  firstName: { type: String },
  surName: { type: String},
  phoneNumber: { type: String },
  dateOfMAIM: { type: Date },
  location: { type: String },

});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
