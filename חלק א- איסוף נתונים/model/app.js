//This code is for subsystem for collecting, receiving data and organizing it using Axios, MySql and Kafka. 
//written by Ayala Bouhnik-Gelbord as part of the Big Data and Cloud Computing course taught by Doctor Yossi Zagori. 

const axios = require('axios');
const mysql = require('mysql');

//connecting js to mysql-
var connection = mysql.createConnection({
  //Properties
  host: '127.0.0.1',
  user: 'root',
  port: 3306,
  password: '98106780ayala',
  database: 'data_collection'
});


connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");


setInterval(function () {
  var date = new Date();
  if ((date.getMinutes() % 2) == 0) {

    //function to get the relevant flights data-
    const params = {
      access_key: '416eb460c93700776d5ba1d859425c02'
    }

    const getFlightData = async () => {
      try {

        const flightsResponse = await axios.get('http://api.aviationstack.com/v1/flights', { params })

        flightsResponse.data.data.forEach(async (flight) => {
          try {
            var airlineName = flight['airline']['name']
            var flightIata = flight['flight']['iata']
            var flightDate = flight['flight_date']
            var depAirport = flight['departure']['airport']
            var depIata = flight['departure']['iata']
            var depScheduled = flight['departure']['scheduled']
            var arrAirport = flight['arrival']['airport']
            var arrIata = flight['arrival']['iata']
            var arrScheduled = flight['arrival']['scheduled']
            var depDelay = flight['departure']['delay']
            var arrDelay = flight['arrival']['delay']

            if (depDelay == null) depDelay = 0
            if (arrDelay == null) arrDelay = 0

            var distFlight = 0; var kmDistance = 2000;
            if (kmDistance > 1500 && kmDistance <= 3500) distFlight = 1;
            if (kmDistance > 3500) distFlight = 2;

            var d = new Date();
            var accessDay = d.getDay() //int type. 0- sunday, 1- monday etc. (the value is 0-6).
            var today = new Date();
            var accessTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var accessType = "api call"


            if (depIata === 'TLV' || arrIata === 'TLV') {
              var insertFlightsData = `INSERT INTO flightsData(flight_date, airline_name, 9, dep_airport, dep_iata, arr_airport, \n 
                arr_iata, dep_scheduled, arr_scheduled, dep_delay, arr_delay, dist_flight, access_day, access_time, access_type) \n
                 VALUES ('${flightDate}' ,'${airlineName}', '${flightIata}' ,'${depAirport}' ,'${depIata}' ,'${arrAirport}' ,'${arrIata}' , \n
                 '${depScheduled}', '${arrScheduled}' ,${depDelay} ,${arrDelay} ,${distFlight} , '${accessDay}' , '${accessTime}', '${accessType}' );`;
              connection.query(insertFlightsData, function (err, result) {
                if (err) throw err;
              })
            }
          } catch (error) {
            console.log(error)
          }
        }
        );

      } catch (e) {
        console.log("error", e)
      }
    }
    getFlightData()

    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    //function to get the day today and hebrew holiday if exist-
    const getDayandHoliday = async () => {
      try {
        responseDay = await axios.get('http://worldclockapi.com/api/json/utc/now')
        var day = responseDay.data.dayOfTheWeek

        responseHoly = await axios.get('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=on&nx=of&year=now&month=x&day=npw&ss=off&mf=off&c=on&geo=geoname&geonameid=10247989&M=on&s=on%27')
        responseHoly.data.items.forEach(item => {
          var date = responseHoly.data.date
          var category = item.category
          if (category === 'holiday') {
            var sql = `INSERT INTO dateData(date, day, categoty) VALUES ('${date}', '${day}', '${category}');`;
            connection.query(sql, function (err, result) {
              if (err) throw err;
            })
          }
          if (category !== 'holiday') {
            category = "regular day"
            var sql = `INSERT INTO dateData(date, day, categoty) VALUES ('${date}', '${day}', '${category}');`
            connection.query(sql, function (err, result) {
              if (err) throw err;
            })
          }
        })
      } catch (e) {
        console.log("error", e)
      }

    }
    getDayandHoliday()

    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    //function to get the temp -
    const getTemp = async () => {
      try {
        responseLatLon = await axios.get('http://api.aviationstack.com/v1/cities?access_key=26e267b3bf58d74f370558ec0333817a')
        const resLatLon = responseLatLon.data.data;
        for (const city of resLatLon) {
          var lat = city['latitude']
          var lon = city['longitude']
          var iataCode = city['iata_code']

          const appid = 'df0200cf9200a889e95164c58e2568b0'
          responseTempAll = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + appid)
          const resTemp = responseTempAll.data.main.temp
          var temp = resTemp.temp
          if (temp == null) temp = Number.MIN_SAFE_INTEGER
          var tempInsert = `INSERT INTO iataTempRow(iata_code, temp) VALUES ('${iataCode}', '${temp}');`;
          connection.query(tempInsert, function (err, result) {
            if (err) throw err;
          })
        }

      } catch (e) {
        console.log("error", e)
      }
    }
    getTemp()

    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    //union of the three tables by the iata code and date
    var unionFlightsTempArr = "SELECT flightsData.arr_iata AS arr_iata, iataTempRow.iata_code AS iata_code FROM flightsData JOIN iataTempRow ON flightsData.arr_iata = iataTempRow.iata_code";
    connection.query(unionFlightsTempArr, function (err, result) {
      if (err) throw err;
      console.log(result);

    });
    var unionFlightsTempDep = "SELECT flightsData.dep_iata AS dep_iata, iataTempRow.iata_code AS iata_code FROM flightsData JOIN iataTempRow ON flightsData.dep_iata = iataTempRow.iata_code";
    connection.query(unionFlightsTempDep, function (err, result) {
      if (err) throw err;
      // console.log(result);
    });
    var unionFlightsTempArr = "SELECT flightsData.arr_iata AS arr_iata, iataTempRow.iata_code AS iata_code FROM flightsData JOIN iataTempRow ON flightsData.arr_iata = iataTempRow.iata_code";
    connection.query(unionFlightsTempArr, function (err, result) {
      if (err) throw err;
      // console.log(result);
    });
    var unionFlightsDate = "SELECT flightsData.flight_date AS flight_date, dateData.date AS date FROM flightsData JOIN dateData ON flightsData.flight_date = dateData.date";
    connection.query(unionFlightsDate, function (err, result) {
      if (err) throw err;
      // console.log(result);
    });

    module.exports = connection;

  }
}, 60000)
// clearInterval(timerID); // The setInterval it cleared and doesn't run anymore.

})