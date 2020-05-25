$(function(){
	$('button').click(function(){
		var subreddit = $('#subreddit').val();
		//var pass = $('#inputPassword').val();
		$.ajax({
			url: '/portfolio/reddit_project',
			//data: $('form').serialize(),
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
          console.log(key + ": " + value);
          $('#searchResults').append('<a href="' + value + '" class="search-results-card" target="_blank">'
            + '<div class="card bg-light mb-3">'
            + '<div class="card-header montserrat-font">' + key + '</div>'
            + '</div></a>'
          );
        });

			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
