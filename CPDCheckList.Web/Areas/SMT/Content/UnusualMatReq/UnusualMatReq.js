$(function () {
    $('#page_name').text('物料異常需求申請單 Đơn xin nhu cầu vật liệu bất thường V9');

    LoadData();
    GetUsers();

    if ($('#thisUser').data('role') == 8) {
        const myInterval = setInterval(() => {
            if ($('#btn_AddNew').is(':visible')) {
                clearInterval(myInterval);
            } else {
                $('#btn_AddNew').fadeIn(300);
            }
        }, 300);
    }
    else {
        const myInterval = setInterval(() => {
            if ($('#btn_AddNew').is(':visible')) {
                clearInterval(myInterval);
            } else {
                $('#btn_AddNew').hide();
            }
            console.log('hide');
        }, 300);
    }
    

    $('#row-root tr').first().find('td').first().find('input');
});

// Create Table
var dataTable;
var isLoadingData = false;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

// GET
function LoadData() {
    onload();

    var data = {
        Location: $('#Location').val(),
        Year: thisYear,
        Month: thisMonth,
        Date: thisDay
    }

    $.ajax({
        type: "GET",
        url: "/SMT/UnusualMatReq/GetMatReqs",
        data: data,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                const MatReqs = res.data;

                await $.each(MatReqs, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#table_MatReq-tbody').append(row);
                });

                CreateTable();
               // AddEventLoadTable();
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }
            endload();
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetResonseError(err.responseText, 'title'), "error");
            endload();
        }
    });
}
function AddEventLoadTable() {
    const divElement = document.querySelector('#table_MatReq');
    divElement.addEventListener('scroll', function () {
        var scrollLenght = parseInt((divElement.scrollTop + divElement.clientHeight));
        var scrollHeight = parseInt(divElement.scrollHeight * 0.9);

        var items = $('#table_MatReq-tbody tr');

        if (!isLoadingData && (scrollLenght > scrollHeight) && items.length > 10) {
            isLoadingData = true;

            onload();

            thisMonth -= 1;
            if (thisMonth == 0) {
                thisYear -= 1;
                thisMonth = 12;
            }

            var data = {
                Location: $('#Location').val(),
                Year: thisYear,
                Month: thisMonth,
                Date: thisDay
            }

            $.ajax({
                type: "GET",
                url: "/SMT/UnusualMatReq/GetMatReqs",
                data: data,
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    if (res.status) {
                        const MatReqs = JSON.parse(res.data);

                        await $.each(MatReqs, function (k, item) {
                            var row = DrawTableRows(item);
                            $('#table_MatReq-tbody').append(row);
                        });

                        if (MatReqs.length > 0) {
                            isLoadingData = false;
                        }
                        endload();
                    }
                    else {
                        Swal.fire("Oops...Something went wrong!", response.message, "error");
                        endload();
                    }
                },
                error: function (err) {
                    Swal.fire("Oops...Something went wrong!", GetInlineString(err.responseText, 'title'), "error");
                    endload();
                }
            });
        }
    });
}
function CreateTable() {
    var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
    var myTable = document.querySelector('#table_MatReq');
    dataTable = new simpleDatatables.DataTable(myTable, {
        scrollY: scrollHeight,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        footer: false,
        sortable: false,
        fixedColumns: false,
    });
};
function DrawTableRows(item, isAddInDatatable = false) {
    var row = [];

    // 0 ID 
    row.push(`<td>${moment(item.DateReq).format('YYYYMMDDHHmm')}-${item.Id}</td>`);
    // 1 User 
    row.push(`<td>${item.UnusualMatReqStatus[0].UserCreated.UserCode}</td>`);
    // 2 DaterReq 
    row.push(`<td>${moment(item.DateReq).format('YYYY-MM-DD HH:mm') }</td>`);
    // 3 ModelName 
    row.push(`<td class="text-center">${item.ModelName}</td>`);
    // 4 MO 
    row.push(`<td class="text-center">${item.MO}</td>`);
    // 5 MatCode
    row.push(`<td>${item.MatCode}</td>`);
    // 6 Unit
    row.push(`<td>${item.Unit}</td>`);
    // 7 ActReqQty
    row.push(`<td class="text-center">${item.ActReqQty}</td>`);
    // 8 Status
    var status = {
        color: "warning",
        status: "Pending"
    }
    var colorStatus = "warning"
    switch (item.UnusualMatReqStatus[0].Status) {
        case "Pending":
            break;
        case "Approved":
            status.color = "success";
            status.status = "Approved";
            break;
        case "Rejected":
            status.color = "danger";
            status.status = "Rejected";
            break;
    }
    row.push(`<td class="text-center"><span class="badge bg-${status.color}">${status.status}</span></td>`);
    // 9 Action
    {
        console.log(item);

        var Button = ``;
        var checkIsNeedSign = false;
        if (item.UnusualMatReqStatus[0].IdUserCreated != $('#thisUser').data('id')) { // nếu không phải người tạo đơn
            $.each(item.UnusualMatReqStatus[0].UnsualMatReqSigns, function (k, sign) {
                if (sign.IdUser != 178) {
                    if (sign.IdUser == $('#thisUser').data('id')) {
                        if (sign.Status == "Pending") {
                            checkIsNeedSign = true;
                        }
                    }
                } else {
                    if (sign.IdRole == $('#thisUser').data('role')) {
                        if (sign.Status == "Pending") {
                            checkIsNeedSign = true;
                        }
                    }
                }
            }); // kiểm tra xem user này đã ký chưa, nếu là 178 (all) thì check role này đã ký chưa

            if (checkIsNeedSign) {
                Button = `<td class="action_col">
                           <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           <button title="Ký"      data-id=${item.Id} class="btn btn-success"  onclick="Approve(this, event)"><i class="bi bi-check"></i></button>
                           <button title="Từ chối"      data-id=${item.Id} class="btn btn-danger"  onclick="Reject(this, event)"><i class="bi bi-x"></i></button>
                      </td>`;
            }
            else {
                Button = `<td class="action_col">
                           <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                      </td>`;
            }
        }
        else {
            var isNoSign = true;
            $.each(item.UnusualMatReqStatus[0].UnsualMatReqSigns, function (k, sign) { // check xem đã có người nào ký chưa, nếu khi rồi không hiện xoá
                if (sign.Status != "Pending") {
                    isNoSign = false;
                }
            });

            if (isNoSign) {
                Button = `<td class="action_col">
                           <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           <button title="Xoá"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
                      </td>`;
            }
            else {
                Button = `<td class="action_col">
                           <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                      </td>`;
            }
            
        }

        
        row.push(Button);
    }

    if (!isAddInDatatable) {
        return `<tr data-id="${item.Id}">${row}</tr>`;
    }
    else {
        return row;
    }
}
function GetRequest(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/SMT/UnusualMatReq/GetRequest?Id=" + id,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: async function (res) {
                if (res.status) {
                    resolve(res.request);
                }
                else {
                    reject(res.message);
                }
            },
            error: function (err) {
                reject(err.responseText);
            }
        });
    });
}


// Add new
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();
    $('input[data-name="Type"]').change();
    $('#type_select').change(); 

    $('[data-name="Add-ModelName"]').val('');
    $('[data-name="Add-MO"]').val('');
    $('[data-name="Add-MatDesc"]').val('');
    $('[data-name="Add-MatCode"]').val('');
    $('[data-name="Add-Unit"]').val('');
    $('[data-name="Add-ActReqQty"]').val('');
    $('[data-name="Add-ExReqQty"]').val('');
    $('[data-name="Add-DemQty"]').val('');
    $('[data-name="Add-ActDelQty"]').val('');
    $('[data-name="Add-TotalLoss"]').val('');
    $('[data-name="Add-MatCost"]').val('');
    $('[data-name="Add-TotalLossCost"]').val('');
    $('[data-name="Add-DemReason"]').val('');

    $('input[data-name="Add-DateReq"]').val(moment().format('YYYY-MM-DDTHH:mm:ss'));

    $('#MatReqModal').modal('show');
});
var file = null;
$('#Addfile-button').click(function () {
    var inputSelectFile = $('<input type="file" />');

    inputSelectFile.change(function () {
        file = this.files[0]; // Lấy ra tệp tin đầu tiên trong danh sách

        if (file) {
            var fileSize = file.size;

            if (fileSize > 50 * 1024 * 1024) {
                alert("Kích thước tệp tin lớn hơn 50 MB. Vui lòng chọn tệp tin nhỏ hơn.");
                return;
            }
            else {
                $('#Addfile-button button').hide();

                var fileName = file.name;
                $('#fileName').text(fileName);
                $('#fileName').show();
            }
        }
    });

    inputSelectFile.click();
})  
$('#MatReqModal-btnSave').click(function () {
    var data = GetDataMatReqModalTable();
    var formData = new FormData();
    formData.append('file', file);
    formData.append('unusualMatReq', JSON.stringify(data));

    $.ajax({
        type: "POST",
        url: "/SMT/UnusualMatReq/NewRequest",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (res) {
            if (res.status) {
                dataTable.rows().add(DrawTableRows(res.data, true));

                $('#MatReqModal').modal('hide');
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetResponseError(err.responseText, 'title'), "error");
        }
    });
});

// Delete
function Delete(elm, e) {
    e.preventDefault();

    const Id = $(elm).data('id');
    const Index = $(elm).closest('tr').index();

    Swal.fire({
        title: "Success",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa!",
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            //Xác nhận xóa:
            $.ajax({
                type: "POST",
                url: "/SMT/UnusualMatReq/DeleteRequest",
                data: {Id},
                success: function (res) {
                    if (res.status) {
                        Swal.fire("Xóa thành công", "", "success");
                        dataTable.rows().remove(Index);
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", res.message, "error");
                    }
                },
                error: function (err) {
                    Swal.fire("Có lỗi xảy ra", GetResponseError(err.responseText, 'title'), "error");
                }
            });
        }
    });
}

// Details
async function Details(elm, e) {
    e.preventDefault();
    var id = $(elm).data('id');
    var request = await GetRequest(id);

    console.log(request);

    

    $('[data-name="details-DateReq"]').val(moment(request.DateReq).format('YYYY-MM-DDTHH:mm:ss'));
    $('[data-name="details-ModelName"]').val(request.ModelName);
    $('[data-name="details-MO"]').val(request.MO);
    $('[data-name="details-MatDesc"]').val(request.MatDesc);
    $('[data-name="details-MatCode"]').val(request.MatCode);
    $('[data-name="details-Unit"]').val(request.Unit);
    $('[data-name="details-ActReqQty"]').val(request.ActReqQty);
    $('[data-name="details-ExReqQty"]').val(request.ExReqQty);
    $('[data-name="details-DemQty"]').val(request.DemQty);
    $('[data-name="details-ActDelQty"]').val(request.ActDelQty);
    $('[data-name="details-TotalLoss"]').val(request.TotalLoss);
    $('[data-name="details-MatCost"]').val(request.MatCost);
    $('[data-name="details-TotalLossCost"]').val(request.TotalLossCost);
    $('[data-name="details-DemReason"]').val(request.DemReason);

    var signProcessTable = $('[data-name="details-signprocess"]');

    $('[ data-name="details-signname"]').text(`LƯU TRÌNH KÝ (${request.UnusualMatReqStatus[0].Type})`);

    var checkIsNeedSign = false;
    var tbodySign = signProcessTable.find('tr');
    $(tbodySign[0]).empty();
    $(tbodySign[1]).empty();

    $(tbodySign[0]).append(`<td class="text-center">Người làm đơn</td>`);
    $(tbodySign[1]).append(`<td class="text-center">${request.UnusualMatReqStatus[0].UserCreated.UserCode} </br> ${request.UnusualMatReqStatus[0].UserCreated.UserFullName}</td>`);
    $.each(request.UnusualMatReqStatus[0].UnsualMatReqSigns, function (k, sign) {   
        $(tbodySign[0]).append(`<td class="text-center bg-secondary-light">${sign.Role.RoleName}</td>`);

        if (sign.IdUser != 178) {
            if (sign.IdUser == $('#thisUser').data('id')) {
                if (sign.Status == "Pending") {
                    checkIsNeedSign = true;
                }    
            }
        } else {
            if (sign.IdRole == $('#thisUser').data('role')) { 
                if (sign.Status == "Pending") {
                    checkIsNeedSign = true;
                }
            }
        }

        switch (sign.Status) {
            case "Pending": {
                $(tbodySign[1]).append(`<td class="text-center"></td>`);
                break;
            }
            case "Approve": {
                $(tbodySign[1]).append(`<td class="text-center" style="background-color: #d1e7dd; color: #198754;">${sign.User.UserCode} </br> ${sign.User.UserFullName}</td>`);
                break;
            }
            case "Reject": {
                $(tbodySign[1]).append(`<td class="text-center" style="background-color: #f8d7da; color: #dc3545;">${sign.User.UserCode} </br> ${sign.User.UserFullName}</td>`);
                break;
            }
        }
        
    });
    if (!checkIsNeedSign) {
        $('#RequestDetails .modal-footer').hide();
    } else {
        $('#RequestDetails .modal-footer').show();
    }

    $('#RequestDetails').modal('show');
}

// Sign
async function Approve(elm, e) {
    var IdRequest = $(elm).data('id');
    var IdUser = $('#thisUser').data('id');
    var Index = $(`#table_MatReq-tbody [data-id="${IdRequest}"]`).index();
    var request = await GetRequest(IdRequest);

    
    Swal.fire({
        title: "Do you want Approve this request?",
        html: `<table class="table table-bordered">
                    <tr class="bg-secondary-light">
                        <th>ID</th>
                        <th>申请人 Người làm đơn</th>
                        <th>日期 Ngày</th>
                        <th>機種 Tên hàng</th>
                        <th>單 Công lệnh</th>
                    </tr>
                    <tr>
                        <td>${moment(request.DateReq).format('YYYYMMDDHHmm')}-${request.Id}</td>
                        <td>${request.UnusualMatReqStatus[0].UserCreated.UserCode} - ${request.UnusualMatReqStatus[0].UserCreated.UserFullName}</td>
                        <td>${moment(request.DateReq).format('YYYY-MM-DD HH:mm')}</td>
                        <td>${request.ModelName}</td>
                        <td>${request.MO}</td>
                    </tr>
                </table>`,
        //html: html,
        icon: 'question',
        reverseButtons: false,
        confirmButtonText: 'Approve',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        buttonsStyling: false,
        reverseButtons: true,
        customClass: {
            cancelButton: 'btn btn-outline-secondary fw-bold me-3',
            confirmButton: 'btn btn-success fw-bold'
        },
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "/SMT/UnusualMatReq/Approve",
                data: JSON.stringify({ IdRequest, IdUser }),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (response) {
                    if (response.status) {
                        var row = DrawTableRows(response.request, true);
                        dataTable.rows().updateRow(Index, row);                       

                        Swal.fire("Success!", "Request was Approved.", "success");
                        $('#RequestDetails').modal('hide');
                    }
                    else {
                        Swal.fire("Something went wrong!", response.message, "error");
                    }
                },
                error: function (error) {
                    Swal.fire("Something went wrong!", GetAjaxErrorMessage(error), "error");
                }
            });
        }
    });
}
function Reject(elm, e) {

}



// Modal event 
$('textarea[data-name="Add-ActReqQty"], textarea[data-name="Add-DemQty"], textarea[data-name="Add-ActDelQty"]').change(function (e) {
    e.preventDefault();

    var thisTr = $(this).closest('tr');

    try {
        var a = parseInt(thisTr.find('textarea[data-name="Add-ActReqQty"]').val());
        var b = parseInt(thisTr.find('textarea[data-name="Add-DemQty"]').val());
        var d = parseInt(thisTr.find('textarea[data-name="Add-ActDelQty"]').val());

        if (!isNaN(a) && !isNaN(b) && !isNaN(d)) {
            thisTr.find('textarea[data-name="Add-TotalLoss"]').val(d - b + a);
        }
    }
    catch { }
});
$('textarea[data-name="Add-TotalLoss"], textarea[data-name="Add-MatCost"]').change(function (e) {
    e.preventDefault();

    var thisTr = $(this).closest('tr');

    try {
        var e = parseInt(thisTr.find('textarea[data-name="Add-TotalLoss"]').val());
        var f = parseInt(thisTr.find('textarea[data-name="Add-MatCost"]').val());


        if (!isNaN(e) && !isNaN(f)) {
            thisTr.find('textarea[data-name="Add-TotalLossCost"]').val(e * f);
        }
    }
    catch { }
});
$('#add_sign').click(function () {
    var row = $('<div class="row" sign-row></div>');
    var card = $(`<div class="col-sm-8 py-2">
                     <div class="card border-primary shadow radius-15">
                         <div class="card-body">
                             <div class="row mt-3">
                                 <div class="col-md-4">
                                     <label class="form-label">Bộ phận</label>
                                     <select type="text" class="form-select" sign-dept></select>
                                 </div>
                                 <div class="col-md-7">
                                     <label class="form-label">Người ký</label>
                                     <select type="text" class="form-select" sign-user></select>
                                 </div>
                                 <div class="col-md-1 align-self-end">
                                     <button class="btn btn-outline-danger" sign-del><i class="bi bi-trash"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>`);
    var dot = $(`<div class="col-sm-1 text-center flex-column d-none d-sm-flex">
                     <div class="row h-50">
                         <div class="col border-end">&nbsp;</div>
                         <div class="col">&nbsp;</div>
                     </div>
                     <h5 class="m-2 red-dot">
                         <span class="badge rounded-pill bg-warning">&nbsp;</span>
                     </h5>
                     <div class="row h-50">
                         <div class="col border-end">&nbsp;</div>
                         <div class="col">&nbsp;</div>
                     </div>
                 </div>`);
    var endSpace = $('<div class="col-sm"></div>');

    var btn_del = card.find('[sign-del]');
    btn_del.click(() => {
        btn_del.closest('[sign-row]').remove();
    });

    var selectDept = card.find('[sign-dept]');
    $.each(DataUsers, function (k, item) {
        selectDept.append(`<option value="${item.Id}">${item.Name}</option>`);
    });
    selectDept.change(async () => {
        card.find('[sign-user]').empty();

        var id = parseInt($(selectDept).val());
        var users;

        await $.each(DataUsers, function (k, item) {
             if (item.Id == id) {
                 users = item.Data;
                 return false;
             }         
        });
        card.find('[sign-user]').append(`<option value="178">All</option>`);
        await $.each(users, function (k, item) {           
            card.find('[sign-user]').append(`<option value="${item.UserId}" >${item.UserCode} - ${item.UserFullName}</option>`);
        });

        
    });
    selectDept.change();

    row.append(card);
    row.append(dot);
    row.append(endSpace);

    $('#sign-container').append(row);
});
function DrawCardSign(IdDept) {
    var row = $('<div class="row  justify-content-center" sign-row></div>');
    var card = $(`<div class="col-sm-8 py-2">
                     <div class="card border-primary shadow radius-15">
                         <div class="card-body p-2">
                             <div class="row">
                                 <div class="col-md-4">
                                     <div class="input-group">
                                         <span class="input-group-text">Bộ phận</span>
                                         <select type="text" class="form-select" sign-dept></select>
                                     </div>
                                 </div>
                                 <div class="col-md-7">
                                     <div class="input-group">
                                         <span class="input-group-text">Mã thẻ</span>
                                          <select type="text" class="form-select" sign-user></select>
                                     </div>  
                                 </div>
                                 <div class="col-md-1">
                                     <button class="btn btn-outline-danger" sign-del><i class="bi bi-trash"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>`);
    var dot = $(`<div class="col-sm-1 text-center flex-column d-none d-sm-flex">
                     <div class="row h-50">
                         <div class="col border-end">&nbsp;</div>
                         <div class="col">&nbsp;</div>
                     </div>
                     <h5 class="m-2 red-dot">
                         <span class="badge rounded-pill bg-warning">&nbsp;</span>
                     </h5>
                     <div class="row h-50">
                         <div class="col border-end">&nbsp;</div>
                         <div class="col">&nbsp;</div>
                     </div>
                 </div>`);
    var endSpace = $('<div class="col-sm"></div>');

    var btn_del = card.find('[sign-del]');
    btn_del.click(() => {
        btn_del.closest('[sign-row]').remove();
    });

    var selectDept = card.find('[sign-dept]');


    $.each(DataUsers, function (k, item) {
        selectDept.append(`<option value="${item.Id}">${item.Name}</option>`);
    });
    selectDept.change(async () => {
        card.find('[sign-user]').empty();

        var id = parseInt($(selectDept).val());
        var users;

        await $.each(DataUsers, function (k, item) {
            if (item.Id == id) {
                users = item.Data;
                return false;
            }
        });
        card.find('[sign-user]').append(`<option value="178">All</option>`);
        await $.each(users, function (k, item) {
            card.find('[sign-user]').append(`<option value="${item.UserId}">${item.UserCode} - ${item.UserFullName}</option>`);
        });


    });

    selectDept.val(IdDept).change();

    row.append(card);
    row.append(dot);
    //row.append(endSpace);

    $('#sign-container').append(row);

}
$('#type_select').change(function () {
    if ($(this).is(':checked')) {
        var process = [9, 10, 11, 12, 14, 15];
        $('#sign-container').empty();

        $.each(process, function (k, i) {
            DrawCardSign(i);
        });
    }
    else {
        var process = [9, 10, 11, 13, 14, 15];
        $('#sign-container').empty();

        $.each(process, function (k, i) {
            DrawCardSign(i);
        });
    }
});

// Get All Data
function GetDataMatReqModalTable() {
    var tr = $('#MatReqModalTable tbody').find('tr').first();
    var data = {
        DateReq: $(tr).find('[data-name="Add-DateReq"]').val(),
        ModelName: $(tr).find('[data-name="Add-ModelName"]').val(),
        MO: $(tr).find('[data-name="Add-MO"]').val(),
        MatDesc: $(tr).find('[data-name="Add-MatDesc"]').val(),
        MatCode: $(tr).find('[data-name="Add-MatCode"]').val(),
        Unit: $(tr).find('[data-name="Add-Unit"]').val(),
        ActReqQty: $(tr).find('[data-name="Add-ActReqQty"]').val(),
        ExReqQty: $(tr).find('[data-name="Add-ExReqQty"]').val(),
        DemQty: $(tr).find('[data-name="Add-DemQty"]').val(),
        ActDelQty: $(tr).find('[data-name="Add-ActDelQty"]').val(),
        TotalLoss: $(tr).find('[data-name="Add-TotalLoss"]').val(),
        MatCost: $(tr).find('[data-name="Add-MatCost"]').val(),
        TotalLossCost: $(tr).find('[data-name="Add-TotalLossCost"]').val(),
        DemReason: $(tr).find('[data-name="Add-DemReason"]').val(),
        Location: $('#thisUser').data('location')
    }
    data.UnusualMatReqStatus = [{
        IdUserCreated: $('input[created-card]').data('id'),
        Type: $('#type_select').is(':checked') ? "NPI" : "Normal",
        DateTime: moment().format("YYYY-MM-DD HH:mm:ss")
    }]
    data.UnusualMatReqStatus[0].UnsualMatReqSigns = [];

    $.each($('#sign-container').find('[sign-row]'), function (k, row) {
        var UnsualMatReqSign = {
            IdUser: $(row).find('[sign-user]').val(),
            SignOrder: k + 1,
            IdRole: $(row).find('[sign-dept]').val(),
            Status: "Pending"
        }
        data.UnusualMatReqStatus[0].UnsualMatReqSigns.push(UnsualMatReqSign);
    });

    return data;
}

// Orther
function GetResponseError(htmlString, elementName) {
    var regex = new RegExp(`<${elementName}>(.*?)<\/${elementName}>`);
    var match = regex.exec(htmlString);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Unknown Error.";
    }
}


// Get Users
var Users;
var DataUsers = {
    CreatedUser: {
        Data: []
    },
    LineLeadUser: { Id: 0, Name: "Tổ/Tuyến trưởng", Data: [] },
    SmtMngUser: { Id: 0, Name: "Chủ quản SMT", Data: [] },
    McUser: { Id: 0, Name: "MC", Data: [] },
    MpmUser: { Id: 0, Name: "MPM", Data: [] },
    PcUser: { Id: 0, Name: "PC", Data: [] },
    ViceMngUser: { Id: 0, Name: "Phó giám đốc", Data: [] },
    KittingUser: { Id: 0, Name: "Kitting", Data: [] }
};
function GetUsers() {
    $.ajax({
        type: "GET",
        url: "/SMT/UnusualMatReq/GetUsers",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                Users = res.data;

                $.each(Users, function (i, user) {
                    switch (user.RoleId) {
                        case 8: {
                            if (user.UserId == $('#thisUser').data('id')) {
                                DataUsers.CreatedUser.Data.push(user);
                            }
                            break;
                        }
                        case 9: {
                            DataUsers.LineLeadUser.Id = 9;
                            DataUsers.LineLeadUser.Data.push(user);
                            break;
                        }
                        case 10: {
                            DataUsers.SmtMngUser.Id = 10;
                            DataUsers.SmtMngUser.Data.push(user);
                            break;
                        }
                        case 11: {
                            DataUsers.McUser.Id = 11;
                            DataUsers.McUser.Data.push(user);
                            break;
                        }
                        case 12: {
                            DataUsers.MpmUser.Id = 12;
                            DataUsers.MpmUser.Data.push(user);
                            break;
                        }
                        case 13: {
                            DataUsers.PcUser.Id = 13;
                            DataUsers.PcUser.Data.push(user);
                            break;
                        }
                        case 14: {
                            DataUsers.ViceMngUser.Id = 14;
                            DataUsers.ViceMngUser.Data.push(user);
                            break;
                        }
                        case 15: {
                            DataUsers.KittingUser.Id = 15;
                            DataUsers.KittingUser.Data.push(user);
                            break;
                        }
                    }
                });
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetResonseError(err.responseText, 'title'), "error");
        }
    });
}