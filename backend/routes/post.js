var express = require('express');
var router = express.Router();
const Note = require('../model/post');

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

module.exports = router;
