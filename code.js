var urlBase = 'http://managercontacts.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";


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

function searchContact() {
    var srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    var contactList = "";

    var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
    var url = urlBase + '/SearchContacts.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                var jsonObject = JSON.parse(xhr.responseText);

                for (var i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i];
                    // iterates through all contacts jsonObject.result[i].variable wanted
                    if (i < jsonObject.results.length - 1) {
                        colorList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }


}