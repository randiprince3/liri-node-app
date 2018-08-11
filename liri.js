require("dotenv").config();
var fs = require('fs');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);
var request = require('request');
var omdb = require('omdb');
var userOne = process.argv[2];
var userTwo = process.argv.splice(3).join(" ");
const params = {
    screen_name: 'randi_codes',
    count: 20
};

function runApp() {
    if (userOne === "my-tweets") {
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('');
                console.log('My Last 20 Tweets: ');
                console.log('--------------------------');
                tweets.forEach(function(individualTweet) {
                    console.log('Time Posted: ' + individualTweet.created_at);
                    console.log('Tweet: ' + individualTweet.text);
                });
            } else {
                console.log(error);
            };
        });

    } else if (userOne === "spotify-this-song") {
        if (userTwo.length < 1) {

            userTwo = "Sicko Mode";
        };
        spotify.search({ type: 'track', query: userTwo }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log('');
            console.log('Spotify Song Results: ');
            console.log('--------------------------');
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Track Title: " + data.tracks.items[0].name);
            console.log("Link to Song: " + data.tracks.items[0].preview_url);
            console.log("Album Title: " + data.tracks.items[0].album.name);
        });
       
    } else if (userOne === "movie-this") {
        if (userTwo.length < 1) {
            userTwo = "Mr. Nobody";
        };
        request("http://www.omdbapi.com/?apikey=5813fd0c&t=" + userTwo + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('');
                console.log('OMDB Movie Information: ');
                console.log('--------------------------');
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year of Release: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Countries produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);
            } else {
                console.log(error);
            }
        });
       
    } else if (userOne === "do-what-it-says") {
    
        fs.readFile('random.txt', 'utf8', function(err, data) {
            if (err) throw err;
            let arr = data.split(',');
            userOne = arr[0].trim();
            userTwo = arr[1].trim();
            runApp();
        });
    }
};

runApp();