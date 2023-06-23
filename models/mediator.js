const mongoose = require('mongoose');

const mediatorSchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },

  refreshToken: { type: String, default: null, },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company"
  },
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
  Reminders:[{
  
    reminderTitle: { type: String },    
    startDate: { type: String }
  }]

},
  {
    timestamps: true,
  }
);

// mediatorSchema.virtual('companies',{
//   ref: 'company',
//   localField: 'companyId',
//   foreignField: '_id'
// })


module.exports = mongoose.model('Mediator', mediatorSchema);