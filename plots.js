function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 

    d3.json("samples.json").then(function(data){
      console.log(data)
      // 3. Create a variable that holds the samples array. 
      var dataArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = dataArray.filter(sampleObj => sampleObj.id == sample);;
      //  5. Create a variable that hsolds the first sample in the array.
      var firstSample = resultArray;
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var resultOtuIds = firstSample[0].otu_ids;
      var resultOtuLabels = firstSample[0].otu_labels;
      var resultSampleValues = firstSample[0].sample_values;
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 

        var counts = {};
        for (var i = 0; i < resultSampleValues.length; i++) {
           counts[resultSampleValues[i]] = 1 + (counts[resultSampleValues[i]] || 0);
        };
     
     // Create items array
    var orderedCounts = Object.keys(counts).map(function(key) {
        return [key, counts[key]];
    });
    console.log(orderedCounts)
    // Sort the array based on the second element
    orderedCounts.sort(function(first, second) {
        return second[1] - first[1];
    });
    console.log(orderedCounts[1])
      // var yticks = 
      var xticks = orderedCounts.map(function(row) {
        return "OTU" + row[0];
    });
    var yticks = orderedCounts.map(function(row) {
      return row[1];
  });

    console.log(yticks);
      // 8. Create the trace for the bar chart. 

      // 9. Create the layout for the bar chart. 

      var trace = {
        y: yticks,
        x: xticks,
        type: "bar"
      };
      var data = [trace];
      var layout = {
        title: "Bacteria Prevalance",
        xaxis: {title: "Otu Ids"},
        yaxis: {title: "Sample Frequency"}
      };
      Plotly.newPlot("bar", data, layout);
    })
  };
      // 10. Use Plotly to plot the data with the layout.