const controller = {};
const models = require('../models');
const { Op } = require("sequelize");

controller.getData = async (req, res, next) => {
    let categories = await models.Category.findAll({
        include: models.Vocabulary
    });
    res.locals.categories = categories;

    let certificates = await models.Certificate.findAll();
    res.locals.certificates = certificates;

    next();
}

controller.showHomePage = async (req, res) => {

    res.render('index');
}
controller.showListPage = async (req, res) => {
    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let certificate = isNaN(req.query.certificate) ? 0 : parseInt(req.query.certificate);
    let keyword = req.query.keyword || '';
    let sort = ['hardest', 'newest', 'oldest'].includes(req.query.sort) ? req.query.sort : 'hardest';

    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));

    let options = {
        include: models.Media,
        where: {}
    }

    if (category > 0) {
        options.where.categoryId = category;
    }
    if (certificate > 0) {
        options.where.certificateId = certificate;
    }
    if (keyword.trim() !== '') {
        options.where.word = {
            [Op.iLike]: `%${keyword}%`
        }

    }


    // Hanlde Sort 
    switch (sort) {
        case 'hardest':
            options.order = [['difficulty', 'DESC']];
            break;
        case 'newest':
            options.order = [['createdAt', 'DESC']];
            break;
        default:
            options.order = [['createdAt', 'ASC']];
    }
    res.locals.sort = sort;

    const limit = 10
    options.limit = limit
    options.offset = (page - 1) * limit

    res.locals.originalUrl = removeParam('sort', req.originalUrl);
    if (Object.keys(req.query).length === 0) {
        res.locals.originalUrl = res.locals.originalUrl + '?';
    }

    let { rows, count } = await models.Vocabulary.findAndCountAll(options);

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: Object.assign({}, req.query)
    }

    let vocabularies = rows;
    res.locals.vocabularies = vocabularies;
    res.render('vocabulary-list');
}

controller.showDetailPage = async (req, res) => {
    let id = req.params.id
    let detailVocabulary = await models.Vocabulary.findOne({
        include: [models.Media, models.Example, models.Category, models.Certificate],
        where: { id }
    });


    let relatedVocabularies = await models.Vocabulary.findAll({
        where: {
            id: { [Op.ne]: id },
        },
        include: models.Media,
        order: [['createdAt', 'ASC']],
        limit: 3,
    });
    res.locals.relatedVocabularies = relatedVocabularies;

    res.locals.detailVocabulary = detailVocabulary;
    res.render('vocabulary-detail');
}

controller.showCreatePage = async (req, res) => {
    let categories = await models.Category.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']]
    });
    res.locals.categories = categories;

    let certificates = await models.Certificate.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['id', 'ASC']]
    });
    res.locals.certificates = certificates;
    res.render('vocabulary-create');
}

controller.handleUpdateState = async (req, res) => {
    let id = req.params.id
    let { isLearned } = req.body
    try {
        await models.Vocabulary.update(
            { isLearned: isLearned },
            { where: { id } }
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

controller.showUpdatePage = async (req, res) => {
    let id = req.params.id
    let categories = await models.Category.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']]
    });


    let certificates = await models.Certificate.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['id', 'ASC']]
    });


    let detailVocabulary = await models.Vocabulary.findOne({
        include: [models.Media, models.Example, models.Category, models.Certificate],
        where: { id }
    });

    res.locals.categories = categories;
    res.locals.certificates = certificates;
    res.locals.detailVocabulary = detailVocabulary;
    res.render('vocabulary-update');
}
controller.showMultiChoicePage = async (req, res) => {
    res.locals.examinationtype = 'MultiChoice';

    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
    let options = {
        include: models.Media,
        where: {}
    }
    let limit = 5
    options.limit = limit
    options.offset = (page - 1) * limit


    let allVocabularies = await models.Vocabulary.findAll()

    let { rows, count } = await models.Vocabulary.findAndCountAll(options);

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: Object.assign({}, req.query)
    }

    let vocabularies = rows;

    let mixedVocabulary = shuffleArray(vocabularies)
    //Create test set:
    for (let i = 0; i < mixedVocabulary.length; i++) {
        let coreItem = {
            id: 0,
            word: mixedVocabulary[i].word,
        }
        let newset = [coreItem, ...getRandomItems(allVocabularies, mixedVocabulary[i].word, 3)]
        newset = shuffleArray(newset);
        mixedVocabulary[i].testResultSet = newset
    }

    res.locals.MultiChoiceExam = mixedVocabulary;
    res.render('vocabulary-examination');
}

controller.showFillBlankPage = async (req, res) => {
    res.locals.examinationtype = 'FillBlank';

    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
    let options = {
        include: models.Media,
        where: {}
    }
    let limit = 5
    options.limit = limit
    options.offset = (page - 1) * limit



    let { rows, count } = await models.Vocabulary.findAndCountAll(options);

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: Object.assign({}, req.query)
    }

    let vocabularies = rows;
    let mixedVocabulary = shuffleArray(vocabularies)

    res.locals.FillBlankExam = mixedVocabulary;
    res.render('vocabulary-examination');
}

//Ham ho tro
function getRandomItems(array, excludeItem, count) {
    const sortArray = []
    let id = 1
    array.forEach(element => {
        sortArray.push({ word: element.word, id: id });
        id++
    });


    const filtered = sortArray.filter(item => item.word != excludeItem);
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, count);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

module.exports = controller;