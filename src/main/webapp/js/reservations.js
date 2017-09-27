function pad2(number) {
     return (number < 10 ? '0' : '') + number
}

function formatDateTime(date) {
    var date = new Date(date)
    return date.toDateString() + " " + pad2(date.getHours()) + ":" + pad2(date.getMinutes());
}

$(document).ready(function(){
    var reservationTable = $('#reservationTable').DataTable( {
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
            {
                "className":      'delete',
                "orderable":      false,
                "data":           null,
                "defaultContent": "<button>Slett</button>",
                "width": "40"
            },
        ]
    });

    $('#reservationTable tbody').on('click', 'td.delete', function () {
        var row = reservationTable.row($(this).closest('tr'));
        var data = row.data();
        $.ajax({
            url: 'rest/reserver/' + data.id,
            type: 'DELETE',
            success: function(result) {
                $('#reservationTable').DataTable().ajax.reload();
            }
        });
    });
});