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
        $.ajax({
            url: 'rest/table',
            type: 'POST',
            data: JSON.stringify({
            id: -1,
            size: $("#newSize").val(),
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                $('#tableTable').DataTable().ajax.reload();
                alert("bord lagt til.");
            }
        });
    });
});