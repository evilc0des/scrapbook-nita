//cloudinary.setCloudName('dhrqglqw8');

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

var validForm = false;
var imgUrl = null;
var vidUrl = null;
var threadInf = -1;
var imgPrevUrl = null;
var currcellPos = 0;
var carouselNotes = [];
var currNotesDesk = [];
var currNotesMob = [];
var currNotes = [];
var firstTimeDesk = 1;
var firstTimeMob = 1;
var rows;
var cols;
var totHeight;
var totWidth; 
var noteHeight;
var noteWidth;
var marginR;
var marginL;
var marginU;
var marginB;
var lastIndexDesk = 0;
var lastIndexMob = 0;

var itemsPerBoard = 18;
var noOfBoards = 1;
var displayBoard = 1;

var scrapBoard = document.querySelector(".scrap-board");
var body = document.querySelector("body");

//var zoomed = false;

var renderedElem = 0;

var x;

$(document).ready(function(e) {

	//object-fit Polyfill for IE, Edge, Safari Support
	//objectFitImages();
	$(".add-container").hide();
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
	//	  		console.log(response);
				  imgPrevUrl = file.dataURL;
				  imgUrl = response.url;
	//	  		console.log(imgUrl);
			});
		}
	});


	$(".text-note").each(function(){
		$(this).css({'background' : getRandomColor()});
	});

	$(".add-btn").click(function(e) {
		$(".add-container").show();
		TweenMax.to(".add-container", 1, {right: "0vw", ease:Power2.easeInOut});
	});

	$(".close-btn").click(function(e) {
		TweenMax.to(".add-container", 1, {right: "-45vw", ease:Power2.easeInOut});
		$(".add-container").hide(2000);
	});

	$(".dz-default.dz-message").html("<b>Drop an Image here to upload.</b><br><span>Or Click here to select a file.</span>");

	$("#label1").click(function(){
		var exists = $("#label1").hasClass("active");
	//	console.log(exists);
		if(!exists)
		{
			$("#label1").addClass("active");	
			$("#label2").removeClass("active");
			$("#video-select").hide();
		//	console.log("show img");	
			$("#image-select").show();	
		}
	});

	$("#label2").click(function(){
		var exists = $("#label2").hasClass("active");
	//	console.log(exists);
		if(!exists)
		{
			$("#label2").addClass("active");	
			$("#label1").removeClass("active");
			$("#image-select").hide();
	//		console.log("show vid");	
			$("#video-select").show();	
		}
	});


	$('#close-modal').click(function(e){
  	$('body').removeClass('modal-active');
  	$('#modal-container').addClass('out');
	});

	$('.flickity-prev-next-button.previous').click(function(){
		prevClick();
	});

	$('.flickity-prev-next-button.next').click(function(){
		nextClick();
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
	$("#video-field").blur(function(e) {
		validForm = checkSendValidity();
	});

	$(".send-btn").click(function(e){
	//	console.log(imgUrl);
		vidUrl = $("#video-field").val();
	//	console.log(vidUrl);
		if(validForm){
			validForm = false;
			var tempnote;
			var name =  $("#name-field").val();
			var branch = $("#branch-field").val();
			var text = $("#text-message").val();
			if(imgUrl){
				tempnote = '<div class="note image-note" style="width: 100%;height:100%; float:none; margin-left:auto; margin-right:auto"><div class="img-element"><img style="width:100%;height:auto;display:block;" src="'+imgPrevUrl+'"></div><div class="text-element" style="bottom: -20%"><p>'+text+'</p><h6 style="text-align: right;">-- '+name+' <span style="font-size: smaller; font-weight: 400">'+branch+'</span></h6></div></div>';
			}
			else if(vidUrl){
				tempnote = '<div class="note video-note" style="width: 100%; float:none; margin-left:auto; margin-right:auto"><div class="video-element"><iframe src="'+embed(vidUrl)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><div class="text-element" style="bottom: -15%"><p>'+text+'</p><h6 style="text-align: right;">-- '+name+' <span style="font-size: smaller; font-weight: 400">'+branch+'</span></h6></div></div>';
			}
			else{
			tempnote = '<div class="note text-note" style="width:100%; background:'+getRandomColor()+'"><h2>'+text+'</h2><h6 style="text-align: right; width: 100%">-- '+name+' <span style="font-size: smaller; font-weight: 400">'+branch+'</span></h6></div>';
			}
			$("#name-field").val('');
			$("#branch-field").val(null);
			$("#text-message").val('');
			$("#video-field").val(null);
			myDropzone.removeAllFiles();
			TweenMax.to(".add-container", 1, {right: "-45vw", ease:Power2.easeInOut});
			$(".send-btn").addClass('disabled');
			swal({
  			title: "You designed a new card!",
			imageUrl: "./assets/thumb-up.png",	
  			html: tempnote,
  			showCancelButton: true,
  			confirmButtonClass: "btn-danger",
	  		cancelButtonColor: "#d33",
  			confirmButtonText: "Yes, submit it!",
  			cancelButtonText: "No, cancel it!",
  			allowOutsideClick: false,
  			footer: "<em>Don't bother about the color of your card, it would change anyway ;)</em>"
   			})
  			.then((result) => {
  			   	if(result.value){
					axios.post('http://localhost:3000/notes/add', {
				    name: name,
				    branch: branch,
				    text: text,
				    imageUrl: imgUrl,
				    videoUrl: vidUrl
				})
				.then(function (response) {
		//		    console.log(response);
				    if(response.data.s == 'p'){
				    	imgUrl = null;
				       	var notes = currNotes.slice();
				    	notes.push(response.data.d);
				    	fetchNotes(x);
				    	swal("Great!", "You have added your note!", "success");
			    	}
				})
				.catch(function (error) {
		//	   		console.log(error);
		    		imgUrl = null;
   		    		swal("Awww!","Some unexpected shit has occurred!","error");
				});
				}
  		    	else{
		    		imgUrl = null;
  		    		swal("Cancelled!","The note was not submitted!","error");
  		    	}
  			});
  		}
  	});	

	$('.lazy').click(function(){
		genModal();
	});

	$('.lazymobutton').click(function(){
		genModal();
	});

	var noteFetchInterval = window.setInterval(fetchNotes(x), 30000);

	setTimeout(function(){ 
	//	console.log($("#footer-navbar").outerHeight());
		TweenMax.to( "#footer-navbar", 1, {bottom: "-" + ($("#footer-navbar").outerHeight() - 10) + "px", ease:Power2.easeInOut}); 
	}, 3000);

	$(".nextbtn").click(function(){
		if(!$(".nextbtn").hasClass('disabled'))
		{
		currBoard = "#board" + displayBoard + ".scrap-board";
		$(currBoard).hide();	
		displayBoard++;
		if(displayBoard == noOfBoards)
		{
			$(".nextbtn").addClass('disabled');
			$(".nextbtn").css({'cursor':'auto'});
		}
		if(displayBoard == 2)
		{
			$(".prevbtn").removeClass('disabled');
			$(".prevbtn").css({'cursor':'pointer'});

		}
		currBoard = "#board" + displayBoard + ".scrap-board";
		$(currBoard).show();
		}
	});

	$(".prevbtn").click(function(){
		if(!$(".prevbtn").hasClass('disabled'))
		{	
		currBoard = "#board" + displayBoard + ".scrap-board";
		$(currBoard).hide();	
		displayBoard--;
		if(displayBoard == 1)
		{
			$(".prevbtn").addClass('disabled');
			$(".prevbtn").css({'cursor':'auto'});

		}
		if(displayBoard == noOfBoards - 1)
		{
			$(".nextbtn").removeClass('disabled');
			$(".nextbtn").css({'cursor':'pointer'});
		}
		currBoard = "#board" + displayBoard + ".scrap-board";
		$(currBoard).show();
		}
	});

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
/*
	$(".carousel .note").each(function(){
		$(this).css({'transform' : 'rotate(0deg)'});
	});
*/

//	$(".scrap-board").panzoom({minScale: 1, contain: "invert"});

	

	//$elem.panzoom("zoom");
/*
	$(".scrap-board").on('mousewheel.focal', function(event) {
	    //console.log(event.deltaX, event.deltaY, event.deltaFactor);

	    if(event.deltaY > 0){
	    	$(this).panzoom("zoom", { focal: event });
	    }
	    if(event.deltaY < 0){
	    	$(this).panzoom("zoom", true, { focal: event });
	    }
	    zoomed = true;
	}); */
	//console.log(body);
	//console.log(scrapBoard)
//	$(".scrap-board").css({"top": "-45%", "padding": "100px"}).height($(document).height()/0.55);

	
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


var fetchNotes = function(xi) {
	axios.get('http://localhost:3000/notes/fetch')
	.then(function (response) {
	//    console.log(response);

	    if(response.data.s == 'p'){
			var notes = response.data.notes;
			currNotes = notes;
			console.log("notes-fetched");
			//updateView(notes);
			dynamicUpdate(xi,notes);
	    }
	})
	.catch(function (error) {
	//    console.log(error);
	});

}

function getRandomColor() {
  color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
  return color;
}

function getTimeString(timestamp) {
	var a = new Date(timestamp);
	var now = Date.now();

	if(now - timestamp < 60*1000)		return "Just Now"
	if(now - timestamp < 60*60*1000)		return parseInt((now - timestamp)/(1000*60))+" Minutes Ago";
	if(now - timestamp < 24*60*60*1000)		return parseInt((now - timestamp)/(60*60*1000))+" Hours Ago";
	if(now - timestamp < 2*24*60*60*1000)
		return "Yesterday";
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year ;  return time;
}

function embed(url)
{
//	console.log(url);
var regex = /^(https:\/\/youtu\.be\/.*)$/;
var matchStatus = url.match(regex);
if(!matchStatus){
	modUrl = "https://www.youtube.com/embed/" + url.split('&')[0].substring(url.indexOf('=')+1);
	return modUrl;
}
else
	{
		modUrl = "https://www.youtube.com/embed/" + url.substring(url.indexOf('.')+4);
		console.log(modUrl);
		return modUrl;
	}
//	console.log("Embed: " + modUrl);
	
}

function findDisqusThread(id){
	var postUrl = window.location.href;   
	var ans=false; 
	var jsonData;
   	postUrl += '&id='+id
	axios.get('http://localhost:3000/notes/api',{
		params:{
			threadid:id,
			threadUrl:postUrl
		}
	})
	.then(function (response) {
//	    console.log(response);

	    if(response.data.s == 'p'){
	    	var dataRecieved = response.data.apidata;
//			console.log(dataRecieved);
		    jsonData = JSON.parse(dataRecieved);
//			 console.log(jsonData.response.likes);
//			 console.log(jsonData.response.posts);
			 ans=true;
		}
		else ans=false;

		if(ans==true)
		threadInf = jsonData;
		else
		threadInf = -1;

		// document.getElementById("likes-text").innerHTML = jsonData.response.likes;
		// document.getElementById("comments-text").innerHTML = jsonData.response.posts;
	})
	.catch(function (error) {
//		console.log(error);
	});
}

function getYoutubeId(url){
var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
var match = url.match(regExp);
if (match && match[2].length == 11) {
  return match[2];
} else {
  return url; 
}

}


function genModal(){
		$('.carousel-cell').empty();
		var tempnote;
		var noteHtml;
		var cellID;
		if(carouselNotes.length == 0)
			carouselNotes = [0,1,2,currNotes.length-2,currNotes.length-1];
		for(var j = 0 ; j < 5 ; j++)
		{
			cellID = "#cell" + j; 
//			console.log("dz "+carouselNotes[j]);
			tempnote = currNotes[carouselNotes[j]]; 
			if(tempnote.imageURL){
//					console.log('imgg');
					noteHtml = '<img class = "modalcard" src="'+tempnote.imageURL+'"></img><div class="modalcard text-element" style="bottom: -30%"><p style="width: 100%">'+tempnote.text+'</p><h6 style="margin-top: 20px; width: 100%; text-align: right">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo(cellID)
					.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							imgUrl: e.data.noteData.imageURL,
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#image-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({'display' : 'flex'});
			}
				else if(tempnote.videoURL){
	//				console.log('vidd');
					noteHtml = '<iframe class = "modalcard" src="'+embed(tempnote.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="modalcard text-element" style="bottom: -40%">'+tempnote.text+'<h6 style="text-align: right;">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo(cellID)
					.click({noteData: tempnote}, function(e) {
	//					console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							videoUrl: embed(e.data.noteData.videoURL),
							commentsCount: commentsc ,
							likesCount: likesc
						}
						var template = $('#video-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
				}
				else {
	//				console.log('notee');
					noteHtml = '<div class="modalcard note text-note" style="background-color: '+getRandomColor()+'"><h2 style="text-align: center">'+tempnote.text+'</h2><h6 style="text-align: right; width: 100%">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div>';
					$(noteHtml).appendTo(cellID)
					.click({noteData: tempnote}, function(e) {
	//					console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#text-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
				}
		}
  	$('#modal-container').removeAttr('class').addClass('one');
  	$('body').addClass('modal-active');
  	var left = (currcellPos + 4)%5;
	var right = (currcellPos + 1)%5;
	TweenMax.to($("#cell" + left),1,{opacity: 0.3});
	TweenMax.to($("#cell" + right),1,{opacity: 0.3});
  	//console.log("Currcell: " + currcellPos);
  	//console.log("Current contents: " + carouselNotes);
}

function prevClick(){
	for(var i = 0 ; i < 5 ; i++)
	{
	TweenMax.to($("#cell" + currcellPos),1,{opacity: 0.3});
	TweenMax.to($("#cell" + (currcellPos+1)%5),1,{opacity: 1});
	TweenMax.to($("#cell" + (currcellPos+3)%5),1,{opacity: 0.3});
	TweenMax.to($("#cell" + (currcellPos+4)%5),1,{opacity: 1});
	}
	carouselNotes[(currcellPos+2)%5] = (carouselNotes[(currcellPos+2)%5]+currNotes.length-5)%currNotes.length;
	var tempnote = currNotes[carouselNotes[(currcellPos+2)%5]];
	var cellID = "#cell" + (currcellPos+2)%5;
	$(cellID).find(".modalcard").remove();
	if(tempnote.imageURL){
//		console.log('imgg');
		noteHtml = '<img class = "modalcard" src="'+tempnote.imageURL+'"></img><div class="modalcard text-element" style="bottom: -30%"><p style="width: 100%">'+tempnote.text+'</p><h6 style="margin-top: 20px; width: 100%; text-align: right">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							imgUrl: e.data.noteData.imageURL,
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#image-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
		.css({'display' : 'flex'});
	}
	else if(tempnote.videoURL){
//		console.log('vidd');
		noteHtml = '<iframe class="modalcard" src="'+embed(tempnote.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="modalcard text-element" style="bottom: -40%">'+tempnote.text+'<h6 style="text-align: right;">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							videoUrl: embed(e.data.noteData.videoURL),
							commentsCount: commentsc ,
							likesCount: likesc
						}
						var template = $('#video-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
	}
	else {
//		console.log('notee');
		noteHtml = '<div class="modalcard note text-note" style="background-color: '+getRandomColor()+'"><h2 style="text-align: center">'+tempnote.text+'</h2><h6 style="text-align: right; width: 100%">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#text-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
	}
	currcellPos = (currcellPos + 4)%5;
  	//console.log("Currcell: " + currcellPos);
  	//console.log("Current contents: " + carouselNotes);

}

function nextClick(){
	for(var i = 0 ; i < 5 ; i++)
	{
	TweenMax.to($("#cell" + currcellPos),1,{opacity: 0.3});
	TweenMax.to($("#cell" + (currcellPos+1)%5),1,{opacity: 1});
	TweenMax.to($("#cell" + (currcellPos+2)%5),1,{opacity: 0.3});
	TweenMax.to($("#cell" + (currcellPos+4)%5),1,{opacity: 1});
	}
	carouselNotes[(currcellPos+3)%5] = (carouselNotes[(currcellPos+3)%5]+5)%currNotes.length;
	var tempnote = currNotes[carouselNotes[(currcellPos+3)%5]];
	var cellID = "#cell" + (currcellPos+3)%5;
	$(cellID).find(".modalcard").remove();
	if(tempnote.imageURL){
//		console.log('imgg');
		noteHtml = '<img class = "modalcard" src="'+tempnote.imageURL+'"></img><div class="modalcard text-element" style="bottom: -30%"><p style="width: 100%">'+tempnote.text+'</p><h6 style="margin-top: 20px; width: 100%; text-align: right">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							imgUrl: e.data.noteData.imageURL,
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#image-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
		.css({'display' : 'flex'});
	}
	else if(tempnote.videoURL){
//		console.log('vidd');
		noteHtml = '<iframe class="modalcard" src="'+embed(tempnote.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="modalcard text-element" style="bottom: -40%">'+tempnote.text+'<h6 style="text-align: right;">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							videoUrl: embed(e.data.noteData.videoURL),
							commentsCount: commentsc ,
							likesCount: likesc
						}
						var template = $('#video-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
	}
	else {
//		console.log('notee');
		noteHtml = '<div class="modalcard note text-note" style="background-color: '+getRandomColor()+'"><h2 style="text-align: center">'+tempnote.text+'</h2><h6 style="text-align: right; width: 100%">-- '+tempnote.name+' <span style="font-size: smaller; font-weight: 400">'+tempnote.branch+'</span></h6></div>';
		$(noteHtml).appendTo(cellID)
		.click({noteData: tempnote}, function(e) {
//						console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#text-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					});
	}
	currcellPos = (currcellPos + 1)%5;
  	//console.log("Currcell: " + currcellPos);
  	//console.log("Current contents: " + carouselNotes);
}

function dynamicUpdate(xi,notes) {
	if (xi.matches) { //Mobile-Site
		console.log("In mobile site");
		if(firstTimeMob == 0)
			$("#board" + 0 + ".scrap-board").show();
		else
		firstTimeMob = 0;
		if(firstTimeDesk == 0)
			$("#board" + displayBoard + ".scrap-board").hide();
		if(currNotesMob.length !== notes.length) {
			var totnotes = notes.length;	
			noteHeight = 15;
			noteWidth = 30;
			marginU = 2;
			marginL = 1;
			var noteHtml;
			var note;
			for(var i = lastIndexMob ; i < totnotes ; i++){
				noteHtml = '';
				note = notes[i];
				var newText = note.text.split(/\s+/).slice(0,10).join(" ");
				if(newText.length>0)
				newText= newText+"<br>...... Read More";
				lastIndexMob++;
				if(note.imageURL){
					noteHtml = '<div class="note image-note"><div class="img-element"><img src="'+note.imageURL+'"></div><div class="text-element"><p>'+newText+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo("#board0.scrap-board")
					.mouseenter(function(e) {
					TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
					})
					.mouseleave(function(e) {
					TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
					})
					.click({noteData: note}, function(e) {
		//			console.log(e.data.noteData);
					findDisqusThread(parseInt(e.data.noteData.created));
					var likesc = 0;
					var commentsc = 0;
					var data = {
					name: e.data.noteData.name,
					branch: e.data.noteData.branch,
					text: e.data.noteData.text,
					time: getTimeString(parseInt(e.data.noteData.created)),
					actualTime: parseInt(e.data.noteData.created),
					imgUrl: e.data.noteData.imageURL,
					commentsCount: commentsc,
					likesCount: likesc
					}
					var template = $('#image-note-view-template').html();
					var compiledTemplate = Handlebars.compile(template);
					var result = compiledTemplate(data);
					$.featherlight(result);
					})
					.css( {'display' : 'flex'});
					renderedElem++;
				}
				else if(note.videoURL){
					// noteHtml = '<div class="note video-note"><div class="video-element"><iframe src="'+embed(note.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><div class="text-element"><p>'+note.text+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
					noteHtml = '<div class="note video-note" style="background-image: url('+"https://img.youtube.com/vi/"+getYoutubeId(note.videoURL)+"/0.jpg"+');background-size: cover;background-repeat: no-repeat; background-position: center;"'+'><div class="video-element"><img style="width:50%;height:50%;display:block;margin:auto;" src="assets/playbutton.png"></div><div class="text-element"><p>'+newText+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
					$(noteHtml).appendTo("#board" + 0 + ".scrap-board")
					.mouseenter(function(e) {
						TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
					})
					.mouseleave(function(e) {
						TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
					})
					.click({noteData: note}, function(e) {
		//				console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							videoUrl: embed(e.data.noteData.videoURL),
							commentsCount: commentsc ,
							likesCount: likesc
						}
						var template = $('#video-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({ 'display' : 'flex'});
					renderedElem++;
				}
				else {
					noteHtml = '<div class="note text-note"><span id="noteText">'+newText+'</span><span style="text-align: right; width: 100%">-- '+note.name+'</span><span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></div>';
					$(noteHtml).appendTo($("#board0.scrap-board"))
					.click({noteData: note}, function(e) {
		//				console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
							name: e.data.noteData.name,
							branch: e.data.noteData.branch,
							text: e.data.noteData.text,
							time: getTimeString(parseInt(e.data.noteData.created)),
							actualTime: parseInt(e.data.noteData.created),
							commentsCount: commentsc,
							likesCount: likesc
						}
						var template = $('#text-note-view-template').html();
						var compiledTemplate = Handlebars.compile(template);
						var result = compiledTemplate(data);
						$.featherlight(result);
					})
					.css({'background' : getRandomColor(), 'display' : 'flex'});
					renderedElem++;
				}
			}
			$(".note").css({'height': noteHeight+'%', 'width': noteWidth+'%', 'margin-top': marginU+'%', 'margin-left': marginL+'%'});
			$("#noteText").css({'font-size' : '0.1vw'});
			$("#noteText").css({'font-size' : '0.1vw'});
			$("#noteText").css({'font-size' : '0.1vw'});
	
			currNotesMob = notes;
		}
	} else { //Desktop -SITE
		console.log("In Desktop Site");
		if(firstTimeDesk == 0)
			$("#board" + displayBoard + ".scrap-board").show();
		else
			firstTimeDesk = 0;
		if(firstTimeMob == 0)
			$("#board" + 0 + ".scrap-board").hide();
			if(currNotesDesk.length !== notes.length) {
				//$(".scrap-board").html("");
		
				/*--
				* Infinity View Implementation
				*
				*/
				var totnotes = notes.length;	
				/*
				cols = Math.ceil(Math.pow(totnotes,0.67));
				rows = Math.ceil(totnotes/cols);
				totHeight = Math.ceil(90/rows);
				totWidth = Math.ceil(100/cols);
				noteHeight = 0.9 * totHeight;
				noteWidth = 0.9 * totWidth;
				marginU = 0.05 * totHeight;
				marginL = 0.05 * totWidth;
		
				console.log(totnotes);
				console.log(cols);
				console.log(rows);
				console.log(totHeight);
				console.log(totWidth);
				console.log(noteHeight);
				console.log(noteWidth);
				console.log(marginU);
				console.log(marginB);
				console.log(marginL);
				console.log(marginR);
		*/
			//	TweenMax.staggerFrom(".note",2,{opacity: 0}, 2);
				noteHeight = 26;
				noteWidth = 14;
				marginU = 2;
				marginL = 2;
		
				noOfBoards = Math.ceil(totnotes/itemsPerBoard);
				if(noOfBoards <= 1)
				{
					$(".nextbtn").addClass('disabled');
					$(".nextbtn").css({'cursor':'auto'});
				}
				var noteHtml;
				var note;
				var currBoard; 	
				for(var i = lastIndexDesk ; i < totnotes ; i++){
					noteHtml = '';
					note = notes[i];
					currBoard = "#board" + Math.ceil((i+1)/itemsPerBoard) + ".scrap-board";
					if(i != 0 && i % itemsPerBoard == 0)
					{
						$(".scrapboards").append('<div id="board' + Math.ceil((i+1)/itemsPerBoard) + '" class="scrap-board"></div>');
						$(currBoard).hide();
						console.log(currBoard);
						if(i == itemsPerBoard)
							$(".nextbtn").css({'cursor':'pointer'});
					}
			//		console.log(note.imageURL);
			//		console.log('Bridge');
			//		console.log(note.videoURL);
					var newTextforText = note.text.split(/\s+/).slice(0,6).join(" ");
					var newTextforImage = note.text.split(/\s+/).slice(0,3).join(" ");
					if(newTextforText.length>0)
					newTextforText= newTextforText+" ...... ";
					if(newTextforImage.length>0)
					newTextforImage= newTextforImage+" ...... ";
					lastIndexDesk++;
					if(note.imageURL){
						noteHtml = '<div class="note image-note"><div class="img-element"><img src="'+note.imageURL+'"></div><div class="text-element"><p>'+newTextforImage+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
						$(noteHtml).appendTo(currBoard)
						.mouseenter(function(e) {
						TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
						})
						.mouseleave(function(e) {
						TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
						})
						.click({noteData: note}, function(e) {
			//			console.log(e.data.noteData);
						findDisqusThread(parseInt(e.data.noteData.created));
						var likesc = 0;
						var commentsc = 0;
						var data = {
						name: e.data.noteData.name,
						branch: e.data.noteData.branch,
						text: e.data.noteData.text,
						time: getTimeString(parseInt(e.data.noteData.created)),
						actualTime: parseInt(e.data.noteData.created),
						imgUrl: e.data.noteData.imageURL,
						commentsCount: commentsc,
						likesCount: likesc
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
						// noteHtml = '<div class="note video-note"><div class="video-element"><iframe src="'+embed(note.videoURL)+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><div class="text-element"><p>'+note.text+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
						noteHtml = '<div class="note video-note" style="background-image: url('+"https://img.youtube.com/vi/"+getYoutubeId(note.videoURL)+"/0.jpg"+');background-size: cover;background-repeat: no-repeat; background-position: center;"'+'><div class="video-element"><img style="width:50%;height:50%;display:block;margin:auto;" src="assets/playbutton.png"></div><div class="text-element"><p>'+newTextforImage+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>';
		
						$(noteHtml).appendTo(currBoard)
						.mouseenter(function(e) {
							TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
						})
						.mouseleave(function(e) {
							TweenMax.to($(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
						})
						.click({noteData: note}, function(e) {
			//				console.log(e.data.noteData);
							findDisqusThread(parseInt(e.data.noteData.created));
							var likesc = 0;
							var commentsc = 0;
							var data = {
								name: e.data.noteData.name,
								branch: e.data.noteData.branch,
								text: e.data.noteData.text,
								time: getTimeString(parseInt(e.data.noteData.created)),
								actualTime: parseInt(e.data.noteData.created),
								videoUrl: embed(e.data.noteData.videoURL),
								commentsCount: commentsc ,
								likesCount: likesc
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
						noteHtml = '<div class="note text-note"><span id="noteText">'+newTextforText+'</span><span style="text-align: right; width: 100%">-- '+note.name+'</span><span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></div>';
						$(noteHtml).appendTo(currBoard)
						.click({noteData: note}, function(e) {
			//				console.log(e.data.noteData);
							findDisqusThread(parseInt(e.data.noteData.created));
							var likesc = 0;
							var commentsc = 0;
							var data = {
								name: e.data.noteData.name,
								branch: e.data.noteData.branch,
								text: e.data.noteData.text,
								time: getTimeString(parseInt(e.data.noteData.created)),
								actualTime: parseInt(e.data.noteData.created),
								commentsCount: commentsc,
								likesCount: likesc
							}
							var template = $('#text-note-view-template').html();
							var compiledTemplate = Handlebars.compile(template);
							var result = compiledTemplate(data);
							$.featherlight(result);
						})
						.css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)', 'background' : getRandomColor(), 'display' : 'flex'});
						renderedElem++;
					}
				}
				$(".note").css({'height': noteHeight+'%', 'width': noteWidth+'%', 'margin-top': marginU+'%', 'margin-left': marginL+'%'});
				$("#noteText").css({'font-size' : '0.1vw'});
				$("#noteText").css({'font-size' : '0.1vw'});
				$("#noteText").css({'font-size' : '0.1vw'});
		
				currNotesDesk = notes;
			}
    }
}

x = window.matchMedia("(max-device-width: 1080px)");
fetchNotes(x);
x.addListener(fetchNotes);

