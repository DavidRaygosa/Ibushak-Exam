const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProjectSchema = Schema(
	{
        SellerID: String,
        SellerName: String,
        Marca: String,
        free_shipping: Boolean,
        logistic_type: String,
        seller_operation: String,
        condition: String,
        Prices: Array, 
        _id: false,
	});
module.exports = mongoose.model('MLDTOShort', ProjectSchema);