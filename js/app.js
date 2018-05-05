//cloudinary.setCloudName('dhrqglqw8');

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

var validForm = false;
var imgUrl = null;
var vidUrl = null;

var currNotes = [];

var scrapBoard = document.querySelector(".scrap-board");
var body = document.querySelector("body");

var zoomed = false;

var renderedElem = 0;

$(document).ready(function(e) {
	//object-fit Polyfill for IE, Edge, Safari Support
	objectFitImages();

	var myDropzone = new Dropzone("div#image-select", { 
		url: "https://api.cloudinary.com/v1_1/dhrqglqw8/image/upload",
		paramName: "file",
		uploadMultiple: false,
		acceptedFiles:'.jpg,.png,.jpeg,.gif',
		maxFiles: 1, 
		init: function() { 
			this.on("maxfilesexceeded", function(file) { 
				this.removeAllFiles(); 
				this.addFile(file); 
			}); 

			this.on('sending', function (file, xhr, formData) {
				formData.append('api_key', 624223764962496);
				formData.append('timestamp', Date.now() / 1000 | 0);
				formData.append('upload_preset', 'wd1egrne');
			});

			this.on("success", function(file, response) {
		  		console.log(response);
		  		imgUrl = response.url;
		  		console.log(imgUrl);
			});
		}
	});


	$(".text-note").each(function(){
		$(this).css({'background' : getRandomColor()});
	});

	$(".add-btn").click(function(e) {
		TweenMax.to(".add-container", 1, {right: "0vw", ease:Power2.easeInOut});
	});

	$(".close-btn").click(function(e) {
		TweenMax.to(".add-container", 1, {right: "-45vw", ease:Power2.easeInOut});
	});

	$(".dz-default.dz-message").html("<b>Drop an Image here to upload.</b><br><span>Or Click here to select a file.</span>");

	$("#label1").click(function(){
		var exists = $("#label1").hasClass("active");
		console.log(exists);
		if(!exists)
		{
			$("#label1").addClass("active");	
			$("#label2").removeClass("active");
			$("#video-select").hide();
			console.log("show img");	
			$("#image-select").show();	
		}
	});


	$("#label2").click(function(){
		var exists = $("#label2").hasClass("active");
		console.log(exists);
		if(!exists)
		{
			$("#label2").addClass("active");	
			$("#label1").removeClass("active");
			$("#image-select").hide();
			console.log("show vid");	
			$("#video-select").show();	
		}
	});
	

	$("#text-message").blur(function(e) {
		validForm = checkSendValidity();
	});
	$("#name-field").blur(function(e) {
		validForm = checkSendValidity();
	});
	$("#branch-field").change(function(e) {
		validForm = checkSendValidity();
	});

	$(".send-btn").click(function(e){
		console.log(imgUrl);
		vidUrl = $("#video-field").val();
		console.log(vidUrl); 
		if(validForm) {
			axios.post('http://localhost:3000/notes/add', {
			    name: $("#name-field").val(),
			    branch: $("#branch-field").val(),
			    text: $("#text-message").val(),
			    imageUrl: imgUrl,
			    videoUrl: vidUrl
			})
			.then(function (response) {
			    console.log(response);
			    if(response.data.s == 'p'){
			    	$("#name-field").val('');
			    	$("#branch-field").val(null);
			    	$("#text-message").val('');
			    	$("#video-field").val(null);
			    	myDropzone.removeAllFiles();
			    	TweenMax.to(".add-container", 1, {right: "-45vw", ease:Power2.easeInOut});
			    	var notes = currNotes.slice();
			    	notes.push(response.data.d);
			    	updateView(notes);
			    	swal("Great!", "You have added your note!", "success");
			    }
			    
			})
			.catch(function (error) {
			    console.log(error);
			});
		}
	});

	fetchNotes();
	var noteFetchInterval = window.setInterval(fetchNotes, 30000);

	setTimeout(function(){ 
		console.log($("#footer-navbar").outerHeight());
		TweenMax.to( "#footer-navbar", 1, {bottom: "-" + ($("#footer-navbar").outerHeight() - 10) + "px", ease:Power2.easeInOut}); 
	}, 3000);


	$("#footer-navbar").mouseenter(function(e) {
		TweenMax.to( "#footer-navbar", 0.6, {bottom: "0", ease:Power2.easeInOut});
	});

	$("#footer-navbar").mouseleave(function(e) {
		TweenMax.to( "#footer-navbar", 0.6, {bottom: "-" + ($("#footer-navbar").outerHeight() - 10) + "px", ease:Power2.easeInOut}); 
	});

	$(".image-note").mouseenter(function(e) {
		TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
	});

	$(".image-note").mouseleave(function(e) {
		TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
	});

	$(".note").each(function(){
		$(this).css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)'});
	});

	$("#video-field").blur(function(e) {
		validForm = checkSendValidity();
	});

	
	$(".scrap-board").panzoom({minScale: 1, contain: "invert"});

	

	//$elem.panzoom("zoom");

	$(".scrap-board").on('mousewheel.focal', function(event) {
	    //console.log(event.deltaX, event.deltaY, event.deltaFactor);

	    if(event.deltaY > 0){
	    	$(this).panzoom("zoom", { focal: event });
	    }
	    if(event.deltaY < 0){
	    	$(this).panzoom("zoom", true, { focal: event });
	    }
	    zoomed = true;
	});
	//console.log(body);
	//console.log(scrapBoard)
	
})


var checkSendValidity = function(){
	//console.log($("#text-message").val()+ ' '+ $("#name-field").val() + ' ' +  $("#video-field").val())
	if($("#text-message").val() != '' && $("#name-field").val() != '' && $("#branch-field").val() != null)
	{
		var regex = /^(https:\/\/www\.youtube\.com\/watch.*)|(https:\/\/youtu\.be\/.*)$/;
		var givenUrl = $("#video-field").val();
		if(givenUrl!='' && givenUrl != undefined && givenUrl != null){
			//console.log(givenUrl);
			var matchStatus = givenUrl.match(regex);
			if(!matchStatus){
				$("#video-field").val('');
				$("#video-field").attr("placeholder","Error! Please enter valid youtube url");
				return false;
			}
		}
		//console.log("validity out");
		$(".send-btn").removeClass('disabled');
		return true;
		
	}

	return false;
	
}


var fetchNotes = function() {
	axios.get('http://localhost:3000/notes/fetch')
	.then(function (response) {
	    console.log(response);

	    if(response.data.s == 'p'){
	    	var notes = response.data.notes;
	    	updateView(notes);
	    }
	})
	.catch(function (error) {
	    console.log(error);
	});

}

var updateView = function(notes) {
	console.log('Notes display');
	console.log(notes);
	if(currNotes.length !== notes.length) {
		//$(".scrap-board").html("");

		/*--
		* Infinity View Implementation
		*
		*/
		var columnSize = 4;
		var rowSize = 1;
		var n = notes.length;
		var a = Math.pow(n/2, 0.5);
		var b = a - Math.floor(a);
		if(b > 0.5 || b == 0)
		{
			rowSize = Math.ceil(a);
			columnSize = 2 * rowSize;

		}
		else {
			var c = n % (2 * Math.floor(a));
			rowSize = Math.floor(a);
			if(c > Math.floor(a)){
				columnSize = 2 * rowSize + 2;
			}
			else {
				columnSize = 2 * rowSize + 1;
			}
		}
		//var offsetY = $(".scrap-board").
		$(".scrap-board").width(columnSize * 310 + 200);
		var minScale = body.clientWidth/scrapBoard.clientWidth ;
		$(".scrap-board").panzoom("option", "minScale", minScale).panzoom("zoom", minScale).panzoom("pan", 0, 0);
		$(".scrap-board").css({"top": "-45%", "padding": "100px"}).height($(document).height()/0.55);
		//var transformMatrix = $(".scrap-board").panzoom("getMatrix").slice(0,5);
		//transformMatrix.push(0);
		//console.log(transformMatrix);
		//$(".scrap-board").panzoom("setMatrix", transformMatrix);
		//console.log($(".scrap-board").panzoom("getMatrix"));

		/*
		* Rendering the Notes in scrapboard.
		* Comparing the Id to render only the difference.
		* More optimization could be done using the timestamps on notes
		*/
		var newNoteNumber = notes.length - currNotes.length;
		for(var i = notes.length; i > 0; i--){
			var j;
			for(j = currNotes.length; j > 0; j--) {
				if(notes[i - 1]._id == currNotes[j - 1]._id)
					break;
			}
			if(j == 0) {
				var noteHtml = '';
				var note = notes[i - 1];
				console.log(note.imageURL);
				console.log('Bridge');
				console.log(note.videoURL);
				if(note.imageURL){
					noteHtml = '<div class="note image-note"><div class="img-element"><img src="'+note.imageURL+'"></div><div class="text-element"><p>'+note.text+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo(".scrap-board")
					.mouseenter(function(e) {
						TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
					})
					.mouseleave(function(e) {
						TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
					})
					.click({noteData: note}, function(e) {
						console.log(e.data.noteData);

						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							imgUrl: e.data.noteData.imageURL,
							commentsCount: 5,
							likesCount: 64
						}
						var template = $('#image-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)', 'display' : 'flex'});
					renderedElem++;
				}
				else if(note.videoURL){
					noteHtml = '<div class="note video-note"><div class="video-element"><iframe src="'+embed(note.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><div class="text-element"><p>'+note.text+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo(".scrap-board")
					.mouseenter(function(e) {
						TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
					})
					.mouseleave(function(e) {
						TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
					})
					.click({noteData: note}, function(e) {
						console.log(e.data.noteData);

						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							videoUrl: embed(e.data.noteData.videoURL),
							commentsCount: 5,
							likesCount: 64
						}
						var template = $('#video-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)', 'display' : 'flex'});
					renderedElem++;
				}
				else {
					noteHtml = '<div class="note text-note"><h2>'+note.text+'</h2><h6 style="text-align: right; width: 100%">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div>';
					$(noteHtml).appendTo(".scrap-board")
					.click({noteData: note}, function(e) {
						console.log(e.data.noteData);

						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							commentsCount: 5,
							likesCount: 64
						}
						var template = $('#text-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)', 'background' : getRandomColor(), 'display' : 'flex'});
					renderedElem++;
				}
				newNoteNumber--;
			}
			if(newNoteNumber == 0)
				break;
		};
		

		$(".note").css({'clear': 'none'});
		for(var i = 1; i < rowSize; i++) {
				$(".note").eq(columnSize * i).css({'clear': 'both'});
		}

		if(currNotes.length == 0) {

			TweenMax.staggerFrom(".note",2,{opacity: 0}, 0.1);
		}
		console.log(minScale);

		
		currNotes = notes;
	}
}

function getRandomColor() {
  color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
  return color;
}

function getTimeString(timestamp) {
	var a = new Date(timestamp);
	var now = Date.now();

	if(now - timestamp < 60*1000)
		return "Just Now"
	if(now - timestamp < 60*60*1000)
		return parseInt((now - timestamp)/(1000*60))+" Minutes Ago";
	if(now - timestamp < 24*60*60*1000)
		return parseInt((now - timestamp)/(60*60*1000))+" Hours Ago";
	if(now - timestamp < 2*24*60*60*1000)
		return "Yesterday";
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year ;
  return time;
}

function embed(url)
{
	console.log(url);
	modUrl = "https://www.youtube.com/embed/" + url.split('&')[0].substring(url.indexOf('=')+1);
	console.log("Embed: " + modUrl);
	return modUrl;
}





