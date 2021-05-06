//$(document).ready(getBooks)
addEventListener("load", getBooks)

const SERVER_URL = "https://lib-mgmt-system-demo.herokuapp.com";
//const SERVER_URL = "http://localhost:3000";

var publishers;
var toDeleteBookId;
var toEditBookId;
var global = {};


function getBooks(){
    
        $.ajax({
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            url: SERVER_URL+"/api/getbooks",
            dataType: 'jsonp',
            success: (data) => {
                var books = data;
                $.each(books, (i,v) => {
                    tr = '<tr class="table-row" title="Click to edit" id="'+v["book_id"]+'">'+
                    '<td class="title">'+v.title+'</td>'+
                    '<td class="author">'+v.author+'</td>'+
                    '<td class="isbn">'+v.isbn+'</td>'+
                    '<td class="publisher">'+v.name+'</td>'+
                    '<td style="display: none;"></td>'+
                    '</tr>'

                    $("#booksTable tbody").append(tr);

                    //event listener for delete button click
                    $("#book"+v["book_id"]).click(() => {

                        var deleteBookModal = document.getElementById("deleteBookModal");

                        deleteBookModal.style.display = "block";

                        toDeleteBookId = v["book_id"];
                    });

                    //event listener for clicking row
                    $("#"+v["book_id"]).click(() => {
                        //set store id for editing record
                        toEditBookId = v["book_id"];
                    });
                })
            }
        }).then(() => {
            var publishers = [];
            $.ajax({
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                url: SERVER_URL+"/api/getPublishers",
                dataType: 'jsonp',
                success: (data) => {
                    publishers = data;
                    $.each(publishers, (index, element) => {
                        var toAppend = document.createElement('option');
                        var publisherSelection = $('#publisherSelection');

                        toAppend.value = element["publisher_id"];
                        toAppend.innerHTML = element.name;
                        publisherSelection.append(toAppend);
                    })

                    $.each(publishers, (index, element) => {
                        var toAppend = document.createElement('option');
                        var editPublisherSelection = $('#editPublisherSelection');

                        toAppend.value = element["publisher_id"];
                        toAppend.innerHTML = element.name;
                        editPublisherSelection.append(toAppend);
                    });
                }
            });
        });
    
    
}

//add record modal
var booksModal = document.getElementById("booksModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");
var btnCancelAdd = document.getElementById("btnCancelAdd");
var saveRecord = document.getElementById("btnSave");

btnAdd.onclick = () => {
    booksModal.style.display = "block";
}

btnClose.onclick = () => {
    hideAddRecordModal();
}

btnCancelAdd.onclick = () => {
    hideAddRecordModal();
}

saveRecord.onclick = () => {

    var reqBody = {
        title: document.getElementById("txtTitle").value,
        author: document.getElementById("txtAuthor").value,
        isbn: document.getElementById("txtISBN").value,
        publisherId: parseInt(document.getElementById("publisherSelection").value)
    }

    //console.log(reqBody);
    //hideAddRecordModal();

    $.ajax({
        crossDomain: true,
        data: JSON.stringify(reqBody),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        url: SERVER_URL+"/api/insertBook",
        success: (data) => {
            hideAddRecordModal();
            document.getElementById("addBookForm").reset();
            refreshData();
        }
    });
}

//edit record modal
var booksTable = document.getElementsByTagName("table")[0];
var booksTableBody = document.getElementsByTagName("tbody")[0];
var editBookModal = document.getElementById("editBookModal");

var btnCloseEditModal = document.getElementById("btnCloseEditModal");
var btnCancelEdit = document.getElementById("btnCancelEdit");

var txtEditTitle = document.getElementById("txtEditTitle");
var txtEditAuthor = document.getElementById("txtEditAuthor");
var txtEditISBN = document.getElementById("txtEditISBN");

var btnSaveChanges = document.getElementById("btnSaveChanges");


btnCloseEditModal.onclick = hideEditRecordModal;
btnCancelEdit.onclick = hideEditRecordModal;

booksTableBody.onclick = (e) => {
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
        }
    }

    txtEditTitle.value = data.title;
    txtEditAuthor.value = data.author;
    txtEditISBN.value = data.isbn;

    editBookModal.style.display = "block";
}

btnSaveChanges.onclick = () => {
    var requestBody = {
        title: txtEditTitle.value,
        author: txtEditAuthor.value,
        isbn: txtEditISBN.value,
        publisherId: parseInt(document.getElementById("editPublisherSelection").value)
    }
    $.ajax({
        crossDomain: true,
        data: JSON.stringify(requestBody),
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        url: SERVER_URL+"/api/updateBook/"+toEditBookId,
        success: (data) => {
            hideEditRecordModal();
            document.getElementById("editBookForm").reset();
            refreshData();
        }
    });
}

//delete record modal
var deleteBookModal = document.getElementById("deleteBookModal");
var btnDelete = document.getElementById("btnDelete");
var btnCancelDelete = document.getElementById("btnCancelDelete");
var btnCloseDeleteModal = document.getElementById("btnCloseDeleteModal");

btnCloseDeleteModal.onclick = () => {
    hideDeleteModal();
}

btnCancelDelete.onclick = () => {
    hideDeleteModal();
}

btnDelete.onclick = () => {

    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "DELETE",
        url: SERVER_URL+"/api/deleteBook/"+toDeleteBookId,
        success: (data) => {
            hideDeleteModal();
            refreshData();
        }
    });
}

function hideAddRecordModal(){
    booksModal.style.display = "none";
}

function hideEditRecordModal(){
    editBookModal.style.display = "none";
}

function hideDeleteModal(){
    deleteBookModal.style.display = "none";
}

function refreshData(){
    $("#booksTable > tbody").empty();
    
    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "GET",
        url: SERVER_URL+"/api/getbooks",
        dataType: 'jsonp',
        success: (data) => {
            var books = data;
            $.each(books, (i,v) => {
                tr = '<tr class="table-row" title="Click to edit" id="'+v["book_id"]+'">'+
                '<td class="title">'+v.title+'</td>'+
                '<td class="author">'+v.author+'</td>'+
                '<td class="isbn">'+v.isbn+'</td>'+
                '<td class="publisher">'+v.name+'</td>'+
                '<td style="display: none;"></td>'+
                '</tr>'

                $("#booksTable tbody").append(tr);

                //event listener for delete button click
                $("#book"+v["book_id"]).click(() => {

                    var deleteBookModal = document.getElementById("deleteBookModal");

                    deleteBookModal.style.display = "block";

                    toDeleteBookId = v["book_id"];
                });

                //event listener for clicking row
                $("#"+v["book_id"]).click(() => {
                    //set store id for editing record
                    toEditBookId = v["book_id"];
                });
            })
        }
    });
}


