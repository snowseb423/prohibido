var express	=	require('express');
var	session	=	require('express-session');
var app	=	express();
app.listen(8080);
var	bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(session({secret: ' ', saveUninitialized: true, resave: true}));
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var sess;
app.get('/', function (req, res) {
  res.render('index.html');
});
app.get('/login', function (req, res) {
	if (sess.user && sess.code)
		res.redirect('/admin');
	else
		res.render('login.html');
});
app.post('/temp',function(req, res) {
	sess = req.session;
	client.hgetall('session', (err, result) => {
		if (result.user == req.body.user && result.code == req.body.code) {
			sess.user = req.body.user;
			sess.code = req.body.code;
			res.end('done');
		} else
			res.end('false');
	});
});
app.get('/admin',function(req,res){
	sess = req.session;
	if (sess.user && sess.code)
		res.render('admin.html');
	else
		res.redirect('/login');
});
