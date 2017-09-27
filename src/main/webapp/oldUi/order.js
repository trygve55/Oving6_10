var nowOrderTable, nextOrderTable, dateTimePicker;

function getStartDate() {
    return new Date($("#date").val() + " " + $("#time").val() + ":00");
}

function updateOrders() {
    var date = new Date($('#dateTimePicker').val());
    console.log(date.toJSON());
    nowOrderTable.ajax.url('rest/orders/' + date.toJSON()).load();
    date.setMinutes(date.getMinutes() + 30);
    nextOrderTable.ajax.url('rest/orders/' + date.toJSON()).load();
    console.log("updating");
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


    $("#dateTimePicker").change(function() {
        updateOrders();
    });


    nowOrderTable = $('#nowOrderTable').DataTable( {
        paging: false,
        ajax: {
            url: 'rest/orders/' + date.toJSON(),
            dataSrc: ''
        },
        columns: [
            { data: 'bordId' },
            {
                "class": "center",
                "data": "foods",
                "render": function (val, type, row) {
                    if (val == null) return "";
                    var string = "";
                    console.log(val);
                    for (var i = 0; i < val.length; i++){
                        string += val[i].amount + "x "+ val[i].name + ", ";
                    }
                    if (val.length == 0) string = "Reservert, men ingen servering nå.";
                    return string;
                }
            },
        ]
    });

    var nextDate = new Date();
    nextDate.setMinutes(nextDate.getMinutes() + 30);

    nextOrderTable = $('#nextOrderTable').DataTable( {
            paging: false,
            ajax: {
                url: 'rest/orders/' + nextDate.toJSON(),
                dataSrc: ''
            },
            columns: [
                { data: 'bordId' },
                {
                    "class": "center",
                    "data": "foods",
                    "render": function (val, type, row) {
                        if (val == null) return "";
                        var string = "";
                        for (var i = 0; i < val.length; i++){
                            string += val[i].amount + "x "+ val[i].name + ", ";
                        }
                        if (val.length == 0) string = "Reservert, men ingen servering.";
                        return string;
                    }
                },
            ]
        });
});