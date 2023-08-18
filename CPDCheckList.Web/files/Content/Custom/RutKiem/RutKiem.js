$(document).ready(function () {
    $('#page_name').text('RÚT KIỂM F17');

    LoadDataCheckList();
    UpdateDataList();
});


//load data
var dataTable;
var isLoadingData = false;
function LoadDataCheckList() {
    onload();
    var dateNow = new Date();
    $.ajax({
        type: "GET",
        url: "/RutKiem/RutKiem/GetWithDrawalList",
        data: {
            Location: $('#thisLocation').val(),
            Year: dateNow.getFullYear(),
            Month: dateNow.getMonth() + 1,
            Date: dateNow.getDate()
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (response) {
            if (response.status) {
                await $.each(response.data, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#tbody_WithDrawal').append(row);
                });
                CreateWithDrawalTable();
                DynamicLoadCheckList();
                endload();
            }
            else {
                Swal.fire("Có lỗi xảy ra", response.message, "error");
                endload();
            }
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            endload();
        }
    });
}
function DynamicLoadCheckList() {
    const divElement = document.querySelector('.dataTable-container');
    divElement.addEventListener('scroll', function () {
        var scrollLenght = parseInt((divElement.scrollTop + divElement.clientHeight));
        var scrollHeight = parseInt(divElement.scrollHeight * 0.9);

        if (!isLoadingData && (scrollLenght > scrollHeight)) {
            isLoadingData = true;

            onload();

            var dateData = {
                Location: $('#thisLocation').val(),
                Year: dateNow.getFullYear(),
                Month: dateNow.getMonth() + 1,
                Date: dateNow.getDate()
            }
            if (dateData.Month == 0) {
                dateData.Year -= 1;
                dateData.Month = 12;
            }

            $.ajax({
                type: "GET",
                url: "/RutKiem/RutKiem/GetWithDrawalList",
                data: {
                    Location: dateData.Location,
                    Year: dateData.Year,
                    Month: dateData.Month,
                    Date: dateData.Date
                },
                contentType: "application/json;charset=utf-8",
                success: async function (response) {
                    if (response.status) {
                        var jsonCheckList = JSON.parse(response);

                        await $.each(jsonCheckList, async function (k, item) {
                            var row = await DrawTableRows(item, true);
                            dataTable.rows().add(row, true);
                        });

                        if (jsonCheckList.length > 0) {
                            isLoadingData = false;
                        }
                        endload();
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra", response.message, "error");
                        endload();
                    }
                },
                error: function (err) {
                    Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                    endload();
                }
            });
        }
    });
}

function CreateWithDrawalTable() {
    var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
    var myTable = document.querySelector('#table_WithDrawal');
    dataTable = new simpleDatatables.DataTable(myTable, {
        scrollY: scrollHeight,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        sortable: false,
        fixedColumns: false,
    });
};

function DrawTableRows(item, isAddInDatatable = false) {
    var row = [];

    var col_0 = `<td><label>${moment(item.CreatedDate).format('YYYY-MM-DD HH:mm')}</label></td>`;
    row.push(col_0); //col 0

    var col_1 = `<td><label>${item.MO}</label></td>`;
    row.push(col_1); //col 1

    var col_2 = `<td><label>${item.StampCode}</label></td>`;
    row.push(col_2) // col 2

    var col_3 = `<td><label>${item.Model}</label></td>`;
    row.push(col_3) // col 3

    var col_4 = `<td><label>${item.MaterialCode}</label></td>`;
    row.push(col_4) // col 4

    var col_5 = `<td><label>${item.CheckSum}</label></td>`;
    row.push(col_5); // col 5

    var col_6 = `<td><label>${item.NumWithDrawals}</label></td>`;
    row.push(col_6); // col 6


    var col_8 = `<td><label>${item.CreatedUser.UserFullName}</label></td>`;
    row.push(col_8); // col 8

    {
        var badgeStyle = "";
        switch (item.Status) {
            case 'Pending': {
                badgeStyle = "bg-primary";
                break;
            }
            case 'Approved': {
                badgeStyle = "bg-success";
                break;
            }
            case 'Reject': {
                badgeStyle = "bg-danger";
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle}">${item.Status}</label></td>`);
    } // col 9

    {
        var cButton = "";
        if ($('#thisUser').data('role') == '2' && item.LineLeaderId == $('#thisUser').data('id')) {
            if (item.Status == 'Pending') {
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="ApprovedRutKiem(this, event)"><i class="bi bi bi-check"></i></button>
                              <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="RejectRutKiem(this, event)"><i class="bi bi bi-x"></i></button>
                           </td>`;
            }
            else {
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="EditRutKiem(this, event)"><i class="bi bi-pen"></i></button>
                              <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="DeleteRutKiem(this, event)"><i class="bi bi-trash"></i></button>
                           </td>`;
            }
        }
        else if (item.Status == 'Pending' && item.CreatedUserId == $('#thisUser').data('id')) {
            cButton = `<td class="action_col">
                          <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
                          <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="EditRutKiem(this, event)"><i class="bi bi-pen"></i></button>
                          <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="DeleteRutKiem(this, event)"><i class="bi bi-trash"></i></button>
                       </td>`;
        }
        else {
            cButton = `<td class="action_col">
                          <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
                       </td>`;
        }
        row.push(cButton);
    } // col 10

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}

function UpdateDataList() {
    $.ajax({
        type: "GET",
        url: "/RutKiem/RutKiem/GetDataList",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.status) {
                response.listUser.forEach(function (item) {
                    $('#data_LineLeaderId').append($(`<option value="${item.UserCode}" data-id="${item.UserId}">${item.UserFullName}</option>`));
                });

                const typeToIdMap = {
                    "MO": "#data_MO",
                    "StampCode": "#data_StampCode",
                    "Model": "#data_Model",
                    "MaterialCode": "#data_MaterialCode",
                    "CheckSum": "#data_CheckSum",
                    "Color": "#data_Color",
                    "MachineName": "#data_MachineName"
                };

                response.listData.forEach(function (item) {
                    const id = typeToIdMap[item.Type];
                    if (id) {
                        $(id).append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                });
            }
            else {
                Swal.fire("Có lỗi xảy ra", response.message, "error");
            }
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
        }
    });
}

// Add function
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();
    SetWithDrawalDataToModal('formData', null, 'add');

    $('input[name="Id"]').val('');
    $('input[name="Status"]').val('Pending');
    $('#WdIndex').val('');
    $('input[name="CreatedDate"]').val(moment(new Date()).format('YYYY-MM-DDTHH:mm'));

    var title = $('#WithDrawalModal .modal-title');
    title.text('THÊM MỚI BIỂU RÚT KIỂM');
    title.removeClass();
    title.addClass(['modal-title', 'text-primary']);

    $('#WithDrawalModal .modal-footer').show();
    $('#WithDrawalModal').modal('show');
});
function SaveWithDrawal() {
    var data = GetData('formData');

    $.ajax({
        url: "/RutKiem/RutKiem/AddNewWithDrawal",
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.status) {

                if ($('#WdIndex').val() == '') {
                    dataTable.rows().add(DrawTableRows(response.data, true));
                }
                else {
                    dataTable.rows().updateRow($('#WdIndex').val(), DrawTableRows(response.data, true));
                }

                UpdateDataList();
                Swal.fire("Thoàn thành", "", "success");
            }
            else {
                Swal.fire("Có lỗi xảy ra", response.message, "error");
            }
            $('#WithDrawalModal').modal('hide');
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            $('#WithDrawalModal').modal('hide');
        }
    });
}
function GetData(idForm) {
    var formData = {};

    $(`#${idForm} [name]`).each(function () {

        var elementName = $(this).attr("name");
        var elementValue = $(this).val().trim();

        if (elementName == 'LineLeaderId') {
            elementValue = $("#data_LineLeaderId option").filter(function () {
                return $(this).val() === elementValue;
            }).data("id");
        }
        else if (elementName == 'CreatedUserId') {
            elementValue = $(this).data('id');
        }
        formData[elementName] = elementValue;
    });
    formData.Location = $('#thisLocation').val();

    if (formData.Status == '') {
        formData.Status = 'Pending';
    }

    return formData;
}

// Details function
function DetailsRutKiem(elm, e) {
    e.preventDefault();

    var Id = $(elm).data('id');

    $.ajax({
        type: "GET",
        url: "/RutKiem/RutKiem/GetAWithDrawal",
        data: { Id: Id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (response) {
            if (response.status) {
                SetWithDrawalDataToModal('formData', response.data, 'Details');

                var title = $('#WithDrawalModal .modal-title');
                title.text(`BIỂU RÚT KIỂM - ${response.data.Status}`);
                title.removeClass();
                title.addClass(['modal-title', 'text-info']);

                $('#WithDrawalModal .modal-footer').hide();
                $('#WithDrawalModal').modal('show');
            }
            else {
                Swal.fire("Có lỗi xảy ra", response.message, "error");
                endload();
            }
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            endload();
        }
    });
}
function SetWithDrawalDataToModal(idForm, data, type) {

    if (type == 'add') {
        $(`#${idForm} [name]`).each(function () {
            var elementName = $(this).attr("name");

            if (elementName != 'CreatedUserId') {
                $(this).val('');
                $(this).attr('disabled', false);
            }
        });
        return;
    }

    $(`#${idForm} [name]`).each(function () {
        var elementName = $(this).attr("name");

        if (elementName == 'LineLeaderId') {
            $(this).val(data.LineLeaderUser.UserCode)
        }
        else if (elementName == 'CreatedUserId') {
            $(this).val(data.CreatedUser.UserCode)
        }
        else if (elementName == 'CreatedDate') {
            $(this).val(moment(data.CreatedDate).format('YYYY-MM-DDTHH:mm'))
        }
        else {
            $(this).val(data[elementName]);
        }

        if (type == 'Details') {
            $(this).attr('disabled', true);
        }
        else {
            if (elementName != 'CreatedUserId') $(this).attr('disabled', false);
        }
    });
}

// Edit function
function EditRutKiem(elm, e) {
    e.preventDefault();

    var Id = $(elm).data('id');
    $('#WdIndex').val($(elm).closest('tr').index());

    $.ajax({
        type: "GET",
        url: "/RutKiem/RutKiem/GetAWithDrawal",
        data: { Id: Id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (response) {
            if (response.status) {
                SetWithDrawalDataToModal('formData', response.data);

                var title = $('#WithDrawalModal .modal-title');
                title.text(`SỬA BIỂU RÚT KIỂM - ${response.data.Status}`);
                title.removeClass();
                title.addClass(['modal-title', 'text-warning']);

                $('#WithDrawalModal .modal-footer').show();
                $('#WithDrawalModal').modal('show');
            }
            else {
                Swal.fire("Có lỗi xảy ra", response.message, "error");
                endload();
            }
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            endload();
        }
    });
}

// Delete function
function DeleteRutKiem(elm, e) {
    e.preventDefault();

    var Id = parseInt($(elm).data('id'));
    var rowIndex = $(elm).closest('tr').index();

    Swal.fire({
        title: "Success",
        text: "Bạn có chắc chắn muốn xóa?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa!",
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/RutKiem/RutKiem/DeleteWithDrawal",
                data: { Id: Id },
                success: function (response) {
                    if (response.status) {
                        Swal.fire("Xóa thành công", "Đã xóa!", "success");
                        dataTable.rows().remove(rowIndex);
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", ex.message, "error");
                    }
                },
                error: function (res) {
                    Swal.fire("Server Error!", "Có lỗi xảy ra. Hãy thử bấm 'Ctrl + F5' để tải lại trang hoặc liên hệ bộ phận CPD-AIOT để được hỗ trợ! SDT: 31746", "error");
                }
            });
        }
    });
}

// Approved function
function ApprovedRutKiem(elm, e) {
    e.preventDefault();

    var Id = parseInt($(elm).data('id'));
    var rowIndex = $(elm).closest('tr').index();

    Swal.fire({
        title: "Success",
        text: "Bạn có chắc chắn muốn chấp nhận?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý!",
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/RutKiem/RutKiem/ApprovedWithDrawal",
                data: JSON.stringify({ Id: Id }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.status) {

                        dataTable.rows().updateRow(rowIndex, DrawTableRows(response.data, true));
                        Swal.fire("Chấp nhận thành công", "", "success");
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", response.message, "error");
                    }
                },
                error: function (res) {
                    Swal.fire("Server Error!", "Có lỗi xảy ra. Hãy thử bấm 'Ctrl + F5' để tải lại trang hoặc liên hệ bộ phận CPD-AIOT để được hỗ trợ! SDT: 31746", "error");
                }
            });
        }
    });
}

// Reject function
function RejectRutKiem(elm, e) {
    e.preventDefault();

    var Id = parseInt($(elm).data('id'));
    var rowIndex = $(elm).closest('tr').index();

    Swal.fire({
        title: "Success",
        text: "Bạn có chắc chắn muốn từ chối?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý!",
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/RutKiem/RutKiem/RejectWithDrawal",
                data: JSON.stringify({ Id: Id }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.status) {
                        dataTable.rows().updateRow(rowIndex, DrawTableRows(response.data, true));
                        Swal.fire("Từ chối thành công", "", "success");
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", response.message, "error");
                    }
                },
                error: function (err) {

                    Swal.fire("Server Error!", "Có lỗi xảy ra. Hãy thử bấm 'Ctrl + F5' để tải lại trang hoặc liên hệ bộ phận CPD-AIOT để được hỗ trợ! SDT: 31746", "error");
                }
            });
        }
    });
}
