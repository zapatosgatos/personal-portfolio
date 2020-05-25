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
        }

        $.each(response, function(key, value) {
          console.log(key + ": " + value);
        });

			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
