import mongoose from 'mongoose'

const database = 'mongodb+srv://Chaitanya:Chaitanya%40mongo@mappy.vkpvu2y.mongodb.net/subscriptions';

mongoose.createConnection(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const schema = new mongoose.Schema({ 
    hash: 
    {
        type :'string',
        unique : true,
    },

    subscriptionEl: {
        endpoint: 'string',
        expirationTime: 'string',
        keys: {
            p256dh: 'string',
            auth: 'string'
        }
    }
});

const Subscription = mongoose.model('Subscription', schema);

export { Subscription };