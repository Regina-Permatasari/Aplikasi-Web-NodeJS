var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var path = require('path');
var authentication_mdl = require('../middlewares/authentication');
var session_store;
var validationResult  = require("express-validator");

/* GET obat page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM obat',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('obat/list',{title:"Data Obat",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var obat = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from obat where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, obat, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/obat');
				}
				else{
					req.flash('msg_info', 'Berhasil Menghapus Data Obat'); 
					res.redirect('/obat');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM obat where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/obat'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "obat can't be find!"); 
					res.redirect('/obat');
				}
				else
				{	
					console.log(rows);
					res.render('obat/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_kadaluwarsa = req.sanitize( 'kadaluwarsa' ).escape().trim();
		v_stok = req.sanitize( 'stok' ).escape().trim();
		v_gambar = req.sanitize( 'gambar' ).escape();

		var obat = {
			name: v_name,
			kadaluwarsa: v_kadaluwarsa,
			stok: v_stok,
			gambar : v_gambar
		}

		var update_sql = 'update obat SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, obat, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('obat/edit', 
					{ 
						name: req.param('name'), 
						kadaluwarsa: req.param('kadaluwarsa'),
						stok: req.param('stok'),
						gambar: req.param('gambar'),
					});
				}else{
					req.flash('msg_info', 'Berhasil Mengupdate Data Obat'); 
					res.redirect('/obat/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/obat/edit/'+req.params.id);
	}
});


router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	message = '';
	const errors = validationResult(req);
	if (!errors || req.method == "POST") {

		var post = req.body;
		var name = post.name;
		var kadaluwarsa = post.kadaluwarsa;
		var stok = post.stok;
		

		if (!req.files) {
			console.log(errors);
			errors_detail = "No files were uploaded";
			req.flash('msg_error', errors_detail);
			res.render('obat/add-obat');
		}

		var file = req.files.gambar;
		var img_name = file.name;

		if (file.mimetype == "image/jpeg" ||"image/png") {

			file.mv('public/images/upload/' + file.name, function(err) {

				if (err)
					return res.status(500).send(err);



				var sql = "INSERT INTO `obat`(`name`,`kadaluwarsa`,`stok`,`gambar`) VALUES ('" + name + "','" + kadaluwarsa + "','" + stok + "','" + img_name + "')";
				req.getConnection(function(err,connection){
					var query = connection.query(sql,  function(err, result){
						if(err)
						{
							var errors_detail  = ("Error Insert : %s ",err );   
							req.flash('msg_error', errors_detail); 
							res.render('obat/add-obat');
						}else{
							req.flash('msg_info', 'Berhasil Menambah Data Obat'); 
							res.redirect('/obat');
						}		
					});
				});

			});
		} else {
			console.log(errors);
			errors_detail = "This format is not allowed , please upload file with '.jpg'";
			req.flash('msg_error', errors_detail);
			res.render('obat/add-obat');
		}
	} else {
		console.log(errors);
		errors_detail = "Sory there are error <ul>";
		for (i in errors) {
			error = errors[i];
			errors_detail += '<li>' + error.msg + '</li>';
		}
		errors_detail += "</ul>";
		req.flash('msg_error', errors_detail);
		res.render('obat/add-obat');
	}
}
	

);

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'obat/add-obat', 
	{ 
		title: 'Tambah Data Obat',
		name: '',
		stok: '',
		gambar:'',
		kadaluwarsa:'',
		session_store:req.session
	});
});

module.exports = router;
