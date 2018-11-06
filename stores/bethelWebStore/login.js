import checkLoggedIn from './checkLoggedIn';
const qs = require('querystring');
const cheerio = require('react-native-cheerio');

export default async function(opts){

    if(!opts.csrf){
        let res = await fetch("https://www.bethel.tv/sign-in", {credentials: 'include'});
        let data = await res.text();
        const $ = cheerio.load(data);
        let csrfMeta = $('meta[name="csrf-token"]');
        if(csrfMeta.length){
            opts.csrf = csrfMeta.attr('content');
        } else {
            return {loggedIn: false}
        }
    }

    const data = qs.stringify({
        'user[email]': opts.email,
        'user[password]': opts.password,
        authenticity_token: opts.csrf,
        'user[remember_me]': 1,
        utf8: '✓'
    });

    let response = await fetch("https://www.bethel.tv/sign-in", {credentials: 'include', method: 'POST', body: data, 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    let checkResult = await checkLoggedIn();

    return checkResult;

}