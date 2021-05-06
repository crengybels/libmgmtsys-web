//$(document).ready(getBorrowers)
addEventListener("load", getBorrowers)

const SERVER_URL = "https://lib-mgmt-system-demo.herokuapp.com";
//const SERVER_URL = "http://localhost:3000";

var toEditBorrowerId;

function getBorrowers(){
        $.ajax({
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            url: SERVER_URL+"/api/getBorrowers",
            dataType: 'jsonp',
            success: (data) => {
                var borrowers = data;
                console.log(borrowers)
                $.each(borrowers, (i,v) => {
                    tr = '<tr class="table-row" title="Click to edit" id="'+v["borrower_id"]+'">' +
                    '<td class="studentId">'+v["student_id"]+'</td>'+
                    '<td class="firstname">'+v["firstname"]+'</td>'+
                    '<td class="lastname">'+v["lastname"]+'</td>'+
                    '<td class="course">'+v.course+'</td>'+
                    '<td class="year">'+v.year+'</td>'+
                    '<td class="contact">'+v.contact+'</td>'+
                    //'<td class="text-center"><button type="button" class="btn btn-danger" id="deleteBook">Delete</button></td>'+
                    '</tr>'

                    $("#borrowersTable tbody").append(tr);

                    //event listener for clicking row
                    $("#"+v["borrower_id"]).click(() => {
                        //set store id for editing record
                        toEditBorrowerId = v["borrower_id"];
                    });
                })
            }
        });
    
    
}

//add record modal
var borrowersModal = document.getElementById("borrowersModal");
var btnAdd = document.getElementById("addRecord");
var btnClose = document.getElementById("btnClose");
var saveRecord = document.getElementById("btnSave");


btnAdd.onclick = () => {
    borrowersModal.style.display = "block";
}

btnClose.onclick = () => {
    hideAddRecordModal();
}

var btnCancel = document.getElementById("btnCancel");

btnCancel.onclick = () => {
    hideAddRecordModal();
}

saveRecord.onclick = () => {

    var reqBody = {
        studentId: document.getElementById("txtStudentId").value,
        firstname: document.getElementById("txtFirstname").value,
        lastname: document.getElementById("txtLastname").value,
        course: document.getElementById("txtCourse").value,
        year: document.getElementById("txtYear").value,
        contact: document.getElementById("txtContact").value,
    }

    $.ajax({
        crossDomain: true,
        data: JSON.stringify(reqBody),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        url: SERVER_URL+"/api/insertBorrower",
        success: (data) => {
            hideAddRecordModal();
            document.getElementById("addBorrowerForm").reset();
            refreshData();
        }
    });
}

//edit record modal
var borrowersTable = document.getElementsByTagName("table")[0];
var borrowersTableBody = document.getElementsByTagName("tbody")[0];
var editBorrowerModal = document.getElementById("editBorrowerModal");

var btnCloseEditModal = document.getElementById("btnCloseEditModal");
var btnCancelEdit = document.getElementById("btnCancelEdit");

var txtEditStudentId = document.getElementById("txtEditStudentId");
var txtEditFirstname = document.getElementById("txtEditFirstname");
var txtEditLastname = document.getElementById("txtEditLastname");
var txtEditCourse = document.getElementById("txtEditCourse");
var txtEditYear = document.getElementById("txtEditYear");
var txtEditContact = document.getElementById("txtEditContact");

var btnSaveChanges = document.getElementById("btnSaveChanges");

btnCloseEditModal.onclick = hideEditRecordModal;
btnCancelEdit.onclick = hideEditRecordModal;

borrowersTableBody.onclick = (e) => {

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

    txtEditStudentId.value = data.studentId;
    txtEditFirstname.value = data.firstname;
    txtEditLastname.value = data.lastname;
    txtEditCourse.value = data.course;
    txtEditYear.value = data.year;
    txtEditContact.value = data.contact;

    editBorrowerModal.style.display = "block";
}

btnSaveChanges.onclick = () => {
    var requestBody = {
        studentId: parseInt(document.getElementById("txtEditStudentId").value),
        firstname: document.getElementById("txtEditFirstname").value,
        lastname: document.getElementById("txtEditLastname").value,
        course: document.getElementById("txtEditCourse").value,
        year: document.getElementById("txtEditYear").value,
        contact: document.getElementById("txtEditContact").value,
    }
    
    $.ajax({
        crossDomain: true,
        data: JSON.stringify(requestBody),
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        url: SERVER_URL+"/api/updateBorrower/"+toEditBorrowerId,
        success: (data) => {
            hideEditRecordModal();
            document.getElementById("editBorrowerForm").reset();
            refreshData();
        }
    });
}

function hideAddRecordModal(){
    borrowersModal.style.display = "none";
}

function hideEditRecordModal(){
    editBorrowerModal.style.display = "none";
}

function refreshData(){
    $("#borrowersTable > tbody").empty();
    getBorrowers();
}