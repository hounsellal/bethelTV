const cheerio = require('react-native-cheerio');
import logout from './logout';

export default async function(cook = null) {
    //await logout();
    let response = await fetch("https://www.bethel.tv/discover", {credentials: 'include'});
    let data = await response.text();
    const $ = cheerio.load(data);
    let whatPage = $('meta[property="og:url"]').attr('content');
    let loggedIn = false;
    if(whatPage === "https://www.bethel.tv/discover") loggedIn = true;
    let csrfMeta = $('meta[name="csrf-token"]');
    let csrf = null;
    if(csrfMeta.length){
        csrf = csrfMeta.attr('content');
    }

    const things = [
        {title: "Last Week at Bethel", slug: "last-week-at-bethel", viewAll: "/categories/last-week", viewAllSubVideos: true},
        {title: "Worship Sets", slug: "worship-sets", viewAll: "/categories/worship-sets", viewAllSubVideos: true},
        {title: 'Categories', slug: 'categories', viewAll: "https://www.bethel.tv/categories", viewAllSubVideos: false}, 
        {title: "Topics", slug: 'topics', viewAll: "https://www.bethel.tv/topics", viewAllSubVideos: false}, 
        {title: 'Events', slug: 'events', viewAll: "https://www.bethel.tv/events", viewAllSubVideos: false}, 
        {title: 'Speakers', slug: 'speakers', viewAll: "https://www.bethel.tv/speakers", viewAllSubVideos: false}, 
        {title: 'Worship Leaders', slug: 'worship-leaders', viewAll: "https://www.bethel.tv/worship-leaders", viewAllSubVideos: false}, 
        {title: 'Classes', slug: 'classes', viewAll: "https://www.bethel.tv/classes", viewAllSubVideos: false}, 
        {title: 'Originals', slug: 'shows', viewAll: "https://www.bethel.tv/shows", viewAllSubVideos: false}
    ];
    
    let videos = {};

    if(loggedIn){
        for(let thing of things){
            let json = $('#' + thing.slug).children('div').attr('data-react-props');
            videos[thing.title] = {
                videos: json ? JSON.parse(json) : null,
                viewAll: thing.viewAll,
                viewAllSubVideos: thing.viewAllSubVideos
            }
        }
    }
    
    let ret = {loggedIn, csrf, videos};
    return ret;
}