var ICColors, ICColor, thisTabCustomer, datatable, users;

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
        columnDefs: [
            { targets: "_all", orderable: false },
            { targets: [0], visible: false },
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
        icColor.Improver,
        icColor.Step,
        icColor.Time,
        icColor.ChangeDate,
        icColor.Status.Status,
        icColor.Status.UserCreated.Username,
        ``
    ]
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

/* new record even */
$('#newICColor-btn').click(function () {
    $('#NewRecordModal').modal('show');
});
$('#NewRecordModal').on('shown.bs.modal', function (e) {
    $('#new-ProgramName').focus();
    $('#new-ChangeDate').val(moment().format('YYYY-MM-DDTHH:mm:ss'));
});
$('#NewRecordModal-btnSave').click(async function () {
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
        datatable.rows.add(datarow).draw(false);

        toastr['success']('Save record success.');
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
        users.forEach(function (user) {
            createUserSelect.append(`<option value="${user.Id}">${user.Username} - ${user.VnName}</option>`);
        });
        createUserSelect.select2({
            dropdownParent: $('#NewRecordModal'),
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