function jsonToReceipt(reservation) {
    var string = "";
    string += "Id: " + reservation.id + "<br><br>";
    string += "Reservert for: " + reservation.forName + "<br>";
    string += "Bord nr: " + reservation.bordId + "<br>";
    string += "Fra: " + formatDateTime(reservation.start) + "<br>";
    string += "Til: " + formatDateTime(reservation.end) + "<br>";
    string += "Kort nummer: " + formatCardNumber(reservation.cardNumber) + "<br>";
    string += "<br>Bestilling:<br>";
    var sum = 0;
    for (var i = 0; i < reservation.foods.length;i++) {
        var food = reservation.foods[i];
        sum += food.amount * food.price;
        string+= food.amount + "x " + food.name + " kr " + food.price + "<br>";
    }

    string += "<br>Sum: kr " + sum;
    return string;
}

function formatCardNumber(cardNumber) {
    var cardString = cardNumber.toString();
    return "**** **** **** " + cardString.substring(cardString.length - 4, cardString.length);
}

function formatDateTime(date) {
    var date = new Date(date)
    return date.toDateString() + " " + pad2(date.getHours()) + ":" + pad2(date.getMinutes());
}

function pad2(number) {
     return (number < 10 ? '0' : '') + number
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    alert('Query Variable ' + variable + ' not found');
}

$(document).ready(function() {
    var reservation;
    $.ajax({
        url: 'rest/reserver/' + getQueryVariable("id"),
        dataType: 'application/json',
        complete: function(data){
            reservation = JSON.parse(data.responseText);
            console.log(reservation);
            $("#text").html(jsonToReceipt(reservation));
        }
    });
});