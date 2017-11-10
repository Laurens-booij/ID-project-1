# Information Design - Project 1
## Description
This project consists of two assignments: 

*  Assignment A: requires a data visualisation to be built using `d3`. The visualisation must give insight in at least three types of data. 
* Assignment B: requires an interactive data visualisation to be made. This can't contain a basic chart type.

## Subject and research
For these assignments I have chosen the subject of population growth and demographic developments.  I did some research so I had a good understanding of the subject I was handling. My reasearch is summed up in a reasearch case using `Evernote`. Check out my [research case][research case].

## Assignment A
### Interactive barchart explaining cause population growth (Dutch)
![preview][preview]

### Description
This chart tells a story about the growth of the Dutch population between 1950 and 2015. The user can navigate trough various charts using the `next` and `previous` buttons. The chart and its accompanied text will in turn update to tell the next part of the story.

The interesting thing about this chart, in my opinion, is that it transitions one chart into three different variations of a bar chart.

### Background
This is a bar chart that is based on a [bar chart with negative values][bar chart] by [Mike Bostock][Bostock]. I took this example and edited to make it interactive. The changes that I made to facilitate this are listed below in the `changes` section.

### Sources
I used the following examples and edited them to accomplish my desired result:
* [Bar chart with negative values][bar chart] by [Mike Bostock][Bostock].
* [Legend][legend]

### Changes
#### index.html
1. Added basic document structure.

2. added `<head>` elment with `meta` elements in it and a `<link>` element linking to `index.css`. See code below:

  ```html
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css">
    <title>Echte versie</title>
  </head>
  ```
3. Added `<script>` elements that link the files to the `d3 library` and to `index.js`:

  ```html
  <script type="text/javascript" src="https://d3js.org/d3.v4.min.js"></script>
  <script type="text/javascript" src="index.js"></script>
  ```

4. Added content to the `<body>` that consist mostly of empty `<div>` elements that are used to style the page using `flexbox`. See code below:
```html
<div class="flex-container">
  <div class="graph-container">
    <h1>Bevolkingsgroei uitgelicht</h1>
    <div class="svg-container"></div>
    <div class="button-container">
      <button class="prev inactive">< previous</button>
      <button class="next">next ></button>
    </div>
  </div>
  <div class="explanation-container">
    <div class="legend-container">
      <h2>Legend</h2>
      <div class="legend-items"></div>
    </div>
    <div class="text-container">
      <h2 class="explanation-header"></h2>
      <p class="explanation-p"></p>
    </div>
  </div>
</div>
```

#### index.js
The changes I made are listed below, to see all code with code comments; check out the included `index.js` file.

1. Removed `var data`, containing data used to create the chart from the original example. I later added my own data so this could be used instead.

2. Added code to declare `svg` element using `javascript`:

```javascript
var svg = d3.select("body").append("svg")
          .attr("width", "1200")
          .attr("height", "500");
```

3. Added code to load and clean the data:

```javascript
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


  var data = d3.csvParseRows(doc, map); // parse the content of `doc` as csv into objects using `map()` function


  function map(d){
      return {
        subject: d[0],
        period: d[1],
        value: d[2]
      };
  }
}
```

4. Added code to filter the data into different sets that can be used for the different charts:

```javascript
// define subset 1
subset1 = data.filter(function(d){
    return d.subject == "Bevolkingsgroei" && d.period != 2014 && d.period != 2016;
  });


// define subset 2
subset2 = data.filter(function(d){
    return d.subject == "Geboorteoverschot" && d.period != 2014 && d.period != 2016;
  });


// define subset 3
subjectBirth = data.filter(function(d){
    return d.subject == "Levendgeborenen" && d.period != 2014 && d.period != 2016;
});

subjectDeath = data.filter(function(d){
    return d.subject == "Overledenen" && d.period != 2014 && d.period != 2016;
});

subjectBirth.forEach(function(d, i){
  subset3[i] = {
      period: d.period,
      birthed: d.value,
      deaths: undefined
  };
});

subjectDeath.forEach(function(d, i){
  subset3[i].deaths = -d.value;
});


// define subset 4
var subjectMigration = data.filter(function(d){
    return d.subject == "Migratiesaldo" && d.period != 2014 && d.period != 2016;
});

subjectMigration.forEach(function(d, i) {

  if(d.value >= 0) {
    subset4[i] = {    
      period: d.period,
      positive: d.value,
      negative: 0
    };
  }

  if(d.value < 0) {
    subset4[i] = {      
      period: d.period,
      positive: 0,
      negative: d.value
    };
  }
});


// define subset 5
subjectImmigration = data.filter(function(d){
    return d.subject == "Immigratie" && d.period != 2014 && d.period != 2016;
});

subjectEmigration = data.filter(function(d){
    return d.subject == "Emigratie" && d.period != 2014 && d.period != 2016;
});

subjectImmigration.forEach(function(d, i){
  subset5[i] = {
      period: d.period,
      immigrated: d.value,
      emigrated: undefined
  };
});

subjectEmigration.forEach(function(d, i){
  subset5[i].emigrated = -d.value;
});
```

5. Changed:

```javascript
var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
```

To:
```javascript
var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax) + 20000])
```

6. Changed the code from [original example][bar chart] by [Mike Bostock][Bostock] that creates the bars for the chart, adding and changing a few lines of code:

```javascript
group                                                            // changed: see step 7
  .selectAll("g")
  .data(series)
  .enter()        
  .append("g")    
    .attr("fill", function(d) { return colorScheme[d.key]; })    // changed: see step 13
  .selectAll("rect")
  .data(function(d) { return d; })
  .enter()                     
  .append("rect")                   
  .attr("width", x.bandwidth)
  .attr("x", function(d) { return x(d.data.period); })
  .attr("height", 0)                                             // added
  .attr("y", height - margin.bottom)                             // added
    .transition()                                                // added
    .duration(500)                                               // added
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .delay(function(d, i) { return i * 20; });                   // added
```

I also changed the name of the function that calls this code to `createBarChart()`

7. Moved code `svg.append("g")` into var `group` so that this element could be targeted later on.

8. Added code that adds classes to the `g` elements that contain the x-axis and y-axis:

```javascript
svg.append("g")
    .attr("class", "bottomAxis")                                // added
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "leftAxis")                                  // added
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));
```

9. Added code that select button elements in `index.html` and stored them in variables:

```javascript
var next =  document.querySelector(".next");
var prev =  document.querySelector(".prev");
```

10. Created functions that define a global var `storyIndex` and call the `updateBarChart` function. This way the user can click trough the charts. See code below: 

```javascript
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
```

11. Created a function that updates the existing bar chart using given data, accompanied by an index number (see step ...). This function is built upon the code that generates the original chart, and thus contains code from the [original example][bar chart] by [Mike Bostock][Bostock]:

```javascript
function updateBarChart(data, index){

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

  var x = d3.scaleBand()
      .domain(data.map(function(d) { return d.period; }))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

  var y = d3.scaleLinear()
      .domain([d3.min(series, stackMin), d3.max(series, stackMax) + 30000])
      .rangeRound([height - margin.bottom, margin.top]);

  group
    .selectAll("g")
    .data(series)
    .exit().remove();

    group
      .selectAll("g")
      .data(series)
      .attr("fill", function(d) { return colorScheme[d.key]; })        // changed: see step 13
        .selectAll("rect")
        .data(function(d) { return d; })
          .transition()                                               
          .duration(500)                                              
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .delay(function(d, i) { return i * 20; });


    if(index == 3 || 4 || 5) {

      group
        .selectAll("g")
        .data(series)
          .enter()
          .append("g")
            .attr("fill", function(d) { return colorScheme[d.key]; })  // changed: see step 13
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("width", x.bandwidth)
            .attr("x", function(d) { return x(d.data.period); })
            .attr("height", 0)
            .attr("y", height - margin.bottom)
            .transition()                                               
            .duration(500)                                              
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .delay(function(d, i) { return i * 20; });
    }

  svg.selectAll(".bottomAxis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

  svg.selectAll(".leftAxis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));
}
```

This function updates the existing bar chart, created with `createBarChart()`. It uses `if()` statements to execute different code according to the number passed on as parameter `index`. The differences in code are mainly related to the way the different datasets are passed on.

 The declarations of variables `x`, `y` and `z` were moved from being declared globally to being declared inside this function. This is the case because the variables need to be declared according to the data that is used to create the chart, which differs every time. See the code below:

```javascript
var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.period; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax) + 30000])
    .rangeRound([height - margin.bottom, margin.top]);

var z = d3.scaleOrdinal(d3.schemeCategory10);
```
Variable `z` was later deleted, because I implemented a different way of setting the fill colors (see step 13)

12. Globally defined subset variables:

```javascript
var subset1 = [],
    subset2 = [],
    subset3 = [],
    subset4 = [],
    subset5 = [];
```

13. Globally defined var `series`

14. Globally defined var `colorScheme`. In it an object is stored. This object links the key names that are used in the different subsets of data, to a color code. This can be used to set the `fill` color of the bars in a chart using the keys that are passed on in the data for that chart. See code below:

```javascript
var colorScheme = {
  value: "#009999",
  birthed: "#002c45",
  deaths: "#f89521",
  positive: "#009999",
  negative: "#009999",
  immigrated: "#002c45",
  emigrated: "#f89521"
};
```

15. Added code that creates a legend. For this I used [this legend code][legend] as an example/source. The original code is listed below, along with the changes I made:

 * [original code][legend]:
 ```javascript
 var legend = svg.append("g")
 	  .attr("class", "legend")
 	  .attr("x", w - 65)
 	  .attr("y", 25)
 	  .attr("height", 100)
 	  .attr("width", 100);

 	legend.selectAll('g').data(dataset)
       .enter()
       .append('g')
       .each(function(d, i) {
         var g = d3.select(this);
         g.append("rect")
           .attr("x", w - 65)
           .attr("y", i*25)
           .attr("width", 10)
           .attr("height", 10)
           .style("fill", color_hash[String(i)][1]);

         g.append("text")
           .attr("x", w - 50)
           .attr("y", i * 25 + 8)
           .attr("height",30)
           .attr("width",100)
           .style("fill", color_hash[String(i)][1])
           .text(color_hash[String(i)][0]);           
        })
 ```

 * Globally declared var `legend` and made some changes to it:

 ```javascript
 var legend = d3.select(".legend-items")  // changed: select element in `index.html`
     .append("svg")                       // added
     .attr("width", 200)                  // added
     .attr("height", 75)                  // added
       .append("g")                       
     	  .attr("class", "legend")        
     	  .attr("x", width - 65)            // changed `w` to `width`
     	  .attr("y", 25)
     	  .attr("height", 100)           
     	  .attr("width", 100);
 ```

 * Added code that creates legend to functions `createBarChart` and made some changes to it:

  ```javascript
  legend.selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
        g.append("rect")
          .attr("x", 0)                         // changes value
          .attr("y", i * 25 )             
          .attr("width", 30)                    // changed value
          .attr("height", 20)                   // changed value
          .style("fill", colorScheme[d.key]);   // changed way value is set

        g.append("text")
          .attr("x", 40)                        // changed value
          .attr("y", i * 25 + 15)               // changed value
          .attr("height",30)
          .attr("width",100)
          .text(d[i].data.subject);             // changed way text content is set
      });
  ```

  * Added code above to function `updateBarChart` and made a few changes to it, to facilitate different the different ways the data is passed on.

  The code is shown below, along with an explanation to the code:

  ```javascript
  legend.selectAll("g")   // <-- See 1. for explanation
    .data([])             //
    .exit().remove();     //

  legend.selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr("class", "legendGroup" + index) // <-- See 2. for explanation
      .each(function(d, i) {
        var g = d3.select(this);
        g.append("rect")
          .attr("x", 0)
          .attr("y", i * 25 )
          .attr("width", 30)
          .attr("height", 20)
          .style("fill", colorScheme[d.key]);

        if(index == 1 || 2) {                        // <-- See 3. for explanation
          g.append("text")                           //
            .attr("x", 40)                           //
            .attr("y", i * 25 + 15)                  //
            .attr("height",30)                       //
            .attr("width",100)                       //
            .text(legendNames[d[i].data.subject]);   //
        }                                            //
        if (index == 3 || 4 || 5) {                  //
          g.append("text")                           //
            .attr("x", 40)                           //
            .attr("y", i * 25 + 15)                  //
            .attr("height",30)                       //
            .attr("width",100)                       //
            .text(legendNames[d.key]);               //
        }
      });
  ```
    1. Added code that deletes the previous legend, so that a new one can be created after, because updating did not work.

    2. Added code that gives the group containing a legend element a class. This class gets a set name of `legendGroup`, along with value of `index`.

     ```
     This code is needed because the fourth chart, which is made to look like it displays only one dataset, but actually displays two datasets. One dataset shows the positive values above the x-axis, while the other shows the negative values below the x-axis. Because of this, two legend items are created. One of which needs to be hidden, and therefore I need to be able to select it using css.
     ```

    3. This code uses `if()` statements to run different code according to the value of `index`. This is needed because there are different ways that the content for `.text()` should be called, because the data is passed on differently.

16. Added an explanative text that updates along with the chart. This took a few steps that are listed below:

  * Created variables `headerElement` and `explanationElement` that containing code that select elements in `index.html`. These elments will end up containing the explanative text.

  * Created variables `headerText` and `explanationText` containing arrays with the text that has to accompany the charts:

  ```javascript
  var headerText = ["Bevolkingsgroei", "Geboorteoverschot", "Geboortes en overledenen", "Migratiesaldo", "Immigranten en emigranten"];

  var explanationText = [

    "In deze grafiek is te zien dat de bevolkingsgroei sinds het jaar 1950 is gedaald en rond het jaar 2005 zijn dieptepunt bereikte. Na het jaar 2005 is de bevolkingsgroei in de tien jaar erna echter weer toegenomen.",

   "De daling van de bevolkingsgroei is deels te verklaren door de daling van het geboorteoverschot. Dit is de som van het aantal geboortes min het aantal sterftegevallen. Wat opvalt is dat het geboorteoverschot na het jaar 2005 blijft dalen, terwijl de vorige grafiek toonde dat de bevolkingsgroei na het jaar 2005 weer toenam.",

   "Als we inzoomen op het aantal geboortes en het aantal overledenen, zien we een verklaring voor de daling in het geboorteoverschot. Het aantal geboortes is na 1970 gedaald, maar daarna gestaag gelijk gebleven. Het aantal sterftegevallen is sinds 1950 echter gestaag toegenomen. Dit verklaart dan ook de daling in het geboorteoverschot.",

  "De verklaring voor de toename van de bevolkingsgroei na 2005 ligt bij het migratiesaldo. Dit is de som van het aantal immigranten dat Nederland binnenkomt min het aantal emigranten dat het land verlaat.",

  "Als we inzoomen op het aantal immigranten en emigranten valt op dat het aantal immigranten in 2015 erg hoog ligt. Het aantal immigranten in 2015 is een verdubbeling ten opzichte van 2005, en daarmee tevens het hoogste aantal sinds 1950. Deze toename in immigratie is te verklaren door de enorme vluchtelingengolf die zich de laatste jaren naar Europa heeft begeven. Dit is, ondanks de toename van emigratie die te zien is, de verklaring voor de toename van het migratiesaldo sinds 2005."];

  ```

  * Added code to the functions `createBarChart` and `updateBarChart` that updates the contents of `headerElement` and `explanationElement` with text from var `headerText` and var `explanationText` respectively. See code below:

  ```javascript
  headerElement.textContent = headerText[index - 1];
  explanationElement.textContent = explanationText[index - 1];
  ```

#### index.css
I wrote some eighty lines of css, but only a few are worth explaining. These lines are listed below:

1. The code below positions the elments using flexbox:

```css
.flex-container {
  display: flex;
}

.graph-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.explanation-container {
  width: 25em;
  margin: 0 0 0 2em;
}

.button-container {
  margin: 2em 0 0 0;
  width: 12em;
  display: flex;
  justify-content: space-between;
}
```

2. This code styles the  `<button>` elements. It adds style changes and a transition when the buttons are hovered. Also, when the buttons get class `inactive`, thy become grey and the transition is taken of. See code below:

```css
button {
  transition: .5s;
  font-size: 0.8em;
  opacity: 0.7;
  width: 7em;
  padding: 1em 0;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: orange;
}

button:hover {
  transition: .5s;
  opacity: 1;
}

button.inactive {
  background-color: #bebebe;
  opacity: 1;
}
button.inactive:hover {
  background-color: #bebebe;
  opacity: 1;
}
```

3. This code takes the second element with class `legendGroup4` and gives it style attribute `display: none;`. This is done because the fourth chart, that is made to look like it displays only one dataset, actually displays two datasets. One dataset shows the positive values above the x-axis, while the other shows the negative values below the x-axis. Because of this, two legend items are created. One of which needs to be hidden.

The code is shown below:
```css
.legendGroup4:nth-of-type(2) {
  display: none; }
```

#### data
The data that is used for this chart published by [CBS][cbs] and contains the data from [this dataset][dataset].

The dataset contains information about the following topics:
  * Population growth
  * Birth deficit
  * Births
  * Deaths
  * Migration deficit
  * Immigration
  * Emigration

The numbers are listed for each year included in the table below, and only take the numbers for The Netherlands into account.

After cleaning, the data stood in the following format:

| subject         | period | value  |
|-----------------|--------|--------|
| Bevolkingsgroei | 1950   | 173507 |
| Bevolkingsgroei | 1955   | 141638 |
| Bevolkingsgroei | 1960   | 138754 |
| Bevolkingsgroei | 1965   | 164925 |
| Bevolkingsgroei | 1970   | 161809 |
| Bevolkingsgroei | 1975   | 134486 |
| Bevolkingsgroei | 1980   | 117572 |
| Bevolkingsgroei | 1985   | 75597  |
| Bevolkingsgroei | 1990   | 117871 |
| Bevolkingsgroei | 1995   | 69767  |
| Bevolkingsgroei | 2000   | 123125 |
| Bevolkingsgroei | 2005   | 28684  |
| Bevolkingsgroei | 2010   | 80810  |
| Bevolkingsgroei | 2014   | 71437  |
| Bevolkingsgroei | 2015   | 78394  |
| Bevolkingsgroei | 2016   | 102387 |


#### Features
* __[D3](https://d3js.org/)__
* __[D3 csv](https://github.com/d3/d3/wiki/CSV)__
* __[D3 csvParseRows](https://github.com/d3/d3-dsv/blob/master/README.md#csvParseRows)__
* __[D3 transition](https://github.com/d3/d3-transition/blob/master/README.md#transition)__
* __[D3 select](https://github.com/d3/d3-selection/blob/master/README.md#select)__
* __[D3 selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll)__
* __[Selection append](https://github.com/d3/d3-selection/blob/master/README.md#selection_append)__
* __[Selection attr](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr)__
* __[Selection enter](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter)__
* __[Selection exit](https://github.com/d3/d3-selection/blob/master/README.md#selection_exit)__

#### Licence
Released under the GNU General Public License, version 3. © Laurens Booij

## Assignment B
### Interactive visualisations showing population density and demographic developments
![preview][preview-2]

#### Description
This interactive visualisation is made using `Principle` and displays data about population density and demographic developments. It displays data from the years 1950 to 2015, in increments of 5 years. The user can spot demographic trends throughout the years by clicking trough them.

### Concept
First I had to come up with a concept. I already finished `assignment A`, and I wanted to use the same subject. Ik had to come up with something more creative, however. 

Eventually I came up with the following concept sketch.
![concept][concept-schets]

I got to work using `Principle` and `Sketch`. This was my first time using the `Principle` tool.

### Data
I used data from [cbs][cbs] about the following subjects:
* Total population
* Births
* Deaths
* Immigrants
* Emigrants
* Population density

All data is about the Netherlands. In my concept, I wanted to show the impact of these subjects on a square kilometre of the Netherlands. Therefore, I had to use the data on `births`, `deaths`, `immigration` and `emigration` and recalculate it so i could see the impact of it on a square kilometer. I did this by taking the total number for a year, and deviding it by 33000 (total land mass of the Netherlands).

The data I used is from the following years:
* 1950
* 1955
* 1960
* 1965
* 1970
* 1975
* 1980
* 1985
* 1990
* 1995
* 2000
* 2005
* 2010
* 2015

#### Result
The result is a prototype that shows the desired function of this concept. It is not fully functional, as not all the years are clickable.

To use the prototype you need to have acces to the `Principle` tool. However, I made a video that showcases the prototype.

I also implemented an `Zero-state` and an `explanation-guide` into the concept app.

Check out the result [HERE.][opdrachtB link]

[bar chart]: https://bl.ocks.org/mbostock/b5935342c6d21928111928401e2c8608
[Bostock]: https://bl.ocks.org/mbostock
[legend]: http://jsbin.com/isuris/1/edit?html,output
[cbs]:https://www.cbs.nl/en-gb
[dataset]: http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=37296ned&D1=57,59-61,63-65&D2=0,5,10,15,20,25,30,35,40,45,50,55,60,64-66&STB=T,G1&VW=T
[preview]: preview.png
[preview-2]: preview-2.png
[research case]: https://www.evernote.com/pub/laurens_booij1/onderzoekbevolkingsgroei-idproject1laurensbooij#st=p&n=3bf9a506-12dc-4885-8150-fec2004c46dd
[concept-schets]: concept-schets.jpg
[opdrachtB link]: https://github.com/Laurens-booij/ID-project-1/tree/master/Assignment%20B
