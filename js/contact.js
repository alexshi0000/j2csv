var contactState = 'active'

function validEmail(email) {
	if (!email || email == '' || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		return true
	return false
}

function send() {
	let description = document.getElementById('description').value
	let email = document.getElementById('email').value
	if (!validEmail(email)) {
		alert('Please enter a valid email')
	} else if (description.length < 1) {
		alert('Please enter a description for your feature request')
	} else {
		try {
			const Http = new XMLHttpRequest()
			const url = 'https://protected-lake-99960.herokuapp.com/add?email=' +
				    email + '&message=' + description
			Http.open('POST', url)
			Http.send()
		} catch (err) {
			console.log(err)
		}
		contactState = 'inactive'
		contactForm()
	}
}

function returnBack() {
	window.location.href = './index.html'
}

function generateForm() {
	if (contactState == 'active') {
		var ret = '' +
			"<div class='separator'></div>" +
			"<div class='centered-content'>" +
				"<h1 class='title'>feature request</h1>" +
			"</div>" +
			"<div class='separator'></div>" +
			"<div id='contact-form' class='centered-content'>" +
				"<p class='subtitle'>Email (optional)</p>" +
				"<textarea id='email' rows='1' placeholder='youremail@xy.com'></textarea>" +
				"<p class='subtitle'>Description</p>" +
				"<textarea id='description' rows='12' placeholder='describe the feature in as much detail as you can here.'></textarea>" +
			"</div>" +
			"<div class='centered-content'>" +
				"<button onclick='send()' type='button' class='button'>send request</button>" +
			"</div>"
	} else {
		var ret = '' +
			"<div class='separator'></div>" +
			"<div class='centered-content'>" +
				"<h1 class='title'>thank you for the suggestion</h1>" +
				"<button onclick='returnBack()' type='button' class='button' style='float: left'>click here go back</button>" +
			"</div>"
	}
	return ret
}

function contactForm() {
	let form = document.getElementById('contact-page')
	form.innerHTML = generateForm()
}
