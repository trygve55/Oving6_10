function validateFieldAdd() {
    if ($("#size").val() <= 0) {
        $("#errorText").html("Bordet må ha minst 1 i størrelse.");
        return false;
    }
    $("#errorText").html("");
    return true;
}

function validateFieldChange() {
    if ($("#changeId").val() <= 0) { //Trenger sjekk for om bord id finnes
        $("#errorText").html("Bordet du vil endre finnes ikke.");
        return false;
    } else if($("#newSize").val() <= 0){
        $("#errorText").html("Bordet som skal endres må ha minst 1 som ny størrelse.");
    }
    $("#errorText").html("");
    return true;
}

function validateFieldDelete() {
    if ($("#deleteId").val() <= 0) { //Trenger sjekk for om bord id finnes
        $("#errorText").html("Bordet du vil slette finnes ikke.");
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
        if(validateFieldDelete()) {
            $.ajax({
                url: 'rest/table/' + $("#deleteId").val(),
                type: 'DELETE',
                success: function (result) {
                    $('#tableTable').DataTable().ajax.reload();
                    alert("Bord slettet");
                }
            });
        }
    });

    $("#change").click(function () {
        if(validateFieldChange()) {
            $.ajax({
                url: 'rest/table/' + $("#changeId").val() + "/" + $("#newSize").val(),
                type: 'POST',
                success: function (result) {
                    $('#tableTable').DataTable().ajax.reload();
                    alert("Bord endret");
                }
            });
        }
    });

    $("#create").click(function () {
        if (validateFieldAdd()) {
            $.ajax({
                url: 'rest/table',
                type: 'POST',
                data: JSON.stringify({
                id: -1,
                size: Math.floor($("#size").val()),
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(result) {
                    $('#tableTable').DataTable().ajax.reload();
                    alert("Bord lagt til");
                }
            });
        }
    });
});