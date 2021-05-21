<?php
    // Store JSON file in var inData
	$inData = getRequestInfo();
	
    // Store data in vars
	$fname = $inData["fname"];
	$lname = $inData["lname"];
    $username = $inData["username"];
    $password = $inData["password"];

    // Specifies the MySQL connection to use
	$conn = new mysqli("localhost", "root", "1Password", "SmallDB");
    // check connection
	if ($conn->connect_error)  // if failed to connect
	{
		returnWithError( $conn->connect_error );
	} 
	else // Good connection
	{
        // Prepare SQl statement
		$stmt = $conn->prepare("INSERT into User (FirstName,LastName,UserName,Password) VALUES(?,?,?,?)");
		// bind vars to sql statement
        $stmt->bind_param("ssss", $fname, $lname,$username,$password);
		// execute mysql statement
        $stmt->execute();
        // CLose connections
		$stmt->close();
		$conn->close();
        // return with no error
		returnWithError("");
	}

    // function to decode json from POST request
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
