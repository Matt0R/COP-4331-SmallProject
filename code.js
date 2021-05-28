var urlBase = 'http://managercontacts.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
//var currContactId;
var currRowI;


function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    // Changed this to our form ID's
    var login = document.getElementById("usernameinput").value;
    var password = document.getElementById("passwordinput").value;

    var hash = md5(password);

    console.log(hash);
    document.getElementById("loginResult").innerHTML = "";

    var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
    //var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
    var url = urlBase + '/Login.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "manager.html";

            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function saveCookie() {
    var minutes = 20;
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    var data = document.cookie;
    var splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        var thisOne = splits[i].trim();
        var tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addUser() {
    var newFname = document.getElementById("firstnameinput").value;
    var newLname = document.getElementById("lastnameinput").value;
    var newUsername = document.getElementById("usernameinput").value;
    var newPassword = md5(document.getElementById("passwordinput").value);

    document.getElementById("userAddResult").innerHTML = "";

    var jsonPayload = '{"fname" : "' + newFname + '", "lname" : "' + newLname + '", "username" : "' + newUsername + '", "password" : "' + newPassword + '"}';


    console.log(jsonPayload);
    var url = urlBase + '/AddUser.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("userAddResult").innerHTML = "User has been added";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("userAddResult").innerHTML = err.message;
    }

}

function addContact() {
    var newFname = document.getElementById("firstNameInput").value;
    var newLname = document.getElementById("lastNameInput").value;
    var newEmail = document.getElementById("email2").value;
    var newPhone = document.getElementById("phone2").value;

    document.getElementById("contactAddResult").innerHTML = "";

    var jsonPayload = '{"fname" : "' + newFname + '", "lname" : "' + newLname + '", "email" : "' + newEmail + '", "phone" : "' + newPhone + '", "userID" : "' + userId + '"}';
    console.log(jsonPayload);

    console.log(jsonPayload);
    var url = urlBase + '/AddContact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                // clears data in add contact popup
                document.getElementById("firstNameInput").value = document.getElementById("firstNameInput").defaultValue;
                document.getElementById("lastNameInput").value = document.getElementById("lastNameInput").defaultValue;
                document.getElementById("email2").value = document.getElementById("email2").defaultValue;
                document.getElementById("phone2").value = document.getElementById("phone2").defaultValue;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }

}

function searchContact() {
    var srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("sTable").innerHTML = ""; // deletes all elements previously in the table
    
    var contactList = document.getElementById("sTable");

    var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
    var url = urlBase + '/SearchContacts.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "  Contact(s) has been retrieved";
                var jsonObject = JSON.parse(xhr.responseText);

                for (var i = 0; i < jsonObject.results.length; i++) {
                // example table
                /*<tr>
                            <td>John</td>
                            <td>Smith</td>
                            <td>john@smith.aol.org</td>
                            <td>222-222-2222</td>
                            <td>4/20/21</td>
                            <td>
                                <button type="button" class="btn-edit" data-bs-toggle="modal" data-bs-target="#editcontact">
                  <i class="bi bi-pencil-square"></i>
                </button>
                                <button type="button" class="btn-delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmation"><i
                    class="bi bi-trash"></i></button>
                            </td>
                        </tr> */
                    /*
                    var row = '<tr> <td> + val[jsonObject.results[i].FirstName] + </td> <td>${jsonObject.results[i].LastName}</td> <td>${jsonObject.results[i].Email}</td> <td>${jsonObject.results[i].Phone}</td> <td>${jsonObject.results[i].Timestamp}</td> <td> <button type="button" class="btn-edit" data-bs-toggle="modal" data-bs-target="#editcontact"><i class="bi bi-pencil-square"></i></button> <button type="button" class="btn-delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmation"><i class="bi bi-trash"></i></button> </td> </tr>'
                        row[0] = jsonObject.results[i].FirstName; */
                        var row = sTable.insertRow(i);
                        row.insertCell(0).innerHTML = jsonObject.results[i].ContactsID;
                        row.insertCell(1).innerHTML = jsonObject.results[i].FirstName;
                        row.insertCell(2).innerHTML = jsonObject.results[i].LastName;
                        row.insertCell(3).innerHTML = jsonObject.results[i].Email;
                        row.insertCell(4).innerHTML = jsonObject.results[i].Phone;
                        row.insertCell(5).innerHTML = jsonObject.results[i].Timestamp;
                        var buttonRow = row.insertCell(6);
                        
                        buttonRow.innerHTML = '<button type="button" class="btn-edit" data-bs-toggle="modal" data-bs-target="#editcontact" onclick="updateCurrentRow(this.parentElement); populateEditPopUp();"><i class="bi bi-pencil-square"></i></button>';
                        buttonRow.innerHTML += '<button type="button" class="btn-delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onclick="updateCurrentRow(this.parentElement); deleteContactResultM();"><i class="bi bi-trash"></i></button>';
                        
                    
                       console.log(jsonObject.results[i].FirstName); 
                    // contactList.innerHTML += row;
                    
                    // iterates through all contacts jsonObject.result[i].variable wanted
                    
                    //if (i < jsonObject.results.length - 1) {
                        //contactList += "<br />\r\n";
                   // }
                }

                // document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }


}

function deleteContactResultM() {
  document.getElementById("contactDeleteResult").innerHTML = "";
}
function deleteContactAddResultM() {
  document.getElementById("contactAddResult").innerHTML = "";
}
function populateEditPopUp() {
  document.getElementById("contactEditResult").innerHTML = "";
  var row = document.getElementById("sTable").rows[currRowI-1];
  
  document.getElementById("firstNameInputE").value = row.cells[1].innerHTML;
  document.getElementById("lastNameInputE").value = row.cells[2].innerHTML;
  document.getElementById("emailE").value = row.cells[3].innerHTML;
  document.getElementById("phoneE").value = row.cells[4].innerHTML;
}

function editContact() {
    var newFname = document.getElementById("firstNameInputE").value;
    var newLname = document.getElementById("lastNameInputE").value;
    var newEmail = document.getElementById("emailE").value;
    var newPhone = document.getElementById("phoneE").value;
    var contactId = document.getElementById("sTable").rows[currRowI-1].cells[0].innerHTML;
    
    document.getElementById("contactEditResult").innerHTML = "";

    var jsonPayload = '{"FirstName" : "' + newFname + '", "LastName" : "' + newLname + '", "Email" : "' + newEmail + '", "Phone" : "' + newPhone + '", "ContactsID" : "' + contactId + '"}';
    console.log(jsonPayload);

    console.log(jsonPayload);
    var url = urlBase + '/EditContacts.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactEditResult").innerHTML = "Contact has been edited";
                var row = document.getElementById("sTable").rows[currRowI-1];
                row.cells[1].innerHTML = newFname;
                row.cells[2].innerHTML = newLname;
                row.cells[3].innerHTML = newEmail;
                row.cells[4].innerHTML = newPhone;
                // clears data in add contact popup
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactEditResult").innerHTML = err.message;
    }

}

function deleteContact() {
    var contactId = document.getElementById("sTable").rows[currRowI-1].cells[0].innerHTML;
    
    document.getElementById("contactDeleteResult").innerHTML = "";
    
    var jsonPayload = '{"ContactsID" : "' + contactId + '"}';

    console.log(contactId);
    console.log(jsonPayload);
    var url = urlBase + '/DeleteContacts.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("sTable").deleteRow(currRowI-1);
                document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }

}

function updateCurrentRow(x) {
  currRowI = x.parentElement.rowIndex;
  console.log(currRowI);
  
}
