class ParametricPlot{
  constructor(selector) {
    this.selector = selector;               // string: id of containing div (without #)
    this.availableData = {"jhiDates": "Datum", "jhiConfirmed": "Fälle gesamt", "jhiConfirmedGrowth": "neue Fälle", "jhiDeaths": "Tote gesamt", "jhiDeathGrowth": "neue Tote"};
    this.isNew = true;
    this.xData = 'jhiDates';
    this.yData = 'jhiConfirmed';
    this.xStyle = 'linear';
    this.yStyle = 'linear';
    this.selectedCountries = {};
    this.traces = [];
    this.config={
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
    this.layout = {
      // title: country.properties.admin,
        font: {
          // family: 'Courier New, monospace',
          size: globalScale * 12,
          color: '#ffffff'
        },
        height: 300 + (globalScale -1) * 100,
        margin: {
          l: 20,
          r: 10,
          b: 10,
          t: 10,
          pad: 4
        },
        // autosize: true,
        plot_bgcolor: "#343a40",
        paper_bgcolor:"#343a40",
        showlegend: true,
        legend: {
          x: 0.5,
          y: 1,
          xanchor: 'right',
          bgcolor: 'rgba(0.203125, 0.2265625, 0.25, 0.3)'
        },
          xaxis: {
            automargin: true,
            autorange: true,
            // range: [firstDay, country.properties.jhiDates.slice(-1)[0]],
            // type: 'number',
            gridcolor: '#555555',
            title: {
              text: this.availableData[this.xData],
              // font: {
              //   family: 'Courier New, monospace',
              //   size: 18,
              //   color: '#7f7f7f'
              // }
            },
        },
        yaxis: {
          automargin: true,
          autorange: true,
          type: graphAxisType,
          gridcolor: '#555555',
          title: {
            text: this.availableData[this.yData],
            // font: {
              // family: 'Courier New, monospace',
              // size: 18,
              // color: '#7f7f7f'
            // }
          }
        }
    };
  }

  addTrace(x, y, legend) {
    this.traces.push({
      x: x,
      y: y,
      type: 'scatter',
      name: legend,
      mode: 'lines+markers',
      // line: {width:1},
    })
  }

  plotCountries() {
    this.traces = [];
    Object.entries(this.selectedCountries).forEach(([_key, properties], _i) => {
      console.log(properties.wb_a2);
      this.addTrace(properties[this.xData], properties[this.yData], lookupCountry(properties.wb_a2, 'wb_a2', 'deutsch'));
    });
    if (this.xData == 'jhiDates') {
      this.layout.xaxis.type = 'date';
    } else {
      this.layout.xaxis.type = this.xStyle;
    }

    if (this.yData == 'jhiDates') {
      this.layout.yaxis.type = 'date';
    } else {
      this.layout.yaxis.type = this.yStyle;
    }


    this.plot();
  }

  plot() {
    Plotly.newPlot(this.selector, this.traces, this.layout, this.config);
    // this.isPlotEmpty = false;
  }

  setXData(xData) {
    this.xData = xData;
    this.layout.xaxis.title.text = this.availableData[this.xData];
    // this.plot();
  }

  setYData(yData) {
    this.yData = yData;
    this.layout.yaxis.title.text = this.availableData[this.yData];
    // this.plot();
  }

  setLog(axis) {
    var type = ((this[axis[0] + 'Data'] == 'jhiDates') ? 'date' : 'log')
    // var updateLayout = {}
    // updateLayout[axis]  = {
    //   automargin: true,
    //   autorange: true,
    //   type: type,
    //   // exponentformat: 'E',
    //   gridcolor: '#555555'
    // }
    this.layout[axis].type = type;
    Plotly.relayout(this.selector, this.layout);
    this[axis[0] + "Style"] ='log';
  }

  setLin(axis) {
    var type = ((this[axis[0] + 'Data'] == 'jhiDates') ? 'date' : 'linear')
    // var updateLayout = {}
    // updateLayout[axis]  = {
    //   gridcolor: '#555555',
    //   type: type,
    //   automargin: true,
    // }
    this.layout[axis].type = type;

    Plotly.relayout(this.selector, this.layout);
    console.log(this[axis[0] + "Style"], 'linear')
    this[axis[0] + "Style"] ='linear';
  }

  toggleCountry(country) {
    if (this.selectedCountries[country.properties.wb_a2] == undefined) {
      this.selectedCountries[country.properties.wb_a2] = country.properties;
    }
    else {
      delete this.selectedCountries[country.properties.wb_a2];
    }
    console.log(this.selectedCountries);
  }

  clearCountryList() {
    this.selectedCountries = {};
  }

}
