const {default: axios} = require('axios');
const series = require('../series.json')
const seasons = require('../seasons.json')
const episodes = require('../episodes.json')

exports.homePage = (req, res) => {
    return res.render('index');
};

exports.detailsPage = (req, res) => {
    return res.render('details');
};

exports.searchPage = (req, res) => {
    return res.render('search');
};

exports.apiSeries = (req, res) => {
    let results = [];
    let querySeriesName = req.query['name'];
    if(querySeriesName){
        for(let tvSeries of series){
            if(tvSeries.name == querySeriesName) {
                results.push(tvSeries);
            }
        };
        res.json(results)
    };
    res.json(series)
};

exports.apiSeriesSort = (req, res) => {
    series.sort(function(firstValue, secondValue) {
        return [firstValue.rating] - [secondValue.rating]
    })
    res.json(series)
}

exports.apiSeriesId = (req, res) => {
    let results = [];
    let querySeriesId = req.query['id'];
    if(querySeriesId){
        for(let tvSeries of series){
            if(tvSeries.id == querySeriesId) {
                results.push(tvSeries);
            }
        };
        res.json(results)
    };
    res.json(series)
};

exports.apiSeriesSeason = (req, res) => {
    let results = []
    let querySeriesId = req.query['id'];
    if(querySeriesId){
        for(let season of seasons){
            if(season.id == querySeriesId) {
                results.push(season);
            }
        };
        res.json(results)
    }
    res.json(seasons)
}

exports.apiSeriesEpisode = (req, res) => {
    let results = [];
    let querySeasonId = req.query['seasonid'];
    if(querySeasonId) {
        for(let episode of episodes){
            if(episode.seasonId == querySeasonId) {
                results.push(episode);
            }
        }
        res.json(results)
    }
    res.json(episodes)
}