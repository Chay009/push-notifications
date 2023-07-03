
import express from 'express'
import rateLimit from 'express-rate-limit'
import bodyParser from 'body-parser'
import ejs from 'ejs'
import webpush from 'web-push'
import mongoose from 'mongoose'
import objectHash from 'object-hash'

// Parsers
let jsonParser = bodyParser.json();

const database = 'mongodb+srv://Chaitanya:Chaitanya%40mongo@mappy.vkpvu2y.mongodb.net/subscriptions';
const connection = mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const app = express()
let port = 3000

// limit number of requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per windowMs
});
   
// apply to all requests
app.use(limiter);

// subscriptions
import * as Subscription from './model.js';

// app settings
app.engine('html', ejs.renderFile);
app.use(express.static('./views'));

// Service Worker Notifications
// Generate your own vapid keys by running: 
    // npm i web-push -g 
    // web-push generate-vapid-keys


const publicVapidKey="BLW96EBxdwHd2AQQoQSlc4DFd2_mQb8ff3vIF-9bgCn4NcNqn6MBL3sXVeG-6eqh-hCVFyj2D-2p2p3f_VB8P_w"
const privateVapidKey="tPLMOEFqJEJ5qr_dF41OqA6ssheApOZnm1qwqHoTM8c"

webpush.setVapidDetails('mailto:mail@someEmail.com', publicVapidKey, privateVapidKey);


// here jsonparser middleware is added implies only json input is allowed
app.post('/subscribe', jsonParser, async function(req, res) {
    try {
        let hash = objectHash(req.body);
        let subscription = req.body;
        // hashed subscription and stored now checking if it exists
        let checkSubscription = await Subscription.Subscription.find({ 'hash' : hash });
        
        // this is shown every time a subscription is added modify as demo mesage 
        let theMessage = JSON.stringify({ title: 'You have already subscribed', body: 'Although we appreciate you trying to again' });

// no previous subscription exists 

        if(checkSubscription.length == 0) {
            const newSubscription = new Subscription.Subscription({
                hash: hash,
                subscriptionEl: subscription
            });


            newSubscription.save(function (err) {
                if (err) {
                    theMessage = JSON.stringify({ title: 'We ran into an error', body: 'Please try again later' });
                    res.status(201).json({});
                    webpush.sendNotification(subscription, theMessage).catch(error => {
                        console.error(error.stack);
                    });
                } else {
                    // use some logic to send demo notification on subscription and hide the subscribe today btn in front end
                    theMessage = JSON.stringify({ title: 'Thank you for Subscribing!', body: 'Can"t wait to share content!!' });
                    res.status(201).json({});
                    webpush.sendNotification(subscription, theMessage).catch(error => {
                        console.error(error.stack);
                    });
                }
            });
        } else {
            res.status(201).json({});
            webpush.sendNotification(subscription, theMessage).catch(error => {
                console.error(error.stack);
            });
        }
    } catch(e) {
        console.log(e);
    }
});

/* THIS IS FOR DEMONSTRATION PURPOSES ONLY */

// this route is nothing to do with application it is handled by admin to send data

/* Please ensure you put the correct security on the mechanism you use to send notifications to all your users */
// here jsonparser middleware is added implies only json input is allowed
app.post('/send-notification', jsonParser, async function(req, res) {
    /*  IMPORTANT NOTE:
        Please ensure you add the apropriate security here so that not just anyone can access this
        and send a notification to all users. You might what to add authentication with username and password
        or something like that */
console.log(req.body);
        const title=req.body.title;
        const message=req.body.message;

        if(!title || !message) {
            res.json({message :'please provide both a title and a message'})
        }


    try {
        // getting all subscriptions for database

        const allSubscriptions = await Subscription.Subscription.find();

        allSubscriptions.forEach((item)=> {

            let theMessage = JSON.stringify({
                title : title,
                body : message
            });


            // console.log(theMessage);
            webpush.sendNotification(item.subscriptionEl, theMessage).catch(error => {
                console.error(error.stack);
            });
        });
        res.status(200).json({"message" : "notification sent"});
    } catch(e) {
        console.log(e.message);
    }
});

app.listen(port, () => {
    console.log(`listening on :${port}`  );
    const vapidKeys = webpush.generateVAPIDKeys();
    // console.log(vapidKeys.publicKey);
    // console.log(vapidKeys.privateKey);
})