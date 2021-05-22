<?php	

  $inData = getRequestInfo(); 
  
	$conn = new mysqli("localhost", "root", "1Password", "SmallDB"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );	
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ContactsID=?");
		$stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Email"], $inData["Phone"], $inData["ContactsID"]);
		$stmt->execute();
    // JOSEPH EDIT
    $stmt = $conn->prepare("UPDATE Contacts SET FullName=? WHERE ContactsID=?");
    $fullname = $inData["FirstName"]." ".$inData["LastName"];
    $stmt->bind_param("si", $fullname, $inData["ContactsID"]);
    $stmt->execute();
    // JOSEPH EDIT
		$stmt->close();
		$conn->close();
   returnWithError($inData["ContactsID"]);
	}
	
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>