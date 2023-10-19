$(function () {
    $('#page_name').text('物料異常需求申請單 Đơn xin nhu cầu vật liệu bất thường V9');

    LoadData();
});

// Create Table
var dataTable;
var isLoadingData = false;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

function LoadData() {
    onload();

    var data = {
        Location: $('#Location').val(),
        Year: thisYear,
        Month: thisMonth,
        Date: thisDay
    }

    $.ajax({
        type: "GET",
        url: "/SMT/UnusualMatReq/GetMatReqs",
        data: data,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: async function (res) {
            if (res.status) {
                const MatReqs = JSON.parse(res.data);

                await $.each(MatReqs, function (k, item) {
                    var row = DrawTableRows(item);
                    $('#table_MatReq-tbody').append(row);
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

        var items = $('#table_MatReq-tbody tr');

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
                url: "/SMT/UnusualMatReq/GetMatReqs",
                data: data,
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    if (res.status) {
                        const MatReqs = JSON.parse(res.data);

                        await $.each(MatReqs, function (k, item) {
                            var row = DrawTableRows(item);
                            $('#table_MatReq-tbody').append(row);
                        });

                        if (MatReqs.length > 0) {
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
    var myTable = document.querySelector('#table_MatReq');
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

    // 0 DaterReq 
    row.push(`<td>${moment(item.DaterReq).format('YYYY-MM-DD HH:mm') }</td>`);
    // 1 ModelName 
    row.push(`<td class="text-center">${item.ModelName}</td>`);
    // 2 MO 
    row.push(`<td class="text-center">${item.MO}</td>`);
    // 3 MatDesc 
    row.push(`<td>${item.MatDesc}</td>`);
    // 4 MatCode
    row.push(`<td>${item.MatCode}</td>`);
    // 5 Unit
    row.push(`<td>${item.Unit}</td>`);
    // 6 ActReqQty
    row.push(`<td>${item.ActReqQty}</td>`);
    // 7 Status
    row.push(`<td>Status</td>`);
    // 8 Action
    {
        var Button = `<td class="action_col">
                       <button title="Chi tiết" data-id=${item.Id} class="btn btn-info"    onclick="Details(this, event)"><i class="bi bi-info"></i></button>
                  </td>`;
        row.push(Button);
    }

    if (!isAddInDatatable) {
        return `<tr>${row}</tr>`;
    }
    else {
        return row;
    }
}

// Add new
$(document).on('click', '#btn_AddNew', function (e) {
    e.preventDefault();

    $('#MatReqModal').modal('show');
})

// Orther
function GetResponseError(htmlString, elementName) {
    var regex = new RegExp(`<${elementName}>(.*?)<\/${elementName}>`);
    var match = regex.exec(htmlString);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Unknown Error.";
    }
}