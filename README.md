# Reddit-to-Pocket

UPDATE: I have begun working on an Ionic application to meet the same goal on an Android (or IOS) device.
That project is [here](https://github.com/8bitg/webbit-to-pocket).

---

A simple script that pulls posts from the subreddits listed in the 'subreddits' array and pushes them to your Pocket account

After doing an npm install, you will need to go to http://getpocket.com/developer/docs/authentication and register your application
Once you've gotten a ConsumerKey, you can use that coupled with a valid account to set up a connection to your Pocket Account

This script pulls in json data from Reddit, breaks it down into a digestable format for Pocket and then sends it.

## Usage
Using this script is very straight-forward.

$node reddit-grab all 10  
Returns the top 10 from all of the subreddits in your 'Subreddits' Array. It takes in all of the listed subs and then returns the Hottest posts between them. (Takes any numeric value.)

$node reddit-grab each 2  
Returns 2 from each of the subs in your 'subreddits' array. (Takes any numeric value.)

$node reddit-grab each 2 funny+worldnews+aww  
Overrides the built-in subreddits array and returns 2 from r/funny, r/worldnews, and r/aww.


Feel free to use any part of the code in this repository. 

Special thanks to https://github.com/vicchi for his npm package https://github.com/vicchi/node-getpocket which I used to clean up my Pocket API calls.
