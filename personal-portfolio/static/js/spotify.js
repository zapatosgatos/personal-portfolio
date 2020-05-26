$(function(){
  $('#album').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $('#search').click();
    }
  });

	$('#search').click(function(){
		var album = $('#album').val();
		$.ajax({
			url: '/portfolio/spotify_project',
      data: JSON.stringify({'data':album}),
      contentType: "application/json",
      type: 'POST',
			success: function(response){
        if($('#searchResults').hasClass('d-none')) {
          $('#searchResults').toggleClass('d-none');
        } else {
          $('#searchResults').empty();
        }
        console.log(response);
        //$.each(response, function(key, value) {

          //$('#searchResults').append('<a href="https://www.reddit.com' + value + '" class="search-results-card" target="_blank">'
          //  + '<div class="card bg-mint mb-3">'
          //  + '<div class="card-body montserrat-font">' + key + '</div>'
          //  + '</div></a>'
          //);
        //});

			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
