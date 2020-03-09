var ApiError = require('./ApiError');
var i18n = require('i18n');


exports.checkExist = async (id, Model, extraQuery = {}, errorMessage = '') => {
    if (typeof extraQuery != 'object') {
        errorMessage = extraQuery;
        extraQuery = {};
    }
    if (validId(id)) {
        let model = await Model.findOne({ _id: id, ...extraQuery }).lean();
        if (model)
            return;
    }
    throw new ApiError(404, errorMessage || `${Model.modelName} Not Found`);
};

exports.checkLanguage = function checkLanguage( arModel, enModel , req) {
    var language = i18n.getLocale(req);
    try {
        if (language == 'ar'){
            return arModel;
        }
        else {
            return enModel;
        }
    } catch (error) {
        throw new ApiError(400, 'Can Not Set Language.');
    }
}

exports.checkExistThenGet = async (id, Model, findQuery = { populate: '', select: '' }, errorMessage = '') => {
    let populateQuery = findQuery.populate || '', selectQuery = findQuery.select || '';

    if (typeof findQuery != 'object') {
        errorMessage = findQuery;
        findQuery = {};
    } else {
        delete findQuery.populate;
        delete findQuery.select;
    }

    if (validId(id)) {
        let model = await Model.findOne({ _id: id, ...findQuery })
            .populate(populateQuery).select(selectQuery);
        if (model)
            return model;
    }

    throw new ApiError(404, errorMessage || `${Model.modelName} Not Found`);
};

exports.validId = id => isNumeric(id);
exports.validIds = ids => isArray(ids) && ids.every(id => validId(id));
exports.isNumeric = value => Number.isInteger(parseInt(value));
exports.isArray = values => Array.isArray(values);
exports.isImgUrl = value => /\.(jpeg|jpg|png|PNG|JPG|JPEG)$/.test(value);
exports.isLat = value => /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/.test(value);
exports.isLng = value => /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/.test(value);
exports.isYear = value => /^\d{4}$/.test(value);
exports.isInternationNo = value => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);