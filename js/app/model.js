var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};

aiaraldea.hauteskundeak2015.model = function () {
  var results = [];

  var Udala = function () {

  };
  var hautatuak = {};

  // Datuen karga
  var importElectionData = function (_data) {
    var data = new Udala();
    data.year = _data.urtea;
    data.herria = _data.udalerria;
    data.zinegotziak = _data.zinegotziak;
    data.errolda = _data.errolda;
    if (_data.zenbatua == null) {
      data.zenbatua =  100;
    }else {
      data.zenbatua = _data.zenbatua;
    }
    data.botoak = _data.botoak;
    data.baliogabeak = _data.baliogabeak;
    data.zuriak = _data.zuriak;
    data.abstentzioa = _data.abstentzioak;
    data.baliodunak = data.botoak - data.baliogabeak;
    data.alderdiak = [];
    importZinegotziak(data, _data);
    data.alderdiak.sort(function (a, b) {
      return b.botoak - a.botoak;
    });
    aberastu(data);
    batuAiaraldea(data);
    results.push(data);
    return data;
  };
//var aiaraldekoZenbatua = function(emaitza) {
//  if (emaitza.herria === 'Aiaraldea') {
//    if (emaitza.urtea === 2015) {
//      
//    } else {
//      emaitza.zenbatua = 100;
//    }
//  }
//} 
  var batuAiaraldea = function (data) {
    var aiaraldea = getCalculatedEmaitzakByCouncilAndYear('Aiaraldea', data.year);
    if (aiaraldea == null) {
      aiaraldea = {
        herria: 'Aiaraldea',
        year: data.year,
        zinegotziak: 0,
        errolda: 0,
        zenbatua: 100,
        botoak: 0,
        baliogabeak: 0,
        baliodunak: 0,
        zuriak: 0,
        abstentzioa: 0,
        alderdiak: []
      };
      results.push(aiaraldea);
    }
    aiaraldea.errolda += data.errolda;
    aiaraldea.zinegotziak += data.zinegotziak;
    aiaraldea.botoak += data.botoak;
    aiaraldea.baliogabeak += data.baliogabeak;
    aiaraldea.baliodunak += data.baliodunak;
    aiaraldea.zuriak += data.zuriak;
    aiaraldea.abstentzioa += data.abstentzioa;
    for (var i = 0; i < data.alderdiak.length; i++) {
      var found = false;
      for (var j = 0; j < aiaraldea.alderdiak.length; j++) {

        if (aiaraldea.alderdiak[j].izena === data.alderdiak[i].izena) {
          found = true;
          aiaraldea.alderdiak[j].botoak += data.alderdiak[i].botoak;
          aiaraldea.alderdiak[j].zinegotziak += data.alderdiak[i].zinegotziak;
          break;
        }
      }
      if (!found) {
        aiaraldea.alderdiak.push({
          izena: data.alderdiak[i].izena,
          botoak: data.alderdiak[i].botoak,
          zinegotziak: data.alderdiak[i].zinegotziak
        });
      }
    }
    aberastu(aiaraldea);

    aiaraldea.alderdiak.sort(function (a, b) {
      return b.botoak - a.botoak;
    });
  };

  var importZinegotziak = function (data, _data) {
    var zinegotziak;
    var general = ['udalerria', 'urtea', 'errolda', 'zenbatua', 'botoak', 'baliogabeak', 'baliodunak', 'hautagaitzei', 'zuriak', 'abstentzioak', 'zinegotziak', 'hautatuak'];
    for (var i in _data) {
      var a = general.indexOf(i);
      if (a < 0 && _data[i] !== null) {
        if (_data.hautatuak != null && _data.hautatuak[i] != null) {
          zinegotziak = _data.hautatuak[i];
        } else {
          zinegotziak = 0;
        }
        data.alderdiak.push({izena: i, botoak: _data[i], zinegotziak: zinegotziak});
        addColor(i);
      }
    }
  };

  var ehunekoa = function (a, b) {
    return Math.round(b / a * 100 * 1e2) / 1e2;
  };

  var aberastu = function (udala) {
    udala.parteHartzea = ehunekoa(udala.errolda, udala.botoak);
    udala.abstentzioaEhunekoa = ehunekoa(udala.errolda, udala.abstentzioa);
    udala.baliogabeakEhunekoa = ehunekoa(udala.errolda, udala.baliogabeak);
    udala.baliogabeakEhunekoEmandakoak = ehunekoa(udala.botoak, udala.baliogabeak);
    udala.zuriakEhunekoa = ehunekoa(udala.errolda, udala.zuriak);
    udala.zuriakEhunekoBalioduna = ehunekoa(udala.baliodunak, udala.zuriak);
    udala.zuriakEhunekoEmandakoak = ehunekoa(udala.botoak, udala.zuriak);
    for (var j = 0; j < udala.alderdiak.length; j++) {
      var alderdia = udala.alderdiak[j];
      // Ehuekoak:
      //  - Emandako boto balioduna
      alderdia.ehunekoBalioduna = ehunekoa(udala.baliodunak, alderdia.botoak);
      //  - Emandako botoa
      alderdia.ehunekoEmandakoak = ehunekoa(udala.botoak, alderdia.botoak);
      //  - Errolda
      alderdia.ehunekoErrolda = ehunekoa(udala.errolda, alderdia.botoak);
    }
  };


  // Ikuspegientzako datu hornitzaileak
  var getCalculatedEmaitzakByCouncilAndYear = function (herria, urtea) {
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
        return results[i];
      }
    }
  };


  var getCalculatedEmaitzakByCouncil = function (herria) {
    var data = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        data.push(results[i]);
      }
    }
    return data;
  };

  this.getTransposedEmaitzakByCouncilAndYear = function (herria, urtea) {
    return transpose(this.getEmaitzakByCouncilAndYear(herria, urtea));
  };

  /**
   * Datuak udalerri eta urte bateko tarta grafikarako.
   * @param {type} herria
   * @param {type} urtea
   * @returns {Array|aiaraldea.hauteskundeak2015.model.getPiechartVotesByCouncilAndYear.data}
   */
  getPiechartVotesByCouncilAndYear = function (herria, urtea) {
    var data = [["aukera", "botoak"]];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
        data.push(['Abstentzioa', results[i].abstentzioa]);
        data.push(['Zuriak', results[i].zuriak]);
        data.push(['Baliogabeak', results[i].baliogabeak]);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          data.push([results[i].alderdiak[j].izena, results[i].alderdiak[j].botoak]);
        }
        return data;
      }
    }
  };
  getD3PiechartVotesByCouncilAndYear = function (herria, urtea) {
    var data = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
        data.push({label: 'Abstentzioa', count: results[i].abstentzioa});
        data.push({label: 'Zuriak', count: results[i].zuriak});
        data.push({label: 'Baliogabeak', count: results[i].baliogabeak});
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          data.push({label: results[i].alderdiak[j].izena, count: results[i].alderdiak[j].botoak});
        }

        var votesColors = [];
        for (var i = 0; i < data.length; i++) {
          votesColors[i] = colors[data[i].label];
        }
        return {zinegotziak: data, koloreak: votesColors, zenbatua: results[i].zenbatua};
      }
    }
  };
  getD3PiechartVotesToPartiesByCouncilAndYear = function (herria, urtea) {
    var data = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
//        data.push({label: 'Abstentzioa', count: results[i].abstentzioa});
//        data.push({label: 'Zuriak', count: results[i].zuriak});
//        data.push({label: 'Baliogabeak', count: results[i].baliogabeak});
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          data.push({label: results[i].alderdiak[j].izena, count: results[i].alderdiak[j].botoak});
        }

        var votesColors = [];
        for (var i = 0; i < data.length; i++) {
          votesColors[i] = colors[data[i].label];
        }
        return {zinegotziak: data, koloreak: votesColors, zenbatua: results[i].zenbatua};
      }
    }
  };
  getPiechartCouncilersByCouncilAndYear = function (herria, urtea) {
    var data = [["aukera", "zinegotziak"]];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          data.push([results[i].alderdiak[j].izena, results[i].alderdiak[j].zinegotziak]);
        }
        return data;
      }
    }
  };
  getD3PiechartCouncilersByCouncilAndYear = function (herria, urtea) {
    var data = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria && results[i].year === urtea) {
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          data.push(
                  {
                    label: results[i].alderdiak[j].izena,
                    count: results[i].alderdiak[j].zinegotziak
                  }
          );
        }

        var councilerColors = [];
        for (var i = 0; i < data.length; i++) {
          councilerColors[i] = colors[data[i].label];
        }
        return {zinegotziak: data, koloreak: councilerColors};
      }
    }
  };

  /**
   * Eskuratu datuak bilakaera grafikarako
   * @param {type} herria
   * @returns {Array|aiaraldea.hauteskundeak2015.model.getEvolutionVotes.data}
   */
  getEvolutionVotes = function (herria) {
    var data = [["Aukera", "Abstentzioa", "Zuriak", "Baliogabeak"]];
    var row;
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        row = [];
        row.push('' + results[i].year);
        row.push(results[i].abstentzioa);
        row.push(results[i].zuriak);
        row.push(results[i].baliogabeak);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          var position = data[0].indexOf(results[i].alderdiak[j].izena);
          if (position < 0) {
            position = data[0].length;
            data[0].push(results[i].alderdiak[j].izena);
          }
          row[position] = (results[i].alderdiak[j].botoak);
        }
        data.push(row);
      }
    }

    return forceArrayLength(data);
  };
  getEvolutionPercentage = function (herria) {
    var data = [["Aukera", "Abstentzioa", "Zuriak", "Baliogabeak"]];
    var row;
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        row = [];
        row.push('' + results[i].year);
        row.push(results[i].abstentzioaEhunekoa);
        row.push(results[i].zuriakEhunekoa);
        row.push(results[i].baliogabeakEhunekoa);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          var position = data[0].indexOf(results[i].alderdiak[j].izena);
          if (position < 0) {
            position = data[0].length;
            data[0].push(results[i].alderdiak[j].izena);
          }
          row[position] = (results[i].alderdiak[j].ehunekoErrolda);
        }
        data.push(row);
      }
    }
    return forceArrayLength(data);
  };
  getEvolutionPercentageOverGiven = function (herria) {
    var data = [["Aukera", "Zuriak", "Baliogabeak"]];
    var row;
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        row = [];
        row.push('' + results[i].year);
        row.push(results[i].zuriakEhunekoEmandakoak);
        row.push(results[i].baliogabeakEhunekoEmandakoak);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          var position = data[0].indexOf(results[i].alderdiak[j].izena);
          if (position < 0) {
            position = data[0].length;
            data[0].push(results[i].alderdiak[j].izena);
          }
          row[position] = (results[i].alderdiak[j].ehunekoEmandakoak);
        }
        data.push(row);
      }
    }
    return forceArrayLength(data);
  };
  getEvolutionPercentageOverValid = function (herria) {
    var data = [["Aukera", "Zuriak"]];
    var row;
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        row = [];
        row.push('' + results[i].year);
        row.push(results[i].zuriakEhunekoBalioduna);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          var position = data[0].indexOf(results[i].alderdiak[j].izena);
          if (position < 0) {
            position = data[0].length;
            data[0].push(results[i].alderdiak[j].izena);
          }
          row[position] = (results[i].alderdiak[j].ehunekoBalioduna);
        }
        data.push(row);
      }
    }
    console.log(data);
    return forceArrayLength(data);
  };
  getEvolutionCouncilers = function (herria) {
    var data = [["Aukera"]];
    var row;
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        row = [];
        row.push('' + results[i].year);
        for (var j = 0; j < results[i].alderdiak.length; j++) {
          var position = data[0].indexOf(results[i].alderdiak[j].izena);
          if (position < 0) {
            position = data[0].length;
            data[0].push(results[i].alderdiak[j].izena);
          }
          row[position] = (results[i].alderdiak[j].zinegotziak);
        }
        data.push(row);
      }
    }
    return forceArrayLength(data);
  };

  /**
   * Makes every row to have the same length.
   * @param {type} data
   * @returns {unresolved}
   */
  var forceArrayLength = function (data) {
    var forcedLength = data[0].length;
    for (var i = 1; i < data.length; i++) {
      if (data[i].length < forcedLength)
        data[i][forcedLength - 1] = undefined;
    }
    return data;
  };

  function transpose(a) {
    return Object.keys(a[0]).map(
            function (c) {
              return a.map(function (r) {
                return r[c];
              });
            }
    );
  }
  var getYearsFor = function (herria) {
    var years = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].herria === herria) {
        years.push(results[i].year);
      }
    }
    years.sort();
    years.reverse();
    return years;
  };

  var getUdalak = function () {
    var udalak = [];
    for (var i = 0; i < results.length; i++) {
      var herria = results[i].herria;
      if (udalak.indexOf(herria) < 0) {
        udalak.push(herria);
      }
    }
    udalak.sort(function (a, b) {
      if (a === 'Aiaraldea')
        return false;
      return a > b;
    });
    this.hautatuak.udala = udalak[0];
    return udalak;
  };

  var colors = {
    'Abstentzioa': '#CCC',
    'Zuriak': '#BBB',
    'Baliogabeak': '#AAA',
    'Bildu': '#aab326',
    'HB': '#aab326',
    'EH': '#aab326',
    'EAE / ANV': '#aab326',
    'Gure Aukera': '#aab326',
    'Amurrioko Aukera': '#aab326',
    'Aiarako Aukera': '#aab326',
    'Okondo Aukera': '#aab326',
    'Arakaldo Aukera': '#aab326',
    'Agrupación Ind. de Orozco': '#aab326',
    'Jóvenes de Arceniega': '#aab326',
    'Artziniegako Gazteak': '#aab326',
    'Ezker Abertzale Batua': '#aab326',
    'EAJ-PNV': '#008000',
    'PP': '#0bb2ff',
    'FAP': '#0bb2ff',
    'UCD': '#0bb2ff',
    'AP-PDP-UL': '#0bb2ff',
    'PSE-EE/PSOE': '#ef1920',
    'PSE-PSOE': '#ef1920'
  };

  var addColor = function (alderdia) {
    if (colors[alderdia] == null)
      colors[alderdia] = '#' + Math.random().toString(16).substring(2, 8);
  };

  return {
    importElectionData: importElectionData,
    getCalculatedEmaitzakByCouncilAndYear: getCalculatedEmaitzakByCouncilAndYear,
    getCalculatedEmaitzakByCouncil: getCalculatedEmaitzakByCouncil,
    getPiechartVotesByCouncilAndYear: getPiechartVotesByCouncilAndYear,
    getPiechartCouncilersByCouncilAndYear: getPiechartCouncilersByCouncilAndYear,
    getD3PiechartVotesToPartiesByCouncilAndYear: getD3PiechartVotesToPartiesByCouncilAndYear,
    getD3PiechartVotesByCouncilAndYear: getD3PiechartVotesByCouncilAndYear,
    getD3PiechartCouncilersByCouncilAndYear: getD3PiechartCouncilersByCouncilAndYear,
    getEvolutionVotes: getEvolutionVotes,
    getEvolutionCouncilers: getEvolutionCouncilers,
    getEvolutionPercentage: getEvolutionPercentage,
    getEvolutionPercentageOverValid: getEvolutionPercentageOverValid,
    getEvolutionPercentageOverGiven: getEvolutionPercentageOverGiven,
    getYearsFor: getYearsFor,
    getUdalak: getUdalak,
    hautatuak: hautatuak,
    colors: colors
  };
};
