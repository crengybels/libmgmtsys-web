//$(document).ready(getBorrowers)
addEventListener("load", getBooksBorrowed)

const SERVER_URL = "https://lib-mgmt-system-demo.herokuapp.com";
//const SERVER_URL = "http://localhost:3000";

var global = {};

var toEditBooksBorrowedId;
var toDeleteBooksBorrowedId;


function getBooksBorrowed(){
        $.ajax({
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            url: SERVER_URL+"/api/getBooksBorrowed",
            dataType: 'jsonp',
            success: (data) => {
                var booksBorrowed = data;
                
                $.each(booksBorrowed, (i,v) => {
                    var dateBorrowed = new Date(v["date_borrowed"]).toDateString();
                    var dueDate = new Date(v["due_date"]).toDateString();
                    
                    tr = '<tr class="table-row" title="Click to edit" id="'+v.id+'">' +
                    '<td class="title">'+v.title+'</td>'+
                    '<td class="isbn">'+v.isbn+'</td>'+
                    '<td class="firstname">'+v.firstname+'</td>'+
                    '<td class="lastname">'+v.lastname+'</td>'+
                    '<td class="studentId">'+v["student_id"]+'</td>'+
                    '<td class="contact">'+v.contact+'</td>'+
                    '<td class="dateBorrowed">'+dateBorrowed+'</td>'+
                    '<td class="dueDate">'+dueDate+'</td>'+
                    '<td class="returned">'+v.returned+'</td>'+
                    //'<td class="text-center"><button type="button" class="btn btn-danger" id="btnDelete'+v.id+'">Delete</button></td>'+
                    '</tr>'

                    $("#booksBorrowedTable tbody").append(tr);

                    //event listener for delete button click
                    $("#btnDelete"+v.id).click(() => {

                        var deleteBooksBorrowedModal = document.getElementById("deleteBooksBorrowedModal");

                        deleteBooksBorrowedModal.style.display = "block";

                        toDeleteBooksBorrowedId = v.id;
                        console.log(toDeleteBooksBorrowedId)
                    });
                })
            }
        }).then(() => {
            var books = [];
            $.ajax({
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                url: SERVER_URL+"/api/getBooks",
                dataType: 'jsonp',
                success: (data) => {
                    books = data;
                    global.books = data;
                    $.each(books, (index, element) => {
                        var toAppend = document.createElement('option');
                        var bookSelection = $('#bookSelection');

                        toAppend.value = element["book_id"];
                        toAppend.innerHTML = element.isbn+' | '+element.title+' ('+element.author+')';
                        bookSelection.append(toAppend);
                    })

                    $.each(books, (index, element) => {
                        var toAppend = document.createElement('option');
                        var editBookSelection = $('#editBookSelection');

                        toAppend.value = element["book_id"];
                        toAppend.innerHTML = element.isbn+' | '+element.title+' ('+element.author+')';
                        editBookSelection.append(toAppend);
                    });
                }
            }).then(() => {
                var borrowers = [];

                $.ajax({
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    url: SERVER_URL+"/api/getBorrowers",
                    dataType: 'jsonp',
                    success: (data) => {
                        borrowers = data;
                        global.borrowers = data;
                        $.each(borrowers, (index, element) => {
                            var toAppend = document.createElement('option');
                            var borrowerSelection = $('#borrowerSelection');

                            toAppend.value = element["borrower_id"];
                            toAppend.innerHTML = element["student_id"]+' - '+element.firstname+' '+element.lastname;
                            borrowerSelection.append(toAppend);
                        })

                        $.each(borrowers, (index, element) => {
                            var toAppend = document.createElement('option');
                            var editBorrowerSelection = $('#editBorrowerSelection');

                            toAppend.value = element["borrower_id"];
                            toAppend.innerHTML = element["student_id"]+' - '+element.firstname+' '+element.lastname;
                            editBorrowerSelection.append(toAppend);
                        });
                    }
                });
            });
        });
    
    
}

//add record modal
var booksBorrowedModal = document.getElementById("booksBorrowedModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");
var btnCancelAdd = document.getElementById("btnCancelAdd");
var btnSave = document.getElementById("btnSave");
var btnCancel = document.getElementById("btnCancel");

btnAdd.onclick = () => {
    document.getElementById("addBooksBorrowedForm").reset();
    booksBorrowedModal.style.display = "block";
}

btnClose.onclick = hideAddBooksBorrowedModal;

btnCancelAdd.onclick = hideAddBooksBorrowedModal;

btnSave.onclick = () => {
    var reqBody = {
        bookId: parseInt(document.getElementById("bookSelection").value),
        borrowerId: parseInt(document.getElementById("borrowerSelection").value),
        dateBorrowed: document.getElementById("dateBorrowed").value,
        dueDate: document.getElementById("dueDate").value,
        returned: document.querySelector('#returned:checked') ? true : false
    }

    $.ajax({
        crossDomain: true,
        data: JSON.stringify(reqBody),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        url: SERVER_URL+"/api/insertBooksBorrowed",
        success: (data) => {
            hideAddBooksBorrowedModal();
            document.getElementById("addBooksBorrowedForm").reset();
            refreshData();
        }
    });
}

//edit record modal
var booksBorrowedTable = document.getElementsByTagName("table")[0];
var booksBorrowedTableBody = document.getElementsByTagName("tbody")[0];
var editBooksBorrowedModal = document.getElementById("editBooksBorrowedModal");

var btnCloseEditModal = document.getElementById("btnCloseEditModal");
var btnCancelEdit = document.getElementById("btnCancelEdit");

var editBookSelection = document.getElementById("editBookSelection");
var editBorrowerSelection = document.getElementById("editBorrowerSelection");
var editDateBorrowed = document.getElementById("editDateBorrowed");
var editDueDate = document.getElementById("editDueDate")
var editReturned = document.querySelector('#returned:checked');

var btnSaveChanges = document.getElementById("btnSaveChanges");

btnCloseEditModal.onclick = hideEditBooksBorrowedModal;
btnCancelEdit.onclick = hideEditBooksBorrowedModal;

booksBorrowedTableBody.onclick = (e) => {
    e = e || window.event;
    var data = {};
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
            data[cells[i].className] = cells[i].innerHTML;
            data.id = parseInt(cells[i].parentNode.id);
        }
    }

    toEditBooksBorrowedId = data.id;
    
    let booksArray = global.books;
    let selectedBook = booksArray.find(book => book.isbn == data.isbn)
    
    $("#editBookSelection").val(selectedBook["book_id"]) //set selected book

    let borrowersArray = global.borrowers;
    let selectedBorrower = borrowersArray.find(borrower => borrower["student_id"] == data.studentId)
    
    $("#editBorrowerSelection").val(selectedBorrower["borrower_id"]) //set selected borrower

    let selectedDateBorrowed = new Date(data.dateBorrowed);
    var dayDateBorrowed = ("0" + selectedDateBorrowed.getDate()).slice(-2);
    var monthDateBorrowed = ("0" + (selectedDateBorrowed.getMonth() + 1)).slice(-2);

    var parsedDateBorrowed = selectedDateBorrowed.getFullYear()+"-"+(monthDateBorrowed)+"-"+(dayDateBorrowed);
    $("#editDateBorrowed").val(parsedDateBorrowed) //set date borrowed

    let selectedDueDate = new Date(data.dueDate);
    var dayDueDate = ("0" + selectedDueDate.getDate()).slice(-2);
    var monthDueDate = ("0" + (selectedDueDate.getMonth() + 1)).slice(-2);

    var parsedDueDate = selectedDueDate.getFullYear()+"-"+(monthDueDate)+"-"+(dayDueDate);
    $("#editDueDate").val(parsedDueDate); //set due date
    
    if(data.returned == "true"){
        $("#editReturned").prop("checked", true);
    }
    else if(data.returned == "false"){
        $("#editReturned").prop("checked", false);
    }

    editBooksBorrowedModal.style.display = "block";
}

btnSaveChanges.onclick = () => {
    var requestBody = {
        bookId: parseInt(editBookSelection.value),
        borrowerId: parseInt(editBorrowerSelection.value),
        dateBorrowed: editDateBorrowed.value,
        dueDate: editDueDate.value,
        returned: document.querySelector('#editReturned:checked') ? true : false
    }

    $.ajax({
        crossDomain: true,
        data: JSON.stringify(requestBody),
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        url: SERVER_URL+"/api/updateBooksBorrowed/"+toEditBooksBorrowedId,
        success: (data) => {
            hideEditBooksBorrowedModal();
            document.getElementById("editBooksBorrowedForm").reset();
            refreshData();
        }
    })
}

var btnDelete = document.getElementById("btnDelete");

btnDelete.onclick = () => {
    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "DELETE",
        url: SERVER_URL+"/api/deleteBooksBorrowed/"+toEditBooksBorrowedId,
        success: (data) => {
            hideEditBooksBorrowedModal();
            //document.getElementById("editBooksBorrowedForm").reset();
            refreshData();
        }
    })
}


function hideAddBooksBorrowedModal(){
    booksBorrowedModal.style.display = "none";
}

function hideEditBooksBorrowedModal(){
    editBooksBorrowedModal.style.display = "none";
}

function refreshData(){
    $("#booksBorrowedTable > tbody").empty(); //clears rows

    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "GET",
        url: SERVER_URL+"/api/getBooksBorrowed",
        dataType: 'jsonp',
        success: (data) => {
            var booksBorrowed = data;
            
            $.each(booksBorrowed, (i,v) => {
                var dateBorrowed = new Date(v["date_borrowed"]).toDateString();
                var dueDate = new Date(v["due_date"]).toDateString();
                tr = '<tr class="table-row" title="Click to edit" id="'+v.id+'">'+
                '<td class="title">'+v.title+'</td>'+
                '<td class="isbn">'+v.isbn+'</td>'+
                '<td class="firstname">'+v.firstname+'</td>'+
                '<td class="lastname">'+v.lastname+'</td>'+
                '<td class="studentId">'+v["student_id"]+'</td>'+
                '<td class="contact">'+v.contact+'</td>'+
                '<td class="dateBorrowed">'+dateBorrowed+'</td>'+
                '<td class="dueDate">'+dueDate+'</td>'+
                '<td class="returned">'+v.returned+'</td>'+
                //'<td class="text-center"><button type="button" class="btn btn-danger" id="deleteBook">Delete</button></td>'+
                '</tr>'

                $("#booksBorrowedTable tbody").append(tr);
            })
        }
    });
}