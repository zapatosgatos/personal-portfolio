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
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
