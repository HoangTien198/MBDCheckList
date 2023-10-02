$(function () {
    $('#page_name').text('Label 樣品表 Bảng Label mẫu');
    LoadDataCheckList();

    $('#isFoxconnLabel').change();
    $('#isSNLabel').change();
    $('#isMacIDLabel').change();
    $('#isCurrentLabel').change();
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

// New LableSample
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();
    $('#AddModel_LabelSample').modal('show');
});


// Custom Cell
{
    // CustomerNote
    $('input[name="FoxconnLabel"][IsCustumerNote]').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="FoxconnLabel"][CustumerNote]').val('');
            $('input[name="FoxconnLabel"][CustumerNote]').attr('disabled', false);
        }
        else {
            $('input[name="FoxconnLabel"][CustumerNote]').val('');
            $('input[name="FoxconnLabel"][CustumerNote]').attr('disabled', true);
        }
    });
    // DerivedFrom
    $('input[IsDerivedFrom]').change(function () {
        var lableType = $(this).attr('name');

        if ($(this).is(':checked')) {
            $(`input[name="${lableType}"][DerivedFrom]`).val('');
            $(`input[name="${lableType}"][DerivedFrom]`).attr('disabled', false);
        }
        else {
            $(`input[name="${lableType}"][DerivedFrom]`).val('');
            $(`input[name="${lableType}"][DerivedFrom]`).attr('disabled', true);
        }
        
    });
    // MacIDCell
    $('input[MacID][type="radio"]').change(function (e) {
        if ($(this).val() === 'Orther') {
            $('input[MacID][OtherText]').attr('disabled', false);
            $('input[MacID][OtherText]').val('');
        }
        else {
            $('input[MacID][OtherText]').attr('disabled', true);
        }
    });
    // Form check radio
    $('.form-check-label').on('click', function () {
        var formCheck = $(this).parents().first();
        var radio = formCheck.find('input[type="radio"]');
        if (!radio.is(':disabled')) {
            radio.prop('checked', true);
            radio.change();
        }
    });
}


// Checkbox Label
$('#isFoxconnLabel').change(function () {
    var tds = $(`#AddModel_LabelSample_Table-tbody td[FoxconnLabel]`);

    if ($(this).is(":checked")) {
        $(tds).css('background-color', '');

        $(tds).find('input[isBarCode]').attr('disabled', false);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[IsCustumerNote]').attr('disabled', false);
        $(tds).find('input[IsCustumerNote]').prop('checked', false);
        $(tds).find('input[CustumerNote]').attr('disabled', true);
        $(tds).find('input[CustumerNote]').val('');

        $(tds).find('input[MadeIn]').attr('disabled', false);
        $(tds).find('input[MadeIn]').val('');

        $(tds).find('input[LableRev]').attr('disabled', false);
        $(tds).find('input[LableRev]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', false);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', false);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', false);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', false);
        $(tds).find('input[LabelImagePath]').val('');
    }
    else {
        $(tds).css('background-color', '#c7c7c7');

        $(tds).find('input[isBarCode]').attr('disabled', true);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[IsCustumerNote]').attr('disabled', true);
        $(tds).find('input[IsCustumerNote]').prop('checked', false);
        $(tds).find('input[CustumerNote]').attr('disabled', true);
        $(tds).find('input[CustumerNote]').val('');

        $(tds).find('input[MadeIn]').attr('disabled', true);
        $(tds).find('input[MadeIn]').val('');

        $(tds).find('input[LableRev]').attr('disabled', true);
        $(tds).find('input[LableRev]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', true);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', true);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', true);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', true);
        $(tds).find('input[LabelImagePath]').val('');
    }   
});
$('#isSNLabel').change(function () {
    var tds = $(`#AddModel_LabelSample_Table-tbody td[SNLabel]`);

    if ($(this).is(":checked")) {
        $(tds).css('background-color', '');

        $(tds).find('input[isBarCode]').attr('disabled', false);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[TimeChangeMethod]').attr('disabled', false);
        $(tds).find('input[TimeChangeMethod]:first').prop('checked', true);

        $(tds).find('input[FixedCode]').attr('disabled', false);
        $(tds).find('input[FixedCode]').val('');

        $(tds).find('input[RangeCode]').attr('disabled', false);
        $(tds).find('input[RangeCode]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', false);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', false);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', false);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', false);
        $(tds).find('input[LabelImagePath]').val('');
    }
    else {
        $(tds).css('background-color', '#c7c7c7');

        $(tds).find('input[isBarCode]').attr('disabled', true);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[TimeChangeMethod]').attr('disabled', true);
        $(tds).find('input[TimeChangeMethod]:first').prop('checked', true);

        $(tds).find('input[FixedCode]').attr('disabled', true);
        $(tds).find('input[FixedCode]').val('');

        $(tds).find('input[RangeCode]').attr('disabled', true);
        $(tds).find('input[RangeCode]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', true);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', true);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', true);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', true);
        $(tds).find('input[LabelImagePath]').val('');
    }
});
$('#isMacIDLabel').change(function () {
    var tds = $(`#AddModel_LabelSample_Table-tbody td[MacIDLabel]`);

    if ($(this).is(":checked")) {
        $(tds).css('background-color', '');

        $(tds).find('input[isBarCode]').attr('disabled', false);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[MacID]').attr('disabled', false);
        $(tds).find('input[MacID]:first').prop('checked', true);
        $(tds).find('input[MacID][OtherText]').attr('disabled', true);
        $(tds).find('input[MacID][OtherText]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', false);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', false);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', false);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', false);
        $(tds).find('input[LabelImagePath]').val('');
    }
    else {
        $(tds).css('background-color', '#c7c7c7');

        $(tds).find('input[isBarCode]').attr('disabled', true);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[MacID]').attr('disabled', true);
        $(tds).find('input[MacID]:first').prop('checked', true);
        $(tds).find('input[MacID][OtherText]').attr('disabled', true);
        $(tds).find('input[MacID][OtherText]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', true);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', true);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', true);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', true);
        $(tds).find('input[LabelImagePath]').val('');
    }
});
$('#isCurrentLabel').change(function (e) {
    var tds = $(`#AddModel_LabelSample_Table-tbody td[CurrentLabel]`);

    if ($(this).is(":checked")) {
        $(tds).css('background-color', '');

        $(tds).find('input[LabelName]').attr('disabled', false);
        $(tds).find('input[LabelName]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', false);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', false);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', false);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', false);
        $(tds).find('input[LabelImagePath]').val('');
    }
    else {
        $(tds).css('background-color', '#c7c7c7');

        $(tds).find('input[LabelName]').attr('disabled', true);
        $(tds).find('input[LabelName]').val('');

        $(tds).find('input[LabelCode]').attr('disabled', true);
        $(tds).find('input[LabelCode]').val('');

        $(tds).find('input[CoalPaperSpec]').attr('disabled', true);
        $(tds).find('input[CoalPaperSpec]:first').prop('checked', true);

        $(tds).find('input[IsDerivedFrom]').attr('disabled', true);
        $(tds).find('input[IsDerivedFrom]').prop('checked', false);
        $(tds).find('input[DerivedFrom]').attr('disabled', true);
        $(tds).find('input[DerivedFrom]').val('');

        $(tds).find('button[Btn-Image]').attr('disabled', true);
        $(tds).find('input[LabelImagePath]').val('');
    }
});
//});
//});
//$('#isMacIDLabel').change(function () {
//    if ($('#isMacIDLabel').is(":checked")) {
//        DisableLabelType('MacIDLabel', false);
//    }
//    else {
//        DisableLabelType('MacIDLabel', true);
//    }

//});
//$('#isCurrentLabel').change(function (e) {
//    if ($('#isCurrentLabel').is(":checked")) {
//        DisableLabelType('CurrentLabel', false);
//    }
//    else {
//        DisableLabelType('CurrentLabel', true);
//    }

//});
//function DisableLabelType(type, isDisable) {
    

//    $.each(tds, function (k, td) {
//        if (isDisable) {
//            $(td).css('background-color', '#c7c7c7');
//            $(td).find('input').attr('disabled', true);
//            $(td).find('input').val('');
//            $(td).find('button').attr('disabled', true);

//            if ($(td).is('[manual]')) {
//                $(td).find('input[type="checkbox"]').prop('checked', false);
//            }
//        }
//        else {
//            $(td).css('background-color', '');
//            $(td).find('input').attr('disabled', false)
//            $(td).find('button').attr('disabled', false);

//            if ($(td).is('[manual]')) {             
//                $(td).find('input[type="text"]').val('');
//                $(td).find('input[type="text"]').attr('disabled', true);
//            }
//        }
        
//    });
//}

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