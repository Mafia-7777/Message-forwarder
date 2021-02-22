require('dotenv').config();
const twilio = require('twilio');
const config = require('./config.json');
const port = process.env.PORT || config.port;
const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser')


const bot = new twilio(process.env.accountSid, process.env.authToken);

const send = async (Number, content) => {
    await bot.messages.create({
        to: Number,
        from: config.number,
        body: content
    })
    console.log(bot.messages)

};

// send(config.logNumber, 'Running :O');

const serverInit = async () => {
    
    app.use(bodyParser.urlencoded({ extended: true }))

    app.post('/sms/:token', (req, res, next) => {
        const token = req.params.token;
        if(token != process.env.serverToken) return next();

        console.log(req.body);
        const { Body, From } = req.body;

        send(config.forwardNumber, `Fom ${From}\n\n${Body}`);


    });

    app.get('/', (req, res) => {
        res.send('HELO WORLD')
    })

    // app.listen(port, () => console.log('On port: ' + port));
    http.createServer(app).listen(port, () => console.log('On port: ' + port));
}

serverInit();