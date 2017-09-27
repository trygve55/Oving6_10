$(document).ready(function(){
    $('#foodTable').DataTable( {
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
                    return "kr " + val.toFixed(2)
                }
            },
        ]
    });

    $("#create").click(function () {
        $.ajax({
            url: 'rest/food',
            type: 'POST',
            data: JSON.stringify({
                id: -1,
                typeId: $("#newTypeId").val(),
                name: $("#newName").val(),
                desc: $("#newDesc").val(),
                price: parseFloat($("#newPrice").val()),
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                $('#foodTable').DataTable().ajax.reload();
                alert("Matrett lagt til.");
            }
        });
    });
});