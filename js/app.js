//cloudinary.setCloudName('dhrqglqw8');

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

var validForm = false;

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
		  		console.log(file);
		  		console.log(response);
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
	$("#video-link").blur(function(e) {
		var regex = /^(https:\/\/www\.youtube\.com\/watch.*)|(https:\/\/youtu\.be\/.*)$/;
		var givenUrl = $("#video-link").val();
		if(givenUrl!='' || givenUrl != undefined){
			var matchStatus = givenUrl.match(regex);
			if(!matchStatus){
				$("#video-link").val('');
				$("#video-link").attr("placeholder","Error! Please enter valid youtube url");
			}
		}
	});
})


var checkSendValidity = function(){
	console.log($("#text-message").val()+ ' '+ $("#name-field").val() + ' ' + $("#branch-field").val())
	if($("#text-message").val() != '' && $("#name-field").val() != '' && $("#branch-field").val() != null)
	{
		$(".send-btn").removeClass('disabled');
		return true;
		
	}

	return false;
	
}
