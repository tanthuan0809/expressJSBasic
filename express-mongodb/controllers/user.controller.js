var db = require('../db.js');
var md5 = require('md5')
var shortid = require('shortid');

var users = db.get('users').value();

module.exports.index = function (req, res) {
	res.render('users/index', {
		users: users
	});
};

module.exports.search = (req,res) => {
	var q = req.query.q;
	var matchUsers = users.filter((user) => {
		return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	
	res.render('users/index', {
		users: matchUsers
	});
};

module.exports.create = (req, res) => {
	var user = db.get('users').find( {id: req.signedCookies.userId}).value();
	//user.avatar = user.avatar.split('/').slice().join('/');
	res.render('users/create', {
		user: user,
		csrfToken: req.csrfToken()
	});
};

module.exports.userID = (req, res) => {
	var id = req.params.id;

	var user = db.get('users').find( {id: id}).value();
	res.render('users/view', {	
		user: user
	});
};

module.exports.postCreate = (req,res) => {
	req.body.id = shortid.generate();
	req.body.name = req.body.name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	req.body.password = md5(req.body.password)
	if(req.file.path)
		req.body.avatar = req.file.path.split('/').slice(1).join('/');

	db.get('users').push(req.body).write();
	res.redirect('/users');
};