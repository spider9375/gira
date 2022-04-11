const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 3, max: 128 },
  status: { type: String, required: true },
  addedBy: { type: String, required: true },
  sprint: { type: String, required: true },
  assignedTo: { type: String },
  project: { type: String, required: true },
  storyPoints: { type: Number, min: 0 },
  description: { type: String, max: 4096 },
  deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  })

issueSchema.method("toJSON", function() {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

issueSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}
issueSchema.set('autoIndex', true)

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;