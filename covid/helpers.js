//----------------------- global variables -------------------------------------
var nice_csv,
    jhListOfCountries;


function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}


function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
}


function jhCountrySums(oldcsv)   // some countries appear more than once, make a single entry for their sum
{
    var newcsv = [];
    oldcsv.forEach((row, i) => {
        // console.log('alt: ', row)
        var found = false;
        newcsv.forEach((item, j) => {
            if (row[1] === item[1]) {
                // console.log('duplicate: ', row[1]);
                found = true;
                for (var idx = 4; idx < item.length; idx++) {
                    item[idx] = Number(item[idx]) + Number(row[idx]);
                }
            }
        });
        if (!found){
          // console.log('new: ', row[1]);
          // console.log('add: ', row);
          newcsv.push(row);
          // console.log('new', newcsv);
        }
    });
    // console.log(newcsv)
    return newcsv;
}


function makeNiceCsv(oldcsv)
{
    oldcsv = jhCountrySums(oldcsv);
    oldcsv = transpose(oldcsv);
    oldcsv.splice(2,2);
    oldcsv.splice(0,1);
    oldcsv = transpose(oldcsv);
    oldcsv[0][0] = "Datum"
    return oldcsv;
}


function convertDateListForPlotly(dateList) {
    var result = [];
    dateList.forEach((item, i) => {
      var values = item.split('/');
      var date = new Date(Number(values[2]) + 2000, Number(values[0] - 1), Number(values[1]));
      result.push(date.toISOString());
    });
    return result;
}


function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length;  i++) {
        var currentOption = document.createElement('option');
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
    }
}


function updateCountry(){
    makePlot(countrySelector.value);
}


function addItemsToDropdown(items, selector) {
  items.forEach((item, _i) => {
    var ele = document.createElement("span");
    ele.classList = "dropdown-item";
    ele.innerText = item;
    document.querySelector(selector).appendChild(ele);
  });
}




function onJohnsHopkinsDataLoaded(results){
  nice_csv = makeNiceCsv(results.data);

  makePlot("Germany");

  jhListOfCountries = unpack(nice_csv, 0)
  jhListOfCountries.shift();
  jhListOfCountries.sort();
  countrySelector = document.querySelector("#dropdown1");
  addItemsToDropdown(jhListOfCountries, countrySelector);
  // $('#dropdown1').on('show.bs.dropdown', updateCountry);
  countrySelector.addEventListener('change', updateCountry, false);

  function updateCountry(){
      makePlot(countrySelector.value);
  }

}


function loadJohnsHopkinsData()
{
    let cnfg = {
    download: true,
    complete: onJohnsHopkinsDataLoaded,
    error:    function(error, file)
              {
                  console.log("    ERROR:", error)
              }
    }

    Papa.parse('data/time_series_19-covid-Confirmed.csv', cnfg)
}


function makePlot2(country)
{
    var firstDay = "2020-02-20T23:00:00.000Z";
    if (country.properties.wb_a2 == 'CN'){
      firstDay = "2020-01-21T23:00:00.000Z";
    }

    trace1 = {
        x: country.properties.jhiDates,
        y: country.properties.jhiConfirmed,
        type: 'scatter',
        name: 'gemeldet',
        mode: 'lines+markers',
        // line: {width:1},
    };

    trace2 = {
        x: country.properties.jhiDates,
        y: country.properties.jhiDeaths,
        type: 'scatter',
        name: 'gestorben',
        mode: 'lines+markers',
        line: {
          width: 1,
          color: '#6c757d'
        },
    };

    trace3 = {
        x: country.properties.jhiDates,
        y: country.properties.jhiRecovered,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'genesen'
    };

    var layout = {
      // title: country.properties.admin,
        font: {
          // family: 'Courier New, monospace',
          size: globalScale * 12,
          color: '#ffffff'
        },
        height: 300 + (globalScale -1) * 50,
        margin: {
          l: 100,
          r: 10,
          b: 10,
          t: 10,
          pad: 4
        },
        // autosize: true,
        plot_bgcolor: "#343a40",
        paper_bgcolor:"#343a40",
        showlegend: false,
        // legend: {
        //   x: 0.3,
        //   xanchor: 'right',
        //   y: 1
        // },
          xaxis: {
            automargin: true,
            autorange: false,
            range: [firstDay, country.properties.jhiDates.slice(-1)[0]],
            type: 'date',
            gridcolor: '#555555'
        },
        yaxis: {
          automargin: true,
          autorange: true,
          type: graphAxisType,
          gridcolor: '#555555'
        }
    };

    var config = {
        // displayModeBar: true,
        staticPlot: ((globalScale > 1) ? true : false ),
        scrollZoom: false,
        responsive: true,
        showLink: true,
        displaylogo: false,
        showSendToCloud: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        modeBarButtonsToRemove: ['toImage', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'hoverClosestGl2d', 'hoverClosestPie', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
    }
    Plotly.newPlot('graph', [trace1, trace2], layout, config);
}

function makePlot3(country)
{
    var firstDay = "2020-02-20T23:00:00.000Z";
    if (country.properties.wb_a2 == 'CN'){
      firstDay = "2020-01-21T23:00:00.000Z";
    }

    var confirmed = nj.array(country.properties.jhiConfirmed);
    var tmp1 = confirmed.slice([1,confirmed.size]);
    var tmp2 = confirmed.slice([0,confirmed.size - 1]);
    var y = tmp1.subtract(tmp2);
    var x = country.properties.jhiDates.slice(1,country.properties.jhiDates.length);
    traceGrowth = {
        x: x,
        y: y.selection.data,
        type: 'scatter',
        name: 'gemeldet',
        mode: 'lines+markers',
        line: {
          width: 1,
          color: '#ffc107'
        },
    };

    var layout = {
      // title: country.properties.admin,
        font: {
          // family: 'Courier New, monospace',
          size: globalScale * 12,
          color: '#ffffff'
        },
        height: 300 + (globalScale -1) * 50,
        margin: {
          l: 100,
          r: 10,
          b: 10,
          t: 10,
          pad: 4
        },
        // autosize: true,
        plot_bgcolor: "#343a40",
        paper_bgcolor:"#343a40",
        showlegend: false,
        // legend: {
        //   x: 0.3,
        //   xanchor: 'right',
        //   y: 1
        // },
          xaxis: {
            automargin: true,
            autorange: false,
            range: [firstDay, country.properties.jhiDates.slice(-1)[0]],
            type: 'date',
            gridcolor: '#555555'
        },
        yaxis: {
          automargin: true,
          autorange: true,
          type: graphAxisType,
          gridcolor: '#555555'
        }
    };

    var config = {
        // displayModeBar: true,
        staticPlot: ((globalScale > 1) ? true : false ),
        scrollZoom: false,
        responsive: true,
        showLink: true,
        displaylogo: false,
        showSendToCloud: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        modeBarButtonsToRemove: ['toImage', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'hoverClosestGl2d', 'hoverClosestPie', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
    }
    Plotly.newPlot('graphGrowth', [traceGrowth], layout, config);
}


function setLin(id) {
  graphAxisType = 'linear';

  var updateLayout = {
    yaxis: {
      type: graphAxisType,
      gridcolor: '#555555'
      // exponentformat: 'E'
    }
  };
  Plotly.relayout(id, updateLayout);
}


function setLog(id) {
  graphAxisType = 'log';
  var updateLayout = {
    yaxis: {
      autorange: true,
      // range: [Math.log10(10), 0.1 + Math.log10(Math.max(...me.data[0].y))],
      type: graphAxisType,
      // exponentformat: 'E',
      gridcolor: '#555555'
    }
  };
  Plotly.relayout(id, updateLayout);
}
