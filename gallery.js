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
		test("art/digital paintings/", document.getElementById('galleryList'));
		// addArt(document.getElementById())

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

	function test(folder, galleryList) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/art/digital paintings", true);
		xhr.responseType = 'document';
		xhr.onload = () => {
		  console.log("in test xhr onload");
		  if (xhr.status === 200) {
		  	console.log("in status 200");
		    var elements = xhr.response.getElementsByTagName("a");
		    for (x of elements) {
		      if ( x.href.match(/\.(jpe?g|png|mp4)$/) ) { 
		          console.log("add file " + x);
		      } 
		    };
		  } 
		  else {
		    alert('Request failed. Returned status of ' + xhr.status);
		  }
		}
		xhr.send();
	}

	function addArt(fileName) {
		var type;
		var folder = "art/digital paintings/";
		var i;
		for(i=0; i < 5; i++) {
			var galleryElement = document.createElement('gallery'); 
			fileName = "092420"
			type = "png"
			if (type == jpg || type == png) {
				// Load png or jpeg image
				var image = document.createElement('img');  
            	image.dataset.src = folder + "/" + fileName; 
            	image.alt = fileName;
            	image.width = "100%"
            	image.classList.appendChild("modal-img", "lazy")

            	var description = document.createElement('div'); 
            	description.innerHTML = fileName;

            	galleryElement.appendChild(image);
            	galleryElement.appendChild(description);
			}
			else if (type == mp4) {
				// load mp4 video
				var video = document.createElement('video');
            	video.width = "100%"
            	video.controls = true
            	video.loop = true

            	var source = document.createElement('source');
            	source.src = folder + "/" + fileName;
            	source.type = "video/mp4"

            	video.innerHTML = "Your browser does not support the video tag."
            	video.appendChild(source);

            	var description = document.createElement('div'); 
            	description.innerHTML = fileName;

            	galleryElement.appendChild(video);
            	galleryElement.appendChild(description);
			}
			else if (type == wav || mp3) {
				// load wav or mp3 song
			}
			else {
				consolg.log("Error : could not load media of type " + type);
				return;
			}
			
			// Add galleryElement 
            document.getElementById('galleryList').appendChild(galleryElement);
		}
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