//$(document).ready(getBorrowers)
addEventListener("load", getBooksBorrowed)

function getBooksBorrowed(){
        $.ajax({
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            url: "http://localhost:3000/api/getBooksBorrowed",
            dataType: 'jsonp',
            success: (data) => {
                var borrowers = data;
                
                $.each(borrowers, (i,v) => {
                    var dateBorrowed = new Date(v["date_borrowed"]).toDateString();
                    var dueDate = new Date(v["due_date"]).toDateString();
                    
                    tr = '<tr class="table-row" title="Click to edit">' +
                    '<td>'+v.title+'</td>'+
                    '<td>'+v.isbn+'</td>'+
                    '<td>'+v["firstname"]+' '+v["lastname"]+'</td>'+
                    '<td>'+v.contact+'</td>'+
                    '<td>'+dateBorrowed+'</td>'+
                    '<td>'+dueDate+'</td>'+
                    '<td>'+v.returned+'</td>'+
                    '<td class="text-center"><button type="button" class="btn btn-danger" id="deleteBook">Delete</button></td>'+
                    '</tr>'

                    $("#booksBorrowedTable tbody").append(tr);
                })
            }
        });
    
    
}

var booksBorrowedModal = document.getElementById("booksBorrowedModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");

btnAdd.onclick = () => {
    booksBorrowedModal.style.display = "block";
}

btnClose.onclick = () => {
    booksBorrowedModal.style.display = "none";
}

var btnCancel = document.getElementById("btnCancel");

btnCancel.onclick = () => {
    booksBorrowedModal.style.display = "none";
}