//$(document).ready(getBooks)
addEventListener("load", getBooks)

const SERVER_URL = "https://lib-mgmt-system-demo.herokuapp.com";

var publishers;

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
                    tr = '<tr class="table-row" title="Click to edit">' +
                    '<td>'+v.title+'</td>'+
                    '<td>'+v.author+'</td>'+
                    '<td>'+v.isbn+'</td>'+
                    '<td>'+v.name+'</td>'+
                    '<td class="text-center"><button type="button" class="btn btn-danger" id="deleteBook">Delete</button></td>'+
                    '</tr>'

                    $("#booksTable tbody").append(tr);
                })
            }
        }).then(() => {
            $.ajax({
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                url: SERVER_URL+"/api/getPublishers",
                dataType: 'jsonp',
                success: (data) => {
                    var publishers = data;
                    
                    $.each(publishers, (index, element) => {
                        var toAppend = document.createElement('option');
                        var publisherSelection = $('#publisherSelection');

                        toAppend.value = element.name;
                        toAppend.innerHTML = element.name;
                        publisherSelection.append(toAppend)
    
                        //$("#publisherSelection option").append(option);
                    })
                
                    
                }
            });
        });
    
    
}

$('#deleteBook').click(() => {
    console.log('clicked')
})



//'<td><button type="button" class="btn btn-danger" id=book"'+v["book_id"]+'">Delete</button></td>'+

var booksModal = document.getElementById("booksModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");

btnAdd.onclick = () => {
    booksModal.style.display = "block";
}

btnClose.onclick = () => {
    booksModal.style.display = "none";
}

var btnCancel = document.getElementById("btnCancel");

btnCancel.onclick = () => {
    booksModal.style.display = "none";
}
