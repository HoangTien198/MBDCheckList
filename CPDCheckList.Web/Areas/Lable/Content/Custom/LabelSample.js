$(function () {
    $('#page_name').text('Label 樣品表 Bảng Label mẫu');
    LoadDataCheckList();

    $('#isFoxconnLabel').change();
    $('#isSNLabel').change();
    $('#isMacIDLabel').change();
    $('#isCurrentLabel').change();

    $('[data-name="CreatedDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));
    $('[data-name="ValidDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));

    AddImageEvent();
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
        url: "/Lable/Sample/GetLabelSamples",
        data: data,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                const lables = JSON.parse(res.data);
                console.log(lables);

                await $.each(lables, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#table_LabelSample-tbody').append(row);
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

        var items = $('#table_LabelSample-tbody tr');

        if (!isLoadingData && (scrollLenght > scrollHeight) && items.length > 10) {
            isLoadingData = true;

            onload();
            var dateNow = new Date();

            var dateData = {
                Location: $('#Location"').val(),
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
                url: "/Lable/Sample/GetLabelSamples",
                data: dateData,
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
};
function DrawTableRows(item, isAddInDatatable = false) {
    var row = [];

    // 0 ProductName
    row.push(`<td>${item.ProductName}</td>`);
    // 1 CreatedDate
    row.push(`<td class="text-center"><label>${moment(item.CreatedDate).format('YYYY-MM-DD HH:mm')}</label></td>`);
    // 2 ValidDate
    row.push(`<td class="text-center"><label>${moment(item.ValidDate).format('YYYY-MM-DD HH:mm') }</label></td>`);
    // 3 MO
    row.push(`<td class="text-center"><label>${item.MO ? item.MO : ''}</label></td>`); // col 6
    // 4 Status
    {
        var badgeStyle = "";
        var message = "";
        switch (item.LabelSampleStatus.Status) {
            case 'Pending': {
                badgeStyle = "bg-warning";
                message = 'Chờ xác nhận'
                break;
            }
            case 'PQE Confirm': {
                badgeStyle = "bg-primary";
                message = 'PQE đã xác nhận'
                break;
            }
            case 'TE Confirm': {
                badgeStyle = "bg-success";
                message = 'TE đã xác nhận'
                break;
            }
            case 'PQE Reject': {
                badgeStyle = "bg-danger";
                message = 'PQE đã từ chối'
                break;
            }           
            case 'TE Reject': {
                badgeStyle = "bg-danger";
                message = 'TE đã từ chối'
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle} align-middle">${message}</label></td>`);
    }
    // 5 Action
    {
        var cButton = "";
        //if ($('#thisUser').data('role') == '1') {
        //    if (item.LableDataFlow_Status.Status == 'Pending') {
        //        cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
        //                      <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
        //                   </td>`;
        //    }
        //    else {
        //        if ((item.LableDataFlow_Status.Status == "LineLeader Confirm" || item.LableDataFlow_Status.Status == "IPQC Confirm") && (!item.BeginCodeImage || !item.EndCodeImage)) {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
        //                   </td>`;
        //        } else {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                   </td>`;
        //        }

        //    }
        //}
        //else if ($('#thisUser').data('role') == '2') {
        //    if (item.LableDataFlow_Status.Status == 'Pending') {
        //        cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
        //                      <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
        //                   </td>`
        //    }
        //    else {
        //        if ((item.LableDataFlow_Status.Status == "LineLeader Confirm" || item.LableDataFlow_Status.Status == "IPQC Confirm") && (!item.BeginCodeImage || !item.EndCodeImage)) {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
        //                   </td>`;
        //        } else {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                   </td>`;
        //        }
        //    }
        //}
        //else if ($('#thisUser').data('role') == '3') {
        //    if (item.LableDataFlow_Status.Status == 'LineLeader Confirm') {
        //        cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
        //                      <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
        //                   </td>`;
        //    }
        //    else {
        //        if ((item.LableDataFlow_Status.Status == "IPQC Confirm" || item.LableDataFlow_Status.Status == "Pending") && (!item.BeginCodeImage || !item.EndCodeImage)) {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
        //                   </td>`;
        //        } else {
        //            cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
        //                   </td>`;
        //        }
        //    }
        //}

        row.push(cButton);
    }

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
    $('input[name="MacIDLabel-MacID"]').change(function (e) {
        if ($(this).val() === 'Orther') {
            $('input[name="MacIDLabel-MacID"][OtherText]').attr('disabled', false);
            $('input[name="MacIDLabel-MacID"][OtherText]').val('');
        }
        else {
            if (!$(this).is('[OtherText]')) {
                $('input[name="MacIDLabel-MacID"][OtherText]').attr('disabled', true);
            }         
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
    // Btn-Img
    $('button[name="FoxconnLabel"][Btn-Image]').click(function () {
        $('input[name="FoxconnLabel"][LabelImagePath]').click();
    });
    $('button[name="SNLabel"][Btn-Image]').click(function () {
        $('input[name="SNLabel"][LabelImagePath]').click();
    });
    $('button[name="MacIDLabel"][Btn-Image]').click(function () {
        $('input[name="MacIDLabel"][LabelImagePath]').click();
    });
    $('button[name="CurrentLabel"][Btn-Image]').click(function () {
        $('input[name="CurrentLabel"][LabelImagePath]').click();
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

        $(tds).find('input[name="MacIDLabel-MacID"]').attr('disabled', false);
        $(tds).find('input[name="MacIDLabel-MacID"]:first').prop('checked', true);
        $(tds).find('input[name="MacIDLabel-MacID"][OtherText]').attr('disabled', true);
        $(tds).find('input[name="MacIDLabel-MacID"][OtherText]').val('');

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

        $(tds).find('input[name="MacIDLabel-MacID"]').attr('disabled', true);
        $(tds).find('input[name="MacIDLabel-MacID"]:first').prop('checked', true);
        $(tds).find('input[name="MacIDLabel-MacID"][OtherText]').attr('disabled', true);
        $(tds).find('input[name="MacIDLabel-MacID"][OtherText]').val('');

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

// Add new
$('#AddModel_LabelSample-btnSave').click(function () {
    const data = GetModalFormData();

    const formData = objectToFormData(data);

    $.ajax({
        type: 'POST',
        url: '/Lable/Sample/NewLabelSample',
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status) {
                const label = JSON.parse(res.data);

                console.log(label);


                Swal.fire("Done!", "", "success");
            }
            else {
                Swal.fire("Sorry, Something went wrong...", res.message, "warning");
            }
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
        }
    });
});
function GetModalFormData() {
    var data = {
        ProductName: $('[data-name="ProductName"]').val(),
        CreatedDate: $('[data-name="CreatedDate"]').val(),
        ValidDate: $('[data-name="ValidDate"]').val(),
        MO: $('[data-name="MO"]').val(),
        Note: [],
        Location: $('#Location').val(),
        IsHasKey: false,
    }

    // FoxconnLabel    
    if ($('#isFoxconnLabel').is(':checked')) {
        var FoxconnLabel =
        {
            IsBarCode: false,
            CustumerNote: null,
            MadeIn: null,
            LableRev: null,
            LabelCode: null,
            CoalPaperSpec: null,
            DerivedFrom: null,
            LabelImagePath: null
        };

        var FoxconnLabelFields = $('#AddModel_LabelSample_Table-tbody').find('[name="FoxconnLabel"]');

        $.each(FoxconnLabelFields, function (k, field) {
            if ($(field).is('[IsBarCode]')) {
                FoxconnLabel.IsBarCode = $(field).is(':checked') ? true : false;
            }              
            if ($(field).is('[IsCustumerNote]') && $(field).is(':checked')) {
                FoxconnLabel.CustumerNote = FoxconnLabelFields.filter('[CustumerNote]').val();
            }
            if ($(field).is('[MadeIn]') && $(field).val() != '') {
                FoxconnLabel.MadeIn = $(field).val();
            }
            if ($(field).is('[LableRev]') && $(field).val() != '') {
                FoxconnLabel.LableRev = $(field).val();
            }
            if ($(field).is('[LabelCode]') && $(field).val() != '') {
                FoxconnLabel.LabelCode = $(field).val();
            }
            if ($(field).is('[CoalPaperSpec]') && $(field).is(':checked')) {
                FoxconnLabel.CoalPaperSpec = $(field).val();
            }
            if ($(field).is('[IsDerivedFrom]') && $(field).is(':checked')) {
                FoxconnLabel.DerivedFrom = FoxconnLabelFields.filter('[DerivedFrom]').val();
            }
            if ($(field).is('[LabelImagePath]')) {
                FoxconnLabel.LabelImagePath = $(field)[0].files[0];
            }
        });
        data.FoxconnLabel = FoxconnLabel;
    }
    // SNLabel 
    if ($('#isSNLabel').is(':checked')) {
        var SNLabel =
        {
            IsBarCode: false,
            TimeChangeMethod: null,
            FixedCode: null,
            RangeCode: null,
            LabelCode: null,
            CoalPaperSpec: null,
            DerivedFrom: null,
            LabelImagePath: null
        };

        var SNLabelFields = $('#AddModel_LabelSample_Table-tbody').find('[name="SNLabel"]');

        $.each(SNLabelFields, function (k, field) {
            if ($(field).is('[IsBarCode]')) {
                SNLabel.IsBarCode = $(field).is(':checked') ? true : false;
            }
            if ($(field).is('[TimeChangeMethod]')) {
                SNLabel.TimeChangeMethod = $(field).find('input').filter(':checked').val()
            }
            if ($(field).is('[MadeIn]') && $(field).val() != '') {
                SNLabel.MadeIn = $(field).val();
            }
            if ($(field).is('[LableRev]') && $(field).val() != '') {
                SNLabel.LableRev = $(field).val();
            }
            if ($(field).is('[LabelCode]') && $(field).val() != '') {
                SNLabel.LabelCode = $(field).val();
            }
            if ($(field).is('[CoalPaperSpec]') && $(field).is(':checked')) {
                SNLabel.CoalPaperSpec = $(field).val();
            }
            if ($(field).is('[IsDerivedFrom]') && $(field).is(':checked')) {
                SNLabel.DerivedFrom = SNLabelFields.filter('[DerivedFrom]').val();
            }
            if ($(field).is('[LabelImagePath]')) {
                SNLabel.LabelImagePath = $(field)[0].files[0];
            }
        });
        data.SNLabel = SNLabel;
    }
    // MacIdLabel
    if ($('#isMacIDLabel').is(':checked')) {
        var MacIDLabel =
        {
            IsBarCode: false,
            MacID: null,
            LabelCode: null,
            CoalPaperSpec: null,
            DerivedFrom: null,
            LabelImagePath: null
        };

        var MacIDLabelFields = $('#AddModel_LabelSample_Table-tbody').find('[name="MacIDLabel"]');

        $.each(MacIDLabelFields, function (k, field) {
            if ($(field).is('[IsBarCode]')) {
                MacIDLabel.IsBarCode = $(field).is(':checked') ? true : false;
            }
            if ($(field).is('[MacID]')) {
                var checkedVal = $(field).find('input').filter(':checked').val();
                if (checkedVal === 'Orther')
                {
                    MacIDLabel.MacID = $(field).find('input[name="MacIDLabel-MacID"][OtherText]').val()
                }
                else {
                    MacIDLabel.MacID = checkedVal;
                }               
            }
            if ($(field).is('[LabelCode]') && $(field).val() != '') {
                MacIDLabel.LabelCode = $(field).val();
            }
            if ($(field).is('[CoalPaperSpec]') && $(field).is(':checked')) {
                MacIDLabel.CoalPaperSpec = $(field).val();
            }
            if ($(field).is('[IsDerivedFrom]') && $(field).is(':checked')) {
                MacIDLabel.DerivedFrom = MacIDLabelFields.filter('[DerivedFrom]').val();
            }
            if ($(field).is('[LabelImagePath]')) {
                MacIDLabel.LabelImagePath = $(field)[0].files[0];
            }
        });
        data.MacIDLabel = MacIDLabel;
    }
    // CurrentLabel
    if ($('#isCurrentLabel').is(':checked')) {
        var CurrentLabel =
        {
            LabelName: false,
            LabelCode: null,
            CoalPaperSpec: null,
            DerivedFrom: null,
            LabelImagePath: null
        };

        var CurrentLabelFields = $('#AddModel_LabelSample_Table-tbody').find('[name="CurrentLabel"]');

        $.each(CurrentLabelFields, function (k, field) {
            if ($(field).is('[LabelName]') && $(field).val() != '') {
                CurrentLabel.LabelName = $(field).val();
            }
            if ($(field).is('[LabelCode]') && $(field).val() != '') {
                CurrentLabel.LabelCode = $(field).val();
            }
            if ($(field).is('[CoalPaperSpec]') && $(field).is(':checked')) {
                CurrentLabel.CoalPaperSpec = $(field).val();
            }
            if ($(field).is('[IsDerivedFrom]') && $(field).is(':checked')) {
                CurrentLabel.DerivedFrom = CurrentLabelFields.filter('[DerivedFrom]').val();
            }
            if ($(field).is('[LabelImagePath]')) {
                CurrentLabel.LabelImagePath = $(field)[0].files[0];
            }
        });
        data.CurrentLabel = CurrentLabel;
    }
    // Note
    var note_1 = $('#AddModel_LabelSample_Table-tbody').find('input[data-name="note_1"]').val();
    var note_2 = $('#AddModel_LabelSample_Table-tbody').find('input[data-name="note_2"]').val();
    var note_3 = $('#AddModel_LabelSample_Table-tbody').find('textarea[data-name="note_3"]').val();
    data.Note.push(note_1); data.Note.push(note_2); data.Note.push(note_3);
    // IsHasKey
    data.IsHasKey = $('#AddModel_LabelSample_Table-tbody').find('input[data-name="IsHasKey"]').is(':checked') ? true : false;

   
    console.log(data);

    return data;
}
function objectToFormData(obj, formData = null, parentKey = '') {
    if (formData === null) {
        formData = new FormData();
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let propName = parentKey ? `${parentKey}[${key}]` : key;

            if (obj[key] instanceof File) {
                // Xử lý trường hợp là file
                formData.append(propName, obj[key], obj[key].name);
            } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                objectToFormData(obj[key], formData, propName);
            } else if (Array.isArray(obj[key])) {
                for (let i = 0; i < obj[key].length; i++) {
                    formData.append(`${propName}[${i}]`, obj[key][i]);
                }
            } else {
                formData.append(propName, obj[key]);
            }
        }
    }

    return formData;
}

// Image Event
var viewPreview;
function AddImageEvent()
{
    const ImageRow = $('#AddModel_LabelSample_Table-tbody tr').eq(7);
    const ImageCells = $(ImageRow).find('td:gt(0)');


    $.each(ImageCells, function (k, cell) {

        const InputFile = $(cell).find('input');
        const PreviewContainer = $(cell).find('.previewContainer');
        const DeleteImageBtn = $(cell).find('.deleteButton');
        const AddImageButton = $(cell).find('button[Btn-Image]');

        DeleteImageBtn.click(function () {
            PreviewContainer.empty();
            DeleteImageBtn.hide();
            InputFile.val('');
            AddImageButton.show();
        });

        InputFile.change(function (event) {
            PreviewContainer.empty('');
            PreviewContainer.show();
            DeleteImageBtn.show();
            AddImageButton.hide();

            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = $('<img>');
                    img.attr('src', event.target.result);
                    img.addClass('previewImage');
                    PreviewContainer.append(img);

                    $(img).on('click', function (img) {
                        let image = $('#ImagePreview');
                        image.attr('src', event.target.result);
                        $(image).click();
                    });
                };
                reader.readAsDataURL(file);
            }
        });


    });
}
$('#ImagePreview').on('click', function () {
    if (viewPreview) {
        viewPreview.destroy();
    }
    viewPreview = new Viewer(document.getElementById('ImagePreview'), {
        backdrop: true,
        button: false,
        focus: true,
        fullscreen: false,
        loading: true,
        loop: false,
        keyboard: false,
        movable: true,
        navbar: false,
        rotatable: false,
        scalable: false,
        slideOnTouch: false,
        title: false,
        toggleOnDbclick: false,
        toolbar: true,
        tooltip: true,
        transition: true,
        zoomable: true,
        zoomOnTouch: true,
        zoomOnWheel: true
    });
});

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