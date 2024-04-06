﻿var ICColors, ICColor, thisTabCustomer, datatable, users;

$(document).ready(async () => {
    try {
        ToastrConfig();
        CreateDatatable();
        CreateUsers();

        ICColors = await GetICColors();      
        CreateTab();

    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra", e, "error");
    }
});



/* datatable */
function CreateDatatable() {
    var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';

    let options = {
        scrollY: scrollHeight,
        scrollX: true,
        order: [0, 'desc'],
        autoWidth: false,
        deferRender: true,
        paging: false,
        ordering: true,
        fixedColumns: {
            start: 0,
            end: 2
        },
        columnDefs: [
            { targets: "_all", orderable: false, className: 'text-nowrap align-content-center text-center px-3' },
            { targets: [0, 1], visible: false },
            { targets: [2], className: 'text-start' },
            { targets: [11], width: 200 },
            
        ],
        createdRow: function (row, data, dataIndex) {
            $(row).data('id', data[0]);
        },
    }

    datatable = $('#datatable').DataTable(options);
}
function CreateDatatableData() {
    datatable.clear().draw();

   
    if (ICColors[thisTabCustomer] && ICColors[thisTabCustomer].length > 0) {
        let dataRows = []
        ICColors[thisTabCustomer].forEach(function (icColor) {
            let datarow = CreateDatatableRow(icColor);
            dataRows.push(datarow);
        });
        datatable.rows.add(dataRows).draw(true);
    }
   
}
function CreateDatatableRow(icColor) {
    return [
        icColor.Id,
        icColor.Customer,
        icColor.ProgramName,
        icColor.MachineType,
        icColor.ICCode,
        icColor.ICParameter,
        icColor.Checksum,
        icColor.SocketBoard,
        `${icColor.ICColorStatuss[0].UserCreated.Username} - ${icColor.ICColorStatuss[0].UserCreated.UserFullName}`,
        icColor.Step,
        icColor.Time,
        moment(icColor.ChangeDate).format('YYYY-MM-DD HH:mm'),
        CreateDatatableCellStatus(icColor),
        CreateDatatableCellAction(icColor)
    ]
}
function CreateDatatableCellStatus(icColor) {
    switch (icColor.ICColorStatuss[0].Status) {
        case 'Confirmed':
            return '<span class="badge rounded-pill bg-success">Đã xác nhận</span>'
    }
}
function CreateDatatableCellAction(icColor) {
    return `
            <button title="Sửa"      data-id=${icColor.Id} class="btn btn-warning" onclick="ICColorEdit(this, event)"><i class="bi bi-pen"></i></button>
            <button title="Xóa"      data-id=${icColor.Id} class="btn btn-danger"  onclick="ICColorDelete(this, event)"><i class="bi bi-trash"></i></button>`;

    //switch ($('#thisUser').data('id')) {
    //    case 119:
    //    case 179:
    //        return `<button title="Chi tiết" data-id=${icColor.Id} class="btn btn-info"    onclick="ICColorDetails(this, event)"><i class="bi bi-info"></i></button>
    //                <button title="Sửa"      data-id=${icColor.Id} class="btn btn-warning" onclick="ICColorEdit(this, event)"><i class="bi bi-pen"></i></button>
    //                <button title="Xóa"      data-id=${icColor.Id} class="btn btn-danger"  onclick="ICColorDelete(this, event)"><i class="bi bi-trash"></i></button>`;
    //    default:
    //        return `<button title="Chi tiết" data-id=${icColor.Id} class="btn btn-info"    onclick="ICColorDetails(this, event)"><i class="bi bi-info"></i></button>`;
    //}
}

/* tab event */
function CreateTab() {
    let tabCustomer = $('#tab-customer');

    // set tab
    {
        for (const customer in ICColors) {
            let liEml = $(`<li class="nav-item" role="${customer}"><button class="nav-link" data-bs-toggle="tab">${customer}</button></li>`);
            tabCustomer.append(liEml);

            liEml.click(function () {
                thisTabCustomer = $(this).attr('role');
                CreateDatatableData();
            });
        }
    }
    // add tab
    {
        let addElement = $(`<li class="nav-item" role="add"><button class="nav-link" data-bs-toggle="tab"><i class="fa-solid fa-plus"></i></button></li>`);
        tabCustomer.append(addElement);
        addElement.click(function () {
            let customer = prompt("Please enter customer name:", "");
            if (customer != null || customer != "") {
                let liEml = $(`<li class="nav-item" role="${customer}"><button class="nav-link active" data-bs-toggle="tab">${customer}</button></li>`);
                addElement.before(liEml);
                thisTabCustomer = customer;
                CreateDatatableData();

                liEml.click(function () {
                    thisTabCustomer = $(this).attr('role');
                    CreateDatatableData();
                });
            }
        });
    }

    // set first tab data
    {
        let firstTab = tabCustomer.find('.nav-item').first();
        firstTab.find('button').addClass('active');
        thisTabCustomer = firstTab.attr('role');

        CreateDatatableData();
    }
}

/* new record event */
$('#newICColor-btn').click(function () {
    $('#NewRecordModal').modal('show');
});
$('#NewRecordModal').on('shown.bs.modal', function (e) {
    $('#new-ProgramName').focus();
    $('#new-ChangeDate').val(moment().format('YYYY-MM-DDTHH:mm:ss'));
});
$('#NewRecordModal-btnSave').click(async function () {
    try {
        var record = {
            Customer: $('#tab-customer').find('.nav-link.active').text(),
            ProgramName: $('#new-ProgramName').val(),
            MachineType: $('#new-MachineType').val(),
            ICCode: $('#new-ICCode').val(),
            ICParameter: $('#new-ICParameter').val(),
            Checksum: $('#new-Checksum').val(),
            SocketBoard: $('#new-SocketBoard').val(),
            Improver: $('#new-Improver').val(),
            Step: $('#new-Step').val(),
            Time: $('#new-Time').val(),
            ChangeDate: $('#new-ChangeDate').val(),
        }

        var result = await CreateICColor(record);

        if (result) {
            var datarow = CreateDatatableRow(result);
            datatable.row.add(datarow).draw(false);

            toastr['success']('Save record success.');
        }
    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra!", e, "error");
    }
    
});

/* delete */
async function ICColorDelete(elm, e) {
    try {
        let IdICColor = $(elm).data('id');

        ICColor = await GetICColor(IdICColor);

        var tableHTML = "";
        tableHTML += `
                              <h4>Bạn có chắc chắn muốn xóa?</h4>
                              <table style='width:100%;border-collapse:collapse;margin-top:20px;'>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>燒碼程式名稱 <br /> Tên chương trình sao chép</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${ICColor.ProgramName}</td>
                                </tr>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>燒碼機型號 <br /> Loạimáy sao chép IC</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${ICColor.MachineType}</td>
                                </tr>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>程式修改者<br />Người cải thiện</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${ICColor.Improver}</td>
                                </tr>
                                <tr>                                                                        
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>MO</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${moment(ICColor.ChangeDate).format('YYYY-MM-DD HH:mm')}</td>
                                </tr>
                                `;

        Swal.fire({
            title: "Success",
            html: tableHTML,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa!",
            cancelButtonText: "Hủy bỏ!",
            reverseButtons: true
        }).then(async function (result) {
            if (result.value) {
                let result = await DeleteICColor(IdICColor);

                if (result) {
                    const thisIndex = datatable.row($(elm).closest('tr')).index();
                    datatable.row(thisIndex).remove().draw(false);

                    toastr['success']('Save record success.');
                }
                else {
                    Swal.fire("Có lỗi xảy ra", 'Bạn không có quyền xoá record này.', "error");
                }
            }
        });

    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra!", e, "error");
    }
}

/* update */
async function ICColorEdit(elm, e) {
    try {
        ICColor = await GetICColor($(elm).data('id'));

        $('#update-ProgramName').val(ICColor.ProgramName);
        $('#update-MachineType').val(ICColor.MachineType);
        $('#update-ICCode').val(ICColor.ICCode);
        $('#update-ICParameter').val(ICColor.ICParameter);
        $('#update-Checksum').val(ICColor.Checksum);
        $('#update-SocketBoard').val(ICColor.SocketBoard);
        $('#update-Improver').val(ICColor.Improver).trigger('change');
        $('#update-Step').val(ICColor.Step);
        $('#update-Time').val(ICColor.Time);
        $('#update-ChangeDate').val(moment(ICColor.ChangeDate).format('YYYY-MM-DDTHH:MM:ss'));

        $('#UpdateRecordModal').modal('show');
    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra!", e, "error");
    }
}
$('#UpdateRecordModal-btnSave').click(async function () {
    try {
        var record = {
            Id: ICColor.Id,
            Customer: ICColor.Customer,
            ProgramName: $('#update-ProgramName').val(),
            MachineType: $('#update-MachineType').val(),
            ICCode: $('#update-ICCode').val(),
            ICParameter: $('#update-ICParameter').val(),
            Checksum: $('#update-Checksum').val(),
            SocketBoard: $('#update-SocketBoard').val(),
            Improver: $('#update-Improver').val(),
            Step: $('#update-Step').val(),
            Time: $('#update-Time').val(),
            ChangeDate: $('#update-ChangeDate').val(),
        }

        var result = await UpdateICColor(record);

        if (result) {
            var datarow = CreateDatatableRow(result);

            const thisIndex = datatable.row($(`[data-id="${ICColor.Id}"]`).closest('tr')).index();
            datatable.row(thisIndex).data(datarow).draw(false);

            toastr['success']('Update record success.');
        }
    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra!", e, "error");
    }
})

/* PROMISE */
function GetICColors() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/ICColor/ICColorManager/GetICColors",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}
function GetUsers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/ICColor/ICColorManager/GetUsers",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}
function GetICColor(Id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `/ICColor/ICColorManager/GetICColor?Id=${Id}`,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}
function CreateICColor(icColor) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: `/ICColor/ICColorManager/CreateICColor`,            
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ icColor }),
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}
function UpdateICColor(icColor) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: `/ICColor/ICColorManager/UpdateICColor`,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ icColor }),
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}
function DeleteICColor(Id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: `/ICColor/ICColorManager/DeleteICColor`,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ Id }),
            success: function (res) {
                if (res.status) {
                    resolve(res.data)
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(GetAjaxErrorMessage(error));
            }
        });
    });
}

/* TOASTR */
function ToastrConfig() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}
/* USERS */
async function CreateUsers() {
    try {
        users = await GetUsers();

        let createUserSelect = $('#new-Improver');
        let updateUserSelect = $('#update-Improver');
        users.forEach(function (user) {
            createUserSelect.append(`<option value="${user.Id}">${user.Username} - ${user.VnName}</option>`);
            updateUserSelect.append(`<option value="${user.Id}">${user.Username} - ${user.VnName}</option>`);
        });
        createUserSelect.select2({
            dropdownParent: $('#NewRecordModal'),
            width: '100%',
            height: '38px'
        });
        updateUserSelect.select2({
            dropdownParent: $('#UpdateRecordModal'),
            width: '100%',
            height: '38px'
        })

    } catch (e) {
        Swal.fire("Có lỗi xảy ra", e, "error");
    }
}

/* OTHER */
function GetAjaxErrorMessage(error) {
    var regex = new RegExp(`<title>(.*?)<\/title>`);
    var match = regex.exec(error.responseText);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Lỗi không xác định.";
    }
}