const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
const { renderStars, randomQuestionType, eq } = require('./controllers/helper')

//Cau hinh static folder:
app.use(express.static(__dirname + '/public'));

//Cau hinh express handlebars:
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        createPagination,
        renderStars,
        randomQuestionType,
        eq,
    }
}));
app.set('view engine', 'hbs');

//Cau hinh body-parser:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes:
app.use('/', require('./routes/indexRouter'));
app.use('/vocabulary', require('./routes/vocabularyRouter'));
app.use('/examination', require('./routes/examinationRouter'));
// Khoi dong server:
app.listen(port, () => {
    console.log(`App is running on port http://localhost:${port}`);
});