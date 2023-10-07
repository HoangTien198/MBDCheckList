$(function () {
    $('#page_name').text('Label 樣品表 Bảng Label mẫu');
    LoadDataCheckList();

    $('#isFoxconnLabel').change();
    $('#isSNLabel').change();
    $('#isMacIDLabel').change();
    $('#isCurrentLabel').change();

    AddImageEvent();

    $('#btn_AddNew').show();

    setInterval(() => {
        if ($('#btn_AddNew').is(':visible')) {
            clearInterval(this);
        } else {
            $('#btn_AddNew').show();
        }
    }, 100);
});

// Create Table
var dataTable;
var isLoadingData = false;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

function LoadDataCheckList() {
    onload();

    var data = {
        Location: $('#Location').val(),
        Year: thisYear,
        Month: thisMonth,
        Date: thisDay
    }

    $.ajax({
        type: "GET",
        url: "/Lable/Sample/GetLabelSamples",
        data: data,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                const lables = JSON.parse(res.data);

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
                url: "/Lable/Sample/GetLabelSamples",
                data: data,
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    if (res.status) {
                        const lables = JSON.parse(res.data);

                        await $.each(lables, function (k, item) {
                            var row = DrawTableRows(item);
                            dataTable.rows().add(row, true);
                        });

                        if (lables.length > 0) {
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
    row.push(`<td class="text-center">${moment(item.CreatedDate).format('YYYY-MM-DD HH:mm')}</td>`);
    // 2 ValidDate
    row.push(`<td class="text-center">${moment(item.ValidDate).format('YYYY-MM-DD HH:mm') }</td>`);
    // 3 MO
    row.push(`<td>${item.MO ? item.MO : ''}</td>`); // col 6
    // 4 Status
    {
        const status = item.LabelSampleStatus != null ? item.LabelSampleStatus.Status : ''
        var badgeStyle = "";
        var message = "";

        switch (status) {
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
                message = 'PE đã xác nhận'
                break;
            }
            case 'PQE Reject': {
                badgeStyle = "bg-danger";
                message = 'PQE đã từ chối'
                break;
            }           
            case 'TE Reject': {
                badgeStyle = "bg-danger";
                message = 'PE đã từ chối'
                break;
            }
            case 'Confirm': {
                badgeStyle = "bg-success";
                message = 'Đơn dã xác nhận'
                break;
            }
            default : {
                badgeStyle = "bg-secondary";
                message = 'Không rõ'
                break;
            }
        }
        row.push(`<td class="text-center"><span class="badge ${badgeStyle} align-middle">${message}</span></td>`);
    }
    // 5 Action
    {
        var cButton = ``;
        var role = $('#thisUser').data('role');
        var id = $('#thisUser').data('id');
        var SampleStatus = item.LabelSampleStatus;

        switch (parseInt(role)) {
            case 1:
            case 2:
            case 3:
            case 4: {
                if (SampleStatus.IdUserCreated == id) {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                                  <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
                               </td>`;
                }
                else {
                    cButton = `<td class="action_col">
                                    <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                               </td>`;
                }
                break;
            }
            case 6: {
                if (SampleStatus.Status != 'Confirm' && SampleStatus.Status != 'PQE Confirm' && SampleStatus.Status != 'PQE Reject' && SampleStatus.Status != 'TE Reject') {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                                  <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                               </td>`;
                }
                else {
                     cButton = `<td class="action_col">
                                    <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                               </td>`;
                }
                break;
            }
            case 7: {
                if (SampleStatus.Status != 'Confirm' && SampleStatus.Status != 'TE Confirm' && SampleStatus.Status != 'PQE Reject' && SampleStatus.Status != 'TE Reject') {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                                  <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                               </td>`;
                }
                else {
                    cButton = `<td class="action_col">
                                    <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                               </td>`;
                }
                break;
            }
            default: {
                cButton = `<td class="action_col">
                                    <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                               </td>`;
                break;
            }
        }
        row.push(cButton);
    }

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}

// Checkbox Label
$('#isFoxconnLabel').change(function () {
    var tds = $(`#LabelSample_Table-tbody td[FoxconnLabel]`);

    if ($(this).is(":checked")) {
        $(tds).css('background-color', '');

        $(tds).find('input[isBarCode]').attr('disabled', false);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[IsCustomerNote]').attr('disabled', false);
        $(tds).find('input[IsCustomerNote]').prop('checked', false);
        $(tds).find('input[CustomerNote]').attr('disabled', true);
        $(tds).find('input[CustomerNote]').val('');

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

        $(tds).find('input[isBarCode]').attr('disabled', false);
        $(tds).find('input[isBarCode]').prop('checked', false);

        $(tds).find('input[IsCustomerNote]').attr('disabled', false);
        $(tds).find('input[IsCustomerNote]').prop('checked', false);
        $(tds).find('input[CustomerNote]').attr('disabled', true);
        $(tds).find('input[CustomerNote]').val('');

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
    var tds = $(`#LabelSample_Table-tbody td[SNLabel]`);

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

        $(tds).find('input[isBarCode]').attr('disabled', false);
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
    var tds = $(`#LabelSample_Table-tbody td[MacIDLabel]`);

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

        $(tds).find('input[isBarCode]').attr('disabled', false);
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
    var tds = $(`#LabelSample_Table-tbody td[CurrentLabel]`);

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

// Clear Modal
function ClearModal() {
    $('#isFoxconnLabel').prop('disabled', false).change();
    $('#isFoxconnLabel').prop('checked', false).change();

    $('#isSNLabel').prop('disabled', false).change();
    $('#isSNLabel').prop('checked', false).change();

    $('#isMacIDLabel').prop('disabled', false).change();
    $('#isMacIDLabel').prop('checked', false).change();

    $('#isCurrentLabel').prop('disabled', false).change();
    $('#isCurrentLabel').prop('checked', false).change();

    $('input[data-name="ProductName"]').val('');
    $('input[data-name="ProductName"]').prop('disabled', false);

    $('input[data-name="CreatedDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));
    $('input[data-name="CreatedDate"]').prop('disabled', false);

    $('input[data-name="ValidDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));
    $('input[data-name="ValidDate"]').prop('disabled', false);

    $('input[data-name="MO"]').val('');
    $('input[data-name="MO"]').prop('disabled', false);

    $('input[data-name="note_1"]').val(''); $('input[data-name="note_1"]').prop('disabled', false);
    $('input[data-name="note_2"]').val(''); $('input[data-name="note_2"]').prop('disabled', false);
    $('textarea[data-name="note_3"]').val(''); $('textarea[data-name="note_3"]').prop('disabled', false);

    $('input[data-name="IsHasKey"]').prop('disabled', false);
    $('input[data-name="IsHasKey"]').prop('checked', false);

    $('td[UserCreated]').empty();
    $('td[UserPQE]').empty(); $('td[UserPQE]').removeClass();
    $('td[UserPQE]').empty(); $('td[UserPQE]').addClass('text-center');

    $('td[UserTE]').empty(); $('td[UserTE]').removeClass();
    $('td[UserTE]').empty(); $('td[UserTE]').addClass('text-center');

    $('#LabelSample-body input[type="file"]').attr('disabled', false);

    $('#LabelSample .modal-footer').show();

    const ImageRow = $('#LabelSample_Table-tbody tr').eq(7);
    const ImageCells = $(ImageRow).find('td:gt(0)');

    $.each(ImageCells, function (k, cell) {

        const InputFile = $(cell).find('input');
        const PreviewContainer = $(cell).find('.previewContainer');
        const DeleteImageBtn = $(cell).find('.deleteButton');
        const AddImageButton = $(cell).find('button[Btn-Image]');

        InputFile.val('');
        PreviewContainer.hide();
        DeleteImageBtn.hide();
        AddImageButton.show();       
    });
}

// Add new
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();

    $('input[data-name="CreatedDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));
    $('input[data-name="ValidDate"]').val(moment().format('YYYY-MM-DDTHH:mm'));

    ClearModal();
    $('#LabelSample').modal('show');
});
$('#LabelSample-btnSave').click(function () {
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

                dataTable.rows().add(DrawTableRows(label, true));

                Swal.fire("Done!", "", "success");
                $('#LabelSample').modal('hide');
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
            CustomerNote: null,
            MadeIn: null,
            LableRev: null,
            LabelCode: null,
            CoalPaperSpec: null,
            DerivedFrom: null,
            LabelImagePath: null
        };

        var FoxconnLabelFields = $('#LabelSample_Table-tbody').find('[name="FoxconnLabel"]');

        $.each(FoxconnLabelFields, function (k, field) {
            if ($(field).is('[IsBarCode]')) {
                FoxconnLabel.IsBarCode = $(field).is(':checked') ? true : false;
            }              
            if ($(field).is('[IsCustomerNote]') && $(field).is(':checked')) {
                FoxconnLabel.CustomerNote = FoxconnLabelFields.filter('[CustomerNote]').val();
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
                if (FoxconnLabel.LabelImagePath == undefined && $(field).next().html() == '') {
                    FoxconnLabel.LabelImagePath = 'Remove';
                }
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

        var SNLabelFields = $('#LabelSample_Table-tbody').find('[name="SNLabel"]');

        $.each(SNLabelFields, function (k, field) {
            if ($(field).is('[IsBarCode]')) {
                SNLabel.IsBarCode = $(field).is(':checked') ? true : false;
            }
            if ($(field).is('[TimeChangeMethod]')) {
                SNLabel.TimeChangeMethod = $(field).find('input').filter(':checked').val()
            }
            if ($(field).is('[FixedCode]') && $(field).val() != '') {
                SNLabel.FixedCode = $(field).val();
            }
            if ($(field).is('[RangeCode]') && $(field).val() != '') {
                SNLabel.RangeCode = $(field).val();
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
                if (SNLabel.LabelImagePath == undefined && $(field).next().html() == '') {
                    SNLabel.LabelImagePath = 'Remove';
                }
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

        var MacIDLabelFields = $('#LabelSample_Table-tbody').find('[name="MacIDLabel"]');

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
                if (MacIDLabel.LabelImagePath == undefined && $(field).next().html() == '') {
                    MacIDLabel.LabelImagePath = 'Remove';
                }
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

        var CurrentLabelFields = $('#LabelSample_Table-tbody').find('[name="CurrentLabel"]');

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
                if (CurrentLabel.LabelImagePath == undefined && $(field).next().html() == '') {
                    CurrentLabel.LabelImagePath = 'Remove';
                }
            }
        });
        data.CurrentLabel = CurrentLabel;
    }

    // Note
    var note_1 = $('#LabelSample_Table-tbody').find('input[data-name="note_1"]').val();
    var note_2 = $('#LabelSample_Table-tbody').find('input[data-name="note_2"]').val();
    var note_3 = $('#LabelSample_Table-tbody').find('textarea[data-name="note_3"]').val();
    data.Note.push(note_1); data.Note.push(note_2); data.Note.push(note_3);
    // IsHasKey
    data.IsHasKey = $('#LabelSample_Table-tbody').find('input[data-name="IsHasKey"]').is(':checked') ? true : false;

    // PdfFile
    if ($('#UploadFilesInput')[0].files[0] != undefined) {
        data.PdfFile = $('#UploadFilesInput')[0].files[0];
    }

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

// Details
function Details(elm, e) {
    e.preventDefault();
    ClearModal();

    const Id = $(elm).data('id');

    $.ajax({
        type: "GET",
        url: "/Lable/Sample/GetLabelSample?Id=" + Id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const label = JSON.parse(res.label);

                FillDataToModal(label, false);
                // show
                $('#LabelSample').modal('show');
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }

            endload();
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
            endload();
        }
    });
}

// Edit
function Edit(elm, e) {
    ClearModal();
    e.preventDefault();

    const Id = $(elm).data('id');
    const Index = $(elm).closest('tr').index();

    $.ajax({
        type: "GET",
        url: "/Lable/Sample/GetLabelSample?Id=" + Id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const label = JSON.parse(res.label);

                FillDataToModal(label, true);

                $('#LabelSample-btnSave').hide();
                $('#LabelSample-btnSaveEdit').show();

                $('.deleteButton').show();

                $('#LabelSample-btnSaveEdit').data('id', Id);
                $('#LabelSample-btnSaveEdit').data('index', Index);

                // show
                $('#LabelSample').modal('show');
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }

            endload();
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
            endload();
        }
    });
}
function SaveEdit(elm, e) {
    e.preventDefault();

    const data = GetModalFormData();

    const formData = objectToFormData(data);

    const Id = $(elm).data('id');
    const Index = $(elm).data('index');

    $.ajax({
        type: 'POST',
        url: '/Lable/Sample/UpdateLabelSample?Id=' + Id,
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status) {
                const label = JSON.parse(res.data);

                dataTable.rows().updateRow(Index, DrawTableRows(label, true));

                Swal.fire("Done!", "", "success");
                $('#LabelSample').modal('hide');
            }
            else {
                Swal.fire("Sorry, Something went wrong...", res.message, "warning");
            }
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
        }
    });


}

// Delete
function Delete(elm, e) {
    e.preventDefault();

    const Id = $(elm).data('id');
    const Index = $(elm).closest('tr').index();

    $.ajax({
        type: "GET",
        url: "/Lable/Sample/GetLabelSample?Id=" + Id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const label = JSON.parse(res.label);

                var tableHTML = "";
                tableHTML += `
                              <h4>Bạn có chắc chắn muốn xóa?</h4>
                              <table style='width:100%;border-collapse:collapse;margin-top:20px;'>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>Tên sản phẩm</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${label.ProductName}</td>
                                </tr>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>Thời gian làm</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${moment(label.CreatedDate).format('yyyy-MM-DD HH:mm')}</td>
                                </tr>
                                <tr>
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>Thời gian có hiệu lực</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${moment(label.ValidDate).format('yyyy-MM-DD HH:mm')}</td>
                                </tr>
                                <tr>                                                                        
                                    <th style='background-color:#f2f2f2;border:1px solid #ddd;padding:8px;text-align:left;'>MO</th>
                                    <td style='border:1px solid #ddd;padding:8px;text-align:left;'>${label.MO}</td>
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
                }).then(function (result) {
                    if (result.value) {
                        //Xác nhận xóa:
                        $.ajax({
                            type: "POST",
                            url: "/Lable/Sample/DeleteLabelSample",
                            data: { Id: Id },
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
                                Swal.fire("Có lỗi xảy ra", GetResonseError(err.responseText, 'title'), "error");
                            }
                        });
                    }
                });
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }

            endload();
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
            endload();
        }
    });
}

// Confirm
function Confirm(elm, e) {
    e.preventDefault();

    const Id = $(elm).data('id');
    const Index = $(elm).closest('tr').index();

    var htmlstring = '';

    Swal.fire({
        title: 'Xác nhận đơn này?',
        icon: "warning",
        html: htmlstring,
        confirmButtonText: 'Gửi',
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true,
        preConfirm: () => {
            var SendData = {
                Id: Id,
                Mail: ''
            }
            $.ajax({
                type: "POST",
                url: "/Lable/Sample/Confirm",
                data: JSON.stringify(SendData),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.status) {
                        var label = JSON.parse(res.data);

                        dataTable.rows().updateRow(Index, DrawTableRows(label, true));
                    }
                    else {
                        Swal.fire("Sorry, Something went wrong...", res.message, "warning");
                    }
                },
                error: function (err) {
                    Swal.fire("Có lỗi xảy ra", GetResonseError(err.responseText, 'title'), "error");
                }
            });
        }
    });
}

// Rejects
function Rejects(elm, e) {
    e.preventDefault();

    const Id = $(elm).data('id');
    const Index = $(elm).closest('tr').index();


    var htmlstring = '<textarea id="iPQCReasonReject" class="form-control" rows="5"></textarea>';

    Swal.fire({
        title: 'Lý do từ chối đơn:',
        icon: "warning",
        html: htmlstring,
        confirmButtonText: 'Gửi',
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true,
        preConfirm: () => {
            if ($('#iPQCReasonReject').val()) {
                var SendData = {
                    Id: Id,
                    Note: $('#iPQCReasonReject').val()
                }
                $.ajax({
                    type: "POST",
                    url: "/Lable/Sample/Reject",
                    data: JSON.stringify(SendData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        if (res.status) {
                            var label = JSON.parse(res.data);

                            dataTable.rows().updateRow(Index, DrawTableRows(label, true));
                        }
                        else {
                            Swal.fire("Sorry, Something went wrong...", res.message, "warning");
                        }
                    },
                    error: function (err) {
                        Swal.fire("Có lỗi xảy ra", GetResonseError(err.responseText, 'title'), "error");
                    }
                });
            }
        }
    });
}

// Fill Data to Modal
function FillDataToModal(label, isEditModal = false) {
    if (label != null) {

        // Header
        $('input[data-name="ProductName"]').val(label.ProductName);
        $('input[data-name="MO"]').val(label.MO);
        $('input[data-name="CreatedDate"]').val(label.CreatedDate);
        $('input[data-name="ValidDate"]').val(label.ValidDate);
        // Body
        FillFoxconnLabel(label.FoxconnLabel);
        FillSNLabel(label.SNLabel);
        FillMacIDLabel(label.MacIDLabel);
        FillCurrentLabel(label.CurrentLabel);
        // Footer
        const note = label.Note.split(',');
        $('input[data-name="note_1"]').val(note[0]);
        $('input[data-name="note_2"]').val(note[1]);
        $('textarea[data-name="note_3"]').val(note[2]);

        $('input[data-name="IsHasKey"]').prop('checked', label.IsHasKey);
        $('input[data-name="IsHasKey"]').css('opacity', 1);
        $('input[data-name="IsHasKey"]').next('label').css('opacity', 1);
        // User
        FillUserLabel(label.LabelSampleStatus);
    }

    if (isEditModal) {
        $('#LabelSample-body').attr('data-edit');
        $('#LabelSample-body').removeAttr('data-details');

        $('#LabelSample-body input').attr('disabled', false);
        $('#LabelSample-body textarea').attr('disabled', false);

        $('button[Btn-Image]').attr('disabled', false);

        // button
        $('#LabelSample .modal-footer').show();
    }
    else {
        $('#LabelSample-body').attr('data-details');
        $('#LabelSample-body').removeAttr('data-edit');

        $('#LabelSample-body input').attr('disabled', true);
        $('#LabelSample-body textarea').attr('disabled', true);
        $('#LabelSample-body input[CoalPaperSpec]:checked').attr('disabled', false);

        $('#LabelSample-body input[TimeChangeMethod]:checked').attr('disabled', false);

        $('button[Btn-Image]').attr('disabled', true);

        $('#LabelSample-body input[name="MacIDLabel-MacID"]:checked').next('label').css('opacity', '1');
        $('#LabelSample-body input[name="MacIDLabel-MacID"]:checked').css('opacity', '1');
        // button
        $('#LabelSample .modal-footer').hide();
    }
}

function FillFoxconnLabel(label) {
    if (label != null) {
        $('#isFoxconnLabel').prop('checked', true).change();
        $('#isFoxconnLabel').css('opacity', 1);
        $('#isFoxconnLabel').next('label').css('opacity', 1);

        // IsBarCode
        $('input[name="FoxconnLabel"][IsBarCode]').prop('checked', label.IsBarCode);
        $('input[name="FoxconnLabel"][IsBarCode]').css('opacity', 1);
        $('input[name="FoxconnLabel"][IsBarCode]').next('label').css('opacity', 1);

        // CustomerNote
        if (label.CustomerNote != null) {
            $('input[name="FoxconnLabel"][IsCustomerNote]').prop('checked', true);
            $('input[name="FoxconnLabel"][IsCustomerNote]').css('opacity', 1);
            $('input[name="FoxconnLabel"][IsCustomerNote]').next('label').css('opacity', 1);

            $('input[name="FoxconnLabel"][CustomerNote]').val(label.CustomerNote);
        }

        // MadeIn
        $('input[name="FoxconnLabel"][MadeIn]').val(label.MadeIn ? label.MadeIn : '');

        // LableRev
        $('input[name="FoxconnLabel"][LableRev]').val(label.LableRev ? label.LableRev : '');
        // LabelCode
        $('input[name="FoxconnLabel"][LabelCode]').val(label.LabelCode ? label.LabelCode : '');
        // CoalPaperSpec
        $(`input[name="FoxconnLabel"][CoalPaperSpec][value="${label.CoalPaperSpec}"]`).prop('checked', true);
        // DerivedFrom
        if (label.DerivedFrom != null) {
            $('input[name="FoxconnLabel"][IsDerivedFrom]').prop('checked', true);
            $('input[name="FoxconnLabel"][IsDerivedFrom]').css('opacity', 1);
            $('input[name="FoxconnLabel"][IsDerivedFrom]').next('label').css('opacity', 1);
            $('input[name="FoxconnLabel"][DerivedFrom]').val(label.DerivedFrom);
        }
        // LabelImagePath
        if (label.LabelImagePath != null) {
            const img = $(`<img src="${label.LabelImagePath.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
            $('td[FoxconnLabel] .previewContainer').html(img);
            $('td[FoxconnLabel] .previewContainer').show();
            $('td[FoxconnLabel] .deleteButton').hide();
            $('td[FoxconnLabel] button[Btn-Image]').hide();

            $(img).on('click', function () {
                let image = $('#ImagePreview');
                image.attr('src', $(img).attr('src'));
                $(image).click();
            });
        }
    } 
}
function FillSNLabel(label) {
    if (label != null) {
        $('#isSNLabel').prop('checked', true).change();
        $('#isSNLabel').css('opacity', 1);
        $('#isSNLabel').next('label').css('opacity', 1);

        // IsBarCode
        $('input[name="SNLabel"][IsBarCode]').prop('checked', label.IsBarCode);
        $('input[name="SNLabel"][IsBarCode]').css('opacity', 1);
        $('input[name="SNLabel"][IsBarCode]').next('label').css('opacity', 1);

        // TimeChangeMethod
        $(`input[name="SNLabel-TimeChangeMethod"][TimeChangeMethod][value="${label.TimeChangeMethod}"]`).prop('checked', true);

        // FixedCode
        $('input[name="SNLabel"][FixedCode]').val(label.FixedCode != 'null' ? label.FixedCode : '');

        // RangeCode
        $('input[name="SNLabel"][RangeCode]').val(label.RangeCode != 'null' ? label.RangeCode : '');

        // LabelCode
        $('input[name="SNLabel"][LabelCode]').val(label.LabelCode != 'null' ? label.LabelCode : '');

        // CoalPaperSpec
        $(`input[name="SNLabel"][CoalPaperSpec][value="${label.CoalPaperSpec}"]`).prop('checked', true);

        // DerivedFrom
        if (label.DerivedFrom != null) {
            $('input[name="SNLabel"][IsDerivedFrom]').prop('checked', true);
            $('input[name="SNLabel"][IsDerivedFrom]').css('opacity', 1);
            $('input[name="SNLabel"][IsDerivedFrom]').next('label').css('opacity', 1);
            $('input[name="SNLabel"][DerivedFrom]').val(label.DerivedFrom);
        }

        // LabelImagePath
        if (label.LabelImagePath != null) {
            const img = $(`<img src="${label.LabelImagePath.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
            $('td[SNLabel] .previewContainer').html(img);
            $('td[SNLabel] .previewContainer').show();
            $('td[SNLabel] .deleteButton').hide();
            $('td[SNLabel] button[Btn-Image]').hide();

            $(img).on('click', function () {
                let image = $('#ImagePreview');
                image.attr('src', $(img).attr('src'));
                $(image).click();
            });
        }       
    }
}
function FillMacIDLabel(label) {
    if (label != null) {
        $('#isMacIDLabel').prop('checked', true).change();
        $('#isMacIDLabel').css('opacity', 1);
        $('#isMacIDLabel').next('label').css('opacity', 1);

        // IsBarCode
        $('input[name="MacIDLabel"][IsBarCode]').prop('checked', label.IsBarCode);
        $('input[name="MacIDLabel"][IsBarCode]').css('opacity', 1);
        $('input[name="MacIDLabel"][IsBarCode]').next('label').css('opacity', 1);

        // MacID
        if ($(`input[name="MacIDLabel-MacID"][value="${label.MacID}"]`).length) {
            $(`input[name="MacIDLabel-MacID"][value="${label.MacID}"]`).prop('checked', true);
        }
        else {
            $(`input[name="MacIDLabel-MacID"][value="Orther"]`).prop('checked', true);
            $(`input[name="MacIDLabel-MacID"][OtherText] `).val(label.MacID);
        }

        // LabelCode
        $('input[name="MacIDLabel"][LabelCode]').val(label.LabelCode != 'null' ? label.LabelCode : '');

        // CoalPaperSpec
        $(`input[name="MacIDLabel"][CoalPaperSpec][value="${label.CoalPaperSpec}"]`).prop('checked', true);

        // DerivedFrom
        if (label.DerivedFrom != null) {
            $('input[name="MacIDLabel"][IsDerivedFrom]').prop('checked', true);
            $('input[name="MacIDLabel"][IsDerivedFrom]').css('opacity', 1);
            $('input[name="MacIDLabel"][IsDerivedFrom]').next('label').css('opacity', 1);
            $('input[name="MacIDLabel"][DerivedFrom]').val(label.DerivedFrom);
        }

        // LabelImagePath
        if (label.LabelImagePath != null) {
            const img = $(`<img src="${label.LabelImagePath.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
            $('td[MacIDLabel] .previewContainer').html(img);
            $('td[MacIDLabel] .previewContainer').show();
            $('td[MacIDLabel] .deleteButton').hide();
            $('td[MacIDLabel] button[Btn-Image]').hide();

            $(img).on('click', function () {
                let image = $('#ImagePreview');
                image.attr('src', $(img).attr('src'));
                $(image).click();
            });
        }
    } 
}
function FillCurrentLabel(label) {
    if (label != null) {
        $('#isCurrentLabel').prop('checked', true).change();
        $('#isCurrentLabel').css('opacity', 1);
        $('#isCurrentLabel').next('label').css('opacity', 1);

        // LabelCode
        $('input[name="CurrentLabel"][LabelName]').val(label.LabelName != 'null' ? label.LabelName : '');

        // LabelCode
        $('input[name="CurrentLabel"][LabelCode]').val(label.LabelCode != 'null' ? label.LabelCode : '');

        // CoalPaperSpec
        $(`input[name="CurrentLabel"][CoalPaperSpec][value="${label.CoalPaperSpec}"]`).prop('checked', true);

        // DerivedFrom
        if (label.DerivedFrom != null) {
            $('input[name="CurrentLabel"][IsDerivedFrom]').prop('checked', true);
            $('input[name="CurrentLabel"][IsDerivedFrom]').css('opacity', 1);
            $('input[name="CurrentLabel"][IsDerivedFrom]').next('label').css('opacity', 1);
            $('input[name="CurrentLabel"][DerivedFrom]').val(label.DerivedFrom);
        }

        // LabelImagePath
        if (label.LabelImagePath != null) {
            const img = $(`<img src="${label.LabelImagePath.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
            $('td[CurrentLabel] .previewContainer').html(img);
            $('td[CurrentLabel] .previewContainer').show();
            $('td[CurrentLabel] .deleteButton').hide();
            $('td[CurrentLabel] button[Btn-Image]').hide();

            $(img).on('click', function () {
                let image = $('#ImagePreview');
                image.attr('src', $(img).attr('src'));
                $(image).click();
            });
        }
    } 
}
function FillUserLabel(status) {
    // UserCreated
    $('td[UserCreated]').empty();
    if (status.UserCreated != null) {
        const uCreated = status.UserCreated;

        $('td[UserCreated]').append(`<label>${uCreated.UserCode}</label>`);
        $('td[UserCreated]').append(`<label class="fw-bold">${uCreated.UserFullName}</label>`);
    }
    // UserPQE
    $('td[UserPQE]').empty();
    if (status.UserPQE != null) {
        const uPQE = status.UserPQE;

        $('td[UserPQE]').append(`<label>${uPQE.UserCode}</label>`);
        $('td[UserPQE]').append(`<label class="fw-bold">${uPQE.UserFullName}</label>`);

        if (status.Status.includes('Confirm')) {
            $('td[UserPQE]').addClass('confirm');
        }
        else if (status.Status.includes('Reject')) {
            $('td[UserPQE]').addClass('reject');
            $('td[UserPQE]').append(`<label>Lý do: ${status.Note}</label>`);
        }
    }
    // UserPE
    $('td[UserTE]').empty();
    if (status.UserTE != null) {
        const uTE = status.UserTE;

        $('td[UserTE]').append(`<label>${uTE.UserCode}</label>`);
        $('td[UserTE]').append(`<label class="fw-bold">${uTE.UserFullName}</label>`);

        if (status.Status.includes('Confirm')) {
            $('td[UserTE]').addClass('confirm');
        }
        else if (status.Status.includes('Reject')) {
            $('td[UserTE]').addClass('reject');
            $('td[UserTE]').append(`<label>Lý do: ${status.Note}</label>`);
        }
    }
}

// Image Event
var viewPreview;
function AddImageEvent()
{
    const ImageRow = $('#LabelSample_Table-tbody tr').eq(7);
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

// Custom Cell
{
    // CustomerNote
    $('input[name="FoxconnLabel"][IsCustomerNote]').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="FoxconnLabel"][CustomerNote]').val('');
            $('input[name="FoxconnLabel"][CustomerNote]').attr('disabled', false);
        }
        else {
            $('input[name="FoxconnLabel"][CustomerNote]').val('');
            $('input[name="FoxconnLabel"][CustomerNote]').attr('disabled', true);
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
    // Upload Pdf
    $('#UploadFiles').click(function (e) {
        e.preventDefault();
        $(this).next().click();
    });
    $('#UploadFilesInput').change(function (e) {
        e.preventDefault();
        var fileName = $($(this).val().split('\\')).last();

        $('#FilesPreview').empty();
        $('#FilesPreview').append(`<a href="javascript:;" style="border: 1px solid; width: fit-content; padding: 5px;">${fileName[0]}<a>`);
    });
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