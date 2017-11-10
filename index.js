// Appends a svg to the body and adds height and width attributes to it
var svg = d3.select(".svg-container").append("svg")
          .attr("width", "900")
          .attr("height", "500");

// Declare `margin`, `width` and `height`
var margin = {top: 20, right: 30, bottom: 30, left: 60};
var width = +svg.attr("width");
var height = +svg.attr("height");

// Creates var `group`, containing a group element that is appended to `svg`
  // README: created this to be able to call it later on
var group = svg.append("g");

// Creates var `legend`
var legend = d3.select(".legend-items").append("svg") // select element with class `legend-items` and append an svg element to it
    .attr("width", 200)           // add width to the svg
    .attr("height", 75)           // add heigt to the svg
      .append("g")                // append `g` to the svg and give it various attributes
    	  .attr("class", "legend")
    	  .attr("x", width - 65)
    	  .attr("y", 25)
    	  .attr("height", 100)
    	  .attr("width", 100);

var next =  document.querySelector(".next");  // selects element with class `next` and stores it in var `next`
var prev =  document.querySelector(".prev");  // selects element with class `prev` and stores it in var `prev`

var headerElement = document.querySelector(".explanation-header"); // selects element with class `explanation-header` and stores it in var `headerElement`
var explanationElement = document.querySelector(".explanation-p"); // selects element with class `explanation-p` and stores it in var `explanationElement`

var subset1 = [],
    subset2 = [],
    subset3 = [],
    subset4 = [],
    subset5 = [];

var series;

// color codes stored in object that will be called with data keys
var colorScheme = {
  value: "#009999",
  birthed: "#009999",
  deaths: "#f89521",
  positive: "#009999",
  negative: "#009999",
  immigrated: "#009999",
  emigrated: "#f89521"
};

// Names that will be show in legend, accecible with data key
var legendNames = {
  Bevolkingsgroei: "Bevolkingsgroei",
  Geboorteoverschot: "Geboorteoverschot",
  birthed: "Geboortes",
  deaths: "Overledenen",
  positive: "Migratiesaldo",
  immigrated: "Immigranten",
  emigrated: "Emigranten"
};

// The headers for each chart, stored in an array
var headerText = ["Bevolkingsgroei", "Geboorteoverschot", "Geboortes en overledenen", "Migratiesaldo", "Immigranten en emigranten"];

// The explaining text for each chart, stored in an array
var explanationText = [

  "In deze grafiek is te zien dat de bevolkingsgroei sinds het jaar 1950 is gedaald en rond het jaar 2005 zijn dieptepunt bereikte. Na het jaar 2005 is de bevolkingsgroei in de tien jaar erna echter weer toegenomen.",

 "De daling van de bevolkingsgroei is deels te verklaren door de daling van het geboorteoverschot. Dit is de som van het aantal geboortes min het aantal sterftegevallen. Wat opvalt is dat het geboorteoverschot na het jaar 2005 blijft dalen, terwijl de vorige grafiek toonde dat de bevolkingsgroei na het jaar 2005 weer toenam.",

 "Als we inzoomen op het aantal geboortes en het aantal overledenen, zien we een verklaring voor de daling in het geboorteoverschot. Het aantal geboortes is na 1970 gedaald, maar daarna gestaag gelijk gebleven. Het aantal sterftegevallen is sinds 1950 echter gestaag toegenomen. Dit verklaart dan ook de daling in het geboorteoverschot.",

"De verklaring voor de toename van de bevolkingsgroei na 2005 ligt bij het migratiesaldo. Dit is de som van het aantal immigranten dat Nederland binnenkomt min het aantal emigranten dat het land verlaat.",

"Als we inzoomen op het aantal immigranten en emigranten valt op dat het aantal immigranten in 2015 erg hoog ligt. Het aantal immigranten in 2015 is een verdubbeling ten opzichte van 2005, en daarmee tevens het hoogste aantal sinds 1950. Deze toename in immigratie is te verklaren door de enorme vluchtelingengolf die zich de laatste jaren naar Europa heeft begeven. Dit is, ondanks de toename van emigratie die te zien is, de verklaring voor de toename van het migratiesaldo sinds 2005."];


d3.text("data.txt") // get text from file `data.txt`
  .get(onload);      // run function `onload()`

 function onload(error, file) {
  if (error) throw error; // if there is an error: throw it

  var doc = file; // store `file` in var `doc`

  var header = doc.indexOf('"Totale bevolkingsgroei"'); // get index of first content after the header
  var footer = doc.indexOf('"� Centraal Bureau');       // get index of footer
      doc = doc.slice(header, footer);                  // slice the header and footer from the document and store remainder


      // replace certain strings by other values and remove unwanted content by replacing it with ""
      doc = doc.replace('"Onderwerpen_1";"Onderwerpen_2"','"Onderwerp"');
      doc = doc.replace('"Waarde eenheid";','');
      doc = doc.replace('"Perioden";','"Periode";');
      doc = doc.replace(/"Bevolkingsgroei";/g,'');
      doc = doc.replace(/"aantal";/g,'');
      doc = doc.replace(/"Emigratie inclusief administratieve c...";/g,'"Emigratie";');
      doc = doc.replace(/"Migratiesaldo inclusief administratie...";/g,'"Migratiesaldo";');
      doc = doc.replace(/"Totale bevolkingsgroei";/g,'"Bevolkingsgroei";');

      doc = doc.replace(/;/g,',');  // replace all `;` by `,`

      console.log(doc);
  var data = d3.csvParseRows(doc, map); // parse the content of `doc` as csv into objects using `map()` function


  function map(d){  // creates an object from each row, giving the called values to the corresponding key
      return {
        subject: d[0],
        period: d[1],
        value: d[2]
      };
  }

  // filter data with subject `bevolkingsgroei` from data. Also exclude the years `2014` and `2016`
  subset1 = data.filter(function(d){
      return d.subject == "Bevolkingsgroei" && d.period != 2014 && d.period != 2016;
    });

  // filter data with subject `Geboorteoverschot` from data. Also exclude the years `2014` and `2016`
  subset2 = data.filter(function(d){
      return d.subject == "Geboorteoverschot" && d.period != 2014 && d.period != 2016;
    });


  // filter data with subject `Levendgeborenen` from data. Also exclude the years `2014` and `2016`
  subjectBirth = data.filter(function(d){
      return d.subject == "Levendgeborenen" && d.period != 2014 && d.period != 2016;
  });

  // filter data with subject `Overledenen` from data. Also exclude the years `2014` and `2016`
  subjectDeath = data.filter(function(d){
      return d.subject == "Overledenen" && d.period != 2014 && d.period != 2016;
  });

  // create an object for eacht element in array `subjectBirth` and add values to corresponding keys
  subjectBirth.forEach(function(d, i){
    subset3[i] = {
        period: d.period,
        birthed: d.value,
        deaths: undefined
    };
  });

  // add values from subjectDeath to subset3. Values are converted into negative numbers so they show properly in the chart
  subjectDeath.forEach(function(d, i){
    subset3[i].deaths = -d.value;
  });

  // filter data with subject `Migratiesaldo` from data. Also exclude the years `2014` and `2016`
  var subjectMigration = data.filter(function(d){
      return d.subject == "Migratiesaldo" && d.period != 2014 && d.period != 2016;
  });

  // define subset4
  subjectMigration.forEach(function(d, i) { // for each index of array `subjectMigration` run function, passing along the data and the index of the array element

    // if `d.value > 0` store `d.value` in key `positive` and set value of key `negative` to `0`
    if(d.value >= 0) {
      subset4[i] = {        // store object in array index of `subet4`
        period: d.period,
        positive: d.value,
        negative: 0
      };
    }

    // if `d.value < 0` store `d.value` in key `negative` and set value of key `positive` to `0`
    if(d.value < 0) {
      subset4[i] = {       // store object in array index of `subset4`
        period: d.period,
        positive: 0,
        negative: d.value
      };
    }
  });

  // filter data with subject `Immigratie` from data. Also exclude the years `2014` and `2016`
  subjectImmigration = data.filter(function(d){
      return d.subject == "Immigratie" && d.period != 2014 && d.period != 2016;
  });

  // filter data with subject `Emigratie` from data. Also exclude the years `2014` and `2016`
  subjectEmigration = data.filter(function(d){
      return d.subject == "Emigratie" && d.period != 2014 && d.period != 2016;
  });

  // create an object for eacht element in array `subjectImmigration` and add values to corresponding keys, leaving key `emigrated` undefined
  subjectImmigration.forEach(function(d, i){
    subset5[i] = {
        period: d.period,
        immigrated: d.value,
        emigrated: undefined
    };
  });

  // add values from `subjectEmigration` to `subset5.emigrated`. Values are converted into negative numbers so they show properly in the chart
  subjectEmigration.forEach(function(d, i){
    subset5[i].emigrated = -d.value;
  });


  var datasets = [subset1, subset2, subset3, subset4, subset5];   // store subsets in array `datasets` in ascending order

  var storyIndex = 1;   // define `storyIndex` as `1`

  next.addEventListener("click", stepNext); // add eventlistener to `next` running function `stepNext` on click
  prev.addEventListener("click", stepPrev); // add eventlistener to `prev` running function `stepPrev` on click

  function stepNext() {

    // if `storyIndex < 5` add `1` to `storyIndex` and run function `updateBarChart`
    if(storyIndex < 5){
      storyIndex++;
      updateBarChart(datasets[storyIndex - 1], storyIndex);
    }

    // if `storyIndex == 2`, remove class `inactive` from element `prev`
    if(storyIndex == 2) {
      prev.classList.remove("inactive");
    }

    // if `storyIndex == 5`, add class `inactive` to element `next`
    if(storyIndex == 5) {
      next.classList.add("inactive");
    }
  }

  function stepPrev() {

    // if `storyIndex < 5` add `1` to `storyIndex` and run function `updateBarChart`
    if(storyIndex > 1){
      storyIndex--;
      updateBarChart(datasets[storyIndex - 1], storyIndex);
    }

    // if `storyIndex == 4`, remove class `inactive` from element `next`
    if(storyIndex == 4) {
      next.classList.remove("inactive");
    }

    // if `storyIndex == 1`, add class `inactive` to element `prev`
    if(storyIndex == 1) {
      prev.classList.add("inactive");
    }
  }

  createBarChart(subset1); // call function `createBarChart` using `subset1`

  function createBarChart(data){

    // README
      series = d3.stack().keys(["value"]).offset(d3.stackOffsetDiverging)(data); // get values from key 'value' in `data` and use them to create values for stacked bars

    // README: Moved inside function

    // define scale of x-axis
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.period; })) // use `data.map()` to set the period as domain
        .rangeRound([margin.left, width - margin.right])    // set range with `margin.left` as minimum and `width - margin.right` as maximum
        .padding(0.1);                                      // set padding between bars to `0.1`

    // define scale of y-axis
    var y = d3.scaleLinear()
        .domain([d3.min(series, stackMin), d3.max(series, stackMax) + 20000]) // set domain min as `stackMin` and domain max as `stackMax`, both using series as data
        .rangeRound([height - margin.bottom, margin.top]); // set range with `height - margin.bottom` as minimum and `margin.top` as maximum

    // create bars for barchart
    group
      .selectAll("g")
      .data(series)     // set `series` as data
      .enter()          // for every element in data run following code
      .append("g")      // append `g` element to `group`
        .attr("fill", function(d) { return colorScheme[d.key]; })  // set `fill` attribute to `colorScheme[d.key]`
      .selectAll("rect")
      .data(function(d) { return d; })  // set `d` as datapoint
      .enter()                          // for every element in data run following code
      .append("rect")                   // append `rect` to previously appended `g` element and set `width`, `x`, `height` and `y` values
      .attr("width", x.bandwidth)
      .attr("x", function(d) { return x(d.data.period); })
      .attr("height", 0)                                            // set height at `0`
      .attr("y", height - margin.bottom)                            // set y at baseline of x-axis
        .transition()                                               // add a transition with a duration of 500 milliseconds
        .duration(500)
        .attr("y", function(d) { return y(d[1]); })                 // set right `y` postion
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })  // set right `height` positon
        .delay(function(d, i) { return i * 20; });                  // put a delay of `i * 20` milliseconds between creating each bar

    // create x-axis
    svg.append("g")
        .attr("class", "bottomAxis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x));
    // create x-axis
    svg.append("g")
        .attr("class", "leftAxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // create legend
    legend.selectAll('g')
        .data(series)                   // set data to `series`
        .enter()                        // for every datapoint run following code
        .append('g')
        .each(function(d, i) {
          var g = d3.select(this);      // define `g` as `this` (the current `g element`)
          g.append("rect")              // append a `rect` to `g`
            .attr("x", 0)
            .attr("y", i * 25 )         // set `y` position to `i * 25` so different legend elements line up below eachother
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", colorScheme[d.key]); // get color from `colorScheme` using `d.key`

          g.append("text")             // append `text` to `g`
            .attr("x", 40)
            .attr("y", i * 25 + 15)    // set y` position to `i * 25 + 15` so different legend elements line up below eachother
            .attr("height",30)
            .attr("width",100)
            .text(d[i].data.subject);  // set text content to `d[i].data.subject`
        });

        headerElement.textContent = headerText[0];            // change the text content of headerElement to headerText[0]
        explanationElement.textContent = explanationText[0];  // change the text content of explanationElement to explanationText[0]
  }

  function updateBarChart(data, index){

    // define series differently according to the value of `index`
    if (index == 1 || 2){
      series = d3.stack().keys(["value"]).offset(d3.stackOffsetDiverging)(data);
    }
    if (index == 3) {
      series = d3.stack().keys(["birthed", "deaths"]).offset(d3.stackOffsetDiverging)(data);
    }
    if (index == 4) {
      series = d3.stack().keys(["positive", "negative"]).offset(d3.stackOffsetDiverging)(data);
    }
    if (index == 5) {
      series = d3.stack().keys(["immigrated", "emigrated"]).offset(d3.stackOffsetDiverging)(data);
    }

    // define `x` using to `data`
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.period; }))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    // define `y` using to `series`
    var y = d3.scaleLinear()
        .domain([d3.min(series, stackMin), d3.max(series, stackMax) + 30000])
        .rangeRound([height - margin.bottom, margin.top]);


    // remove excess groups
    group
      .selectAll("g")
      .data(series)
      .exit().remove();

    group
      .selectAll("g")
        .attr("fill", function(d) { return colorScheme[d.key]; })     // set fill to
        .selectAll("rect")
        .data(function(d) { return d; })
          .transition()
          .duration(500)
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .delay(function(d, i) { return i * 20; });

      // if `index == 3 || 4 || 5` run following code
      if(index == 3 || 4 || 5) {

        group
          .selectAll("g")
          .data(series)                                                   // set `series` as data
            .enter()                                                      // for evry data point in 'series' run following code
            .append("g")
              .attr("fill", function(d) { return colorScheme[d.key]; })   // set `fill` attribute to `colorScheme[d.key]`
            .selectAll("rect")
            .data(function(d) { return d; })                              // set 'd' as data
            .enter()                                                      // for every data point in `d` run following code
            .append("rect")                                               // append `rect` with attributes `width`, `x` , `height` and `y`
              .attr("width", x.bandwidth)
              .attr("x", function(d) { return x(d.data.period); })
              .attr("height", 0)                                          // set height at `0`
              .attr("y", height - margin.bottom)                          // set y at baseline of x-axis
              .transition()
              .duration(500)
              .attr("y", function(d) { return y(d[1]); })                 // set right `y` postion
              .attr("height", function(d) { return y(d[0]) - y(d[1]); })  // set right `height` positon
              .delay(function(d, i) { return i * 20; });                  // put a delay of `i * 20` milliseconds between creating each bar
      }


    // select the element within `svg` with class `bottomAxis` and update it
    svg.selectAll(".bottomAxis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));

    // select the element within `svg` with class `bottomAxis` and update it
    svg.selectAll(".leftAxis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));

    //
    legend.selectAll("g")
      .data([])
      .exit().remove();

    // create legend
    legend.selectAll('g')
        .data(series)                   // set data to `series`
        .enter()                        // for every datapoint run following code
        .append('g')
        .attr("class", "legendGroup" + index)     // set class of `g` to `"legendgroup" + index`
        .each(function(d, i) {                    // for each element in 'series' run following code passing on `d` and an index number
          var g = d3.select(this);                // define `g` as `this` (the current `g element`)
          g.append("rect")                        // append a `rect` to `g`
            .attr("x", 0)
            .attr("y", i * 25 )                   // set `y` position to `i * 25` so different legend elements line up below eachother
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", colorScheme[d.key]);   // get color from `colorScheme` using `d.key`

          // run different code according to value of `index`
          if(index == 1 || 2) {
            g.append("text")                            // append `text` to `g`
              .attr("x", 40)
              .attr("y", i * 25 + 15)                   // set y` position to `i * 25 + 15` so different legend elements line up below eachother
              .attr("height",30)
              .attr("width",100)
              .text(legendNames[d[i].data.subject]);    // set text content to `d[i].data.subject`
          }
          if (index == 3 || 4 || 5) {
            g.append("text")                           // append `text` to `g`
              .attr("x", 40)
              .attr("y", i * 25 + 15)                  // set y` position to `i * 25 + 15` so different legend elements line up below eachother
              .attr("height",30)
              .attr("width",100)
              .text(legendNames[d.key]);              // set text content to `d[i].data.subject`
          }
        });


    headerElement.textContent = headerText[index - 1];              // change the text content of headerElement to headerText[index - 1]
    explanationElement.textContent = explanationText[index - 1];    // change the text content of explanationElement to explanationText[index - 1]
  }

  // return lowest value in the stack that is passed along as `serie` as `d[0]`
  function stackMin(serie) {
    return d3.min(serie, function(d) { return d[0]; });
  }

  // return highest value in the stack that is passed along as `serie` as `d[1]`
  function stackMax(serie) {
    return d3.max(serie, function(d) { return d[1]; });
  }
}
