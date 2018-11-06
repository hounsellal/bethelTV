const cheerio = require('react-native-cheerio');

export default async function(url){
    if(url.startsWith("/")) url = "https://www.bethel.tv" + url;
    let res = await fetch(url, {
        credentials: 'include'
    });

    let text = await res.text();

    const $ = cheerio.load(text);

    let apiLink = $('div[id="livestream-api-link"]');
    if(apiLink.length){
        
        let link = apiLink.attr('data-value');
        return link;
    } else return false;

}