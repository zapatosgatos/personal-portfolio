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
        var color = d3.scaleOrdinal(d3.schemeCategory20b);
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

        //window.onresize = resize;
        //var radius = Math.min(width, height) / 2;


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
            .enter().append('g').attr("class", "node").append('path')
            //.enter().append('path')
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .style('stroke', '#fff')
            .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });

        g.selectAll(".node")
            .append("name")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
            .attr("dx", "-20") // radius margin
            .attr("dy", ".5em") // rotation align
            .text(function(d) { return d.parent ? d.data.name : "" });

        function computeTextRotation(d) {
          var angle = (d.x0 + d.x1) / Math.PI * 90;

          // Avoid upside-down labels
          //return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
          return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        }
			},
			error: function(error){
				console.log(error);
			}
		});
	});

  window.onresize = resize;
});
