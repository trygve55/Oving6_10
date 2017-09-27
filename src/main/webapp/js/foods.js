function validateFields() {
    if ($("#newName").val() == 0) {
        $("#errorText").html("Retten må ha et navn.");
        return false;
    }
    if ($("#newDesc").val() == 0) {
        $("#errorText").html("Retten må ha en beskrivelse.");
        return false;
    }
    if ($("#newPrice").val() < 0) {
        $("#errorText").html("Prisen må være 0 eller positiv.");
        return false;
    }
    $("#errorText").html("");
    return true;
}

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
        if (validateFields()) {
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
        }
    });
});