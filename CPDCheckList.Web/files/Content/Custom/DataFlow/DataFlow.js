
$(document).ready(function () {
    $('#page_name').text('Label 流水号登记表 Biểu lưu trình dữ liệu Label');
    LoadDataCheckList();

    $('#DataFlowModal').modal('show');

    ForcusInputEvent();
});

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


function SaveLableDataFlow() {
    var formHead = {};
    // Data header
    $("#formData [name]").each(function () {
        var elementName = $(this).attr("name");
        var elementValue;

        if ($(this).is("td")) {
            elementValue = $(this).text();
        } else {
            elementValue = $(this).val();
        }

        formHead[elementName] = elementValue;
    });

    console.log(formHead);
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
            Location: $('#thisLocation').val(),
            Year: dateNow.getFullYear(),
            Month: dateNow.getMonth() + 1,
            Date: dateNow.getDate()
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (response) {
            console.log(response);
            CreateTable();
            //if (response.status) {
            //    await $.each(response.data, function (k, item) {
            //        var row = DrawTableRows(item);
            //        $('#tbody_DataFlow').append(row);
            //    });
            //    CreateTable();
            //    DynamicLoadTable();
            //}
            //else {
            //    Swal.fire("Có lỗi xảy ra", response.message, "error");
                
            //}
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
                url: "/Lable/DataFlow/GetDataFlowList",
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

    var col_0 = `<td><label>${moment(item.CreatedDate).format('YYYY-MM-DD HH:mm')}</label></td>`;
    row.push(col_0); //col 0

    var col_1 = `<td><label>${item.MO}</label></td>`;
    row.push(col_1); //col 1

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
            case 'Đợi tuyến trưởng xác nhận': {
                badgeStyle = "bg-primary";
                break;
            }
            case 'Tuyến trưởng đã xác nhận': {
                badgeStyle = "bg-success";
                break;
            }
            case 'Chờ IPQC xác nhận': {
                badgeStyle = "bg-danger";
                break;
            }
            case 'IPQC đã xác nhận': {
                badgeStyle = "bg-danger";
                break;
            }
        }
        row.push(`<td class="text-center"><label class="badge ${badgeStyle}">${item.Status}</label></td>`);
    } // col 9

    {
        var cButton = "";
        //if ($('#thisUser').data('role') == '2' && item.LineLeaderId == $('#thisUser').data('id')) {
        //    if (item.Status == 'Pending') {
        //        cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Xác nhận" data-id=${item.Id} class="btn btn-warning" onclick="ApprovedRutKiem(this, event)"><i class="bi bi bi-check"></i></button>
        //                      <button title="Từ chối"  data-id=${item.Id} class="btn btn-danger"  onclick="RejectRutKiem(this, event)"><i class="bi bi bi-x"></i></button>
        //                   </td>`;
        //    }
        //    else {
        //        cButton = `<td class="action_col">
        //                      <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
        //                      <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="EditRutKiem(this, event)"><i class="bi bi-pen"></i></button>
        //                      <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="DeleteRutKiem(this, event)"><i class="bi bi-trash"></i></button>
        //                   </td>`;
        //    }
        //}
        //else if (item.Status == 'Pending' && item.CreatedUserId == $('#thisUser').data('id')) {
        //    cButton = `<td class="action_col">
        //                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
        //                  <button title="Sửa"      data-id=${item.Id} class="btn btn-warning" onclick="EditRutKiem(this, event)"><i class="bi bi-pen"></i></button>
        //                  <button title="Xóa"      data-id=${item.Id} class="btn btn-danger"  onclick="DeleteRutKiem(this, event)"><i class="bi bi-trash"></i></button>
        //               </td>`;
        //}
        //else {
        //    cButton = `<td class="action_col">
        //                  <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="DetailsRutKiem(this, event)"><i class="bi bi-info"></i></button>
        //               </td>`;
        //}
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
    //SetWithDrawalDataToModal('formData', null, 'add');

    //$('input[name="Id"]').val('');
    //$('input[name="Status"]').val('Pending');
    //$('#WdIndex').val('');
    //$('input[name="CreatedDate"]').val(moment(new Date()).format('YYYY-MM-DDTHH:mm'));

    //var title = $('#WithDrawalModal .modal-title');
    //title.text('THÊM MỚI BIỂU RÚT KIỂM');
    //title.removeClass();
    //title.addClass(['modal-title', 'text-primary']);

    //$('#WithDrawalModal .modal-footer').show();
    $('#DataFlowModal').modal('show');
});