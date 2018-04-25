//cloudinary.setCloudName('dhrqglqw8');

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

var validForm = false;
var imgUrl = null;

var notes = [];

var scrapBoard = document.querySelector(".scrap-board");
var body = document.querySelector("body");

$(document).ready(function(e) {
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

	$(".add-btn").click(function(e) {
		TweenMax.to(".add-container", 1, {right: "0vw", ease:Power2.easeInOut});
	});

	$(".close-btn").click(function(e) {
		TweenMax.to(".add-container", 1, {right: "-45vw", ease:Power2.easeInOut});
	});

	$(".dz-default.dz-message").html("<b>Drop an Image here to upload.</b><br><span>Or Click here to select a file.</span>");


	$("#option1").click(function(){
		var exists = $("#label1").hasClass("active");
		if(!exists)
		{
			$("#label1").addClass("active");	
			$("#label2").removeClass("active");
			$("#video-select").hide();	
			$("#image-select").show();	
		}
	});


	$("#option2").click(function(){
		var exists = $("#label2").hasClass("active");
		if(!exists)
		{
			$("#label2").addClass("active");	
			$("#label1").removeClass("active");
			$("#image-select").hide();	
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
		if(validForm) {
			axios.post('http://localhost:3000/notes/add', {
			    name: $("#name-field").val(),
			    branch: $("#branch-field").val(),
			    text: $("#text-message").val(),
			    imageUrl: imgUrl,
			    videourl: $("#video-field").val()
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
			    	notes.push(response.data.d);
			    	updateView();
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

	$(".text-note").each(function(){
		$(this).css({'background' : getRandomColor()});
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
	});

	//console.log(body);
	//console.log(scrapBoard)
	
})


var checkSendValidity = function(){
	console.log($("#text-message").val()+ ' '+ $("#name-field").val() + ' ' + $("#branch-field").val())
	if($("#text-message").val() != '' && $("#name-field").val() != '' && $("#branch-field").val() != null)
	{
		var regex = /^(https:\/\/www\.youtube\.com\/watch.*)|(https:\/\/youtu\.be\/.*)$/;
		var givenUrl = $("#video-field").val();
		if(givenUrl!='' || givenUrl != undefined){
			var matchStatus = givenUrl.match(regex);
			if(!matchStatus){
				$("#video-field").val('');
				$("#video-field").attr("placeholder","Error! Please enter valid youtube url");
				return false;
			}
		}
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
	    	notes = response.data.notes;
	    	updateView();
	    }
	})
	.catch(function (error) {
	    console.log(error);
	});

}

var updateView = function() {
	console.log(notes);
	$(".scrap-board").html("");
	notes.map(function(note) {
		console.log(note);
		if(note.imageURL){
			$(".scrap-board").append(
				'<div class="note image-note"><div class="img-element"><img src="'+note.imageURL+'"></div><div class="text-element"><p>'+note.text+'</p><h6 style="text-align: right;">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div></div>'
			);
		}
		else {
			$(".scrap-board").append(
				'<div class="note text-note"><h2>'+note.text+'</h2><h6 style="text-align: right; width: 100%">-- '+note.name+' <span style="font-size: smaller; font-weight: 400">'+note.branch+'</span></h6></div>'
			);
		}
	});

	console.log("here");
	$(".image-note").mouseenter(function(e) {
		TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "0", ease:Power2.easeInOut});
	});
	console.log("here2");
	$(".image-note").mouseleave(function(e) {
		TweenMax.to( $(this).find('.text-element'), 0.5, {bottom: "-50%", ease:Power2.easeInOut});
	});

	$(".note").each(function(){
		$(this).css({'transform' : 'rotate('+ Math.floor(Math.random() * Math.floor(20) * (Math.round(Math.random()) * 2 - 1)) +'deg)'});
	});

	$(".text-note").each(function(){
		$(this).css({'background' : getRandomColor()});
	});
	var columnSize = 4;
	var n = notes.length;
	var a = Math.pow(n/2, 0.5);
	var b = a - Math.floor(a);
	if(b > 0.5 || b == 0)
	{
		columnSize = 2 * Math.ceil(a);
	}
	else {
		var c = n % (2 * Math.floor(a));
		if(c > Math.floor(a)){
			columnSize = 2 * Math.floor(a) + 2;
		}
		else {
			columnSize = 2 * Math.floor(a) + 1;
		}
	}

	$(".scrap-board").width(columnSize * 310);
	var minScale = body.clientWidth/scrapBoard.clientWidth ;
	$(".scrap-board").panzoom("option", "minScale", minScale).panzoom("zoom", minScale).panzoom("pan", 0, 0);
	console.log(minScale);

	//$(".scrap-board").panzoom("zoom", 2.0);
}

function getRandomColor() {
  color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
  return color;
}