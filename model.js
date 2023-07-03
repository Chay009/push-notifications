import mongoose from 'mongoose'

const database = 'REPLACE WITH MOBGODB URI';

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
