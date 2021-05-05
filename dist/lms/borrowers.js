//$(document).ready(getBorrowers)
addEventListener("load", getBorrowers)

function getBorrowers(){
        $.ajax({
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            url: "http://localhost:3000/api/getBorrowers",
            dataType: 'jsonp',
            success: (data) => {
                var borrowers = data;
                console.log(borrowers)
                $.each(borrowers, (i,v) => {
                    tr = '<tr class="table-row" title="Click to edit">' +
                    '<td>'+v["student_id"]+'</td>'+
                    '<td>'+v["firstname"]+' '+v["lastname"]+'</td>'+
                    '<td>'+v.course+'</td>'+
                    '<td>'+v.year+'</td>'+
                    '<td>'+v.contact+'</td>'+
                    '<td class="text-center"><button type="button" class="btn btn-danger" id="deleteBook">Delete</button></td>'+
                    '</tr>'

                    $("#borrowersTable tbody").append(tr);
                })
            }
        });
    
    
}

var borrowersModal = document.getElementById("borrowersModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");

btnAdd.onclick = () => {
    borrowersModal.style.display = "block";
}

btnClose.onclick = () => {
    borrowersModal.style.display = "none";
}

var btnCancel = document.getElementById("btnCancel");

btnCancel.onclick = () => {
    borrowersModal.style.display = "none";
}