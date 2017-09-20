var Hapi = require('hapi');
var mysql= require('mysql');
var inert = require('inert');
var vision = require('vision');
var hbars = require('handlebars');

var portnum = process.env.PORT || 3000;

//'edurekasql.cojajm63r6qf.us-west-2.rds.amazonaws.com'
var dbconnection = mysql.createConnection({
  host     : 'myawssql.cojajm63r6qf.us-west-2.rds.amazonaws.com',
  user     : 'akhil',
  password : 'akhil123',
  port     : '3306',
  database : 'AwsDB'
});

var httpserver = new Hapi.Server();
httpserver.connection({ port: portnum });

dbconnection.connect();

//setting public folder
httpserver.register(inert);

//Vision setup 
httpserver.register(vision, function(err){
    if(err){
      throw err;
    }
});

// View engine 
httpserver.views({
     engines: {
         html: hbars
     },
     relativeTo: __dirname,
     path: 'templates'
 });


//define routes
httpserver.route({
    method: 'GET',
    path: '/',
    handler: function (req, res) {
       dbconnection.query('SELECT quote,credit from FAMOUSQUOTES order by rand() limit 1', function(err, rows, fields) {
       if (err) throw err;
       res.view('index', {quote:rows[0].quote, credit:rows[0].credit});
       });
    }
});

httpserver.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

httpserver.start( function(){
     console.log('Catch the action at : ' + httpserver.info.uri);
});
