async function buildMap(){

    //var margin = {top:50, left: 50, right:50, bottom: 50};
    var height = 800;
    var width = 1200; 

    var mapData = await d3.json("topojson/bgd_admbnda_adm2_bbs_20180410.1.json")
    var csvData = await d3.csv("csv/datasheets.csv")
    var worldMap = await d3.json("topojson/TM_WORLD_BORDERS-0.3.json")
    console.log(worldMap)

    var features = topojson.feature(mapData, mapData.objects.bgd_admbnda_adm2_bbs_20180410).features;
    var featuresWorld = topojson.feature(worldMap, worldMap.objects.worldmap).features;
    

    var mergedData = _.map(features, function(element){
        let findItem = _.findWhere(csvData, {District_N: element.properties.ADM2_EN.toUpperCase()})
        return _.extend(element, findItem)
    })

    var colorScale = d3.scaleThreshold()
        .domain([0, 20, 50, 100, 300, 500, 700])
        .range(d3.schemeReds[7])

    var radius = d3.scaleLinear()
        .domain([0, 700])
        .range([0, 20]);

    console.log(featuresWorld)

    var projection = d3.geoMercator()
        .center([90.2, 24.8])
            .scale(3000)
            .rotate( 0, 0, 0)
                
    var path = d3.geoPath()
            .projection(projection)

    var svg = d3.select("#map")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
    
    var g = svg.append("g")

        g.selectAll(".world-map")
            .data(featuresWorld)
            .enter()
            .append("path")
            .attr("class", "world-map")
            .attr("d", path)
            .attr("fill", "white")
            .attr("stroke", "grey")

        g.selectAll(".district")
            .data(mergedData)
            .enter()
            .append("path")
            .attr("class", "district")
            .attr("d", path)
            .attr("fill", function(d){ return colorScale(d.quarantine)})

        g.selectAll(".cases")
            .data(mergedData)
            .enter()
            .append("circle")
            .attr("r", function(d){ return radius(d.quarantine)})
            .attr("transform", function(d){ return "translate("+ path.centroid(d)+")"})
            .attr("fill", "steelblue")
}

buildMap();