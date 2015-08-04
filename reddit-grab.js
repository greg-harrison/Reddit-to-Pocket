// Todo:
//  Need to fix the issue where using the Each parameter sends 40 duped items to pocket, and causes the android app to crash ;D
//  Clean up unused variables/libraries
//  Need to figure out why I'm getting "{action_results: [ false ], status: 1}" when I run '$node reddit-grab all 1'
//  Research the best way to convert this to a web app.

var express = require('express'),
    config = require('./config'),
    app = express(),
    request = require('request'),
    http = require('http'),
    process = require('process'),
    GetPocket = require('node-getpocket'),
    moment = require('moment'),
    prettyjson = require('prettyjson'),
    q = require('q');

var subreddits = ['webdev', 'opensource', 'frontend', 'programming', 'javascript'];
var arg2 = process.argv[2] || 'all';
var subListDefault = setSubListDefault(arg2);
var subList = process.argv[4] || subListDefault;
var limit = process.argv[3] || 2;
var pocketArray = [];

function setSubListDefault (arg2) {
    if (arg2 == 'each') {
        return subreddits;
    }
    else {
        return subreddits.toString().replace(/,/g, '+');
    }
}

var buildRequestUrl = function (arg2, subList, limit) {
    if (arg2 == 'each') {
        subList.forEach(function (element) {
            var url = "http://www.reddit.com/r/" + element + "/hot.json?limit=" + limit + "";
            request(url, returnAll);
        });
    } else {
        var url = "http://www.reddit.com/r/" + subList + "/hot.json?limit=" + limit + "";
        request(url, returnAll);
    }
};

function returnAll(error, response, body) {
    if (!error && response.statusCode == 200) {
        var resp = JSON.parse(body);
        var respLength = limit || resp.data.children.length;

        for (var i = 0; i < respLength; i++) {
            var pocketObject = {};
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

                pocketObject.action = "add";
                pocketObject.item_id = timeData+"_"+i;
                pocketObject.tags = tagData;
                pocketObject.time = timeData;
                pocketObject.title = titleData;
                pocketObject.url = linkData;

                pocketArray.push(pocketObject);
                console.log(pocketArray);
            }
        }

        sendToPocket(pocketArray);

        console.log("\n" + pocketArray.length + " items packaged in array");
        console.log('\nLast execution: ' + moment().format("MM/D, h:mm:ss a"));
        console.log('=======================================================\n');
    } else {
        console.log('Error: ', error);
    }
}

buildRequestUrl(arg2, subList, limit);

var pocketConfig = {
    consumer_key: config.pocket.consumerKey,
    access_token: config.pocket.accessToken
};

var pocket = new GetPocket(pocketConfig);

function logArrayLink(element, index, array) {
    console.log(index + ': ' + element.normal_url);
}

function sendToPocket(pocketArray){
    var params = {
      actions: pocketArray
    };

    pocket.send(params, function(err, resp){
        if (err) {
            console.log(err);
        } else {
            console.log(resp);
            var results = resp.action_results;
            results.forEach(logArrayLink);
        }
    });

}