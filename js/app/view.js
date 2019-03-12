var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};

aiaraldea.hauteskundeak2015.udalak = function (parent, _model, clickCallback) {
  var component;
  var model = _model;
  component = $('<div class="uh2015ud">').appendTo(parent);

  var init = function () {
    var udala = model.getUdalak();

    component.empty();
    var list = $('<ul></ul>').appendTo(component);
    for (var i in udala) {
      list.append('<li>' + udala[i] + '</li>');
    }
    list.find('li').click(clickCallback);
  };

  var hautatu = function (udala) {
    component.find('li').removeClass('hautatua');
    component.find('li').filter(function () {
      return $(this).text() === udala;
    }).addClass('hautatua');
  };
  return {init: init, hautatu: hautatu};
};

aiaraldea.hauteskundeak2015.urteak = function (parent, _model, clickCallback) {
  var component;
  var model = _model;

  component = $('<div class="uh2015u">').appendTo(parent);

  var init = function (udala) {
    var years = model.getYearsFor(udala);

    component.empty();
    var list = $('<ul></ul>').appendTo(component);
    list.append('<li>Bilakaera</li>');
    for (var i in years) {
      list.append('<li>' + years[i] + '</li>');
    }
    list.find('li').click(clickCallback);
    this.hautatu(model.hautatuak.urtea);
  };

  var hautatu = function (urtea) {
    if (urtea === null)
      urtea = 'Bilakaera';
    component.find('li').removeClass('hautatua');
    component.find('li:contains("' + urtea + '")').addClass('hautatua');
  };
  return {init: init, hautatu: hautatu};
};

aiaraldea.hauteskundeak2015.table = function (parent, _model) {
  var component;
  var model = _model;
  component = $('<div class="uh2015tc">').appendTo(parent);

  var init = function (_udala, urtea) {

    var udala = model.getCalculatedEmaitzakByCouncilAndYear(_udala, urtea);
    empty();
    var councilFields = $('<div class="cf"></div>').appendTo(component);
    councilFields.append('<div><span class="label">Errolda</span><span class="data">' + udala.errolda + '</span></div>');
    councilFields.append('<div><span class="label">Hautesleak</span><span class="data">' + udala.botoak + ' (%' + udala.parteHartzea + ')</span></div>');
    councilFields.append('<div><span class="label">Abstentzioa</span><span class="data">' + udala.abstentzioa + ' (%' + udala.abstentzioaEhunekoa + ')</span></div>');
    councilFields.append('<div><span class="label">Baliogabeak</span><span class="data">' + udala.baliogabeak + ' (%' + udala.baliogabeakEhunekoa + ')</span></div>');
    councilFields.append('<div><span class="label">Zuriak</span><span class="data">' + udala.zuriak + ' (%' + udala.zuriakEhunekoa + ')</span></div>');
    councilFields.append('<div><span class="label">Eserlekuak</span><span class="data">' + udala.zinegotziak + '</span></div>');

    var table = $('<table><thead><th></th><th>Alderdia</th><th>Botoak</th><th>Erroldaren gaineko ehunekoa</th><th>Boto baliodunen gaineko ehunekoa</th><th>Zinegotziak</th></thead></table>').appendTo(component);

    var body = $('<tbody>').appendTo(table);
    for (var i = 0; i < udala.alderdiak.length; i++) {
      var alderdia = udala.alderdiak[i];
      body.append('<tr><td style="background-color:' + model.colors[alderdia.izena] + '"></td><td>' + alderdia.izena + '</td><td class="data">' + alderdia.botoak + '</td><td class="data">' + alderdia.ehunekoErrolda + '</td><td class="data ' + atalaseClass(udala.herria, alderdia.ehunekoBalioduna) + '">' + alderdia.ehunekoBalioduna + '</td><td class="data">' + alderdia.zinegotziak + '</td></tr>');
    }
  };

  var atalaseClass = function (herria, ehunekoa) {
    if (herria !== 'Aiaraldea' & ehunekoa < 5) {
      return 'atalaseAzpian';
    }
    return '';
  };
  var empty = function () {
    component.empty();
  };
  return {init: init, empty: empty};
};

aiaraldea.hauteskundeak2015.bilakaera = function (parent, _model) {
  var component;
  var model = _model;
  var chart, chartType;

  var init = function (_udala) {
    if (chartType === undefined) {
      chartType = 'Botoak';
    }
    hautatu(chartType);
    component.show();
    drawChart(_udala);
  };

  var hautatu = function (chartType) {
    component.find('.selector > div').removeClass('hautatua');
    component.find('.selector > div').filter(function () {
      return $(this).text() === chartType;
    }).addClass('hautatua');
  };

  var drawChart = function (udala) {
    var data;
    if (chartType === 'Zinegotziak') {
      data = model.getEvolutionCouncilers(udala);
    } else if (chartType === 'Erroldaren gaineko ehunekoa') {
      data = model.getEvolutionPercentage(udala);
    } else if (chartType === 'Boto baliodunen gaineko ehunekoa') {
      data = model.getEvolutionPercentageOverValid(udala);
    } else if (chartType === 'Emandako botoen gaineko ehunekoa') {
      data = model.getEvolutionPercentageOverGiven(udala);
    } else {
      data = model.getEvolutionVotes(udala);
    }
    var _colors = [];
    for (var i = 1; i < data[0].length; i++) {
      var color = model.colors[data[0][i]];
      _colors[i - 1] = color;
    }

    var options = {
      isStacked: true,
      legend: {position: 'top', maxLines: 6},
      colors: _colors
    };
    var dataTable = google.visualization.arrayToDataTable(data);
    chart.draw(dataTable, options);
  };

  var hide = function () {
    component.hide();
  };

  var drawContainer = function (parent) {
    return $('<div id="bilakaera"><div class="chart"></div><div class="selector"><div class="label">Ikuspegia:</div><div class="option">Botoak</div><div class="option">Zinegotziak</div> <div class="option">Erroldaren gaineko ehunekoa</div> <div class="option">Boto baliodunen gaineko ehunekoa</div> <div class="option">Emandako botoen gaineko ehunekoa</div> </div></div>').appendTo(parent);
  };

  component = drawContainer(parent);
  chart = new google.visualization.ColumnChart(component.find('.chart').get()[0]);
  google.setOnLoadCallback(this.prepareChart);

  component.find('.selector .option').click(function () {
    chartType = $(this).text();
    init(model.hautatuak.udala);
  });

  return {init: init, hide: hide};
};

aiaraldea.hauteskundeak2015.pie = function (parent, _model, label) {
  var component;
  var model = _model;
  var chart;
  component = $('<div class="piechart"><div class="chart"></div><div class="label">' + label + '</div></div>').appendTo(parent);

  chart = new google.visualization.PieChart(component.find('.chart').get()[0]);
  google.setOnLoadCallback(this.prepareChart);

  var init = function (data, pieSliceText) {
    component.show();
    drawChart(data, pieSliceText);
  };

  var drawChart = function (data, pieSliceText) {
    component.show();
    var options = {
      pieHole: 0.4,
      pieSliceText: pieSliceText || 'percentage',
      slices: {
      },
      chartArea: {left: 10, top: 10, width: "95%", height: "90%"},
      legend: 'none'
    };
    for (var i = 1; i < data.length; i++) {
      options.slices[i - 1] = {color: model.colors[data[i][0]]};
    }
    var dataTable = google.visualization.arrayToDataTable(data);

    chart.draw(dataTable, options);
  };

  var hide = function () {
    component.hide();
  };
  return {init: init, hide: hide};
};