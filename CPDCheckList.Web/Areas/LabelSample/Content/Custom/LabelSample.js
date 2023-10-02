$(function () {
    $('#page_name').text('Label 樣品表 Bảng Label mẫu');
    LoadDataCheckList();
});

// Create Table
var dataTable;
var isLoadingData = false;
function LoadDataCheckList() {
    onload();
    var dateNow = new Date();

    var data= {
        Location: $('#Location').val(),
            Year: dateNow.getFullYear(),
                Month: dateNow.getMonth() + 1,
                    Date: dateNow.getDate()
    }

    console.log(data);

    $.ajax({
        type: "GET",
        url: "/LabelSample/LabelSample/GetLabelSamples",
        data: {
            Location: $('[name="Location"]').val(),
            Year: dateNow.getFullYear(),
            Month: dateNow.getMonth() + 1,
            Date: dateNow.getDate()
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                //await $.each(res.data, function (k, item) {
                //    var row = DrawTableRows(item);
                //    $('#tbody_DataFlow').append(row);
                //});
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

        var items = $('#table_LabelSample-tbody tr');

        if (!isLoadingData && (scrollLenght > scrollHeight) && items.length > 10) {
            isLoadingData = true;

            onload();
            var dateNow = new Date();

            var dateData = {
                Location: $('[name="Location"]').val(),
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
                url: "/Lable/DataFlow/GetLabelSamples",
                data: {
                    Location: dateData.Location,
                    Year: dateData.Year,
                    Month: dateData.Month,
                    Date: dateData.Date
                },
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    if (res.status) {

                        await $.each(res.data, async function (k, item) {
                            var row = await DrawTableRows(item, true);
                            dataTable.rows().add(row, true);
                        });

                        if (res.data.length > 0) {
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
    if ($(window).width() < 500) {
        var scrollHeight = document.querySelector('#sidebar').offsetHeight - 450 + 'px';
        var myTable = document.querySelector('#table_LabelSample');
        dataTable = new simpleDatatables.DataTable(myTable, {
            scrollY: scrollHeight,
            paging: false,
            footer: false,
            sortable: false,
            hiddenHeader: true,
        });
        dataTable.columns().hide([4, 5]);
    }
    else {
        var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
        var myTable = document.querySelector('#table_LabelSample');
        dataTable = new simpleDatatables.DataTable(myTable, {
            scrollY: scrollHeight,
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            footer: false,
            sortable: false,
            fixedColumns: false,
        });
    }
};
function DrawTableRows(item, isAddInDatatable = false) {
    var row = [];

    var col_0 = `<td><label>${moment(item.DateTime).format('YYYY-MM-DD HH:mm')}</label></td>`;
    row.push(col_0); //col 1

    var col_1 = `<td class="text-center"><label>${(item.Shift == 'D') ? 'Ngày' : 'Đêm'}</label></td>`;
    row.push(col_1); //col 2

    var col_2 = `<td class="text-center"><label>${item.MO}</label></td>`;
    row.push(col_2); //col 3

    var col_3 = `<td class="text-center"><label>${item.ProductName}</label></td>`;
    row.push(col_3) // col 4

    var col_5 = `<td class="text-center"><label>${item.LableCode}</label></td>`;
    row.push(col_5); // col 6

    var col_8 = `<td class="text-center"><label>${item.LableDataFlow_Status.UserCreate.UserFullName}</label></td>`;
    row.push(col_8); // col 8

    {
        var badgeStyle = "";
        var message = "";
        switch (item.LableDataFlow_Status.Status) {
            case 'Pending': {
                badgeStyle = "bg-warning";
                message = 'Chờ xác nhận'
                break;
            }
            case 'LineLeader Confirm': {
                badgeStyle = "bg-primary";
                message = 'Chuyền trưởng đã xác nhận'
                break;
            }
            case 'LineLeader Reject': {
                badgeStyle = "bg-danger";
                message = 'Chuyền trưởng đã từ chối'
                break;
            }
            case 'IPQC Confirm': {
                badgeStyle = "bg-success";
                message = 'IPQC đã xác nhận'
                break;
            }
            case 'IPQC Reject': {
                badgeStyle = "bg-danger";
                message = 'IPQC đã từ chối'
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle} align-middle">${message}</label></td>`);
    } // col 9

    {
        var cButton = "";
        if ($('#thisUser').data('role') == '1') {
            if (item.LableDataFlow_Status.Status == 'Pending') {
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                              <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
                           </td>`;
            }
            else {
                if ((item.LableDataFlow_Status.Status == "LineLeader Confirm" || item.LableDataFlow_Status.Status == "IPQC Confirm") && (!item.BeginCodeImage || !item.EndCodeImage)) {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                           </td>`;
                } else {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           </td>`;
                }

            }
        }
        else if ($('#thisUser').data('role') == '2') {
            if (item.LableDataFlow_Status.Status == 'Pending') {
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                              <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                           </td>`
            }
            else {
                if ((item.LableDataFlow_Status.Status == "LineLeader Confirm" || item.LableDataFlow_Status.Status == "IPQC Confirm") && (!item.BeginCodeImage || !item.EndCodeImage)) {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                           </td>`;
                } else {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           </td>`;
                }
            }
        }
        else if ($('#thisUser').data('role') == '3') {
            if (item.LableDataFlow_Status.Status == 'LineLeader Confirm') {
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                              <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                           </td>`;
            }
            else {
                if ((item.LableDataFlow_Status.Status == "IPQC Confirm" || item.LableDataFlow_Status.Status == "Pending") && (!item.BeginCodeImage || !item.EndCodeImage)) {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                              <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                           </td>`;
                } else {
                    cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           </td>`;
                }
            }
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

// Orther
function GetResonseError(htmlString, elementName) {
    var regex = new RegExp(`<${elementName}>(.*?)<\/${elementName}>`);
    var match = regex.exec(htmlString);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Unknown Error.";
    }
}