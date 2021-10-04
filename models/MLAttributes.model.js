const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProjectSchema = Schema(
	{
        value_name: String,
        values: {
                id: Number,
                name: String,
                struct: String,
                source: Number,
                _id: false,
        },
        _id: false,
	});
module.exports = mongoose.model('MLAttributes', ProjectSchema);