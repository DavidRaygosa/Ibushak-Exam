// IMPORTS
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // FETCH

// MODELS
	const MLModel = require('../models/MLDTO.model');
    const MLModelShort = require('../models/MLDTOshort.model');
    const MLAttributesModel = require('../models/MLAttributes.model');

// ------------------------------------ FUNCTIONS -------------------------------------------------

// GET AND RETURN 'SELLER DATA' BY ID
const getSellerData = async(id) => {
    const seller = await fetch('https://api.mercadolibre.com/users/'+id);
    return seller.json();
};

// SET AND RETURN COMPLETE MODEL FUNCTION
const setCompleteData = (article, seller) => {
    let article_DTO = new MLModel();
    article_DTO.MeliID = article.id;
    article_DTO.SiteID = article.site_id;
    article_DTO.Title = article.title;
    article_DTO.SellerID = article.seller.id;
    article_DTO.SellerName = seller.nickname;
    article_DTO.Price = article.price
    article_DTO.Available_quantity = article.available_quantity;
    article_DTO.Link = article.permalink;
    article_DTO.SellerDirection = seller.address.city;
    article_DTO.Shipping.free_shipping = article.shipping.free_shipping;
    article_DTO.logistic_type = article.shipping.logistic_type;
    if(article.attributes){ // IF ARTICLE HAS ATTRIBUTES
        article.attributes.map(attribute =>{
            attribute_data = new MLAttributesModel();
            attribute_data.value_name = attribute.name;
            if(attribute.values){ // IF ATTRIBUTE HAS VALUES
                attribute.values.map(value =>{
                    attribute_data.values.id = value.id;
                    attribute_data.values.name = value.name;
                    attribute_data.values.struct = value.struct;
                    attribute_data.values.source = value.source;
                });
            }
            article_DTO.Attributes.push(attribute_data);
        });
    }
    return article_DTO;
};

// SET AND RETURN SHORT MODEL FUNCTION
const setShortData = (article, seller) => {
    let article_short = new MLModelShort();
    article_short.SellerID = article.seller.id;
    article_short.SellerName = seller.nickname;
    article_short.Marca = article.attributes[0].value_name;
    article_short.free_shipping = article.shipping.free_shipping;
    article_short.logistic_type = article.shipping.logistic_type;
    article_short.seller_operation = seller.address.city;
    article_short.condition = article.condition;
    article_short.Prices = article.prices.prices;
    return article_short;
};

// ------------------------------------ EXPORT FUNCTION -------------------------------------------------

var controller_ml = 
{
	getByPage: async(req, res) => {
        // REQ QUERIES
        let page = req.params.page;
        let isShort = req.query.short;

        // 'MercadoLibre' API ONLY ALLOWS 1000 PAGES WHITOUT AN 'access_token'
        if(page<=1000){
            let API_url = ['https://api.mercadolibre.com/sites/MLM/search?search_type=scan&category=MLM1055&sort=price_asc&offset='+page]; // API
            await Promise.all(API_url.map(url => fetch(url).then(res => res.json())))
            .then(async (response) => {
                data = response.flat();

                // PROMISE TO AWAIT SELLER DATA
                const Articles = await Promise.all(
                    data[0].results.map(async (article) =>{
                        let seller = await getSellerData(article.seller.id);
                        if(isShort) return setShortData(article, seller);
                        else return setCompleteData(article, seller);
                    })
                );

                // RETURN 'res' SUCCESSFULLY
                res.status(200).send(Articles); 
            });
        }else res.status(403).send({status:"Sin access_token la pagina maxima permitida es 1000"}); // RETURN FORBIDDEN IF 'page' IS GREATER THAN 1000 
	},

    getAll: async(req, res) => {
        // REQ QUERIES
        let isShort = req.query.short; // TO GET A SHORT MODEL
        let customList = req.query.articles; // CUSTOM ARTICLES LIST

        // VARS
        let Articles = [], page = 0, WantedArticles;

        // IF (CUSTOMLIST) SET VALUE; ELSE SET DEFAULT '1000' ARTICLES
        if(customList) WantedArticles = customList;
        else WantedArticles = 1000;

        // WHILE 'Articles' ARE LESS THAN 'WantedArticles' EXEC
        while (Articles.length<WantedArticles){
            let API_url = ['https://api.mercadolibre.com/sites/MLM/search?search_type=scan&category=MLM1055&sort=price_asc&offset='+page]; // API
            await Promise.all(API_url.map(url => fetch(url).then(res => res.json())))
            .then(async (response) => {
                data = response.flat();

                // PROMISE TO AWAIT SELLER DATA
                const ArticlesPromise = await Promise.all(
                    data[0].results.map(async (article) =>{
                        let seller = await getSellerData(article.seller.id); // GET SELLER DATA BY 'MercadoLibre' API
                        if(isShort) return setShortData(article, seller); // SET SHORT MODEL
                        else return setCompleteData(article, seller); // SET COMPLETE MODEL
                    })
                );
                ArticlesPromise.map(article => Articles.push(article));
                page++ // CHANGE API PAGE
            });
        };

        // RETURN 'res' SUCCESSFULLY
        res.status(200).send(Articles); 
    }
}

module.exports = controller_ml;