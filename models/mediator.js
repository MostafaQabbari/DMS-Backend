const mongoose = require('mongoose');

const mediatorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  refreshToken: {
    type: String,
    default: null,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
  }
  
},
{
  timestamps: true,
}
);

mediatorSchema.virtual('company',{
  ref: 'company',
  localField: 'compadnyId',
  foreignField: '_id'
})

module.exports = mongoose.model('Mediator', mediatorSchema);