const Joi = require('joi');
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  image: {
    type: String,
    required: false,
  }
});

const Member = mongoose.model('Members', memberSchema);

function validateMember(member) {
  const schema = {
    firstName: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(member, schema);
}

exports.memberSchema = memberSchema;
exports.Member = Member; 
exports.validate = validateMember;