var foods = [];

function getReservation() {
    var date = new Date($('#dateTimePicker').val());
    var string = JSON.stringify({
        id: -1,
        start: date.getTime(),
        end: null,
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

function validateFields() {
    if ($("#forName").val().length == 0) {
        $("#errorText").html("Du må fylle inn et navn.");
        return false;
    }
    if ($("#tableSize").val() <= 0) {
        $("#errorText").html("Antall personer må være minst en.");
        return false;
    }
    if ($("#bordId").val() == null) {
        $("#errorText").html("Du må velge et ledig bord");
        return false;
    }
    if (foods.length == 0) {
        $("#errorText").html("Du må legge til noe på bestillingen.");
        return false;
    }
    if ($("#cardNumber").val().length != 16) {
        $("#errorText").html("Kort nummeret må være 16 siffer.");
        return false;
    }
    if ($("#cardPin").val().length != 3) {
        $("#errorText").html("Kontrollsiffer må være 3 siffer.");
        return false;
    }
    if (new Date($("#cardExpiryDate").val() + "/28") == "Invalid Date") {
        $("#errorText").html("Kortet må ikke ha gått ut.");
        return false;
    }
    $("#errorText").html("");
    return true;
}

function updateTotalPrice() {
    var sum = 0.0;
    for (var i = 0;i < foods.length;i++) {
        sum += foods[i].price*foods[i].amount;
    }
    $("#foodSum").html(sum.toFixed(2));
}

function getStartDate() {
    return new Date($('#dateTimePicker').val());
}

function updateFreeBords() {
    var date = new Date($('#dateTimePicker').val());
    console.log(date.toISOString());
    $('#bordId').empty();
    $.ajax({
        url: "rest/table/free/" + date.toJSON() + "/" + $("#tableSize").val(),
    }).then(function(data) {
        if (data.length == 0) $("#noTableText").html("Ingen ledige bord, prøv et annent tidspunkt.");
        else $("#noTableText").html("");
        for (var i = 0; i < data.length;i++) {
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

    var date = new Date();
    if (date.getHours() < 11) date.setHours(11);
    if (date.getMinutes() < 30) date.setMinutes(00);
    else date.setMinutes(30);
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 28);

    dateTimePicker = $('#dateTimePicker').datetimepicker({
        step: 30,
        minDate: new Date(),
        maxDate: maxDate,
        minTime: "11:00",
        defaultDate: date,
    });

    $('#cardExpiryDate')$.datepicker({
        viewMode: 'years',
         format: 'mm-yyyy'
    });

    $("#tableSize").change(function() {
        updateFreeBords();
    });

    $("#dateTimePicker").change(function() {
        updateFreeBords();
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
                "defaultContent": "<button>-</button>",
                "width": "20"
            },
            {
                "className":      'food-amount',
                "orderable":      false,
                "data":           'amount',
                "width": "30"
            },
            {
                "className":      'more-food',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>+</button>",
                "width": "20"
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

    $("#create").click(function () {
        if (validateFields()) {
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
        }
    });
});