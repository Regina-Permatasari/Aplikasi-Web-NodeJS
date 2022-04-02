var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET dokter page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM dokter',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('dokter/list',{title:"Data Dokter",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var dokter = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from dokter where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, dokter, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/dokter');
				}
				else{
					req.flash('msg_info', 'Berhasil Menghapus Data Dokter'); 
					res.redirect('/dokter');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM dokter where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/dokter'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "dokter can't be find!"); 
					res.redirect('/dokter');
				}
				else
				{	
					console.log(rows);
					res.render('dokter/edit',{title:"Edit ",data:rows[0],session_store:req.session});

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
		v_spesialis = req.sanitize( 'spesialis' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var dokter = {
			name: v_name,
			address: v_address,
			spesialis: v_spesialis,
			phone : v_phone
		}

		var update_sql = 'update dokter SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, dokter, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('dokter/edit', 
					{ 
						name: req.param('name'), 
						address: req.param('address'),
						spesialis: req.param('spesialis'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Berhasil Mengupdate Data Dokter'); 
					res.redirect('/dokter/edit/'+req.params.id);
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
		res.redirect('/dokter/edit/'+req.params.id);
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_spesialis = req.sanitize( 'spesialis' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var dokter = {
			name: v_name,
			address: v_address,
			spesialis: v_spesialis,
			phone : v_phone
		}

		var insert_sql = 'INSERT INTO dokter SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, dokter, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('dokter/add-dokter', 
					{ 
						name: req.param('name'), 
						address: req.param('address'),
						spesialis: req.param('spesialis'),
						phone: req.param('phone'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Berhasil Menambah Data Dokter'); 
					res.redirect('/dokter');
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
		res.render('dokter/add-dokter', 
		{ 
			name: req.param('name'), 
			address: req.param('address'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'dokter/add-dokter', 
	{ 
		title: 'Tambah Data Dokter',
		name: '',
		spesialis: '',
		phone:'',
		address:'',
		session_store:req.session
	});
});

module.exports = router;
