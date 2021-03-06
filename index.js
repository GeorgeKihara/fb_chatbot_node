var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request'); 
var mongoose = require("mongoose");
var db = mongoose.connect(process.env.MONGODB_URI);

var Bot = require("./models/bots");
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
// Server index page
app.get("/", function (req, res) {
  res.send("Welcome to a basic facebook bot made using node js!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
      console.log("Verified webhook");
      res.status(200).send(req.query["hub.challenge"]);
  } else {
      console.error("Verification failed. The tokens do not match.");
      res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
      // Iterate over each entry
      // There may be multiple entries if batched
      req.body.entry.forEach(function(entry) {
          // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
              if (event.postback) {
                  processPostback(event);
              } else if (event.message) {
                  processMessage(event);
              }
          });
      });

      res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.10/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
        message = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: "Bots category",
                subtitle: "Select a category of Bot to dearch from.",
               
                buttons: [{
                  type: "postback",
                  title: "Yes",
                  payload: "Correct"
                }, {
                  type: "postback",
                  title: "No",
                  payload: "Incorrect"
                }]
              }]
            }
          }
        };
      }
      var messageObject = greeting + "My name is BotStore Bot. I make it easier for you to search for other bots." + message;
      sendMessage(senderId, {text: messageObject});
    });
  } else if (payload === "games") {
    sendMessage(senderId, {text: "Awesome! What would you like to find out? Enter 'name', 'developer', 'category', 'company',  for the various details."});
  } else if (payload === "health") {
    sendMessage(senderId, {text: "Awesome! What would you like to find out? Enter 'name', 'developer', 'category', 'company',  for the various details."});
  }
}

function processMessage(event) {
  if (!event.message.is_echo) {
      var message = event.message;
      var senderId = event.sender.id;

      console.log("Received message from senderId: " + senderId);
      console.log("Message is: " + JSON.stringify(message));

      // You may get a text or attachment but not both
      if (message.text) {
          var formattedMsg = message.text.toLowerCase().trim();

          // If we receive a text message, check to see if it matches any special
          // keywords and send back the corresponding movie detail.
          // Otherwise search for new movie.
          switch (formattedMsg) {
              case "name":
              case "developer":
              case "category":
              case "company":
           
                  getBot(senderId, formattedMsg);
                  break;

              default:
                  findBot(senderId, formattedMsg);
          }
      } else if (message.attachments) {
          sendMessage(senderId, {text: "Sorry, I don't understand your request."});
      }
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.10/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}


function getBot(userId, field) {
  Bot.findOne({user_id: userId}, function(err, movie) {
    if(err) {
      sendMessage(userId, {text: "Something went wrong. Try again"});
    } else {
      sendMessage(userId, {text: bot[field]});
    }
  });
}
