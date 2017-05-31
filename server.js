const express	=	require('express');
const	session	=	require('express-session');
const	bodyParser = require('body-parser');
const redis = require('redis');
const client = redis.createClient();
const validator = require('email-validator');
const sendmail = require('gmail-send');
const fs = require('fs');

const email = {
	user: fs.readFileSync('mail/.user', 'UTF-8'),
	pass: fs.readFileSync('mail/.pass', 'UTF-8'),
	subscribe: fs.readFileSync('mail/.subscribe', 'UTF-8')
};

////////////CONFSERVER//////////////////////////

var app	=	express();
app.listen(8080);

app.use((req, res, next) => {
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

////////////////ROAD/////////////////////////

var sess = '';
app.get('/', (req, res) => {
  res.render('index.html');
});
app.get('/en', (req, res) => {
  res.render('en.html');
});
app.get('/login', (req, res) => {
	if (sess.user && sess.code)
		res.redirect('/admin');
	else
		res.render('login.html');
});
app.post('/temp', (req, res) => {
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
app.get('/admin', (req, res) => {
	sess = req.session;
	if (sess.user && sess.code)
		res.render('admin.html');
	else
		res.redirect('/login');
});
app.get('/logout',(req, res) => {
	req.session.destroy( err => {
		if(err)
			console.log(err);
		else
			res.redirect('/login');
	});
});

//////////////////AJAXREQUEST//////////////

app.post('/registration', (req, res) => {
	let mail = req.body.mail;
	if (validator.validate(mail)) {
		client.lrange('mails', 0, -1, (err, result) => {
			if (result.indexOf(mail) == -1)
				client.lpush('mails', mail);
		});
		sendmail({
			user: email.user,
			pass: email.pass,
			to: req.body.mail,
			subject: mail.objet,
			html: mail.subscribe
		})();
		res.end('done');
	} else {
		res.end('false');
	}
});

app.post('/sendmail', (req, res) => {
	let mail = req.body;
	sendmail({
		user: email.user,
		pass: email.pass,
		to: email.user,
		subject: mail.objet,
		html: '<br/><b>Email : </b>' + mail.email +
					'<br/><b>Tel : </b>' + mail.tel +
					'<br/><b>Date : </b>' + mail.date +
					'<br/><b>Nombre : </b>' + mail.nombre +
					'<br/><b>Message :</b><br/>' + mail.message
	})();
	res.end('done');
});

app.post('/users', (req, res) => {
	client.lrange('mails', 0, -1, (err, result) => { res.end(JSON.stringify(result)); });
});
