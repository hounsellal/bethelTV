const cheerio = require('react-native-cheerio');
import moment from 'moment';

export default async function(searchString, page = 1){
    const res = await fetch("https://www.bethel.tv/search?page=" + page + "&per_page=100&query="+encodeURIComponent(searchString), {
        "credentials":"include",
    });

    const text = await res.text();

    const $ = cheerio.load(text);

    const cards = $(".card-grid__card");

    let videos = [];

    cards.each(function(){
        let card = $(this);
        let url = card.attr('href');
        let image = card.find('.card-grid__image').attr('data-src');
        let name = card.find('.card-caption__title').text().trim();
        let date = card.find('.card-caption__date').text().trim();
        //December 22, 2016
        let dt = moment(date, "MMMM D, YYYY") / 1000;
        videos.push({
            node: {url, name, publicDatetime: dt, thumbnail: {url: image}}
        });
    });

    const hasMoreDiv = $('.load-more');

    const hasMore = hasMoreDiv.length ? true : false;

    return {videos, hasMore};
}