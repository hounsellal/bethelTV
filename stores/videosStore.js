import { observable, action } from 'mobx';
import getSubVideos from './bethelWebStore/getSubVideos';
import getViewAllVideos from './bethelWebStore/getViewAllVideos';
import getMoreSubVideos from './bethelWebStore/getMoreSubVideos';
import searchVideos from './bethelWebStore/search';

class VideosStore {

    @observable videos = {};
    @observable currentList = [];
    @observable loadingCurrentList = false;
    @observable addingToCurrentList = false;
    @observable currentSlug = null;
    @observable currentCSRF = null;
    @observable endCursor = null;
    @observable hasNextPage = false;
    @observable title = '';
    @observable viewAllList = [];
    @observable viewAllTitle = '';
    @observable searchPage = 1;
    @observable searchTerms = null;

    @action resetCurrentList = () => {
        this.currentList = [];
        this.currentSlug = null;
        this.currentCSRF = null;
        this.endCursor = null;
        this.hasNextPage = false;
        this.searchPage = 1;
        this.searchTerms = null;
        this.title = '';
    }

    @action setVideos = (vids) => {
        this.videos = vids;
    }

    @action addToList = async () => {

        if(this.currentSlug){
            this.addingToCurrentList = true;
            let res = await getMoreSubVideos({slug: this.currentSlug, cursor: this.currentCursor, csrf: this.currentCSRF});
            this.currentList = [...this.currentList, ...res.videos];
            this.currentCursor = res.graph.videos.pageInfo.endCursor;
            this.hasNextPage = res.graph.videos.pageInfo.hasNextPage;
            this.addingToCurrentList = false;
        }

        else if(this.searchPage > 1){
            this.addingToCurrentList = true;
            let res = await searchVideos(this.searchTerms, this.searchPage);
            this.currentList = [...this.currentList, ...res.videos];
            this.hasNextPage = res.hasMore;
            this.searchPage += 1;
            this.addingToCurrentList = false;
        }

    }

    @action setTitle = (title) => {
        this.title = title;
    }

    @action replaceList = (vids) => {
        this.currentList = vids;
        this.currentCursor = null;
    }

    @action populateCurrentList = async (url) => {
        this.loadingCurrentList = true;
        this.resetCurrentList();
        let res = await getSubVideos(url);
        this.currentList = res.videos;
        if(res.graph){
            this.currentCursor = res.graph.videos.pageInfo.endCursor;
            this.hasNextPage = res.graph.videos.pageInfo.hasNextPage;
        }
        if(res.slug) this.currentSlug = res.slug;
        if(res.csrf) this.currentCSRF = res.csrf;
        this.loadingCurrentList = false;
        
    }

    @action populateViewAllList = async (url) => {
        this.viewAllList = [];
        let res = await getViewAllVideos(url);
        this.viewAllList = res;
    }

    @action setViewAllTitle = (title) => {
        this.viewAllTitle = title;
    }

    @action search = async (terms) => {
        this.resetCurrentList();
        this.searchTerms = terms;
        this.loadingCurrentList = true;
        let res = await searchVideos(this.searchTerms, this.searchPage);
        if(res.hasMore) {
            this.hasNextPage = true;
            this.searchPage += 1;
        }
        this.currentList = res.videos;
        this.loadingCurrentList = false;
    }

}

export default new VideosStore();
