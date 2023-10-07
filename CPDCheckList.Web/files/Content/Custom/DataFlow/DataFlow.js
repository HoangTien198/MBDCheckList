
$(document).ready(function () {
    $('#page_name').text('Label 流水号登记表 Biểu lưu trình dữ liệu Label');
    LoadDataCheckList();
    ForcusInputEvent();
    AddImageEvent();
});
// Orther
function ForcusInputEvent() {
    const tdElements = document.querySelectorAll('td');
    tdElements.forEach(td => {
        td.addEventListener('click', function (event) {
            // Kiểm tra xem td có chứa input hay không
            const inputElement = td.querySelector('input');
            if (inputElement) {
                // Chọn input
                inputElement.select();
            }
        });
    });
}

//load data
var dataTable;
var isLoadingData = false;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

function LoadDataCheckList() {
    onload();    
    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetDataFlowList",
        data: {
            Location: $('[name="Location"]').val(),
            Year: thisYear,
            Month: thisMonth,
            Date: thisDay
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                await $.each(res.data, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#tbody_DataFlow').append(row);
                });
                CreateTable();
                DynamicLoadTable();
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
function DynamicLoadTable() {
    const divElement = document.querySelector('.dataTable-container');
    divElement.addEventListener('scroll', function () {
        var scrollLenght = parseInt((divElement.scrollTop + divElement.clientHeight));
        var scrollHeight = parseInt(divElement.scrollHeight * 0.9);

        var items = $('#tbody_DataFlow tr');

        if (!isLoadingData && (scrollLenght > scrollHeight) && items.length > 10) {
            isLoadingData = true;

            onload();

            thisMonth -= 1;
            if (thisMonth == 0) {
                thisYear -= 1;
                thisMonth = 12;
            }

            var dateData = {
                Location: $('[name="Location"]').val(),
                Year: thisYear,
                Month: thisMonth,
                Date: thisDay
            }

            $.ajax({
                type: "GET",
                url: "/Lable/DataFlow/GetDataFlowList",
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
                        Swal.fire("Có lỗi xảy ra", response.message, "error");
                        endload();
                    }
                },
                error: function (err) {
                    Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
                    endload();
                }
            });
        }
    });
}
function CreateTable() {
    if ($(window).width() < 500) {
        var scrollHeight = document.querySelector('#sidebar').offsetHeight - 450 + 'px';
        var myTable = document.querySelector('#table_DataFlow');
        dataTable = new simpleDatatables.DataTable(myTable, {
            scrollY: scrollHeight,
            paging: false,
            footer: false,
            sortable: false,
            hiddenHeader: true,
        });
        dataTable.columns().hide([4,5]);
    }
    else {
        var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
        var myTable = document.querySelector('#table_DataFlow');
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
        var cButton = `<td class="action_col">
                          <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                       </td>`;

        var role = parseInt($('#thisUser').data('role'));
        var Id = parseInt($('#thisUser').data('id'));
        var status = item.LableDataFlow_Status;
        
        switch (role) {
            case 1: {
                if (status.Status == 'Pending') {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                                  <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
                               </td>`;
                }
                else if (!item.BeginCodeImage || !item.EndCodeImage) {
                    cButton = `<td class="action_col">
                                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                                   </td>`;

                }
                else if (status.IdUserCreate == Id && status.Status != "IPQC Confirm"){
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                               </td>`;
                }
                break;
            }
            case 2: {
                if (status.Status == 'Pending') {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                                  <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                               </td>`
                }
                else if (status.Status != "IPQC Confirm") {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="Edit(this, event)"><i class="bi bi-pen"></i></button>
                                  <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="Delete(this, event)"><i class="bi bi-trash"></i></button>
                               </td>`;
                }
                break
            }
            case 3: {
                if (status.Status == 'LineLeader Confirm') {
                    cButton = `<td class="action_col">
                                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                                  <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="Confirm(this, event)"><i class="bi bi bi-check"></i></button>
                                  <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="Rejects(this, event)"><i class="bi bi bi-x"></i></button>
                               </td>`;
                }
                else {
                    if (!item.BeginCodeImage || !item.EndCodeImage) {
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

// Add function
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();

    //Get Fill Data
    FillSaveData();

    // clear data input
    $("#formData [name]").each(function () {
        var elementName = $(this).attr("name");
        if (elementName != "Location") $(this).val('');
    });

    // clear user infor
    $('#UserInfo').hide();


    // clear image preview
    $('#BeginCell #BeginCodeImageButton').show();
    $('#BeginCell [class="deleteButton"]').hide();
    $('#BeginCell [class="previewContainer"]').html('');
    $('#BeginCell #BeginCodeImageFile').val('');

    $('#EndCell #EndCodeImageButton').show();
    $('#EndCell [class="deleteButton"]').hide();
    $('#EndCell [class="previewContainer"]').html('');
    $('#EndCell #EndCodeImageFile').val('');

    // clear save button
    $('#SaveBtn').data('id', null);
    $('#SaveBtn').data('index', null);
    $('#SaveBtn').data('type', 'Add');
    $('#SaveBtn').removeClass();
    $('#SaveBtn').addClass(['btn', 'btn-primary']);
    $('#SaveBtn').text('添新 Thêm mới');

    // status
    $('#formData [status]').hide();

    //set datetime and shift

    $('input[name="DateTime"]').val(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
    $('select[name="Shift"]').val(DayOrNightShift(new Date()));

    $('#DataFlowModal .modal-footer').show();

    $('#DataFlowModal').modal('show');
});
//Edit function
function Edit(elm, e) {
    e.preventDefault();

    // Get Fill data
    FillSaveData();

    const rowId = $(elm).data('id');
    const rowIndex = $(elm).closest('tr').index();

    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetDataFlow",
        data: { Id: rowId },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const data = res.data;

                //set datetime and shift
                {
                    var dateConvert = moment(data.DateTime).format('YYYY-MM-DDTHH:mm')
                    $('input[name="DateTime"]').val(dateConvert);
                    $('select[name="Shift"]').val(DayOrNightShift(new Date(dateConvert)));
                }
                // set each data
                {
                    $("#formData [name]").each(function () {
                        var elementName = $(this).attr("name");

                        if (elementName == "MO") {
                            $(this).val(data.MO);
                        }
                        if (elementName == "ProductName") {
                            $(this).val(data.ProductName);
                        }
                        if (elementName == "MO_Num") {
                            $(this).val(data.MO_Num);
                        }
                        if (elementName == "LableCode") {
                            $(this).val(data.LableCode);
                        }
                        if (elementName == "BeginCode") {
                            $(this).val(data.BeginCode);
                        }
                        if (elementName == "EndCode") {
                            $(this).val(data.EndCode);
                        }
                        if (elementName == "LablePrintNum") {
                            $(this).val(data.LablePrintNum);
                        }
                        if (elementName == "MOPrintNum") {
                            $(this).val(data.MOPrintNum);
                        }
                        if (elementName == "LableTable") {
                            $(this).val(data.LableTable);
                        }
                        if (elementName == "Note") {
                            $(this).val(data.Note);
                        }
                        if (elementName == "BarCode") {
                            $(this).val(data.BarCode);
                        }
                    });
                }
                // clear old status
                {
                    $('#UserInfo .form-control').each(function () {
                        $(this).html('');
                        $(this).removeClass(['confirm', 'reject']);
                    });
                    $('#UserInfo').show();
                }
                // user
                {
                    $('#UserInfo [user]').html(`
                    <p>${data.LableDataFlow_Status.UserCreate.UserCode}</p>  
                    <b><p>${data.LableDataFlow_Status.UserCreate.UserFullName}</p></b>
                `);
                }
                // line leader
                {
                    if (data.LableDataFlow_Status.LineLeader) {
                        if (data.LableDataFlow_Status.Status == 'LineLeader Confirm' || data.LableDataFlow_Status.Status == 'IPQC Confirm') {
                            $('#UserInfo [line]').html(`
                                <p>${data.LableDataFlow_Status.LineLeader.UserCode}</p>  
                                <b><p>${data.LableDataFlow_Status.LineLeader.UserFullName}</p></b>
                            `);
                            $('#UserInfo [line]').addClass('confirm');
                        }
                        else {
                            $('#UserInfo [line]').html(`
                                <p>${data.LableDataFlow_Status.LineLeader.UserCode} - <b>${data.LableDataFlow_Status.LineLeader.UserFullName}</b></p>
                                <p><b>Lý do: </b>${data.LableDataFlow_Status.Note}</p>
                            `);
                            $('#UserInfo [line]').addClass('reject');
                        }
                    }
                }
                // ipqc
                {
                    if (data.LableDataFlow_Status.IPQC) {
                        if (data.LableDataFlow_Status.Status == 'IPQC Confirm') {
                            $('#UserInfo [ipqc]').html(`
                                <p>${data.LableDataFlow_Status.IPQC.UserCode}</p>  
                                <b><p>${data.LableDataFlow_Status.IPQC.UserFullName}</p></b>
                            `);
                            $('#UserInfo [ipqc]').addClass('confirm');
                        }
                        else {
                            $('#UserInfo [ipqc]').html(`
                                <p>${data.LableDataFlow_Status.IPQC.UserCode} - <b>${data.LableDataFlow_Status.IPQC.UserFullName}</b></p>  
                                <p><b>Lý do: </b>${data.LableDataFlow_Status.Note}</p>
                            `);
                            $('#UserInfo [ipqc]').addClass('reject');
                        }
                    }
                }
                // status
                {
                    var badgeStyle = "";
                    var message = "";
                    switch (data.LableDataFlow_Status.Status) {
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

                    $('#formData [status]').html(`
                        <span class="d-block badge ${badgeStyle} status-custom">${message}</span>
                    `);

                    $('#formData [status]').show();
                }
                // image
                {
                    // img begin code
                    try {
                        if (data.BeginCodeImage == '') data.BeginCodeImage = null;
                        const imgBegin = $(`<img src="${data.BeginCodeImage.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
                        $('#BeginCell .previewContainer').html(imgBegin);
                        $('#BeginCell .previewContainer').show();
                        $('#BeginCell .deleteButton').show();
                        $('#BeginCodeImageButton').hide();

                        $(imgBegin).on('click', function () {
                            let image = $('#Image_Preview');
                            image.attr('src', $(imgBegin).attr('src'));
                            $(image).click();
                        });
                    }
                    catch {
                        $('#BeginCell .previewContainer').hide();
                        $('#BeginCell .deleteButton').hide();
                        $('#BeginCodeImageButton').show();
                    }

                    // img end code
                    try {
                        if (data.EndCodeImage == '') data.EndCodeImage = null;
                        const imgEnd = $(`<img src="${data.EndCodeImage.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
                        $('#EndCell .previewContainer').html(imgEnd);
                        $('#EndCell .previewContainer').show();
                        $('#EndCell .deleteButton').show();
                        $('#EndCodeImageButton').hide();

                        $(imgEnd).on('click', function () {
                            let image = $('#Image_Preview');
                            image.attr('src', $(imgEnd).attr('src'));
                            $(image).click();
                        });
                    } catch {
                        $('#EndCell .previewContainer').hide();
                        $('#EndCell .deleteButton').hide();
                        $('#EndCodeImageButton').show();
                    }
                }
                // button
                $('#DataFlowModal .modal-footer').show();
                $('#SaveBtn').data('id', rowId);
                $('#SaveBtn').data('index', rowIndex);
                $('#SaveBtn').data('type', 'Edit');
                $('#SaveBtn').removeClass('btn-primary');
                $('#SaveBtn').addClass('btn-warning');
                $('#SaveBtn').text('使固定 Sửa');
                // show
                $('#DataFlowModal').modal('show');
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
// Details function
function Details(elm, e) {
    e.preventDefault();

    const rId = $(elm).data('id');
    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetDataFlow",
        data: { Id: rId },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const data = res.data;

                //set datetime and shift
                {
                    var dateConvert = moment(data.DateTime).format('YYYY-MM-DDTHH:mm')
                    $('input[name="DateTime"]').val(dateConvert);
                    $('select[name="Shift"]').val(DayOrNightShift(new Date(dateConvert)));
                }
                // set each data
                {
                    $("#formData [name]").each(function () {
                        var elementName = $(this).attr("name");

                        if (elementName == "MO") {
                            $(this).val(data.MO);
                        }
                        if (elementName == "ProductName") {
                            $(this).val(data.ProductName);
                        }
                        if (elementName == "MO_Num") {
                            $(this).val(data.MO_Num);
                        }
                        if (elementName == "LableCode") {
                            $(this).val(data.LableCode);
                        }
                        if (elementName == "BeginCode") {
                            $(this).val(data.BeginCode);
                        }
                        if (elementName == "EndCode") {
                            $(this).val(data.EndCode);
                        }
                        if (elementName == "LablePrintNum") {
                            $(this).val(data.LablePrintNum);
                        }
                        if (elementName == "MOPrintNum") {
                            $(this).val(data.MOPrintNum);
                        }
                        if (elementName == "LableTable") {
                            $(this).val(data.LableTable);
                        }
                        if (elementName == "Note") {
                            $(this).val(data.Note);
                        }
                        if (elementName == "BarCode") {
                            $(this).val(data.BarCode);
                        }
                    });
                }
                // clear old status
                {
                    $('#UserInfo .form-control').each(function () {
                        $(this).html('');
                        $(this).removeClass(['confirm', 'reject']);
                    });
                    $('#UserInfo').show();
                }
                // user
                {
                    $('#UserInfo [user]').html(`
                        <p>${data.LableDataFlow_Status.UserCreate.UserCode}</p>  
                        <b><p>${data.LableDataFlow_Status.UserCreate.UserFullName}</p></b>
                    `);
                }
                // line leader
                {
                    if (data.LableDataFlow_Status.LineLeader) {
                        if (data.LableDataFlow_Status.Status == 'LineLeader Confirm' || data.LableDataFlow_Status.Status == 'IPQC Confirm' || data.LableDataFlow_Status.Status == 'IPQC Reject') {
                            $('#UserInfo [line]').html(`
                                <p>${data.LableDataFlow_Status.LineLeader.UserCode}</p>  
                                <b><p>${data.LableDataFlow_Status.LineLeader.UserFullName}</p></b>
                            `);
                            $('#UserInfo [line]').addClass('confirm');
                        }
                        else if (data.LableDataFlow_Status.Status == 'LineLeader Reject') {
                            $('#UserInfo [line]').html(`
                                <p>${data.LableDataFlow_Status.LineLeader.UserCode} - <b>${data.LableDataFlow_Status.LineLeader.UserFullName}</b></p>
                                <p><b>Lý do: </b>${data.LableDataFlow_Status.Note}</p>
                            `);
                            $('#UserInfo [line]').addClass('reject');
                        }
                    }
                }
                // ipqc
                {
                    if (data.LableDataFlow_Status.IPQC) {
                        if (data.LableDataFlow_Status.Status == 'IPQC Confirm') {
                            $('#UserInfo [ipqc]').html(`
                                <p>${data.LableDataFlow_Status.IPQC.UserCode}</p>  
                                <b><p>${data.LableDataFlow_Status.IPQC.UserFullName}</p></b>
                            `);
                            $('#UserInfo [ipqc]').addClass('confirm');
                        }
                        else if (data.LableDataFlow_Status.Status == 'IPQC Reject'){
                            $('#UserInfo [ipqc]').html(`
                                <p>${data.LableDataFlow_Status.IPQC.UserCode} - <b>${data.LableDataFlow_Status.IPQC.UserFullName}</b></p>  
                                <p><b>Lý do: </b>${data.LableDataFlow_Status.Note}</p>
                            `);
                            $('#UserInfo [ipqc]').addClass('reject');
                        }
                    }
                }
                // status
                {
                    var badgeStyle = "";
                    var message = "";
                    switch (data.LableDataFlow_Status.Status) {
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

                    $('#formData [status]').html(`
                        <p class="badge ${badgeStyle} status-custom">${message}</p>
                    `);
                    $('#formData [status]').show();
                }
                // image
                {
                    // img begin code
                    try {
                        if (data.BeginCodeImage == '') data.BeginCodeImage = null;
                        const imgBegin = $(`<img src="${data.BeginCodeImage.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);                      
                        $('#BeginCell .previewContainer').html(imgBegin);
                        $('#BeginCell .previewContainer').show();
                        $('#BeginCell .deleteButton').hide();
                        $('#BeginCodeImageButton').hide();

                        $(imgBegin).on('click', function () {
                            let image = $('#Image_Preview');
                            image.attr('src', $(imgBegin).attr('src'));
                            $(image).click();
                        });
                    }
                    catch {
                        $('#BeginCell .previewContainer').hide();
                        $('#BeginCell .deleteButton').hide();
                        $('#BeginCodeImageButton').hide();
                    }

                    // img end code
                    try {
                        if (data.EndCodeImage == '') data.EndCodeImage = null;
                        const imgEnd = $(`<img src="${data.EndCodeImage.replace(/^.*\\Areas/, "/Areas")}" class="previewImage">`);
                        $('#EndCell .previewContainer').html(imgEnd);
                        $('#EndCell .previewContainer').show();
                        $('#EndCell .deleteButton').hide();
                        $('#EndCodeImageButton').hide();

                        $(imgEnd).on('click', function () {
                            let image = $('#Image_Preview');
                            image.attr('src', $(imgEnd).attr('src'));
                            $(image).click();
                        });
                    } catch {
                        $('#EndCell .previewContainer').hide();
                        $('#EndCell .deleteButton').hide();
                        $('#EndCodeImageButton').hide();
                    }
                }
                // button
                $('#DataFlowModal .modal-footer').hide();
                // show
                $('#DataFlowModal').modal('show');
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
// Delete function
function Delete(elm, e) {
    e.preventDefault();

    const rowId = $(elm).data('id');
    const rowIndex = $(elm).closest('tr').index();

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
            //Xác nhận xóa:
            $.ajax({
                type: "POST",
                url: "/Lable/DataFlow/DeleteCheckList",
                data: { Id: rowId },
                success: function (res) {
                    if (res.status) {
                        Swal.fire("Xóa thành công", "", "success");
                        dataTable.rows().remove(rowIndex);
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", res.message, "error");
                    }
                },
                error: function (err) {
                    Swal.fire("Có lỗi xảy ra", GetInlineString(err.responseText, 'title'), "error");
                }
            });
        } else if (result.dismiss === "cancel") {
            //ko làm gì
        }
    });
}
// Confirm
function Confirm(elm, e) {
    e.preventDefault();

    const rowId = $(elm).data('id');
    const rowIndex = $(elm).closest('tr').index();


    var htmlstring = '';
    if ($('[name="Location"]').val() == "F06") {
        htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="No">No send mail</option>
                                      <option value="cpeii-vn-ipqc-netgear@mail.foxconn.com">IPQC Netgear</option>
                                  </select>`;
    }
    else {
        htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="No">No send mail</option>
                                  </select>`;
    }

    Swal.fire({
        title: 'Chọn mail để gửi đơn:',
        icon: "warning",
        html: htmlstring,
        confirmButtonText: 'Gửi',
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true,
        preConfirm: () => {
            if ($('#mailSelected').val()) {
                var SendData = {
                    Id: rowId,
                    Mail: $('#mailSelected').val()
                }
                $.ajax({
                    type: "POST",
                    url: "/Lable/DataFlow/Confirm",
                    data: JSON.stringify(SendData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        if (res.status) {
                            dataTable.rows().updateRow(rowIndex, DrawTableRows(res.data, true));
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
        }
    });

}
// Reject
function Rejects(elm, e) {
    e.preventDefault();

    const rowId = $(elm).data('id');
    const rowIndex = $(elm).closest('tr').index();


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
                    Id: rowId,
                    Note: $('#iPQCReasonReject').val()
                }
                $.ajax({
                    type: "POST",
                    url: "/Lable/DataFlow/Reject",
                    data: JSON.stringify(SendData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        if (res.status) {
                            dataTable.rows().updateRow(rowIndex, DrawTableRows(res.data, true));
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
        }
    });
}
// Create Or Update Data
function SaveLableDataFlow() {
    // Add
    if ($('#SaveBtn').data('type') == 'Add') {
        var formData = new FormData();

        $("#formData [name]").each(function () {

            var elementName = $(this).attr("name");
            var elementValue;

            if ($(this).is("td")) {
                elementValue = $(this).text();
            } else {
                elementValue = $(this).val();
            }
            formData.append('lableDataFlow.' + elementName, elementValue);
        });

        var BeginCodeImage = $('#BeginCodeImageFile')[0].files[0];
        var EndCodeImage = $('#EndCodeImageFile')[0].files[0];

        formData.append('BeginCodeImage', BeginCodeImage);
        formData.append('EndCodeImage', EndCodeImage);

        $.ajax({
            type: 'POST',
            url: '/Lable/DataFlow/AddNewCheckList',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.status) {
                    Swal.fire("Done!", "", "success");
                    $('#DataFlowModal').modal('hide');


                    dataTable.rows().add(DrawTableRows(res.data, true));

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
    if ($('#SaveBtn').data('type') == 'Edit') {
        var formData = new FormData();

        $("#formData [name]").each(function () {

            var elementName = $(this).attr("name");
            var elementValue;

            if ($(this).is("td")) {
                elementValue = $(this).text();
            } else {
                elementValue = $(this).val();
            }
            formData.append('lableDataFlow.' + elementName, elementValue);
        });

        const beginImageSrc = $('#BeginCell .previewImage').attr('src');
        const endImageSrc = $('#EndCell .previewImage').attr('src');
        var BeginCodeImage;
        var EndCodeImage;

        try {
            if (!beginImageSrc.includes('ImageData')) {
                BeginCodeImage = $('#BeginCodeImageFile')[0].files[0];
            }
        }
        catch { }
        try {
            if (!endImageSrc.includes('ImageData')) {
                EndCodeImage = $('#EndCodeImageFile')[0].files[0];
            }
        }
        catch { }

        formData.append('BeginCodeImage', BeginCodeImage);
        formData.append('EndCodeImage', EndCodeImage);
        formData.append('lableDataFlow.Id', $('#SaveBtn').data('id'))

        $.ajax({
            type: 'POST',
            url: '/Lable/DataFlow/UpdateCheckList',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.status) {
                    Swal.fire("Done!", "", "success");
                    $('#DataFlowModal').modal('hide');

                    dataTable.rows().updateRow($('#SaveBtn').data('index'), DrawTableRows(res.data, true));

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
}

// Fill Save Data
function FillSaveData() {
    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetSaveData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.status) {
                const list = res.data;

                $('#DataList_MO').html('');
                $('#DataList_ProductName').html('');
                $('#DataList_LableCode').html('');
                $('#DataList_LableTable').html('');

                const typeToIdMap = {
                    "MO": "#DataList_MO",
                    "ProductName": "#DataList_ProductName",
                    "LableCode": "#DataList_LableCode",
                    "LableTable": "#DataList_LableTable",
                };
                $('#DataList_MO').html('');

                list.forEach(function (item) {
                    const id = typeToIdMap[item.Type];
                    if (id) {
                        $(id).append($(`<option value="${item.Name}">${item.Name}</option>`));
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

// Sự kiện khi tải lên hình ảnh => thêm nút xoá + preview ảnh
var viewPreview;
$('#BeginCodeImageButton').on('click', function (e) {
    e.preventDefault();
    $('#BeginCodeImageFile').click();
});
$('#EndCodeImageButton').on('click', function (e) {
    e.preventDefault();
    $('#EndCodeImageFile').click();
});
function AddImageEvent() {
    {
        const cellBegin = $('#BeginCell');

        const input = $(cellBegin).find('input[type="file"]');
        const previewContainer = $(cellBegin).find('.previewContainer');
        const deleteButton = $(cellBegin).find('.deleteButton');

        input.on('change', function (event) {
            previewContainer.html('');
            previewContainer.show();
            deleteButton.css('display', 'block');
            $('#BeginCodeImageButton').hide();

            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = $('<img>');
                    img.attr('src', event.target.result);
                    img.addClass('previewImage');
                    previewContainer.append(img);

                    $(img).on('click', function (img) {
                        let image = $('#Image_Preview');
                        image.attr('src', event.target.result);
                        $(image).click();
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        deleteButton.on('click', function () {
            previewContainer.html('');
            deleteButton.css('display', 'none');
            input.val('');
            $('#BeginCodeImageButton').show();
        });
    }
    {
        const cellBegin = $('#EndCell');

        const input = $(cellBegin).find('input[type="file"]');
        const previewContainer = $(cellBegin).find('.previewContainer');
        const deleteButton = $(cellBegin).find('.deleteButton');

        input.on('change', function (event) {
            previewContainer.html('');
            previewContainer.show();
            deleteButton.css('display', 'block');
            $('#EndCodeImageButton').hide();

            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = $('<img>');
                    img.attr('src', event.target.result);
                    img.addClass('previewImage');
                    previewContainer.append(img);

                    $(img).on('click', function (img) {
                        let image = $('#Image_Preview');
                        image.attr('src', event.target.result);
                        $(image).click();
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        deleteButton.on('click', function () {
            previewContainer.html('');
            deleteButton.css('display', 'none');
            input.val('');
            $('#EndCodeImageButton').show();
        });
    }
   
}
$('#Image_Preview').on('click', function () {
    if (viewPreview) {
        viewPreview.destroy();
    }
    viewPreview = new Viewer(document.getElementById('Image_Preview'), {
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

function DayOrNightShift(date) {
    if (date.getHours() >= 7 && date.getHours() <= 19) {
        if (date.getHours() == 7 && date.getMinutes < 30) {
            return 'N';
        }
        else if (date.getHours() == 19 && date.getMinutes >= 30) {
            return 'N';
        }
        else {
            return 'D';
        }
    }
    else {
        return 'N';
    }
}
function GetInlineString(htmlString, elementName) {
    // Sử dụng biểu thức chính quy để trích xuất nội dung trong thẻ
    var regex = new RegExp(`<${elementName}>(.*?)<\/${elementName}>`);
    var match = regex.exec(htmlString);

    // Lấy nội dung đã trích xuất (nếu có)
    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Lỗi không xác định.";
    }
}