var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};

aiaraldea.hauteskundeak2015.controller = function (_model) {
  var model = _model;
  var table, urteak, udalak, bilakaera, pie1, pie2;

  function loadModel(botoak, model) {
    if (typeof botoak === "undefined")
      return;
    for (var i = 0; i < botoak.length; i++) {
      var b = botoak[i];
      model.importElectionData(b);
    }
  }

  var loadPreviousData = function () {
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1979, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1983, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1987, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1991, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1995, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak1999, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak2003, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak2007, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak2011, model);
    loadModel(aiaraldea.hauteskundeak2015.model.botoak2015, model);
  };

  var init = function (_component) {
    var component = $(_component);
    component.empty();

    udalak = aiaraldea.hauteskundeak2015.udalak(component, model, udalaClickCallback);
    udalak.init();
    urteak = aiaraldea.hauteskundeak2015.urteak(component, model, clickCallback);

    var grafikoak = $("<div id='grafikoak'>").appendTo(component);
    bilakaera = aiaraldea.hauteskundeak2015.bilakaera(grafikoak, model);
    pie1 = aiaraldea.hauteskundeak2015.pie(grafikoak, model, 'Erroldaren gaineko ehunekoa');
//    pie2 = aiaraldea.hauteskundeak2015.pie(component, model, 'Zinegotziak');

    pie2 = aiaraldea.hauteskundeak2015.d3pie.create(grafikoak[0], 'adg-zinegotziak');
    table = aiaraldea.hauteskundeak2015.table(component, model);

    model.hautatuak.udala = 'Aiaraldea';
    udalak.hautatu(model.hautatuak.udala);
    selectBilakaera();
  };

  var selectBilakaera = function () {
    model.hautatuak.urtea = null;
    urteak.hautatu('Bilakaera');
    table.empty();
    pie1.hide();
    pie2.hide();
    bilakaera.init(model.hautatuak.udala);
    urteak.init(model.hautatuak.udala);
  };

  var clickCallback = function () {
    var testua = $(this).text();
    if (testua !== 'Bilakaera') {
      bilakaera.hide();
      model.hautatuak.urtea = parseInt($(this).text());
      urteak.hautatu(model.hautatuak.urtea);
      table.init(model.hautatuak.udala, model.hautatuak.urtea);
      var data1 = model.getPiechartVotesByCouncilAndYear(model.hautatuak.udala, model.hautatuak.urtea);
      // var data2 = model.getPiechartCouncilersByCouncilAndYear(model.hautatuak.udala, model.hautatuak.urtea);
      var data2 = model.getD3PiechartCouncilersByCouncilAndYear(model.hautatuak.udala, model.hautatuak.urtea);
      pie1.init(data1);
      pie2.draw(data2.zinegotziak, 'Zinegotziak', data2.koloreak);
    } else {
      selectBilakaera();
    }
  };

  var udalaClickCallback = function () {
    bilakaera.hide();
    model.hautatuak.udala = $(this).text();
    udalak.hautatu(model.hautatuak.udala);
    urteak.init(model.hautatuak.udala);
    if (model.hautatuak.urtea == null) {
      urteak.hautatu('Bilakaera');
      table.empty();
      $('#piechart').hide();
      bilakaera.init(model.hautatuak.udala);
    } else {
      table.init(model.hautatuak.udala, model.hautatuak.urtea);
      var data1 = model.getPiechartVotesByCouncilAndYear(model.hautatuak.udala, model.hautatuak.urtea);
      var data2 = model.getD3PiechartCouncilersByCouncilAndYear(model.hautatuak.udala, model.hautatuak.urtea);
      pie1.init(data1);
      pie2.draw(data2.zinegotziak, 'Zinegotziak', data2.koloreak);
    }
  };

  return {
    loadPreviousData: loadPreviousData,
    init: init
  };
};
