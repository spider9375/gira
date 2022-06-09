const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const sprintSchema = new mongoose.Schema({
    title: { type: String, required: true, min: 3, max: 128 },
    isActive: { type: Boolean, required: true },
    project: { type: String, required: true },
    // issues: { type: Array },
    addedBy: {type: String, required: true, min: 24, max: 24 },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  })

sprintSchema.method("toJSON", function() {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

sprintSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}
sprintSchema.set('autoIndex', true)

const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;