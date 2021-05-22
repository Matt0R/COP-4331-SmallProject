<?php	

  $inData = getRequestInfo(); 
  
	$conn = new mysqli("localhost", "root", "1Password", "SmallDB"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );	
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactsID=?");
		$stmt->bind_param("i", $inData["ContactsID"]);
		$stmt->execute();
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