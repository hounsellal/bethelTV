//<div data-react-class="WatchVideoGrid" data-react-props has it
//div data-react-class="VideoFilter" data-react-props has the filters for the content
const cheerio = require('react-native-cheerio');

export default async function(url){

    let videos = [];
    let graph = null;
    let slug = null;
    let first = await fetch("https://www.bethel.tv" + url, {credentials: 'include'});
    let data = await first.text();
    const $ = cheerio.load(data);
    let csrf = $('meta[name="csrf-token"]').attr('content');

    let videoFilter = $("div[data-react-class='VideoFilter']");
    if(videoFilter.length){
        let filterArgs = JSON.parse(videoFilter.attr('data-react-props'));

        let query = `query videoFilter($slugs: [ID!]!, $type: String) {
            videoFilter(slugs: $slugs, type: $type) {
                slug
                name
                headerImageUrl
                subfilters {
                    edges {
                        node {
                            slug
                            name
                        }
                    }
                }
                videos(first: 100) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
                            id
                            name
                            url
                            publicDatetime
                            thumbnail {
                                url
                            }
                            defaultThumbnail {
                                url
                            }
                            authors {
                                edges {
                                    node {
                                        thumbnail {
                                            url
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`;


        let body = {
            query,
            operationName: "videoFilter",
            variables: {slugs: [filterArgs.filter.slug]}
        };

        if(filterArgs.filter.type) {
            body.variables.type = filterArgs.filter.type;
        }

        let bodyString = JSON.stringify(body);


        let res = await fetch("https://www.bethel.tv/graphql", {
            "credentials":"include",
            "headers":{
                'content-type': 'application/json',
                'accept': '*/*',
                'X-Csrf-Token': csrf
            },
            "referrer":"https://www.bethel.tv/categories/last-week",
            "referrerPolicy":"no-referrer-when-downgrade",
            "body": bodyString,
            "method":"POST",
            "mode":"cors"});

        let json = await res.json();
        videos = json.data.videoFilter.videos.edges;
        graph = json.data.videoFilter;
        slug = filterArgs.filter.slug;

    } else {

        let videoGrid = $("div[data-react-class='WatchVideoGrid']");
        if(videoGrid.length){
            let vids = JSON.parse(videoGrid.attr('data-react-props'));

            let tempVids = [];
            for(let section of vids.playlists){
                for(let item of section.items){
                    tempVids.push({
                        node: {
                            thumbnail: {url: item.thumbnail_url},
                            name: item.title + " (" + section.title + ")",
                            url: item.path                        }                        
                    })
                }
            }

            videos = tempVids;

        }

    }

    return {videos, graph, slug, csrf};

    

    

    
}