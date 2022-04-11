const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const sprintSchema = new mongoose.Schema({
    title: { type: String, required: true, min: 3, max: 128 },
    start: { type: Date, required: false },
    end: { type: Date, required: false },
    status: { type: String, required: true },
    project: { type: String, required: true },
    issues: { type: Array },
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