$(function(){
  $('#artist').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $('#search').click();
    }
  });

	$('#search').click(function(){
		var artist = $('#artist').val();
		$.ajax({
			url: '/portfolio/spotify_project',
      data: JSON.stringify({'data':artist}),
      contentType: "application/json",
      type: 'POST',
			success: function(response){
        if($('#searchResults').hasClass('d-none')) {
          $('#searchResults').toggleClass('d-none');
        } else {
          $('#searchResults').empty();
        }
        console.log(response);
        var width = document.getElementById('searchResults').clientWidth;
        var height = width;
        var radius = Math.min(width, height) / 2;
        var svg = d3.select('#searchResults').append('svg');

        var g = d3.select('#searchResults svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        function resize() {
          width = document.getElementById('searchResults').clientWidth;
          height = width;
          radius = Math.min(width, height) / 2;
          //var color = d3.scaleOrdinal(d3.schemeCategory20b);

          g = d3.select('#searchResults svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        }

        window.onresize = resize;

        //var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory20b);

        // Create primary <g> element
        /*var g = d3.select('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');*/

        // Data strucure
        var partition = d3.partition()
            .size([2 * Math.PI, radius]);

        // Find data root
        var root = d3.hierarchy(response)
            .sum(function (d) { return d.size});

        // Size arcs
        partition(root);
        var arc = d3.arc()
            .startAngle(function (d) { return d.x0 })
            .endAngle(function (d) { return d.x1 })
            .innerRadius(function (d) { return d.y0 })
            .outerRadius(function (d) { return d.y1 });

        // Put it all together
        g.selectAll('path')
            .data(root.descendants())
            .enter().append('path')
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .style('stroke', '#fff')
            .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });


    			},
    			error: function(error){
    				console.log(error);
    			}
		});
	});
});
