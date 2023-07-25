"use strict";

function onload() {
    $('#loader-page').show();
}
function endload() {
    $('#loader-page').hide();
}

function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    if (username.trim()) {
        if (password.trim()) {         
            setTimeout(function () {
                onload();
            }, 1000);
            //data da duoc validate:
            var loginModel = {};
            loginModel.username = username.trim();
            loginModel.password = password.trim();

            $.ajax({
                type: "POST",
                url: "/Login/CheckLogin",
                data: JSON.stringify(loginModel),
                dataType: "script",//Kieu du lieu tra ve
                contentType: "application/json",
                success: function (response) {

                },
                error: function (res) {
                    alert('fail');
                }
            });
        }
        else {
            Swal.fire("Mật khẩu không được trống!", "Bạn hãy nhập mật khẩu!", "warning");
        }
    }
    else {
        Swal.fire("Tên đăng nhập không đươc trống!", "Bạn hãy nhập tên đăng nhập!", "warning");
    }
}

//------- FORMAT DATE ------------
//date: 2022-09-06T00:00:00
function formatDateyyyyMMdd(date) {
    var dateSplit = date.split('T');
    return dateSplit[0];
}

//compare 2 time: "10:20:45" vs "11:21:48"
function compareTime(strTime1, strTime2) {
    if (Date.parse(`01/01/2011 ` + strTime1) > Date.parse(`01/01/2011 ` + strTime2)) {
        return true
    }
    else {
        return false;
    }
}

function DrawTableRowsIPQC(item, isAddInDatatable = false) {

    var row = [];

    var col_0 = `<td class="col_0"><label>${item.MO}</label></td>`;
    row.push(col_0); //col 0

    var col_1 = `<td class=""><label>${item.ModelName}</label></td>`;
    row.push(col_1); //col 1

    var col_2 = `<td class=""><label>${item.MachineCode}</label></td>`;
    row.push(col_2) // col 2

    var col_3 = `<td class=""><label>${item.TeCreatedByName}</label></td>`;
    row.push(col_3) // col 3

    var col_4 = `<td class="text-center"><label>${(item.ShiftWork == 1) ? "Ngày" : "Đêm"}</label></td>`;
    row.push(col_4) // col 4

    var col_5 = `<td class="text-center"><label>${formatDateyyyyMMdd(item.ChecklistCreateDate) }</label></td>`;
    row.push(col_5); //col 5


    {
        var badgeMessage = "";
        var badgeStyle = "";
        switch (item.StatusConfirm) {
            case 0: {
                badgeMessage = "Chờ chuyền trưởng xác nhận";
                badgeStyle = "bg-info";
                break;
            }
            case 1: {
                badgeMessage = "Chờ IPQC xác nhận";
                badgeStyle = "bg-warning";
                break;
            }
            case 2: {
                badgeMessage = "IPQC đã xác nhận";
                badgeStyle = "bg-success";
                break;
            }
            case 3: {
                badgeMessage = "Chuyền trưởng từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
            case 4: {
                badgeMessage = "IPQC từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle}">${badgeMessage}</label></td>`);
    } // col 6

    {
        var cButton = "";
        if (item.StatusConfirm == 1) {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết"       data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                    <button title="Xác nhận"       data-id=${item.CheckListFirstId} class="btn btn-success" onclick="ConfirmCheckList(this, event)"><i class="bi bi-check-lg"></i></button>
                    <button title="Không xác nhận" data-id=${item.CheckListFirstId} class="btn btn-danger"  onclick="RejectCheckList(this, event)"><i class="bi bi-x"></i></button>
                 </td>`;
        }
        else {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết"       data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                 </td>`;
        }
        row.push(cButton);
    } // col 7

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}
function DrawTableRowsLead(item, isAddInDatatable = false) {

    var row = [];

    var col_0 = `<td class="col_0"><label>${item.MO}</label></td>`;
    row.push(col_0); //col 0

    var col_1 = `<td class=""><label>${item.ModelName}</label></td>`;
    row.push(col_1); //col 1

    var col_2 = `<td class=""><label>${item.MachineCode}</label></td>`;
    row.push(col_2) // col 2

    var col_3 = `<td class=""><label>${item.TeCreatedByName}</label></td>`;
    row.push(col_3) // col 3

    var col_4 = `<td class="text-center"><label>${(item.ShiftWork == 1) ? "Ngày" : "Đêm"}</label></td>`;
    row.push(col_4) // col 4

    var col_5 = `<td class="text-center"><label>${formatDateyyyyMMdd(item.ChecklistCreateDate)}</label></td>`;
    row.push(col_5); //col 5


    {
        var badgeMessage = "";
        var badgeStyle = "";
        switch (item.StatusConfirm) {
            case 0: {
                badgeMessage = "Chờ chuyền trưởng xác nhận";
                badgeStyle = "bg-info";
                break;
            }
            case 1: {
                badgeMessage = "Chờ IPQC xác nhận";
                badgeStyle = "bg-warning";
                break;
            }
            case 2: {
                badgeMessage = "IPQC đã xác nhận";
                badgeStyle = "bg-success";
                break;
            }
            case 3: {
                badgeMessage = "Chuyền trưởng từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
            case 4: {
                badgeMessage = "IPQC từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle}">${badgeMessage}</label></td>`);
    } // col 6

    {
        var cButton = "";
        if (item.StatusConfirm == 0) {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết"       data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                    <button title="Xác nhận"       data-id=${item.CheckListFirstId} class="btn btn-success" onclick="ConfirmCheckList(this, event)"><i class="bi bi-check-lg"></i></button>
                    <button title="Không xác nhận" data-id=${item.CheckListFirstId} class="btn btn-danger"  onclick="RejectCheckList(this, event)"><i class="bi bi-x"></i></button>
                 </td>`;
        }
        else {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết"       data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                 </td>`;
        }
        row.push(cButton);
    } // col 7

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}
function DrawTableRowsWork(item, isAddInDatatable = false) {

    var row = [];

    var col_0 = `<td class="col_0"><label>${item.MO}</label></td>`;
    row.push(col_0); //col 0

    var col_1 = `<td class=""><label>${item.ModelName}</label></td>`;
    row.push(col_1); //col 1

    var col_2 = `<td class=""><label>${item.MachineCode}</label></td>`;
    row.push(col_2) // col 2

    var col_3 = `<td class=""><label>${item.TeCreatedByName}</label></td>`;
    row.push(col_3) // col 3

    var col_4 = `<td class="text-center"><label>${(item.ShiftWork == 1) ? "Ngày" : "Đêm"}</label></td>`;
    row.push(col_4) // col 4

    var col_5 = `<td class="text-center"><label>${formatDateyyyyMMdd(item.ChecklistCreateDate)}</label></td>`;
    row.push(col_5); //col 5


    {
        var badgeMessage = "";
        var badgeStyle = "";
        switch (item.StatusConfirm) {
            case 0: {
                badgeMessage = "Chờ chuyền trưởng xác nhận";
                badgeStyle = "bg-info";
                break;
            }
            case 1: {
                badgeMessage = "Chờ IPQC xác nhận";
                badgeStyle = "bg-warning";
                break;
            }
            case 2: {
                badgeMessage = "IPQC đã xác nhận";
                badgeStyle = "bg-success";
                break;
            }
            case 3: {
                badgeMessage = "Chuyền trưởng từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
            case 4: {
                badgeMessage = "IPQC từ chối đơn";
                badgeStyle = "bg-danger";
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle}">${badgeMessage}</label></td>`);
    } // col 6

    {
        var cButton = "";
        if (item.StatusConfirm == 0) {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết" data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                    <button title="Sửa"      data-id=${item.CheckListFirstId} class="btn btn-warning" onclick="EditCheckList(this, event)"><i class="bi bi-pen-fill"></i></button>
                    <button title="Xóa"      data-id=${item.CheckListFirstId} class="btn btn-danger"  onclick="DeleteCheckList(this, event)"><i class="bi bi-trash-fill"></i></button>
                 </td>`;
        }
        else {
            cButton =
                `<td class="col_7">
                    <button title="Chi tiết" data-id=${item.CheckListFirstId} class="btn btn-info"    onclick="DetailsCheckList(this, event)"><i class="bi bi-info-lg"></i></button>
                   
                 </td>`;
        }
        row.push(cButton);
    } // col 7

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}

var dataTable;
function CreateCheckListTable() {
    var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
    var myTable = document.querySelector('#table_Checklist');
    dataTable = new simpleDatatables.DataTable(myTable, {
        scrollY: scrollHeight,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        sortable: false,
        fixedColumns: false,
    });
    $('#tbody_checklist').show();
}

function GetDatatable() {
    return dataTable;
}

