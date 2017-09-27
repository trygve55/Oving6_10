function validateFields() {
    if ($("#newSize").val() <= 0) {
        $("#errorText").html("Bordet må ha minst en i størrelse.");
        return false;
    }
    $("#errorText").html("");
    return true;
}

$(document).ready(function(){
    $('#tableTable').DataTable( {
        searching: false,
        paging: false,
        ajax: {
            url: 'rest/table/',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'size' }
        ]
    });

    $("#delete").click(function () {
        $.ajax({
            url: 'rest/table/' + $("#deleteId").val(),
            type: 'DELETE',
            success: function(result) {
                $('#tableTable').DataTable().ajax.reload();
            }
        });
    });

    $("#create").click(function () {
        if (validateFields()) {
            $.ajax({
                url: 'rest/table',
                type: 'POST',
                data: JSON.stringify({
                id: -1,
                size: Math.floor($("#newSize").val()),
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(result) {
                    $('#tableTable').DataTable().ajax.reload();
                    alert("bord lagt til.");
                }
            });
        }
    });
});