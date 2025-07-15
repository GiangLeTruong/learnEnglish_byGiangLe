const exphbs = require('express-handlebars');
function renderStars(difficulty) {
    let color;
    let difByWord;
    switch (difficulty) {
        case 1: color = '#FFD700'; difByWord = 'Rất dễ'; break;       // vàng
        case 2: color = '#FFA500'; difByWord = 'Dễ'; break;       // vàng cam
        case 3: color = '#FF8C00'; difByWord = 'Trung bình'; break;       // cam đậm
        case 4: color = '#FF4500'; difByWord = 'Khó'; break;       // đỏ cam
        case 5: color = '#FF0000'; difByWord = 'Rất khó'; break;       // đỏ
        default: color = '#ccc';
    }

    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= difficulty) {
            stars += `<span style="color: ${color}; font-size: 24px;">★</span>`;
        } else {
            stars += `<span style="color: #ccc; font-size: 24px;">★</span>`;
        }
    }
    stars += `<p style="color: ${color}; font-size: 18px;">(${difByWord})</p>`
    return stars;
}

function randomQuestionType(vocabulary) {
    const word = vocabulary.word;
    const types = [
        vocabulary.Medium?.imagePath,
        vocabulary.definition,
        vocabulary.meaning_vi,
        vocabulary.pronunciation
    ];

    const randomIndex = Math.floor(Math.random() * types.length);
    const randomValue = types[randomIndex];

    let html;

    switch (randomIndex) {
        case 0:
            html = `
                <h5 class="card-title">Choose a word that matches the picture below:</h5>
                <img src="${randomValue}" class="img-fluid" style="max-width: 500px;" alt="${word}">
            `;
            break;
        case 1:
            html = `<h5 class="card-title">Choose a word that means: "${randomValue}"</h5>`;
            break;
        case 2:
            html = `<h5 class="card-title">Choose a word that means "${randomValue}" in Vietnamese</h5>`;
            break;
        case 3:
            html = `<h5 class="card-title">Choose a word with pronunciation: /${randomValue}/</h5>`;
            break;
        default:
            html = `<h5 class="card-title">Choose a word that means: "${randomValue}"</h5>`;
            break;
    }

    return html;
}

function eq(a, b) {
    return a == b
}
module.exports = { renderStars, randomQuestionType, eq };