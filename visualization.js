(function(){
    var margin = {top:50, bottom:50, left:50, right:50};
    var height = 800 - margin.top - margin.bottom;
    var width = 800 - margin.left - margin.right;
    var zoomExtent = d3.zoom().scaleExtent([1, 20]);


    
    d3.json("districts.json").then(data => {
        console.log(data)


        var districts = topojson.feature(data, data.objects.districts);

        var projection = d3.geoIdentity()
            .reflectY(true)
            .fitSize([width, height], districts)

        var path = d3.geoPath()
            .projection(projection)


        
        var features = topojson.feature(data, data.objects.districts).features;
        var centroids = features.map(function (feature) {
            return path.centroid(feature);
        });
        console.log(centroids)

        var svg = d3.select("#map")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomExtent
                .on("zoom", zoom))

        // var g2 = svg.append("g2");
        var g = svg.append("g");
        
        // var DistrictCenter = []
            g.selectAll(".district")
            .data(districts.features)
            .enter()
            .append("path")
            .attr("class", "district")
            .attr("d", path)
            // .on("mouseover", function(d){
            //     d3.select(this).classed("hover", true)
            // })
            // .on("mouseout", function(d){
            //     d3.select(this).classed("hover", false)
            // })
            // .on("click", function(d){
            //     d3.select(this).classed("selected", !d3.select(this).classed("selected"))
            // })
        //    .each(function () {
        //        var bbox = d3.select(this).node().getBBox();
        //        DistrictCenter.push([bbox.x + bbox.width / 2, bbox.y + bbox.height / 2]);
        //    })

            g.selectAll(".district-center")
                .data(centroids)
                    .enter()
                    .append("circle")
                    .attr("class", "district-center")
                    .attr("r", 5)
                .attr("cx", function (d) { return   d[0]; })
                .attr("cy", function(d){ return d[1];})



                  
        
        


        function zoom() {
            g.attr("transform", d3.event.transform)
        }





    })
   
            
    

})();