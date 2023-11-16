$(function () {
    $('#page_name').text('物料異常需求申請單 Đơn xin nhu cầu vật liệu bất thường V9');

    LoadData();
    GetUsers();

    const myInterval = setInterval(() => {
        if ($('#btn_AddNew').is(':visible')) {
            clearInterval(myInterval);
        } else {
            $('#btn_AddNew').fadeIn(300);
        }
    }, 300);

    $('#row-root tr').first().find('td').first().find('input');
});

// Create Table
var dataTable;
var isLoadingData = false;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

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
                const MatReqs = JSON.parse(res.data);

                await $.each(MatReqs, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#table_MatReq-tbody').append(row);
                });

                CreateTable();
                AddEventLoadTable();
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
    const divElement = document.querySelector('.dataTable-container');
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

    // 0 DaterReq 
    row.push(`<td>${moment(item.DaterReq).format('YYYY-MM-DD HH:mm') }</td>`);
    // 1 ModelName 
    row.push(`<td class="text-center">${item.ModelName}</td>`);
    // 2 MO 
    row.push(`<td class="text-center">${item.MO}</td>`);
    // 3 MatDesc 
    row.push(`<td>${item.MatDesc}</td>`);
    // 4 MatCode
    row.push(`<td>${item.MatCode}</td>`);
    // 5 Unit
    row.push(`<td>${item.Unit}</td>`);
    // 6 ActReqQty
    row.push(`<td>${item.ActReqQty}</td>`);
    // 7 Status
    row.push(`<td>Status</td>`);
    // 8 Action
    {
        var Button = `<td class="action_col">
                       <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                  </td>`;
        row.push(Button);
    }

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}

// Add new
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();
    $('input[data-name="Type"]').change();
    $('#type_select').change(); 
    $('#MatReqModal').modal('show');
});

// Get Users
var Users;
var DataUsers = {
    LineLeadUser: {
        Id: 0,
        Name: "Tổ/Tuyến trưởng",
        Data: []
    },
    SmtMngUser: {
        Id: 0,
        Name: "Chủ quản SMT",
        Data: []
    },
    McUser: {
        Id: 0,
        Name: "MC",
        Data: []
    },
    MpmUser: {
        Id: 0,
        Name: "MPM",
        Data: []
    },
    PcUser: {
        Id: 0,
        Name: "PC",
        Data: []
},
    ViceMngUser: {
        Id: 0,
        Name: "Phó giám đốc",
        Data: []
    },
    KittingUser: {
        Id: 0,
        Name: "Kitting",
        Data: []
    },
}
function GetUsers() {
    $.ajax({
        type: "GET",
        url: "/SMT/UnusualMatReq/GetUsers",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                Users = JSON.parse(res.data);

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

// Add new row
$('#NewItem-row').click(function () {
    var deleteButton = $('<button class="btn btn-outline-danger p-0" style="font-size=12px"><i class="bi bi-trash"></i></button>');
    var data = $(`<tr class="text-middle">
                    <!-- 1  -->
                    <td><input class="form-control form-control-sm" type="datetime-local" data-name="Add-DateReq" value="${moment().format('YYYY-MM-DDTHH:mm:ss')}" style="width: 175px;"></td>
                    <!-- 2  -->                                                            
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-ModelName"></textarea></td>
                    <!-- 3  -->                                                            
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-MO"></textarea></td>
                    <!-- 4  -->                                                            
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-MatDesc"></textarea></td>
                    <!-- 5  -->                                                            
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-MatCode"></textarea></td>
                    <!-- 6  -->                                                            
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-Unit"></textarea></td>
                    <!-- 7  -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-ActReqQty"></textarea></td>
                    <!-- 8  -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-ExReqQty"></textarea></td>
                    <!-- 9  -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-DemQty"></textarea></td>
                    <!-- 10 -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-ActDelQty"></textarea></td>
                    <!-- 11 -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-TotalLoss"></textarea></td>
                    <!-- 12 -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-MatCost"></textarea></td>
                    <!-- 13 -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-TotalLossCost"></textarea></td>
                    <!-- 14 -->                                                               
                    <td><textarea class="form-control form-control-sm" rows="3" data-name="Add-DemReason"></textarea></td>
                    <!-- 15 -->                                                            
                    <td></td>
                </tr>`);

    data.find('td').last().append(deleteButton);
    deleteButton.click(() => {
        deleteButton.closest('tr').remove();
    });

    // Auto cal
    data.find('textarea[data-name="Add-ActReqQty"], textarea[data-name="Add-DemQty"], textarea[data-name="Add-ActDelQty"]').change(function (e) {
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
    data.find('textarea[data-name="Add-TotalLoss"], textarea[data-name="Add-MatCost"]').change(function (e) {
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


    if ($('#MatReqModalTable-tbody tr').length < 6) {
        $(this).closest('tr').before(data);
    }
    else{
        Swal.fire("Có lỗi xảy ra", "Max item.", "error");
    }
    
});

// Sign
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
                                     <label class="form-label">Người ký (nếu chỉ định)</label>
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
        await $.each(users, function (k, item) {           
            card.find('[sign-user]').append(`<option value="${item.UserCode}">${item.UserCode} - ${item.UserFullName}</option>`);
        });

        
    });
    selectDept.change();

    row.append(card);
    row.append(dot);
    row.append(endSpace);

    $('#sign-container').append(row);
});

// Type Normal/NPI
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
function DrawCardSign(IdDept) {
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
                                     <label class="form-label">Người ký (nếu chỉ định)</label>
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
        card.find('[sign-user]').append(`<option value="none">None</option>`);
        await $.each(users, function (k, item) {
            card.find('[sign-user]').append(`<option value="${item.UserCode}">${item.UserCode} - ${item.UserFullName}</option>`);
        });


    });

    selectDept.val(IdDept).change();

    row.append(card);
    row.append(dot);
    row.append(endSpace);

    $('#sign-container').append(row);

}

// Get All Data
$('#MatReqModal-btnSave').click(function () {
    GetDataMatReqModalTable();
});
function GetDataMatReqModalTable() {
    var table = $('#MatReqModalTable tbody');
    var trs = table.find('tr');

    var datas = [];

    if (trs.length > 0) {
        $.each(trs, function (k, tr) {
            if ($(tr).is('#NewItem-row')) return;

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
            }
            datas.push(data);
            
        });
    }
    console.log(datas);
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