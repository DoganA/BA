<?php
	//Variablen für
	$servername = "127.0.0.1";		//Serveradresse, auf dem sich die SQL-Server Befindet
	$username = "root";
	$password = "";
	$dbname = "bachelor";
	$str = "";
	$graph_data = array();
	$categories = array();

	// Verbindung zum Server und Datenbank aufbauen.
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	$str.= " daten.Zeitstempel <= '".$_POST['endDatum']."' AND daten.Zeitstempel >='".$_POST['beginDatum']."'";
        $channels = array();
        if ($_POST['A'] == "true") array_push($channels, "'A'");
        if ($_POST['B'] == "true") array_push($channels, "'B'");
        if ($_POST['C'] == "true") array_push($channels, "'C'");
        if ($_POST['D'] == "true") array_push($channels, "'D'");
        $str .= " AND sensor.Zaelernummer in (" . join(',', $channels) . ")";

//	if  ($_POST['A'] == "true") $str .= " AND  sensor.Zaelernummer = 'A'";
//	if  ($_POST['B'] == "true") $str .= " AND  sensor.Zaelernummer = 'B'";
//	if  ($_POST['C'] == "true") $str .= " AND  sensor.Zaelernummer = 'C'";
//	if  ($_POST['D'] == "true") $str .= " AND  sensor.Zaelernummer = 'D'";


	$sql = "SELECT daten.Zeitstempel, daten.Wert, sensor.Zaelernummer
				 FROM daten INNER JOIN sensor
  				   ON daten.Sensor_ID = sensor.ID
				WHERE " .$str ;
	//echo $sql;
	//Datenbank abfrage
	$result = $conn->query($sql);

	//Überprüfen, ob Daten empfangen wurden
	if ($result->num_rows > 0) {
		//Empfangene Daten Einsortieren
		$ch1 = array();
		$ch2 = array();
		$ch3 = array();
		$ch4 = array();
		while($row = $result->fetch_assoc()) {
			
			//Zeitstempel einem Array übergeben
			$timestamp = "";
			if($timestamp != $row["Zeitstempel"]){ //Array wird einem
				$timestamp = $row["Zeitstempel"];
				array_push($categories, $row["Zeitstempel"]);
			}
			
			$graph_data['timestamp']= $categories;
			
			if  ($_POST['A'] == "true" && $row["Zaelernummer"]  == 'A') {
				array_push($ch1, floatval($row["Wert"]));
			
			}
			
			if  ($_POST['B']== "true" && $row["Zaelernummer"]  == 'B') {
				array_push($ch2, floatval($row["Wert"]));
			
			}
			
			if  ($_POST['C']== "true" && $row["Zaelernummer"]  == 'C') {
				array_push($ch3, floatval($row["Wert"]));
			
			}
			if  ($_POST['D']== "true" && $row["Zaelernummer"]  == 'D') {
				array_push($ch4, floatval($row["Wert"]));
			
			}
		}
		$graph_data['ch1']= $ch1;
		$graph_data['ch2']= $ch2;
		$graph_data['ch3']= $ch3;
		$graph_data['ch4']= $ch4;
	}
	
	$conn->close();	//Schließen der Datenbankverbindung
	//Senden der Daten, in Json codierung
	echo json_encode($graph_data);
exit;
?>	
