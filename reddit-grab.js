var express = require('express'),
    app = express(),
    request = require('request'),
    http = require('http'),
    process = require('process'),
    moment = require('moment'),
    prettyjson = require('prettyjson'),
    q = require('q');

var subreddits = ['webdev', 'opensource', 'frontend', 'programming'];
var arg2 = process.argv[2] || 'all';
var subListDefault = setSubListDefault(arg2);
var subList = process.argv[4] || subListDefault;
var limit = process.argv[3] || 2;
var timePeriod = "day";
var timeOccurred = "";
var pocketArray = [];

function setSubListDefault (arg2) {
    if (arg2 == 'each') {
        return subreddits;
    }
    else {
        return subreddits.toString().replace(/,/g, '+');
    }
}

var buildRequestUrl = function (arg2, subList, timePeriod, limit) {
    if (arg2 == 'each') {
        subList.forEach(function (element) {
            var url = "http://www.reddit.com/r/" + element + "/top.json?t="+ timePeriod +"&limit=" + limit + "";
            request(url, returnAll);
        });
    } else {
        var url = "http://www.reddit.com/r/" + subList + "/top.json?t="+ timePeriod +"&limit=" + limit + "";
        request(url, returnAll);
    }
};

//var someOptions = {
//    url: "http://www.reddit.com/r/" + subreddits[i] + "/top.json?t="+ timePeriod +"&limit=" + limit + ""
//};

function returnAll(error, response, body) {
    if (!error && response.statusCode == 200) {
        var resp = JSON.parse(body);
        var respLength = resp.data.children.length;

        var pocketObject = {};

        for (var i = 0; i < respLength; i++) {
            var subredditData = "";
            var titleData = "";
            var linkData = "";
            var tagData = "";
            var timeData = "";
            var dateMonth = moment().format('MMMM');
            var dateYear = moment().format('YYYY');

            linkData = resp.data.children[i].data.url;
            var goodLink = linkData.indexOf("imgur");


            if (resp.data.children[i].kind !== "t3" || goodLink !== -1) {

                console.log('\nNumber: ', i+1);
                console.log('This is not a pocketable object');
                if (goodLink > 0) {
                    console.log("Reason: We ain't got time for IMGUR BS.");
                }

            } else {
                subredditData = resp.data.children[i].data.subreddit;
                titleData = resp.data.children[i].data.title;
                linkData = resp.data.children[i].data.url;
                tagData = "r/"+subredditData + ", " + dateYear + " " + dateMonth;
                timeData = moment().format('X');

                console.log('\nNumber: ', i+1);
                console.log('Subreddit: ', subredditData);
                console.log('Title: ', titleData);
                console.log('Link: ', linkData);
                console.log('Tags: ', tagData);

                pocketObject.item_id = timeOccurred+"_"+i+1;
                pocketObject.tags = tagData;
                pocketObject.time = timeData;
                pocketObject.title = titleData;
                pocketObject.url = linkData;

                pocketArray.push(pocketObject);
            }
        }

        console.log("\n" + pocketArray.length + " items packaged in array");
        console.log('\nLast execution: ' + moment().format("MM/D, h:mm:ss a"));
        console.log('=======================================================\n');

    } else {
        console.log('Error: ', error);
    }
}

function sendToPocket(error, response, body){

}

buildRequestUrl(arg2, subList, timePeriod, limit);

//var action = "add";
//var
//var pocketUrl = "https://getpocket.com/v3/send?actions=%5B%7B%22action%22%3A%22archive%22%2C%22time%22%3A1348853312%2C%22item_id%22%3A229279689%7D%5D&access_token=[ACCESS_TOKEN]&consumer_key=[CONSUMER_KEY]";
//
//request(, sendToPocket);