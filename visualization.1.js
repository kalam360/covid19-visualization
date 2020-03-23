async function buildmap(){
    var margin = {top:50, bottom:50, left:50, right:50};
    var height = 800 - margin.top - margin.bottom;
    var width = 800 - margin.left - margin.right;
    var zoomExtent = d3.zoom().scaleExtent([1, 20]);


    
    var mapData = await d3.json("districts.json");
    var caseData = await d3.csv("datasheets.csv");


    var districts = topojson.feature(mapData, mapData.objects.districts);
        

    var projection = d3.geoIdentity()
            .reflectY(true)
            .fitSize([width, height], districts)

    var path = d3.geoPath()
            .projection(projection)


        
    var features = topojson.feature(mapData, mapData.objects.districts).features;

    var mergedData = _.map(features, function (element) {
            let findItem = _.findWhere(caseData, { District_N: element.properties.District_N })
        return _.extend(element, findItem);
        });

        console.log(mergedData)
        
    var radius = d3.scaleLinear()
        .domain([0, 700])
        .range([0, 40]);

    var colorScale = d3.scaleThreshold()
                .domain([0,20,50, 100,300, 500, 700])
                .range(d3.schemeReds[7])


    var svg = d3.select("#map")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomExtent
                .on("zoom", zoom))


    var g = svg.append("g");
        

        g.selectAll(".district")
            .data(mergedData)
            .enter()
            .append("path")
            .attr("class", "district")
            .attr("d", path)
            .attr("fill", function(d){
                return colorScale(d.quarantine);
            })
            
        g.selectAll(".district-center")
                    .data(mergedData)
                    .enter()
                    .append("circle")
                    .attr("class", "district-center")
                    .attr("r", function(d){ return radius(d.quarantine)})
                    .attr("cx", function (d) { return   path.centroid(d)[0] })
                    .attr("cy", function(d){ return path.centroid(d)[1]})
                    

    function zoom() {
            g.attr("transform", d3.event.transform)
            }

   

}


buildmap();

