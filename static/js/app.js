
var otu_ids_count = [];
var new_otu_data = []

// Create empty arrays to store the dish and spice values
var stored_otu_ids = [];
var stored_otu_labels = [];
var newSortedValues = [];
var newSamples = [];
var max_number_of_samples = 0;
var max_id = 0;


var dropdownMenu = d3.select("#selDataset");


// Fetch the JSON data and console log it
d3.json("../static/data/samples.json").then(function(data) {

    metadata = data.metadata
    samples = data.samples

    //console.log(metadata)
    //console.log(samples)

    // add the county names to the drop-down menu
    metadata.forEach(function(individual) {
        var option = dropdownMenu.append("option");
        option.text(individual.id);
    });

    // direct the dropdown menu to the updatePlots function when clicked
    dropdownMenu.on("change", updatePlots);

    // default the page to the first individual id
    updatePlots();

    function updatePlots() {
        // get the selected individual id value from the drop down
        var selectedIndividualId = dropdownMenu.property("value");
        
        // we are only interested in the selected inidividual samples
        var selectedValue = samples.filter( function( el ) {
            if( el.id == selectedIndividualId )
            {
                return el
            }
        });

        // sort the sample values by descending
        var sortedValues = selectedValue.sort(function (a,b) {return d3.descending(a.sample_values, b.sample_values);});
        
        // extract the top 10 items from the descending ordred list
        var top_ten_otu_ids = sortedValues[0].otu_ids.slice(0,10);
        var top_ten_sample_values = sortedValues[0].sample_values.slice(0,10);
        var top_ten_otu_labels = sortedValues[0].otu_labels.slice(0,10);

        //console.log(top_ten_otu_ids);
        //console.log(top_ten_sample_values);
        //console.log(top_ten_otu_labels);

        var y_labels = []
        Object.entries(top_ten_otu_ids).forEach(([key, value]) => {
            y_labels.push("OTU " + value);
        });
        
        // set up the data sources in descending (reverse) order for a bar chart
        var data = [{
            type: 'bar',
            x: top_ten_sample_values.reverse(),
            y: y_labels.reverse(),
            orientation: 'h',
            marker: {
                width: 1
            },
            text: top_ten_otu_labels.reverse()
        }];

        // add a title
        var layout = {title: `Bar Chart - Top 10 OTUs found for Individual ${selectedIndividualId}`}
          
        // plot the bar chart
        Plotly.newPlot('bar', data, layout);


        // random 10 colors, but top three will be gold, silver and bronze
        var random_colors = ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',
        'rgb(44, 160, 101)', 'rgb(255, 65, 54)',
        'rgb(52, 63, 123)','rgb(135, 12, 73)',
        'rgb(65, 108, 25)', 'bronze',
        'silver','gold'];

        var trace1 = {
            x: top_ten_otu_ids,
            y: top_ten_sample_values,
            text: top_ten_otu_labels,
            mode: 'markers',
            marker: {
              color: random_colors,   
              size: top_ten_sample_values
            }
        };
          
        var data = [trace1];
        
        var layout = {
            title: `Bubble Chart - Top 10 OTUs found for Individual ${selectedIndividualId}`,
            showlegend: false
        };
        
        var config = {responsive: true}

        // plot the bubble chart
        Plotly.newPlot('bubble', data, layout, config);

        
        // get selected individual's meta data
        var selectedMetaData = metadata.filter(metadata => metadata.id == selectedIndividualId);
        
        // only interested in the un-indexed dictionary
        var metaData = selectedMetaData[0];

        // Flush html first, then traverse through the dictionary and write to html tag
        d3.select("#sample-metadata").html("");
        Object.keys(metaData).forEach(function(key) {
            d3.select("#sample-metadata").append("html").html("<b>" + key + "</b>: " + metaData[key]);
        });
    }
});