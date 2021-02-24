bootstrapValidate('#people-input', 'integer:Please choose a valid amount of people.')

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    startDate: "today",
    todayHighlight: true
});

$('.clockpicker').clockpicker({
    default: 'now',
    autoclose: true,
    donetext: ''
});

loadReviews();
function loadReviews() {
    var url = window.location.href;
	let id = url ? url.split('?').pop() : window.location.search.slice(1);
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reviews/shop",
        "shop_id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var main = document.getElementById("reviews");

            if (response.hasOwnProperty('NoReviewsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are no Reviews on the Shop.";
                main.appendChild(displayMessage);
                return;
            }
            var reviews = response["Reviews"];

            for (entry in reviews) {
                var review = reviews[entry]

                // CREATE ROW FOR EVERY REVIEW
                var card = document.createElement("div");
                card.classList.add('review');

        		var line = document.createElement('hr');
        		line.classList.add('rate-hr');
				card.appendChild(line);

	            var nameTime = document.createElement('div');
	          //  nameTime.classList.add('d-flex','flex-column','pl-3');

	            var name = document.createElement('h4');
	            name.classList.add('uname');
	            name.innerText = review.fname;
	            nameTime.appendChild(name);

	            var time = document.createElement('small');
	            time.classList.add('grey-text');
	            time.innerText = review.sub_date.split(' ')[0];
	            nameTime.appendChild(time);
	            card.appendChild(nameTime);

	            var rating = document.createElement('div');
	            for(var i = 1; i<=5; i++){
	            	if(i<=parseInt(review.rating)){
	            		var star = document.createElement('div');
	            		star.classList.add('fa','fa-star','checked');
	            	}else{
	            		var star = document.createElement('div');
	            		star.classList.add('fa','fa-star');
	            	}
	            	rating.appendChild(star);
	            }
	            card.appendChild(rating);


		        var description = document.createElement("div");   
		        var descriptionContent =  document.createElement('p');
		        descriptionContent.classList.add('white-text');
		        descriptionContent.innerText = review.content; 
		        description.appendChild(descriptionContent); 
		       	card.appendChild(description); 

               	main.appendChild(card);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        var line = document.createElement('hr');
        line.classList.add('rate-hr');
		main.appendChild(line);
    }

    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

loadShopContent();
function loadShopContent() {
    var url = window.location.href;
	let id = url ? url.split('?').pop() : window.location.search.slice(1);
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/shop",
        "id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var name = document.getElementById("shop-name");
            console.log(response);
            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "Null Shop";
                name.appendChild(displayMessage);
                return;
            }
            name.innerText = response.sname;
            document.getElementById('type').innerText = response.stype;
            document.getElementById('description').innerText = response.description;
            document.getElementById('rating').innerText = response.rating;

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}