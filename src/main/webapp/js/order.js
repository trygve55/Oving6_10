function updateOrders() {
    var date = $('#datetimepicker').data("DateTimePicker").date()
    nowOrderTable.ajax.url('rest/orders/' + date.toJSON()).load();
    $("#nowHeader").html('Serveres kl: ' + date.format('HH:mm'));
    date.add(30, 'minutes');
    nextOrderTable.ajax.url('rest/orders/' + date.toJSON()).load();
    $("#nextHeader").html('Serveres kl: ' + date.format('HH:mm'));
}

$(document).ready(function() {
    $('#datetimepicker').datetimepicker({
            sideBySide: true,
            format : 'DD/MM/YYYY HH:mm',
            stepping: 30,
            minDate: moment().add(-30, 'minutes'),
            defaultDate: moment().add(-30, 'minutes'),
            maxDate: moment().add(1, 'month'),
            enabledHours: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            useStrict: true,
            keepInvalid: true,
            inline: true
    });

    $("#datetimepicker").on("dp.change", function(e) {
        updateOrders();
    });

    var date = new Date();

    nowOrderTable = $('#nowOrderTable').DataTable( {
        searching: false,
        paging: false,
        info : false,
        "oLanguage": {"sZeroRecords": "", "sEmptyTable": "Ingen serveringer for dette tidspunkt."},
        ajax: {
            url: 'rest/orders/' + date.toJSON(),
            dataSrc: ''
            },
            columns: [
                {
                    data: 'bordId',
                    "width": "100",
                },
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
    searching: false,
    paging: false,
    info : false,
    "oLanguage": {"sZeroRecords": "", "sEmptyTable": "Ingen serveringer for dette tidspunkt."},
    ajax: {
        url: 'rest/orders/' + nextDate.toJSON(),
        dataSrc: ''
        },
        columns: [
            {
                data: 'bordId',
                "width": "100",
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
                if (val.length == 0) string = "Reservert, men ingen servering.";
                return string;
                }
            },
        ]
    });
    updateOrders();
})
