export default async function(opts){

    let query = `query fetchMoreVideos($slugs: [ID!]!, $cursor: String!) {
        videoFilter(slugs: $slugs) {
            videos(first: 100, after: $cursor) {
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

    //{"operationName":"fetchMoreVideos","variables":{"slugs":["bill-johnson","recent"],"cursor":"MTY="},"query":"

    let body = JSON.stringify({
        query,
        operationName: "fetchMoreVideos",
        variables: {slugs: [opts.slug], cursor: opts.cursor}
    });

    let res = await fetch("https://www.bethel.tv/graphql", {
        "credentials":"include",
        "headers":{
            'content-type': 'application/json',
            'accept': '*/*',
            'X-Csrf-Token': opts.csrf
        },
        "referrer":"https://www.bethel.tv/categories/last-week",
        "referrerPolicy":"no-referrer-when-downgrade",
        "body": body,
        "method":"POST",
        "mode":"cors"});


    let json = await res.json();
    videos = json.data.videoFilter.videos.edges;
    graph = json.data.videoFilter;

    return {videos, graph};

}