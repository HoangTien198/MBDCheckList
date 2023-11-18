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

    console.log(item);

    // 0 ID 
    row.push(`<td>${moment(item.DaterReq).format('YYYYMMDDHHmm')}-${item.Id}</td>`);
    // 0 DaterReq 
    row.push(`<td>${moment(item.DaterReq).format('YYYY-MM-DD HH:mm') }</td>`);
    // 1 ModelName 
    row.push(`<td class="text-center">${item.ModelName}</td>`);
    // 2 MO 
    row.push(`<td class="text-center">${item.MO}</td>`);
    // 4 MatCode
    row.push(`<td>${item.MatCode}</td>`);
    // 5 Unit
    row.push(`<td>${item.Unit}</td>`);
    // 6 ActReqQty
    row.push(`<td class="text-center">${item.ActReqQty}</td>`);
    // 7 Status
    var status = {
        color: "warning",
        status: "Pending"
    }
    var colorStatus = "warning"
    switch (item.UnusualMatReqStatus.Status) {
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

    $('input[data-name="Add-DateReq"]').val(moment().format('YYYY-MM-DDTHH:mm:ss'));

    $('#MatReqModal').modal('show');
});

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
$('#Addfile-button').click(function () {
    console.log('add file');
});

// Auto Cal
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
            card.find('[sign-user]').append(`<option value="${item.UserId}">${item.UserCode} - ${item.UserFullName}</option>`);
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
    var data = GetDataMatReqModalTable();

    $.ajax({
        type: "POST",
        url: "/SMT/UnusualMatReq/NewRequest",
        data: JSON.stringify(data),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {       
                dataTable.rows().add(DrawTableRows(res.data, true));
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
    data.UnusualMatReqStatus = {
        IdUserCreated: $('input[created-card]').data('id'),
        Type: $('#type_select').is(':checked') ? "NPI" : "Normal",
        DateTime: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    data.UnusualMatReqStatus.UnsualMatReqSigns = [];

    $.each($('#sign-container').find('[sign-row]'), function (k, row) {
        var UnsualMatReqSign = {
            IdUser: $(row).find('[sign-user]').val(),
            SignOrder: k + 1,
            IdRole: $(row).find('[sign-dept]').val()
        }
        data.UnusualMatReqStatus.UnsualMatReqSigns.push(UnsualMatReqSign);
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