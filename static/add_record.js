// add, find, update, clear buttons
var addButton = document.getElementById('add');
var findButton = document.getElementById('find');
var updateButton = document.getElementById('update');
var clearButton = document.getElementById('clear');

// Feedback message
var msg = document.getElementById('msg');

// text input fields
var id = document.getElementById('db_id');
var herbName = document.getElementById('herbName');
var binomialName = document.getElementById('binomialName');
var benefits = document.getElementById('benefits');
var toxicity = document.getElementById('toxicity');


// adding a record to database - clicking the "add" button
addButton.addEventListener('click', function(){
		if (herbName.value.trim() && binomialName.value.trim() && benefits.value.trim() && toxicity.value.trim()){
			
			var toServer = JSON.stringify({
					'herbName': herbName.value.trim(),
					'binomialName': binomialName.value.trim(),
					'benefits': benefits.value.trim(),
					'toxicity': toxicity.value.trim()
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
					
					herbName.value = data['res'][0];
					binomialName.value = data['res'][1];
					benefits.value = data['res'][2];
					toxicity.value = data['res'][3];
					
					msg.textContent = 'Data successfully received from server.';
				}
			}
		} else {
			msg.textContent = 'Please enter a valid id';
		}
		
}, false);


// update a record in database with "update" button
updateButton.addEventListener('click', function(){
		if(id.value.trim() && herbName.value.trim() && binomialName.value.trim() && benefits.value.trim() && toxicity.value.trim()){
				var toServer = JSON.stringify({
					'id': id.value.trim(),
					'herbName': herbName.value.trim(),
					'binomialName': binomialName.value.trim(),
					'benefits': benefits.value.trim(),
					'toxicity': toxicity.value.trim()
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


// "clear" button functionality
clearButton.addEventListener('click', function(){
			id.value = ''; 
			herbName.value = '';
			binomialName.value = '';
			benefits.value = '';
			toxicity.value = '';
			msg.innerHTML = '';			
			
}, false);