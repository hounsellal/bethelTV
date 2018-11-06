const cheerio = require('react-native-cheerio');

export default async function(url){
    const page = await fetch(url, {
        credentials: 'include'
    });

    const text = await page.text();

    const $ = cheerio.load(text);

    const cards = $('.card');

    let videos = [];

    cards.each(function(card){
        let image = $(this).find('.card__image').attr('data-src');
        let name = $(this).find('.card-caption__title').text();
        let href = $(this).attr('href');
        videos.push({
            image, name, href
        });
    });

    return videos;
}