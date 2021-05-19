const express 	= require('express');
const app 		= express();
var methodOverride = require("method-override");
var request 	= require('request');
const mongoose 	= require('mongoose');
var bodyParser 	= require("body-parser");
var alert       = require( 'alert')
var nodemailer = require("nodemailer");
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');
 


// mongoose.connect('mongodb+srv://yuhang:a123456@clustertest2.iccfd.mongodb.net/<dbname>?retryWrites=true&w=majority',{
// 	useNewUrlParser: true,
// 	useCreateIndex:true
// }).then(()=>{
// 	console.log('connected to DB!');
// }).catch(err =>{
// 	console.log('ERROR:', err.message);
	
// });

// const PostSchema = new mongoose.Schema({
// 	title: String,
// 	description: String,
// });

// const Post = mongoose.model("Post", PostSchema);

// app.get('/',async (req,res) =>{
// 	let post = await Post.create({title:'Test',description:'this is a test also'});
// 	res.send(post);
// });

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/test_app1");
app.use(methodOverride("_method"));

// DB schema
var userSchema =  new mongoose.Schema({
		email: String,
		password: String,
		body: String,
		createdtime:{type: Date, default: Date.now},
		last: String,
	 	buy:String,
		sell:String,
	    sellPrice:String,
		address:String,
		phone:String
		});

var User = mongoose.model("user",userSchema);

// email stuff-----------------------------------------
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: '462yuhang@gmail.com',
        pass: 'Aa462462462'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

var mailOptions = {
	from:'462yuhang@gmail.com',
	to:'462yuhangtest@gmail.com',
	subject:'node.js',
	text:'hi this is test email!'
}
app.get('/email',(req,res) => {	
	transporter.sendMail(mailOptions,function(error,info){
		if(error){
			console.log(error);
		}else{gg
			console.log('Email sent: '+info.response)
		}										 
	})	
});
// email stuff-----------------------------------------


//home page
app.get('/',(req,res) => {
	console.log("home page");
	
	res.render("search.ejs");
	
});
//logged in search page
app.get("/searchLogged/:id", function(req, res){
	
	
	
	 
	User.findOne({_id:req.params.id},function(err,variable){
		if(err){
			res.redirect("/sign-up");
		}else{
			url = "https://www.googleapis.com/books/v1/volumes?q=Science+subject&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	
			request(url,function(error, response, body){
				
				if (!error && response.statusCode == 200){
					var musicData = JSON.parse(body);
			 		url = "https://www.googleapis.com/books/v1/volumes?q=art+subject&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	
					request(url,function(error, response, body){

						if (!error && response.statusCode == 200){
							var artData = JSON.parse(body);

							res.render("searchLogged.ejs",{user:variable,music:musicData,art:artData})
						}		
					});	
			 		
				}		
   	 		});	
			 
		}
	})
})

// log-in model
app.get('/log-in',(req,res) => {
	var state=0
	console.log("log-in page");

	res.render("log-in.ejs",{logState:state});
	
});

function IfCanlogIn(req,res,next){
	var state=0
	// 0:right 1:account 2:password
	console.log("IfCanlogIn")
	
	User.findOne({email:req.body.user.email},function(err,variable){
		if(err){}
		else{
				console.log("loging")
			    console.log("varible="+variable)
				r=variable;
				console.log("r1="+r)
				
				
					
				if(r!=null){
					console.log("account is right ")
					
					if(r.password==req.body.user.password){
						console.log("password is right ")
						res.redirect("/searchLogged/"+variable._id);
					}else{
						console.log("password is wrong")
						state=2
						res.render("log-in.ejs",{logState:state})
					}
					
					
					
				}
				else{
					console.log("not signup")
					state=1
					res.render("log-in.ejs",{logState:state})
	        	}
		}
	})
}

app.post('/canLogIn',IfCanlogIn,(req,res) => {
	// console.log("log-in page");

	// res.render("log-in.ejs");
	
});

/// forgotPassword---
app.get('/forgotPassword',(req,res) => {
	console.log("sign-up page");

	res.render("forgotPassword.ejs");
	
});

function IfSignUpForgot(req,res,next){
	
	var r
	User.findOne({email:req.body.user.email},function(err,varible){
		if(err){}
		else{
				console.log("varible="+varible)
				r=varible;
				console.log("r1="+r)
				if(r==null){
					console.log("forgotPassword there is no the email")
					var state=1
					res.render("log-in.ejs",{logState:state})
				}
				else{
					console.log("forgotPassword there is a  email")
					return next()
	        	}
		}
	})	
}

app.post('/forgotPassword',IfSignUpForgot,function(req,res){
	var code=0
	var email=req.body.user.email
		User.findOne({email:req.body.user.email},function(err,varible){
		if(err){}
		else{
			var mailOptions = {
			from:'462yuhang@gmail.com',
			to:email,
			subject:'node.js',
			text:' Change your Archived password:'+'https://test2-zvfhv.run-us-west2.goorm.io/user/'+varible._id
		}

		transporter.sendMail(mailOptions,function(error,info){
			if(error){
				console.log(error);
				res.render("alertSignUp.ejs")
			}else{
				var code=1
				console.log('Email sent: '+info.response)
				res.render("forgotPassword.ejs",{VerifCode:code,UserEmail:email})
				// res.render("sign-up.ejs",{VerifCode:code,UserEmail:email})
			}
		})	
			
		}
	})	
		
		
													 
})	

/// forgotPassword---
// log-in model-------
//sign-up------------------------

///IfSignUp

function IfSignUp(req,res,next){
	
	var r
	User.findOne({email:req.body.user.email},function(err,varible){
		if(err){}
		else{
				console.log("varible="+varible)
				r=varible;
				console.log("r1="+r)
				if(r==null){
					return next()
				}
				else{
					console.log("already signup")
					res.render("alertSignUp.ejs")
	        	}
		}
	})	
}

app.post("/signUp",IfSignUp, function(req,res){
	console.log("req.body.user.email="+req.body.user.email)
		 
		 User.create(req.body.user, function(err, varible){
			 
			 if(err){
			 	res.redirect("/sign-up");
			 } else {
				console.log(varible._id);
			 	res.redirect("/searchLogged/"+varible._id);
			 }
		});	 	
});
//email check

app.get('/emailCheck',(req,res) => {
	console.log("emailCheck page");

	res.render("emailCheck.ejs");
	
});

app.post('/emailCheck',IfSignUp,function(req,res){
	var code=0
	var email=req.body.user.email
	
		console.log("sign-up page");
		var mailOptions = {
			from:'462yuhang@gmail.com',
			to:email,
			subject:'node.js',
			text:'You are verifying an email account for Archived, please click here： Verify email:'+'https://test2-zvfhv.run-us-west2.goorm.io/sign-up/'+email
		}

		transporter.sendMail(mailOptions,function(error,info){
			if(error){
				console.log(error);
				res.render("alertSignUp.ejs")
			}else{
				var code=1
				console.log("sign-up page");
				console.log('Email sent: to '+email)
				console.log('Email sent: '+info.response)
				res.render("emailCheck.ejs",{VerifCode:code,UserEmail:email})
				// res.render("sign-up.ejs",{VerifCode:code,UserEmail:email})
			}
		})	
													 
})	


	
	


// sign-up page
app.get('/sign-up',(req,res) => {
	console.log("sign-up page");

	res.render("sign-up.ejs");
	
});
app.get('/sign-up/:id',(req,res) => {
	var email=req.params.id
	console.log("sign-up page");

	res.render("sign-up.ejs",{UserEmail:email});
	
});
//sign-up------------------------



//personal page
app.get("/user/:id", function(req, res){
	
	 
	User.findById(req.params.id,function(err,varible){
		if(err){
			res.redirect("/sign-up");
		}else{
			 res.render("personal.ejs",{user:varible})
		}
	})
})

app.put("/user/:id", function(req, res){
	User.findByIdAndUpdate(req.params.id,req.body.user,function(err,variable){
		if(err){
			res.redirect("/sign-up");
		}else{
			 
			 res.redirect("/user/"+req.params.id)
		}
	})
	 // res.send("put route")
	// User.findByIdAndUpdate(req.params.id,req.nody.user,function(err,varible){
	// 	if(err){
	// 		res.redirect("/sign-up");
	// 	}else{
	// 		 res.redirect("/user/"+req.params.id,{user:varible})
	// 	}
	// })
})

//itemCheckout page
app.get("/itemCheckout/:id/:sellerEmail", function(req, res){
	
	 
	User.findById(req.params.id,function(err,varible){
		if(err){
			res.redirect("/sign-up");
		}else{
			
			User.findOne({email:req.params.sellerEmail},function(err,sellerVarible){
				if(err){
					res.redirect("/sign-up");
				}else{
					console.log("sellerVarible="+sellerVarible)
					console.log("user="+varible)
			 		res.render("itemCheckout.ejs",{user:varible,seller:sellerVarible})
				}
	        })
			
    	}
	})
})


// update id and send email------------------------------------





























app.put("/itemCheckout/:id/:sellerEmail", function(req, res){
	
	const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));

	
	
	User.findByIdAndUpdate(req.params.id,req.body.user,function(err,variable){
		console.log("id="+req.params.id)
		console.log("sellerEmail="+req.params.sellerEmail)
		if(err){
			res.redirect("/sign-up");
		}else{
			 var email=req.body.user.selleremail
			 
			 // ---------------
			var query = req.body.user.buy;
				console.log('picture query='+query)

				url = "https://www.googleapis.com/books/v1/volumes?q="+query+"&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
				console.log(url)
				request(url,function(error, response, body){
					if (!error && response.statusCode == 200){
						var parsedData = JSON.parse(body);
						// console.log(parsedData['items'][0]["id"])
						try{
								parsedData['items'][0]["volumeInfo"]["title"]
										
								console.log(' query ID ='+parsedData['items'][0]["volumeInfo"]["title"])
							
							const html = template({
	  						title: parsedData['items'][0]["volumeInfo"]["title"],
	  						desc: '使用Ejs渲染模板',
							pictureUrl:parsedData["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"],
							buyer:req.body.user.email,
							seller:email,
							buyerPhone:req.body.user.phone,
							});
							
							console.log(parsedData["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"])
							var mailOptions = {
								from:'462yuhang@gmail.com',
								to:email,
								subject:'node.js',
								text:'hi this is test email!'+req.body.user.email+" want buy your book "+req.body.user.buy,
								html: html, 
							}

							transporter.sendMail(mailOptions,function(error,info){
								if(error){
								console.log(error);
								res.render("alertSignUp.ejs")
								}else{
								console.log('Email sent to: '+email)
								console.log('Email sent: '+info.response)
						
									// res.render("sign-up.ejs",{VerifCode:code,UserEmail:email})
								}
							})	
							
						}catch(e){console.log('error='+e)}


					}		
				});	
			    
			 
			 
			 // -----------------
	
			
				

			
			res.redirect("/itemCheckout/"+req.params.id+"/"+req.params.sellerEmail)
		}
	})
	
})
// update id and send email------------------------------------

//userList page
app.get("/userList", function(req, res){
	var created=0
	User.find({},function(err,varible){
		if(err){
			console.log("error!");
		}else{
			res.render("userList.ejs",{users:varible,userCreated:created})
		}
	})
})

app.put("/userDelete/:id", function(req, res){
	
	User.findByIdAndDelete({_id:req.params.id},function(err,varible){
		if(err){
			console.log("error!");
		}else{
			res.redirect("/userList")
		}
	})
})

app.put("/userManage/:id", function(req, res){
	User.findByIdAndUpdate(req.params.id,req.body.user,function(err,variable){
		if(err){
			res.redirect("/sign-up");
		}else{
			 
			res.redirect("/userlist/")
		}
	})

})

function IfCreated(req,res,next){
	
	var r
	var created=0
	
	User.findOne({email:req.body.user.email},function(err,varible){
		if(err){}
		else{
				console.log("varible="+varible)
				r=varible;
				console.log("r1="+r)
				if(r==null){
					return next()
				}
				else{
					created=1
					User.find({},function(err,varible){
						if(err){
							console.log("error!");
						}else{
							res.render("userList.ejs",{users:varible,userCreated:created})
						}
					})
	        	}
		}
	})
	
}


app.post("/userCreate",IfCreated, function(req,res){
	console.log("req.body.user.email="+req.body.user.email)
		 
		 User.create(req.body.user, function(err, varible){
			 
			 if(err){
			 	res.redirect("/sign-up");
			 } else {
			
			 	res.redirect("/userlist");
			 }
		});	 	
});





// search model
app.get('/search',(req,res) => {
	console.log("search page");

	res.render("search.ejs");
	
});

//details
app.get('/details',(req,res) => {
	var query = req.query.search;
	console.log('details query='+query)
	
	url = "https://www.googleapis.com/books/v1/volumes?q="+query+"&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	console.log(url)
	request(url,function(error, response, body){
		if (!error && response.statusCode == 200){
			var parsedData = JSON.parse(body);
			// console.log(parsedData['items'][0]["id"])
			try{
					User.countDocuments({sell:parsedData['items'][0]["id"]},function(err,sellNumberVariable){
						console.log("sellnumber="+sellNumberVariable)
							res.render("details.ejs",	
								   {data:parsedData,
									SearchWords:query,
									
									sellNumber:sellNumberVariable,
									
							})
			})	
					}catch(e){}
			

		}		
    });		
});

app.get("/detailsLogged/:id", function(req, res){
	var query = req.query.search;
	url = "https://www.googleapis.com/books/v1/volumes?q="+query+"&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	User.findOne({_id:req.params.id},function(err,variable){
		if(err){
			res.redirect("/sign-up");
		}else{
			 console.log("ID="+req.params.id);
			 console.log("varible="+variable);
			 request(url,function(error, response, body){
			 	if (!error && response.statusCode == 200){
			 		var parsedData = JSON.parse(body);
					// console.log(parsedData['items'][0]["volumeInfo"]["title"])
					console.log("idparsedData="+parsedData[0])
					try{
					User.find({sell:parsedData['items'][0]["id"]},function(err,sellvariable){
							console.log("sell="+sellvariable);
							User.find({buy:parsedData['items'][0]["id"]},function(err,buyvariable){


							// console.log("buyvariable="+buyvariable[0].email)


								res.render("detailsLogged.ejs",	
									   {data:parsedData,
										SearchWords:query,
										user:variable,
										sell:sellvariable,
										buyer:buyvariable
										})
							})
						})		
					}catch(e){}
					
					
				}
						
			 		
			    		
             });	
			
		}
	})
})


//results page
app.get('/results',(req,res) => {
	var query = req.query.search;
	console.log('search query='+query)
	
	url = "https://www.googleapis.com/books/v1/volumes?q="+query+"&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	console.log(url)
	request(url,function(error, response, body){
		if (!error && response.statusCode == 200){
			var parsedData = JSON.parse(body);
			console.log(parsedData['items'][0]["volumeInfo"]["title"])
			
			
			
			res.render("results.ejs",{data:parsedData,SearchWords:query
									 });
			
			// var a = parsedData["items"].forEach(function(element){
			// 	console.log(element["volumeInfo"]["title"])
			// });
			// // console.log(parsedData["items"][0]["volumeInfo"]["title"]);
			// // res.render(body);
			// // res.send("hi show page")1
			// // var a=parsedData["items"][0]["volumeInfo"]["title"]
			// res.send(a)
			
		}		
    });		
});

app.get("/resultsLogged/:id", function(req, res){
	var query = req.query.search;
	url = "https://www.googleapis.com/books/v1/volumes?q="+query+"&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
	User.findOne({_id:req.params.id},function(err,variable){
		if(err){
			res.redirect("/sign-up");
		}else{
			 console.log("ID="+req.params.id);
			 console.log("varible="+variable);
			 request(url,function(error, response, body){
			 	if (!error && response.statusCode == 200){
			 		var parsedData = JSON.parse(body);
			 		console.log(parsedData['items'][0]["volumeInfo"]["title"])
			 		res.render("resultsLogged.ejs",{data:parsedData,SearchWords:query,user:variable
				});
			
			 }		
        });	
			
		}
	})
})

// app.get('/showapi',(req,res) => {
	
	
// 	// url = "https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
// 	url = "https://www.googleapis.com/books/v1/volumes?q=carlifornia dream &key=%20AIzaSyDVurmj45R2OOppe3616JuwEA7u2A2pUNY"
// 	// url = 'http://www.google.com'
// 	request(url,function(error, response, body){
// 		if (!error && response.statusCode == 200){
// 			var parsedData = JSON.parse(body);
			
// 			var a = parsedData["items"].forEach(function(element){
// 				console.log(element["volumeInfo"]["title"])
// 			});
// 			// console.log(parsedData["items"][0]["volumeInfo"]["title"]);
// 			// res.render(body);
// 			// res.send("hi show page")1
// 			// var a=parsedData["items"][0]["volumeInfo"]["title"]
// 			res.send(a)
		
			
			
			
// 		}		
//     });		
// });
// search model 



app.listen(3000,(req,res) => {
	console.log('server listening on port 3000');
	
});