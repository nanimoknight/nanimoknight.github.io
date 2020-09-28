// Name: Rebecca Rollins
// File: gallery.js
// Date: 9/26/20
// Description: Display art media galleries

(function () {

	'use strict';

	// Global variablesS

	// Setup
	window.onload = function() {
		// Set up Modal for images if Modal div is present
		var modal = document.getElementById("myModal");
	    if(modal){
	        createModal(modal);
	    }
		
		// Make sure only one media plays at a time
		onlyPlayOneIn(document.body);

	};

	function createModal(modal){
		var img = document.getElementsByClassName("modal-img");
		var modalImg = document.getElementById("img-in-modal");
		var caption = document.getElementById("caption");
		var i;
		for(i=0;i< img.length;i++) {    
			img[i].onclick = function(){
				modal.style.display = "block";
				modalImg.src = this.src;

				var tag = document.createElement("p");
				var captionText = document.createTextNode(this.alt);
   				tag.appendChild(captionText);
				caption.appendChild(tag);
			}
		}

		var span = document.getElementsByClassName("close")[0];
		span.onclick = function() { 
		   modal.style.display = "none";
		   caption.innerHTML = "";
		}
	}

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
})();