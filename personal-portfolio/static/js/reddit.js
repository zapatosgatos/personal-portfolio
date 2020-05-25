$(function(){
  $('#txtSearchProdAssign').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $('button').click();
    }
  });

	$('button').click(function(){
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
          $('#searchResults').append('<a href="https://www.reddit.com/' + value + '" class="search-results-card" target="_blank">'
            + '<div class="card bg-mint mb-3">'
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
