const cheerio = require('react-native-cheerio');

export default async function(){
    const accountPage = await fetch("https://www.bethel.tv/account/profile", {
        credentials: 'include'
    });

    const text = await accountPage.text();
    const $ = cheerio.load(text);

    const attrs = [{firstName: 'user_user_profile_attributes_first_name'}, {lastName: 'user_user_profile_attributes_last_name'}, {screenName: 'user_user_profile_attributes_screen_name'}, {email: 'user_email'}];

    let ret = {};

    for(let attr of attrs){
        let thing = $('#' + Object.values(attr)[0]).val();
        ret[Object.keys(attr)[0]] = thing;
    }

    return ret;
}