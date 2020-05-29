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
        //var color = d3.scaleOrdinal(d3.schemeCategory10);
        var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, response.children.length + 1))
        //var svg = d3.select('#searchResults').append('svg');
        //const root = d3.partition(response);
        //root.each(d => d.current = d);
        //var partition = d3.partition(response)
        //  .size([2 * Math.PI, radius]);
        //var root = d3.hierarchy(response)
        //    .sum(function (d) { return d.size});
        var part = d3.partition()
          .size([2 * Math.PI, radius]);

        var root = d3.hierarchy(response)
          .sum(function (d) { return d.size});

        root.each(d => d.current = d);

        const svg = d3.select('#searchResults').append('svg')
          .attr('width', width)
          .attr('height', height)
          //.attr("viewBox", [0, 0, width, width])
          .style("font", "10px sans-serif");

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${width / 2})`);

        const path = g.append("g")
          .selectAll("path")
          .data(root.descendants().slice(1))
          //.join("path")
          .enter().append("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("d", d => arc(d.current));

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

        const label = g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
          .selectAll("text")
          .data(root.descendants().slice(1))
          //.join("text")
          .enter().append("path")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);

        const parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);

        function clicked(p) {
          parent.datum(p.parent || root);

          root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          });

          const t = g.transition().duration(750);

          // Transition the data on all arcs, even the ones that aren’t visible,
          // so that if this transition is interrupted, entering arcs will start
          // the next transition from the desired position.
          path.transition(t)
              .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
              })
            .filter(function(d) {
              return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
              .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
              .attrTween("d", d => () => arc(d.current));

          label.filter(function(d) {
              return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
              .attr("fill-opacity", d => +labelVisible(d.target))
              .attrTween("transform", d => () => labelTransform(d.current));
        }

        function arcVisible(d) {
          return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }

        function labelVisible(d) {
          return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }

        function labelTransform(d) {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2 * radius;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }

        //return svg.node();

        /*var width = document.getElementById('searchResults').clientWidth;
        var height = width;
        var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory20b);
        var svg = d3.select('#searchResults').append('svg');

        var g = d3.select('#searchResults svg')
          .attr('width', width)
          .attr('height', height)
          .style("font", "10px sans-serif");
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

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
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)

        path.filter(d => d.children)
          .style("cursor", "pointer")
          .on("click", clicked);

        g.selectAll(".node")
            .append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
            .attr("dx", "-20") // radius margin
            .attr("dy", ".5em") // rotation align
            .text(function(d) { return d.parent ? d.data.name : "" });

        function computeTextRotation(d) {
          var angle = (d.x0 + d.x1) / Math.PI * 90;

          // Avoid upside-down labels
          return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
          //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        }*/


			},
			error: function(error){
				console.log(error);
			}
		});
	});

  /*$(window).resize(function(){
    width = document.getElementById('searchResults').clientWidth;
    height = width;
    radius = Math.min(width, height) / 2;
    //var color = d3.scaleOrdinal(d3.schemeCategory20b);

    g = d3.select('#searchResults svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  };*/
});
