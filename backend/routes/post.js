var express = require('express');
var router = express.Router();
const Note = require('../model/post');
var request = require('request')

/* GET users listing. */
router.post('/add', function(req, res, next) {
  
	let newNote = new Note();
	newNote.name = req.body.name;
	newNote.branch = req.body.branch;
	newNote.text = req.body.text;

	if(req.body.imageUrl)
		newNote.imageURL = req.body.imageUrl;
	if(req.body.videoUrl)
		newNote.videoURL = req.body.videoUrl;
	newNote.created = Date.now();
	console.log(newNote.imageUrl);
	console.log('Lool');
	console.log(newNote.videoUrl);
	newNote.save((err) => {
		if(err)
			throw err;
		res.json({s: 'p', d: newNote});
	});

  	//res.send('respond with a resource');
});

router.get('/fetch', function(req, res, next) {
  
	Note.find({}).exec((err, notes) => {
        if(err)
        	throw err;
        else if(notes.length == 0)
		{
            res.json({s: 'f'});
		}
		else
		{
            res.json({s: 'p', notes: notes});
		}
    });
  	//res.send('respond with a resource');
});

router.get('/api',function(req,res,next){
	var url = "http://disqus.com/api/3.0/threads/details.json?api_key=KXWM0ZEeMPFjdLLoXkpieefAtBqF28rMqg4r1C88rjUonigvuOCk9u9EZKGcoFJD&forum=memorabilia-1&thread:ident="+req.query.threadid;
	request.get(url,function(error,response,body){
		if(!error && res.statusCode == 200){
			res.json({s:'p',apidata:body});
		}else{
			console.log(error);
		}
	})
});

module.exports = router;
