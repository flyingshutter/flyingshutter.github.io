class ParametricPlot{
  constructor(selector, availableData) {
    this.selector = selector;               // string: id of containing div (without #)
    this.availableData = availableData;     // ['jhiDate', 'data1', ..]
    this.isPlotEmpty = true;
    this.xData = 'jhiDates';
    this.yData = 'jhiConfirmed';
    this.xStyle = 'linear';
    this.yStyle = 'linear'
    this.selectedCountries = {}
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
        showlegend: true,
        legend: {
          x: 0.3,
          xanchor: 'right',
          y: 1
        },
          xaxis: {
            automargin: true,
            autorange: true,
            // range: [firstDay, country.properties.jhiDates.slice(-1)[0]],
            // type: 'number',
            gridcolor: '#555555'
        },
        yaxis: {
          automargin: true,
          autorange: true,
          type: graphAxisType,
          gridcolor: '#555555'
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
      this.addTrace(properties[this.xData], properties[this.yData], properties.admin);
    });
    if (this.xData == 'jhiDates') {
      this.layout.xaxis['type'] = 'date';
    } else {
      this.layout.xaxis['type'] = this.xStyle;
    }

    if (this.yData == 'jhiDates') {
      this.layout.yaxis['type'] = 'date';
    } else {
      this.layout.yaxis['type'] = this.yStyle;
    }


    Plotly.newPlot(this.selector, this.traces, this.layout, this.config);
    this.isPlotEmpty = false;
  }

  plot() {
    Plotly.newPlot(this.selector, this.traces, this.layout, this.config);
    this.isPlotEmpty = false;
  }

  setLog(axis) {
    var type = ((this[axis[0] + 'Data'] == 'jhiDates') ? 'date' : 'log')
    var updateLayout = {}
    updateLayout[axis]  = {
      automargin: true,
      autorange: true,
      // range: [Math.log10(10), 0.1 + Math.log10(Math.max(...me.data[0].y))],
      type: type,
      // exponentformat: 'E',
      gridcolor: '#555555'

    }
    Plotly.relayout(this.selector, updateLayout);
    this[axis[0] + "Style"] ='log';
    console.log(this[axis[0]] + "Style", 'log')
  }

  setLin(axis) {
    var type = ((this[axis[0] + 'Data'] == 'jhiDates') ? 'date' : 'linear')
    var updateLayout = {}
    updateLayout[axis]  = {
      gridcolor: '#555555',
      type: type,
      automargin: true,

    }
    Plotly.relayout(this.selector, updateLayout);
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

}
