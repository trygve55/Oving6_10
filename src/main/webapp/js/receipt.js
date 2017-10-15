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
        string+= food.amount + "x " + food.name + " kr " + food.price.toFixed(2) + "<br>";
    }

    string += "<br>Sum: kr " + sum.toFixed(2);
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
    var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };

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

    $('#cmd').click(function () {
        var text = ("Kvitering - Resturant<br><br>" + jsonToReceipt(reservation)).split("<br>");
        doc.text(text, 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('kvitering.pdf');
    });

    $('#print').click(function () {
        var divToPrint=document.getElementById('receipt');
        var newWin=window.open('','Print-Window');
        newWin.document.open();
        newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
        newWin.document.close();
        setTimeout(function(){newWin.close();},10);
    });
});