// add, find, update, clear buttons
var addButton = document.getElementById('add');
var findButton = document.getElementById('find');
var updateButton = document.getElementById('update');
var clearButton = document.getElementById('clear');

// select box
var selectBox = document.getElementById('speakerList');	

// Update speaker
var btnUpdateSpeaker = document.getElementById('updateSpeaker');
var updateContainer = document.getElementById('updateCont');
var newSpeaker = document.getElementById('newSpeaker');
var update = document.getElementById('executeUpdate');

// Feedback message
var msg = document.getElementById('msg');

// text input fields
var id = document.getElementById('db_id');
var ch_no = document.getElementById('ch_no');
var ch_title = document.getElementById('ch_title');
var speaker = document.getElementById('speaker');
var content = document.getElementById('content');

// adding a record to database - clicking the "add" button
addButton.addEventListener('click', function(){
		if (ch_no.value.trim() && ch_title.value.trim() && speaker.value.trim() && content.value.trim()){
			
			var toServer = JSON.stringify({
					'ch_no': ch_no.value.trim(),
					'ch_title': ch_title.value.trim(),
					'speaker': speaker.value.trim(),
					'content': content.value.trim()
					});
			// Send data via POST request to server to be added to db 
			// Make the request
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/add_record', true);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(toServer);
			
			// process server response
			xhr.onload = function(){
				if(xhr.status === 200){
					data = JSON.parse(xhr.responseText);
					
					msg.textContent = data['res'];
					id.value = data['id'];
			
				}
			}
			
		} else {
			msg.textContent = 'One or more fields is empty!...';
			
		}
		

		
}, false);

// looking up a record in database using "find" button
findButton.addEventListener('click', function(){
		if(id.value.trim()) {
			var toServer = JSON.stringify({ 'id': id.value.trim(),
											"page": "record"
									});
			
			// Make POST request to server to obtain data
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/show_more', true);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(toServer);
			
			// Process the response
			xhr.onload = function(){
				if(xhr.status === 200){
					data = JSON.parse(xhr.responseText);
					
					ch_no.value = data['res'][0];
					ch_title.value = data['res'][1];
					speaker.value = data['res'][2];
					content.value = data['res'][3];
					
					msg.textContent = 'Data successfully received from server.';
				}
			}
		} else {
			msg.textContent = 'Please enter a valid id';
		}
		
}, false);


// "clear" button functionality
clearButton.addEventListener('click', function(){
			id.value = ''; 
			content.value = '';
			msg.innerHTML = '';			
			
}, false);


// update a record in database with "update" button
updateButton.addEventListener('click', function(){
		if(id.value.trim() && ch_no.value.trim() && ch_title.value.trim() && speaker.value.trim() && content.value.trim()){
				var toServer = JSON.stringify({
					'id': id.value.trim(),
					'ch_no': ch_no.value.trim(),
					'ch_title': ch_title.value.trim(),
					'speaker': speaker.value.trim(),
					'content': content.value.trim()
					});
				
				// send data to server via POST request
				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'update_record', true);
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.send(toServer);
				
				// analyse server response
				xhr.onload = function(){
					if(xhr.status === 200){
						data = JSON.parse(xhr.responseText);
						
						msg.textContent = data['res'];
						
					}
				}

			
			
		} else {
			msg.textContent = 'One of the fields is empty!...';
		}	
		
}, false);


// get the <select> box items from database

window.addEventListener('load', function(){
		// Make GET Request to obtain Speakers from db
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/selectBox', true);
		xhr.send();
		
		// Process the response
		xhr.onload = function(){
			if(xhr.status === 200){
				data = JSON.parse(xhr.responseText);
				var str = '';
				for (var i=0; i < data['speakers'].length; i++){
					str += '<option value="' + i + '">' + data['speakers'][i] + '</option>';
				}
				selectBox.innerHTML = str;
			}
		}			
}, false);



// Update Speaker in database

btnUpdateSpeaker.addEventListener('click', function(){
			updateContainer.style.display = 'inline';
			newSpeaker.value = selectBox.options[selectBox.selectedIndex].textContent;
}, false);

update.addEventListener('click', function(){
			var oldValue = selectBox.options[selectBox.selectedIndex].textContent;
			var newValue = newSpeaker.value;
			
			var toServer = JSON.stringify({
				'oldValue': oldValue,
				'newValue': newValue
			})
			
			// Send data via POST request to server
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/update_speaker', true);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(toServer);
			
			// Process response
			xhr.onload = function(){
					if(xhr.status === 200){
						data = JSON.parse(xhr.responseText);
						
						updateContainer.style.display = 'none';
						msg.textContent = data['res'];
					}
			}
			

	
}, false);