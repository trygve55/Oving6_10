var foods = [];

function getReservation() {
    var date = new Date($("#date").val() + " " + $("#time").val() + ":00");
    var string = JSON.stringify({
        id: -1,
        start: date.getTime(),
        end: new Date(date.getTime() + 90*60000).getTime(),
        forName: $("#forName").val(),
        bordId: parseInt($("#bordId").val()),
        cardNumber: parseInt($("#cardNumber").val()),
        cardPin: parseInt($("#cardPin").val()),
        cardExpiryDate: new Date($("#cardExpiryDate").val() + "/28").getTime(),
        foods: foods,
    })
    console.log(string);
    return string;
}

function updateFoods(food) {
    for (var i = 0;i < foods.length;i++) {
        if (foods[i].id == food.id) {
            if (food.amount == 0) {
                foods.splice(i, 0);
            }
            else {
                foods[i] = food;
            }
            console.log(foods);
            updateTotalPrice();
            return;
        }
    }
    foods.push(food);
    console.log(foods);
    updateTotalPrice();
}

function updateTotalPrice() {
    var sum = 0.0;
    for (var i = 0;i < foods.length;i++) {
        sum += foods[i].price*foods[i].amount;
    }
    $("#foodSum").html(sum.toFixed(2));
}

function getStartDate() {
    return new Date($("#date").val() + " " + $("#time").val() + ":00");
}

function updateFreeBords() {
    var date = new Date($("#date").val() + " " + $("#time").val() + ":00");
    console.log(date.toISOString());
    $('#bordId').empty();
    $.ajax({
        url: "rest/table/free/" + new Date($("#date").val() + " " + $("#time").val() + ":00").toISOString() + "/" + $("#tableSize").val(),
    }).then(function(data) {
        if (data.length == 0) $("#noTableText").html("Ingen ledige bord, prøv et annent tidspunkt.");
        else $("#noTableText").html("");
        for (var i = 0; i < data.length;i++) {
            console.log(data[i].id);
            $('#bordId').append("<option>" + data[i].id + "</option>")
        }
    });
}

function pad2(number) {
     return (number < 10 ? '0' : '') + number
}

function formatDateTime(date) {
    var date = new Date(date)
    return date.toDateString() + " " + pad2(date.getHours()) + ":" + pad2(date.getMinutes());
}

$(document).ready(function(){



    $('#time').timepicker({
        timeFormat: 'H:mm',
        interval: 30,
        minHour: 10,
        maxHour: 23,
        defaultTime: '11',
        startTime: '10:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        onSelect: function(timeText, inst){
                if(window.console)
                    console.log(timeText);
            }
    });

    $('#testButton').on('click', function () {
            getFoods()
        } );

    $('#date').datepicker({
        dateFormat: 'yy/mm/dd',
        defaultDate: new Date(),
        minDate: 0,
        maxDate: 31,
    });

    $('#cardExpiryDate').MonthPicker({Button:false , MonthFormat: 'yy/mm' });

    $("#tableSize").change(function() {
        updateFreeBords();
    });

    $("#date").change(function() {
        updateFreeBords();
    });

    $("#time").change(function() {
        updateFreeBords();
    });
    $('#time').on('change', function() {
        console.log("test");
        updateFreeBords();
    });

    console.log(getStartDate());


    // Bind opp tabellen mot rest-ressursen '/kunder'
    $('#reservationTable').DataTable( {
        ajax: {
            url: 'rest/reserver',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            {
                "class": "center",
                "data": "start",
                "render": function (val, type, row) {
                    return formatDateTime(val);
                }
            },
            {
                "class": "center",
                "data": "end",
                "render": function (val, type, row) {
                    return formatDateTime(val);
                }
            },
            { data: 'forName' },
            { data: 'bordId' },
            { data: 'cardNumber' },
            { data: 'cardPin' },
            {
                "class": "center",
                "data": "cardExpiryDate",
                "render": function (val, type, row) {
                    var date = new Date(val);
                    return date.getFullYear() + "/" + date.getMonth();
                }
            },
            {
                "class": "center",
                "data": "foods",
                "render": function (val, type, row) {
                    if (val == null) return "";
                    var string = "";
                    for (var i = 0; i < val.length; i++){
                        string += val[i].amount + "x "+ val[i].name + ", ";
                    }
                    return string;
                }
            },
        ]
    });

    var foodTable = $('#foodTable').DataTable( {
        paging: false,
        ajax: {
            url: 'rest/food',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'type' },
            { data: 'name' },
            { data: 'desc' },
            {
                "class": "center",
                "data": "price",
                "render": function (val, type, row) {
                    return "kr " + Number(val).toFixed(2);
                }
            },
            {
                "className":      'less-food',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>-</button>"
            },
            {
                "className":      'food-amount',
                "orderable":      false,
                "data":           'amount',
            },
            {
                "className":      'more-food',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>+</button>"
            },
            {
                "className":      'totalPrice',
                "orderable":      false,
                "data": null,
                "render": function (data,type, row, meta) {
                    return "kr " + Number(data.amount * data.price).toFixed(2);
                }
            },
        ]
    });

    $('#foodTable tbody').on('click', 'td.more-food', function () {
        var row = foodTable.row($(this).closest('tr'));
        var data = row.data();
        data.amount++;
        row.invalidate("data").draw();
        updateFoods(data);
    } );

    $('#foodTable tbody').on('click', 'td.less-food', function () {
        var row = foodTable.row($(this).closest('tr'));
        //console.log($(this).closest('tr'));
        var data = row.data();
        if (data.amount > 0) data.amount--;
        row.invalidate("data").draw();
        updateFoods(data);
    } );

    // Slett rest-ressursen '/kunder/kundeId'
    $("#delete").click(function () {
        console.log("test");
        $.ajax({
            url: 'rest/reserver/' + $("#deleteId").val(),
            type: 'DELETE',
            success: function(result) {
                $('#myTable').DataTable().ajax.reload();
            }
        });
    });

    // Lag ny rest-ressursen under '/kunder/'
    $("#create").click(function () {
        //alert($("date").val + 'T' + $("time").val);
        $.ajax({
            url: 'rest/reserver',
            type: 'POST',
            data: getReservation(),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                setTimeout(function(){
                    $('#myTable').DataTable().ajax.reload();
                }, 700)
            }
        });
        $('#myTable').DataTable().ajax.reload();
    });
});