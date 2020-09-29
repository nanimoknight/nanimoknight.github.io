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