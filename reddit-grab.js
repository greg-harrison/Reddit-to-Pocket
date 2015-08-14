// Todo:
//  Research the best way to convert this to a web app.

var express = require('express'),
    config = require('./config'),
    app = express(),
    request = require('request'),
    http = require('http'),
    process = require('process'),
    GetPocket = require('node-getpocket'),
    moment = require('moment');

var subreddits = ['webdev', 'opensource', 'frontend', 'programming', 'javascript', 'dailyprogrammer'];
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
            request(url, returnEach);
            console.log(element);
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
            var pocketObject = {},
                subredditData = "",
                titleData = "",
                linkData = "",
                tagData = "",
                timeData = "",
                pocketAction = "add",
                dateMonth = moment().format('MMMM'),
                dateYear = moment().format('YYYY');

            linkData = resp.data.children[i].data.url;
            var goodLink = linkData.indexOf("youtube") || linkData.indexOf("imgur");


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

                pocketObject.action = pocketAction;
                pocketObject.tags = tagData;
                pocketObject.time = timeData;
                pocketObject.title = titleData;
                pocketObject.url = linkData;

                pocketArray.push(pocketObject);
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

function returnEach(error, response, body) {
    if (!error && response.statusCode == 200) {
        var resp = JSON.parse(body);
        var respLength = limit || resp.data.children.length;
        var i;

        for (i = 0; i < respLength; i++) {
            var pocketObject = {},
                subredditData = "",
                titleData = "",
                linkData = "",
                tagData = "",
                timeData = "",
                pocketAction = "add",
                dateMonth = moment().format('MMMM'),
                dateYear = moment().format('YYYY');

            linkData = resp.data.children[i].data.url;
            var goodLink = linkData.indexOf("youtube") || linkData.indexOf("imgur");


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

                pocketObject.action = pocketAction;
                pocketObject.tags = tagData;
                pocketObject.time = timeData;
                pocketObject.title = titleData;
                pocketObject.url = linkData;

                pocketArray.push(pocketObject);

                if (pocketArray.length == (subList.length * limit)) {
                    console.log('Length of Request: ', pocketArray.length);
                    sendToPocket(pocketArray);
                }
            }
        }
    }
}

buildRequestUrl(arg2, subList, limit);

function logArrayLink(element, index, array) {
    console.log(index + ': ' + element.normal_url);
}


var pocketConfig = {
    consumer_key: config.pocket.consumerKey,
    access_token: config.pocket.accessToken
};

var pocket = new GetPocket(pocketConfig);

function sendToPocket(pocketArray){

    var params = {
      actions: pocketArray
    };

    console.log(params.actions);
//    pocket.modify(params, function(err, resp){
//        if (err) {
//            console.log(err);
//        } else {
//            var results = resp.action_results;
//            results.forEach(logArrayLink);
//        }
//    });

}
