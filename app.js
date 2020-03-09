var express = require ('express');
var path = require ('path');
var bodyparser = require ('body-parser');
var cors = require ('cors');
var expressValidator = require ('express-validator');
var helmet = require ('helmet');
var mongoose = require ('mongoose');
var autoIncrement = require ('mongoose-auto-increment');
var url = require ('url');
var compression = require ('compression') ;
var logger = require ('morgan');
var i18n = require ("i18n"); 

var config = require ('./src/config');
var router = require ('./src/index');
var ApiError = require ('./src/Helper/ApiError');

i18n.configure({
    locales:['ar', 'en'],
    directory: __dirname + '/src/locales',
    register: global
});




const app = express();
app.use(compression())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   next();
});



app.use((req, res, next)=> {
    i18n.setLocale(req.headers['accept-language'] || 'ar');
    return next();
  });

// Ensure Content Type
app.use('/', (req, res, next) => {

    // check content type
    let contype = req.headers['content-type'];
    if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
        return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });
    // set current host url
    config.appUrl = url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
    next();
});



app.use(bodyparser.json({ limit: '1000mb' }));
app.use(bodyparser.urlencoded({ limit: '1000mb', extended: true, parameterLimit: 50000 }));


app.use(expressValidator());

//Routes
app.use('/', router);



//Not Found Handler
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found...'));
});


//ERROR Handler
app.use((err, req, res, next) => {

    if (err instanceof mongoose.CastError)
        err = new ApiError.NotFound(err) ||  new ApiError.NotFound(err.model.modelName)  ;
 console.log(err);
 
    res.status(err.status || 500).json({
        errors: err.message
    });
    
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, { useNewUrlParser: true });

autoIncrement.initialize(mongoose.connection);

mongoose.connection.on('connected', () =>{
    app.use( (req, res,next)=> { 
        // control for favicon
        if (req === '/favicon.ico') {
          res.writeHead(200, {'Content-Type': 'image/x-icon'} );
          res.end();
          return;
        }
        res.write(res);
        res.end(); 
      }).listen(config.port);
        console.log('\x1b[32m%s\x1b[0m','Server is connected at:'+config.port+'.....');
    console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
} );
mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...')); 



