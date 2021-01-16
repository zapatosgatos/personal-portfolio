
  /*$('#subreddit').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $('#search').click();
    }
  });*/

	/*$('#search').click(function(){
		var subreddit = $('#subreddit').val();
		$.ajax({
			url: '/portfolio/reddit_project',
      data: JSON.stringify({'data':subreddit}),
      contentType: "application/json",
      type: 'POST',
			success: function(response){
        if($('#searchResults').hasClass('d-none')) {
          $('#searchResults').toggleClass('d-none');
        } else {
          $('#searchResults').empty();
        }

        $.each(response, function(key, value) {
          $('#searchResults').append('<a href="https://www.reddit.com' + value + '" class="search-results-card" target="_blank">'
            + '<div class="card bg-mint mb-3">'
            + '<div class="card-body montserrat-font">' + key + '</div>'
            + '</div></a>'
          );
        });

			},
			error: function(error){
				console.log(error);
			}
		});
	});*/



function dayClicked(day, forecast){
  var weather_report = forecast;
  console.log(weather_report);
  if($('#weatherResults').hasClass('d-none')) {
    $('#weatherResults').toggleClass('d-none');
  } else {
    $('#weatherResults').empty();
  }

  $('#weatherResults').append('<div class="pl-3">'
    //+ '<h4>High Temperature Sol ' + day + ": " + weather_report[day]['Temperature'][1] + '</h4>'
    + '<table id="weatherTable" class="table">'
    + '<thead class="thread-dark">'
    + '<tr>'
    + '<th scope="col">Location</th>'
    + '<th scope="col">Measurement</th>'
    + '<th scope="col">Low</th>'
    + '<th scope="col">High</th>'
    + '<th scope="col">Avg</th>'
    + '</tr>'
    + '</thead>'
    + '<tbody>'
    + '<tr>'
    + '<th scope="row">Mars</th>'
    + '<td>Temperature</td>'
    + '<td>' + weather_report[day]['Temperature'][0] + ' &#176;F</td>'
    + '<td>' + weather_report[day]['Temperature'][1] + ' &#176;F</td>'
    + '<td>' + weather_report[day]['Temperature'][2] + ' &#176;F</td>'
    + '</tr>'
    + '<tr>'
    + '<th scope="row"></th>'
    + '<td>Wind Speed</td>'
    + '<td>' + weather_report[day]['Wind'][0] + ' mph</td>'
    + '<td>' + weather_report[day]['Wind'][1] + ' mph</td>'
    + '<td>' + weather_report[day]['Wind'][2] + ' mph</td>'
    + '</tr>'
    + '<tr>'
    + '<th scope="row"></th>'
    + '<td>Pressure</td>'
    + '<td>' + weather_report[day]['Pressure'][0] + ' Pa</td>'
    + '<td>' + weather_report[day]['Pressure'][1] + ' Pa</td>'
    + '<td>' + weather_report[day]['Pressure'][2] + ' Pa</td>'
    + '</tr>'
    + '</tbody>'
    + '/table>'
  );
};
