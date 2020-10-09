// Name: Rebecca Rollins
// File: gallery.js
// Date: 9/26/20
// Description: Display art media galleries

(function () {

	'use strict';

	// Global variables  
	var lazyloadThrottleTimeout;

	// Setup
	window.onload = function() {
		// Load the gallery depending on the page
		var path = window.location.pathname;
		// Get html file name to use for laoding the correct gallery
		var page = path.split("/").pop().slice(0, -5);
		LoadGallery(page);

		// Set up Modal for images if Modal div is present
		var modal = document.getElementById("myModal");
	    if(modal){
	        createModal(modal);

	        // Lazy image load
		  	lazyload(modal);
		  	document.addEventListener("scroll", lazyload);
			window.addEventListener("resize", lazyload);
			window.addEventListener("orientationChange", lazyload);
	    }
		
		// Make sure only one media plays at a time
		onlyPlayOneIn(document.body);

	};

	function LoadGallery(galleryType) {
		var fileList = "/art/" + galleryType + "/fileList.html";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", fileList, true);
		xhr.responseType = 'document';
		xhr.onload = () => {
		  if (xhr.status === 200) {
		    var elements = xhr.response.getElementsByTagName("div");
		    for (var i = 0; i < elements.length; i++) {
		    	if (elements[i].classList.contains(header)) {
		    		// Create new header
		    		hr = document.createElement('hr');
		    		var title = document.createElement('h3');
		    		title.innerHtml = elements[i].innerHTML;
		    		document.getElementById('galleryList').appendChild(hr);
		    		document.getElementById('galleryList').appendChild(title);
		    		document.getElementById('galleryList').appendChild(hr);
		    	}
		    	else {
		    		console.log("add file " + elements[i].innerHTML);
	          		addArt(galleryType, elements[i], section);
		    	}
		    }
		  } 
		  else {
		    alert('Request failed. Returned status of ' + xhr.status);
		  }
		}
		xhr.send();
	}

	function addArt(galleryType, fileLink) {
		var fullPath = "art/" + galleryType + "/" + fileLink.src;
		var type = filePath.split('.').pop();
		var filename = fileLink.innerHTML;
		var galleryElement = document.createElement('div');
		galleryElement.classList.add("gallery");

		if (type == "jpg" || type == "png") {
			// Load png or jpeg image
			var image = document.createElement('img');  
        	image.dataset.src = fullPath
        	image.alt = filename;
        	image.classList.add("modal-img", "lazy");
        	galleryElement.appendChild(image);
		}
		else if (type == "mp4") {
			// load mp4 video
			var video = document.createElement('video');
        	video.width = "100%";
        	video.controls = true;
        	video.loop = true;
        	video.classList.add("playable-media");

        	var source = document.createElement('source');
        	source.src = fullPath;
        	source.type = "video/mp4";

        	video.innerHTML = "Your browser does not support the video tag.";
        	video.appendChild(source);
        	galleryElement.appendChild(video);
		}
		else if (type == "wav" || "mp3") {
			// load wav or mp3 song
			var image = document.createElement('img');  
        	image.dataset.src = "art/musicArtwork/" + filename + ".png"; 
        	image.alt = filename;
        	image.classList.add("modal-img", "lazy");

			var audio = document.createElement('audio');
        	audio.controls = true;
        	audio.loop = true;
        	audio.classList.add("playable-media");

        	var source = document.createElement('source');
        	source.src = fullPath;
        	if(mp3) {
        		source.type = "audio/mpeg";
        	}
        	else {
        		source.type = "audio/wav";
        	}

        	audio.innerHTML = "Your browser does not support the audio element.";
        	audio.appendChild(source);
        	galleryElement.appendChild(audio);
		}
		else {
			consolg.log("Error : could not load media of type " + type);
			return;
		}

		// Add the description
		var description = document.createElement('div'); 
        description.innerHTML = filename;
		description.classList.add("desc");
		galleryElement.appendChild(description);
		
		// Add galleryElement 
        document.getElementById('galleryList').appendChild(galleryElement);
	}

	// Set up modal capability for image. Called during lazy loading
	function prepModalForImage(image, modal) {
		var modalImg = document.getElementById("img-in-modal");
		var caption = document.getElementById("caption");
		image.onclick = function(){
			modal.style.display = "block";
			modalImg.src = this.src;

			var tag = document.createElement("p");
			var captionText = document.createTextNode(this.alt);
				tag.appendChild(captionText);
			caption.appendChild(tag);
		}
	}

	// Set up the modal
	function createModal(modal){
		var img = document.getElementsByClassName("modal-img");
		var modalImg = document.getElementById("img-in-modal");
		var caption = document.getElementById("caption");
		var i;

		var span = document.getElementsByClassName("close")[0];
		span.onclick = function() { 
		   modal.style.display = "none";
		   caption.innerHTML = "";
		}

		// Close modal on click ouside image
		modal.onclick = function(event) {
			if (!$(event.target).is('#img-in-modal')) {
			   modal.style.display = "none";
			   caption.innerHTML = "";
			}
		}
	}

	// Make sure only one media can play at a time
	function onlyPlayOneIn(container) {
		container.addEventListener("play", function(event) {
			var audio_elements = container.getElementsByClassName("playable-media")
			var i;
			for(i=0; i < audio_elements.length; i++) {
			  var audio_element = audio_elements[i];
			  if (audio_element !== event.target) {
			    audio_element.pause();
			  }
			}
		}, true);
	}

	// Lazy image loading
	function lazyload (modal) {
		var lazyloadImages = document.querySelectorAll("img.lazy");
		if(lazyloadThrottleTimeout) {
		  clearTimeout(lazyloadThrottleTimeout);
		}  
		console.log("Lazy count");
		console.log(lazyloadImages.length);

		lazyloadThrottleTimeout = setTimeout(function() {
		    var scrollTop = window.pageYOffset;
		    lazyloadImages.forEach(function(img) {
		        if(img.offsetTop < (window.innerHeight + scrollTop)) {
		          img.src = img.dataset.src;
		          img.classList.remove('lazy');
		          prepModalForImage(img, modal);
		        }
		    });
		    if(lazyloadImages.length == 0) { 
		      document.removeEventListener("scroll", lazyload);
		      window.removeEventListener("resize", lazyload);
		      window.removeEventListener("orientationChange", lazyload);
		    }
		}, 20);
	}

})();
