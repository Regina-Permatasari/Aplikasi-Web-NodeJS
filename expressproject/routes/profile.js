var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var path = require('path');
var authentication_mdl = require('../middlewares/authentication');
var session_store;
var validationResult  = require("express-validator");

/* GET profile page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM profile',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('profile/profile',{title:"Profil Saya",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

module.exports = router;