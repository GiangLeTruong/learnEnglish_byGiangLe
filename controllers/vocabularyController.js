const controller = {};
const models = require('../models');

controller.create = async (req, res) => {
    let vocabulary = {
        word: req.body.word,
        pronunciation: req.body.pronunciation,
        type: req.body.type,
        difficulty: req.body.difficulty,
        isLearned: req.body.isLearned == 'true' ? true : false,
        meaning_vi: req.body.meaning_vi,
        definition: req.body.definition,
        categoryId: isNaN(req.body.category) ? 0 : parseInt(req.body.category),
        certificateId: isNaN(req.body.certificate) ? 0 : parseInt(req.body.certificate)
    }
    const createdVocabulary = await models.Vocabulary.create(vocabulary);
    let examples = req.body['examples[]'];
    if (examples && examples.length > 0) {
        const exampleArray = Array.isArray(examples) ? examples : [examples];

        const exampleData = exampleArray.map(sentence => ({
            sentence,
            vocabularyId: createdVocabulary.id
        }));

        await models.Example.bulkCreate(exampleData);
    }

    let media = {
        imagePath: req.body.imagePath,
        audioPath: req.body.audioPath,
    }
    media.vocabularyId = createdVocabulary.id;
    await models.Media.create(media);
    res.redirect('/list');
}
controller.update = async (req, res) => {
    let id = req.params.id
    let vocabulary = {
        word: req.body.word,
        pronunciation: req.body.pronunciation,
        type: req.body.type,
        difficulty: req.body.difficulty,
        isLearned: req.body.isLearned == 'true' ? true : false,
        meaning_vi: req.body.meaning_vi,
        definition: req.body.definition,
        categoryId: req.body.category,
        certificateId: req.body.certificate
    }
    await models.Vocabulary.update(vocabulary, {
        where: { id }
    });
    // Update Examples
    let examples = req.body['examples[]'];

    if (examples && examples.length > 0) {
        const exampleArray = Array.isArray(examples) ? examples : [examples];
        console.log(exampleArray)
        await models.Example.destroy({ where: { vocabularyId: id } });

        const exampleData = exampleArray.map(sentence => ({
            sentence,
            vocabularyId: id
        }));

        await models.Example.bulkCreate(exampleData);
    }

    // Update or Create Media
    await models.Media.upsert({
        imagePath: req.body.imagePath || null,
        audioPath: req.body.audioPath || null,
        id
    });


    res.redirect(`/update/${id}`);
}

controller.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await models.Vocabulary.destroy({ where: { id } });
        await models.Example.destroy({ where: { vocabularyId: id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
module.exports = controller;