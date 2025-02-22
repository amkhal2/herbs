// Declaring General-Scope Variables

var herbBtn = document.getElementById('getHerb'); // search button
var msg = document.getElementById('msg');	// "msg" empty div
var elShow_more = document.getElementById('show_more');	// "show_more" empty div
var herbsSelectBox = document.getElementById('herb');	// herb select box
var elSearch = document.getElementById('search'); // search bar

// get the <select> box items from database

window.addEventListener('load', function(){
		// Make GET Request to obtain Speakers from db
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/selectBox', true);
		xhr.send();
		
		// Process the response
		xhr.onload = function(){
			if(xhr.status === 200){
				var data = JSON.parse(xhr.responseText);
				var herbs = '';
				for (var i=0; i < data['herbs'].length; i++){
					herbs += '<option value="' + i + '">' + data['herbs'][i] + '</option>';
				}

				herbsSelectBox.innerHTML = herbs;
				
			}
		}			
}, false);


// get selected herb and search database to get more details

herbBtn.addEventListener('click', function(){
	// empty the "show_more" div
	elShow_more.innerHTML = '';
	
	// get the selected option
	var selectedElement = herbsSelectBox.options[herbsSelectBox.selectedIndex].textContent;
	console.log(selectedElement);
	
	var toServer = JSON.stringify({ 'herb': selectedElement, 'page': 'home' });
	
	// Make POST request to query database with selected "herb"
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/search_selectbox', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(toServer);
	
	// Process the response
	xhr.onload = function(){
		if(xhr.status === 200){
			data = JSON.parse(xhr.responseText);
			
			var content = '';
			content += '<h3>Benefits of ' + data['res'][0][1]; 
			content += ' (<i>' + data['res'][0][2] + '</i>)' + '</h3>';
			
			content += '<ul class="list">';
			for (var i=0; i < data['res'][0][3].length; i++) {
				content += '<li>' + data['res'][0][3][i] + '</li>';
			}
			content += '</ul>';
			
			content += '<h3>Toxicity of ' + data['res'][0][1] + '</h3>';
			content += '<p>' + data['res'][0][4] + '</p>';
			
			msg.innerHTML = content;
			msg.scrollIntoView(); // make the msg DIV visible to the user 
		}
		
	}
		
}, false)




// The Ajax search bar "display results as you type"

elSearch.addEventListener('keyup', function(){
	var toServer = JSON.stringify({
		'input': elSearch.value, 'page':'home'	});
	
	// Make the request
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/search_db', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(toServer);
	
	// Process the response
	xhr.onload = function(){
		if (xhr.status === 200){
			data = JSON.parse(xhr.responseText);
			
			if (data['status'] === 'success') {
				var content = '';
				content += '<p id=\'resultCount\'>' + data['res'].length + ' results were found...</p>';
				content += '<table><tr> <th>Herb name</th> <th>Benefits</th> <th>Toxicity</th></tr>';
				
				for (var i=0; i < data['res'].length; i++){
					content += '<tr> <td>' + '<a href= "#" id="' + data['res'][i][0] + '">' + data['res'][i][1];
					content += ' (' + data['res'][i][2] + ') </a></td>';
					content += ' <td>'
					
					// creating the herb benefits bullets inside table cell
					content += '<ul>';
					for (var x=0; x < data['res'][i][3].length; x++) {
						content += '<li>' + data['res'][i][3][x] + '</li>';
					}
					content += '</ul>';
					
					content += '</td>';
					content += ' <td>' + data['res'][i][4] + '</td> </tr>';
					
				}

				
				content += '</table>';
				
				msg.innerHTML = content;
				
				
				
			} else {
				msg.textContent = data['res'];
				elShow_more.innerHTML = '';
				
			}
			
			
		}
	}
	
}, false);


// Using event delegation with links in the table to view details of specific row:

msg.addEventListener('click', function(e){
					var target = e.target;
					// disable link functionality
					e.preventDefault();
					
					if(target.tagName.toLowerCase() === 'a'){
						var id = target.getAttribute('id')
						console.log(id);
												
						// Send "id" via POST request to server
						var toServer = JSON.stringify({"id": id, "page":"home"})
						
						var xhr = new XMLHttpRequest();
						xhr.open('POST', '/show_more', true);
						xhr.setRequestHeader('Content-type', 'application/json');
						xhr.send(toServer);
						
						// get the response and insert it into "show_more" div
						xhr.onload = function(){
							if(xhr.status === 200) {
								data = JSON.parse(xhr.responseText);
								
								var content = '';
								content += '<h3>Benefits of ' + data['res'][0]; 
								content += ' (<i>' + data['res'][1] + '</i>)' + '</h3>';
								
								content += '<ul>';
								for (var i=0; i < data['res'][2].length; i++) {
									content += '<li>' + data['res'][2][i] + '</li>';
								}
								content += '</ul>';
								
								content += '<h3>Toxicity of ' + data['res'][0] + '</h3>';
								content += '<p>' + data['res'][3] + '</p>';
							
								elShow_more.innerHTML = content;
								 
								window.scrollTo(0,0); // Move to the top of the page
								 
								target.className = 'clicked'; // Highlight the link yellow
							}
						}					
					}							
}, false);


