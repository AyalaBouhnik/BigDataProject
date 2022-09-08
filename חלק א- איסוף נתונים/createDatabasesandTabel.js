
  //**this code should be running just one time .
  connection.query("CREATE DATABASE data_collection", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  connection.query("CREATE DATABASE temp_iata", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  var flightsData = "CREATE TABLE flightsData (id INT AUTO_INCREMENT PRIMARY KEY, flight_date VARCHAR(255), airline_name VARCHAR(255), flight_iata VARCHAR(255), dep_airport VARCHAR(255), dep_iata VARCHAR(255), arr_airport VARCHAR(255), arr_iata VARCHAR(255), dep_scheduled VARCHAR(255), arr_scheduled VARCHAR(255), dep_delay int, arr_delay int,dist_flight int, latitude_live double, longitude_live VARCHAR(255), direction_live VARCHAR(255), speed_horizontal VARCHAR(255), speed_vertical VARCHAR(255), is_ground BOOLEAN, day VARCHAR(255), categoty VARCHAR(255), access_day int, access_time VARCHAR(255), access_type VARCHAR(255))";
  connection.query(flightsData, function (err, result) {
    if (err) throw err;
    console.log("TABLE created");
  })

  var dateData = "CREATE TABLE dateData (date VARCHAR(255), day VARCHAR(255), categoty VARCHAR(255))";
  connection.query(dateData, function (err, result) {
    if (err) throw err;
    console.log("TABLE created");
  })

  var iataTempRow = "CREATE TABLE iataTempRow (id INT AUTO_INCREMENT PRIMARY KEY, iata_code VARCHAR(255), temp double)";
  connection.query(iataTempRow, function (err, result) {
    if (err) throw err;
})
