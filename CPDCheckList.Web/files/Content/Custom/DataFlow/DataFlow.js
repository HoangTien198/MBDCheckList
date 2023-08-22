
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
function LoadDataCheckList() {
    onload();
    var dateNow = new Date();
    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetDataFlowList",
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
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            endload();
        }
    });
}
function DynamicLoadTable() {
    const divElement = document.querySelector('.dataTable-container');
    divElement.addEventListener('scroll', function () {
        var scrollLenght = parseInt((divElement.scrollTop + divElement.clientHeight));
        var scrollHeight = parseInt(divElement.scrollHeight * 0.9);

        if (!isLoadingData && (scrollLenght > scrollHeight)) {
            isLoadingData = true;

            onload();

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
                url: "/Lable/DataFlow/GetDataFlowList",
                data: {
                    Location: dateData.Location,
                    Year: dateData.Year,
                    Month: dateData.Month,
                    Date: dateData.Date
                },
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    if (res.status) {
                        //var jsonCheckList = JSON.parse(response);

                        await $.each(res.data, async function (k, item) {
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
function CreateTable() {
    var scrollHeight = document.querySelector('#sidebar').offsetHeight - 200 + 'px';
    var myTable = document.querySelector('#table_DataFlow');
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

    var col_0 = `<td><label>${moment(item.DateTime).format('YYYY-MM-DD HH:mm')}</label></td>`;
    row.push(col_0); //col 1

    var col_1 = `<td class="text-center"><label>${(item.Shift == 'D') ? 'Ngày' : 'Đêm'}</label></td>`;
    row.push(col_1); //col 2

    var col_2 = `<td><label>${item.MO}</label></td>`;
    row.push(col_2); //col 3

    var col_3 = `<td><label>${item.ProductName}</label></td>`;
    row.push(col_3) // col 4

    var col_5 = `<td><label>${item.LableCode}</label></td>`;
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
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           </td>`;
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
                cButton = `<td class="action_col">
                              <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                           </td>`;
            }
        }
        else if ($('#thisUser').data('role') == '3'){
            if (item.LableDataFlow_Status.Status == 'LineLeader Confirm') {
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

    // clear data input
    $("#formData [name]").each(function () {
        $(this).val('');
    });
   
    // clear user infor
    $('#UserInfo [user]').html('');
    $('#UserInfo [user]').removeClass(['confirm', 'reject']);
    $('#UserInfo [line]').html('');
    $('#UserInfo [line]').removeClass(['confirm', 'reject']);
    $('#UserInfo [ipqc]').html('');
    $('#UserInfo [ipqc]').removeClass(['confirm', 'reject']);

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
    $('#SaveBtn').data('id', null);
    $('#SaveBtn').removeClass();
    $('#SaveBtn').addClass(['btn', 'btn-primary']);
    $('#SaveBtn').text('添新 Thêm mới');

    //set datetime and shift
    var DateNow = new Date();
    $('input[name="DateTime"]').val(moment(DateNow).format('YYYY-MM-DDTHH:mm'));
    if (DateNow.getHours() >= 7 && DateNow.getHours() <= 19) {
        if (DateNow.getHours() == 7 && DateNow.getMinutes < 30) {
            $('select[name="Shift"]').val('D');
        }
        else if (DateNow.getHours() == 19 && DateNow.getMinutes >= 30) {
            $('select[name="Shift"]').val('N');
        }
        else {
            $('select[name="Shift"]').val("D");
        }
    }
    else {
        $('select[name="Shift"]').val('N');
    }

    $('#DataFlowModal').modal('show');
});
function SaveLableDataFlow() {
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
            console.log(res);

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
            Swal.fire("Sorry, Something went wrong...", "warning");
        }
    });
}

//Edit function
function Edit(elm, e) {
    e.preventDefault();

    const rowId = $(elm).data('id');
    const rowIndex = $(elm).closest('tr').index();

    $('#SaveBtn').data('id', rowId);
    $('#SaveBtn').data('id', rowIndex);
    $('#SaveBtn').removeClass('btn-primary');
    $('#SaveBtn').addClass('btn-warning');
    $('#SaveBtn').text('使固定 Sửa');

    $.ajax({
        type: "GET",
        url: "/Lable/DataFlow/GetDataFlow",
        data: { Id: rowId },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log(res);

            const data = res.data;
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
            });


            $('#UserInfo div[class="form-control"]').each(function () {
                $(this).html('');
                $(this).removeClass(['confirm', 'reject']);
            });

            $('#UserInfo [user]').html(`
                <p>${data.LableDataFlow_Status.UserCreate.UserCode}</p>  
                <b><p>${data.LableDataFlow_Status.UserCreate.UserFullName}</p></b>
            `);

            if (data.LableDataFlow_Status.LineLeader && data.LableDataFlow_Status.Status == 'LineLeader Confirm') {
                $('#UserInfo [line]').html(`
                    <p>${data.LableDataFlow_Status.LineLeader.UserCode}</p>  
                    <b><p>${data.LableDataFlow_Status.LineLeader.UserFullName}</p></b>
                `);
                $('#UserInfo [line]').addClass('confirm');
            }
            else if (data.LableDataFlow_Status.LineLeader && data.LableDataFlow_Status.Status == 'LineLeader Reject') {
                $('#UserInfo [line]').html(`
                    <p>${data.LableDataFlow_Status.LineLeader.UserCode}</p>  
                    <b><p>${data.LableDataFlow_Status.LineLeader.UserFullName}</p></b>
                `);
                $('#UserInfo [line]').addClass('reject');
            }

            if (data.LableDataFlow_Status.IPQC && data.LableDataFlow_Status.Status == 'IPQC Confirm') {
                $('#UserInfo [ipqc]').html(`
                    <p>${data.LableDataFlow_Status.IPQC.UserCode}</p>  
                    <b><p>${data.LableDataFlow_Status.IPQC.UserFullName}</p></b>
                `);
                $('#UserInfo [ipqc]').addClass('confirm');
            }
            else if (data.LableDataFlow_Status.IPQC && data.LableDataFlow_Status.Status == 'IPQC Reject') {
                $('#UserInfo [ipqc]').html(`
                    <p>${data.LableDataFlow_Status.IPQC.UserCode}</p>  
                    <b><p>${data.LableDataFlow_Status.IPQC.UserFullName}</p></b>
                `);
                $('#UserInfo [ipqc]').addClass('reject');
            }
            


            $('#DataFlowModal').modal('show');
            endload();
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
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
            console.log(res);

            endload();
        },
        error: function (error) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
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