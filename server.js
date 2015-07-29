var express = require('express'),
    app = express(),
    request = require('request'),
    http = require('http'),
    process = require('process'),
    moment = require('moment'),
    prettyjson = require('prettyjson');

var subreddits = ['programming', 'webdev', 'opensource', 'frontend'];
var subList = process.argv[2] || subreddits.toString().replace(/,/g, '+');
var limit = 5;
var timePeriod = "day";
var pocketArray = [];


var options = {
    url: "http://www.reddit.com/r/" + subList + "/top.json?t="+ timePeriod +"&limit=" + limit + ""
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('=======================================================');

        var resp = JSON.parse(body);
        var respLength = resp.data.children.length;

        var pocketObject = {};

        for (var i = 0; i < respLength; i++) {
            var subredditData = "";
            var titleData = "";
            var linkData = "";
            var tagData = "";
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

                console.log('\nNumber: ', i+1);
                console.log('Subreddit: ', subredditData);
                console.log('Title: ', titleData);
                console.log('Link: ', linkData);
                console.log('Tags: ', tagData);

                pocketObject.number = i+1;
                pocketObject.subreddit = subredditData;
                pocketObject.title = titleData;
                pocketObject.link = linkData;
                pocketObject.tags = tagData;

                pocketArray.push(pocketObject);

                //Todo: package this block of info and ship it over to Pocket
            }
        }

        console.log("\n" + pocketArray.length + " items packaged in array");
        console.log("\n" + options.url);
        console.log('\nLast execution: ' + moment().format("MM/D, h:mm:ss a"));
        console.log('=======================================================\n');

    } else {
        console.log('Error: ', error);
    }
}

request(options, callback);

