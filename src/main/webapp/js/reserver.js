var foods = [], foodTable;

function getReservation() {
    var date = $('#datetimepicker').data("DateTimePicker").date();
    var string = JSON.stringify({
        id: -1,
        start: date.valueOf(),
        end: null,
        forName: $("#name").val(),
        bordId: parseInt($("#tableId").val()),
        cardNumber: parseInt($("#cardNumber").val()),
        cardPin: parseInt($("#cardPin").val()),
        cardExpiryDate: $('#cardExpiryDate').data("DateTimePicker").date().valueOf(),
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

            updateTotalPrice();
            return;
        }
    }

    foods.push(food);
    updateTotalPrice();
}

function updateFreeBords() {
    var date = $('#datetimepicker').data("DateTimePicker").date();

    $.ajax({
        url: "rest/table/free/" + date.toJSON() + "/" + $("#tableSize").val(),
    }).then(function(data) {
        if (data.length == 0) $("#noTableText").html("Ingen ledige bord, prøv et annent tidspunkt.");
        else $("#noTableText").html("");
        $('#tableId').empty();
        for (var i = 0; i < data.length;i++) {
            $('#tableId').append("<option>" + data[i].id + "</option>")
        }
    });
}

function validateFields() {
    $("#errorWell").css("visibility", "visible");
    if ($("#name").val().length == 0) {
        $("#errorText").html("Du må fylle inn et navn.");
        return false;
    }
    if ($("#tableSize").val() < 1) {
        $("#errorText").html("Antall personer må være minst en.");
        return false;
    }
    if ($("#tableId").val() == null) {
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
    if ( $('#cardExpiryDate').data("DateTimePicker").date() == null) {
        $("#errorText").html("Kortet må ikke ha gått ut.");
        return false;
    }
    $("#errorWell").css("visibility", "hidden");
    $("#errorText").html("");
    return true;
}

function updateTotalPrice() {
    var sum = 0.0;
    var string = "";

    if (foods.length == 0) string += "<div style='text-align: right; margin-right: 1.05cm;'>Her kommer bestillingen</div>";

    for (var i = 0;i < foods.length;i++) {
        if (foods[i].amount != 0) {
            sum += foods[i].price*foods[i].amount;
            string += "<text style='float: left; margin-left: 1.05cm;'>" + foods[i].amount + "x " + foods[i].name +
            "</text><text style='float: right; margin-right: 1.05cm;'> kr " +
             (foods[i].price*foods[i].amount).toFixed(2) + "</text><br>";
        }
    }

    $("#foodText").html(string);
    $("#foodSum").html("Sum: kr " + sum.toFixed(2));
}

$(document).ready(function() {
    $('#datetimepicker').datetimepicker({
        sideBySide: true,
        format : 'DD/MM/YYYY HH:mm',
        stepping: 30,
        minDate: moment(),
        defaultDate: moment(),
        maxDate: moment().add(1, 'month'),
        enabledHours: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        useStrict: true,
        keepInvalid: true
    });

    $('#datetimepicker').on('focus', 'input', function() {
        $('#datetimepicker').data("DateTimePicker").show();
    });

    $('#cardExpiryDate').datetimepicker({
        format : 'MM/YY',
        useStrict: true,
        keepInvalid: true,
        minDate: moment(),
        maxDate: moment().add(10, 'year'),
    });

    updateFreeBords();

    $("#datetimepicker").on("dp.change", function(e) {
        updateFreeBords();
    });

    $("#tableSize").change(function() {
        updateFreeBords();
    });

    $("#create").click(function () {
        if (validateFields()) {
            $.ajax({
                url: 'rest/reserver',
                type: 'POST',
                data: getReservation(),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                complete: function(data) {
                    window.location.replace("receipt.html?id=" + data.responseText);
                }
            });
        }
    });

    $('#foodTypeId').on('keyup click', function(){
         $('#foodTable').DataTable().column(0).search($(this).val(), false, false).draw();
    });

    foodTable = $('#foodTable').DataTable( {
        paging: false,
        info : false,
        "sDom": 't',
        "autoWidth": false,
        ajax: {
            url: 'rest/food',
            dataSrc: ''
        },
        columns: [
            { data: 'type', },
            { data: 'name' },
            { data: 'desc' },
            {
                "class": "center",
                "data": "price",
                "width": "60",
                "render": function (val, type, row) {
                    return "kr " + Number(val).toFixed(2);
                }
            },
            {
                "className":      'less-food',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>-</button>",
                "width": "15"
            },
            {
                "className":      'food-amount',
                "orderable":      false,
                "data":           'amount',
                "width": "15"
            },
            {
                "className":      'more-food',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>+</button>",
                "width": "15"
            }/*,
            {
                "className":      'totalPrice',
                "orderable":      false,
                "data": null,
                "width": "64",
                "render": function (data,type, row, meta) {
                    return "kr " + Number(data.amount * data.price).toFixed(2);
                }
            },*/
        ]

    });

    foodTable.column(0).visible(false);

    $.ajax({
        type:"GET",
        url: "rest/table/maxTablePlaces",
        success: function(data){
            $("#tableSize").attr("max", parseInt(data));
        }
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
        var data = row.data();
        if (data.amount > 0) {data.amount--;
            row.invalidate("data").draw();
            updateFoods(data);
        }
    } );

    $('.btn-minuse').on('click', function(){
        var field = $(this).parent().siblings('input')
        var val = parseInt(field.val());
        if (val > field.attr("min")) field.val(val - 1)
        field.change();
    })

    $('.btn-pluss').on('click', function(){
        var field = $(this).parent().siblings('input')
        var val = parseInt(field.val());
        if (val < field.attr("max")) field.val(val + 1)
        field.change();
    })
})
