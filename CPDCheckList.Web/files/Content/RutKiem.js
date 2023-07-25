$(document).ready(function () {
    LoadDataCheckList();

    UpdateDataList();
});


//load data
var dataTable;
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
        success: function (response) {
            //if (response.status) {
            //    var jsonCheckList = JSON.parse(response);

            //    $.each(jsonCheckList, async function (k, item) {
            //        var row = await DrawTableRows(item);
            //        $('#tbody_checklist').append(row);
            //    });
                CreateWithDrawalTable();
            //    DynamicLoadCheckList();
                endload();
            //}
            //else {              
            //    Swal.fire("Có lỗi xảy ra", response.message, "error");
            //    endload();
            //}
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            endload();
        }
    });
}
var isLoadingData = false;
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

    var col_0 = `<td><label>${new Date(item.CreatedDate)}</label></td>`;
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

    var col_6 = `<td><label>${item.NumWithdrawals}</label></td>`;
    row.push(col_6); // col

    var col_7 = `<td><label>${item.NumWithdrawals}</label></td>`;
    row.push(col_7); // col 6

    {
        var badgeMessage = "";
        var badgeStyle = "";
        switch (item.Status) {
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
function UpdateDataList() {
    $.ajax({
        type: "GET",
        url: "/RutKiem/RutKiem/GetDataList",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);

            if (response.status) {
                response.listUser.forEach(function (item) {
                    if (item.RoleId == 1) {
                        $('#data_CreateUserId').append($(`<option value="${item.Username}">${item.UserFullName}</option>`));
                    }
                    else if (item.RoleId == 2) {
                        $('#data_LineLeaderId').append($(`<option value="${item.Username}">${item.UserFullName}</option>`));
                    }
                });

                response.listData.forEach(function (item) {
                    if (item.Type == "MO") {
                        $('#data_MO').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "StampCode") {
                        $('#data_StampCode').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "Model") {
                        $('#data_Model').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "MaterialCode") {
                        $('#data_MaterialCode').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "CheckSum") {
                        $('#data_CheckSum').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "Color") {
                        $('#data_Color').append($(`<option value="${item.Name}">${item.Name}</option>`));
                    }
                    else if (item.Type == "MachineName") {
                        $('#data_MachineName').append($(`<option value="${item.Name}">${item.Name}</option>`));
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

    $('input[name="CreatedDate"]').val(new Date().toISOString().slice(0, 16));

    $('#WithDrawalModal').modal('show');
});
function SaveWithDrawal() {
    var data = GetData('formData');
    console.log(data);

    $.ajax({
        url: "/RutKiem/RutKiem/AddNewWithDrawal",
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.status) {
                Swal.fire("Thoàn thành", "Thêm mới biểu rút kiểm thành công.", "success");
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
        var elementValue;

        if ($(this).is("td")) {
            elementValue = $(this).text();
        } else {
            elementValue = $(this).val().trim().toUpperCase();
        }
        formData[elementName] = elementValue;
    });
    formData.Location = $('#thisLocation').val();

    return formData;
}

