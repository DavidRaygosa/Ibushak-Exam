const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProjectSchema = Schema(
	{
        MeliID: String,
        SiteID: String,
        Title: String,
        SellerID: String,
        SellerName: String,
        Price: Number,
        Available_quantity: Number,
        Link: String,
        SellerDirection: String,
        Shipping: {
                free_shipping: Boolean,
                logistic_type: String,
                _id: false
        },
        Attributes: [
                {
                        value_name: String,
                        values: {
                                id: Number,
                                name: String,
                                struct: String,
                                source: Number,
                                _id: false,
                        },
                        _id: false
                },
        ],
        _id: false,
	});
module.exports = mongoose.model('MLDTO', ProjectSchema);