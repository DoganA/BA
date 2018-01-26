/**
 * Dateiname: page.js
 * Autor: Dogan Alkan, s772991
 * Beschreibung:Diese datei ist im Rahmen der Bachelorarbeit erstellt worden. 
 *              Es soll Verbrauchsdaten, in einem grafen Visuell darstellen
 */
/**
 * Zeichnet einen Grafen.
 */
function InitHighChart(von, bis) {
  var checkbox_value = "";
  $(":checkbox").each(function () {
    var ischecked = $(this).is(":checked");
    if (ischecked) {
      checkbox_value += $(this).val()+"=true" + "&";
    }else{
      checkbox_value += $(this).val()+"=false" + "&";
    }
  });

  var beginDatum = new Date(2014, 11, 05, 00, 00, 00);
  var endDatum = new Date(2015, 11, 06, 23, 59, 59);
  //var begin= beginDatum.getFullYear()+"-"+beginDatum.getMonth()+"-"+beginDatum.getDay();
  //var end= endDatum.getFullYear()+"-"+endDatum.getMonth()+"-"+endDatum.getDay();

  var allPOSTparameter = "beginDatum="+von+"&endDatum="+bis+"&"+checkbox_value;
  //var allPOSTparameter = "beginDatum="+begin+"&endDatum="+end+"&"+checkbox_value;

  var options = {
    chart: {
      renderTo: 'chart',
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Timestmp Overview',
      x: -20
    },
    xAxis: {
      categories: [{}]
    },
    tooltip: {
      formatter: function() {
        var s = '<b>'+ this.x +'</b>';

        $.each(this.points, function(i, point) {
          s += '<br/>'+point.series.name+': '+point.y;
        });

        return s;
      },
      shared: true
    },
    navigation: {
      buttonOptions: {   // Modul zum Esportieren der Visuallisierung, als Bild bzw. PD
        enabled: true
      }
    },

    series: [{}, {}, {}, {}]
  };

  $.ajax({
    url: "http://localhost/Visualisierung/php/getgraph.php",
    data: allPOSTparameter,
    type:'post',
    dataType: "json",
    success: function(data){
      $("#chart").html("geladen22323");
      options.xAxis.categories = data.timestamp;
      options.series[0].name = 'ch1';
      options.series[0].data = data.ch1;
      options.series[1].name = 'ch2';
      options.series[1].data = data.ch2;
      options.series[2].name = 'ch3';
      options.series[2].data = data.ch3;
      options.series[3].name = 'ch4';
      options.series[3].data = data.ch4;
      var chart = new Highcharts.Chart(options);
    }
  });

}

/**
 * Startet den Zeichenvorgang
 */
function drawChart()
{

  if ( document.getElementById('aktuell').checked == true )   //Aktuelle Verbrauchsdaten sollen angezeigt werden.
  {
    //Datumseingabe Deaktivieren, da aktuelle Verbrauchsdaten angezeigt werden sollen.
    document.getElementById('beginDatum').value = '';
    document.getElementById('beginDatum').disabled = true;
    document.getElementById('endDatum').value = '';
    document.getElementById('endDatum').disabled = true;
  }
  else if (document.getElementById('zeitraum').checked == true ) //Verbrauchsdaten, für einen Zeitraum,sollen angezeigt werden.
  {
    //Verbrauchsdaten für einen Zeitraum angezeigen.
    var anfangsZeit = datepicker2Timestamp(document.getElementById('beginDatum').value,'00:00:00');
    var endZeit = datepicker2Timestamp(document.getElementById('endDatum').value,'23:59:59');
    InitHighChart(anfangsZeit, endZeit);
  }
}

/**
 * Wandelt den, durch den Benutzer Eingegebenen Datum, in einen vom
 * Datenbank abfragbaren format um.
 */
function datepicker2Timestamp(date,time)
{
  var t = date.split("/");
  var formatetDateTime = t[2]+"-"+t[0]+"-"+t[1]+" "+time;

  return formatetDateTime;
};

/**
 * Aktiviert bzw. Deaktiviert die Datumseingabefelder, um das, durch den Benutzer Eingegebenen Datum, in einen vom
 * Datenbank abfragbaren format um.
 */
function disableField() {

  if ( document.getElementById('aktuell').checked == true )   //Aktuelle Verbrauchsdaten sollen angezeigt werden.
  {
    //Datumseingabe Deaktivieren, da aktuelle Verbrauchsdaten angezeigt werden sollen.
    document.getElementById('beginDatum').value = '';
    document.getElementById('beginDatum').disabled = true;
    document.getElementById('endDatum').value = '';
    document.getElementById('endDatum').disabled = true;
  }
  else if (document.getElementById('zeitraum').checked == true ) //Verbrauchsdaten, für einen Zeitraum,sollen angezeigt werden.
  {
    //Datumseingabe Aktivieren, da Verbrauchsdaten für einen Zeitraum angezeigt werden sollen.
    document.getElementById('beginDatum').disabled = false;
    document.getElementById('endDatum').disabled = false;
  }
};


/******************************************************************************
 * Fügt den Textfeldern, in denen das Datum eingefügt werden sollen, einen
 * Datepicker ein
 */
$(function() {
  $( "#beginDatum" ).datepicker();
  $( "#endDatum" ).datepicker();
  $( "#zeitraumBegin" ).datepicker();
  $( "input.abfrageRadio").change(disableField);
});
