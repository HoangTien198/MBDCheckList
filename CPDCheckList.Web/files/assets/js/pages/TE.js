var formMode = "add";
var shiftWork;
var checkListFirstId_Edit;

var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

var formCheckListOnTime = $('#formCheckListOnTime').html();

var isLoadingData = false;

$(document).ready(function () {
    $('#page_name').text(`Check List - ${$('#location').val()}`);
    loadDataCheckList();

    
})

//load data
function loadDataCheckList() {
    onload();
    $.ajax({
        type: "Get",
        url: "/CheckList/GetAllCheckListFirst",
        data: {
            location: $('[data-location]').data('location'),
            year: thisYear,
            month: thisMonth,
            day: thisDay
        },
        contentType: "application/json;charset=utf-8",
        success: async function (response) {
            try {
                var jsonCheckList = JSON.parse(response);

                await $.each(jsonCheckList, async function (k, item) {
                    var row = await DrawTableRowsWork(item);
                    $('#tbody_checklist').append(row);
                });
                CreateCheckListTable();
                DynamicLoadCheckList();
                endload();
            }
            catch (ex) {
                endload();
                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            }
        },
        error: function (err) {
            // endload();
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
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

            thisMonth -= 1;
            if (thisMonth == 0) {
                thisYear -= 1;
                thisMonth = 12;
            }

            $.ajax({
                type: "Get",
                url: "/CheckList/GetAllCheckListFirst",
                data: {
                    location: $('[data-location]').data('location'),
                    year: thisYear,
                    month: thisMonth,
                    day: -1
                },
                contentType: "application/json;charset=utf-8",
                success: async function (response) {
                    try {
                        var jsonCheckList = JSON.parse(response);

                        await $.each(jsonCheckList, async function (k, item) {
                            var row = await DrawTableRowsWork(item, true);
                            dataTable.rows().add(row, true);
                        });

                        if (jsonCheckList.length > 0) {
                            isLoadingData = false;
                        }
                        endload();
                    }
                    catch (ex) {
                        endload();
                        Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                    }
                },
                error: function (err) {
                    endload();
                    Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                }
            });
        }
    });
}

// Show modal add new check list
$(document).on('click', '#btn_AddNew', function () {
    $("#formCheckListOnTime").html('');
    $("#formAddCheckList .badge").html('');
    $("#formAddCheckList span").html('');

    //reset form:
    $("#formAddCheckList").trigger('reset');

    $.ajax({
        type: "GET",
        url: "/BanDau/BanDau/GetThisUser",
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            //binding datetime-local:
            var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");

            //binding thời gian + ca làm việc
            var dateTimeInput = $('#modalCheckList').find('[data-fieldname="DateTECreated"]');
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            $(dateTimeInput).val(now.toISOString().slice(0, 16));

            var shiftInput = $('#modalCheckList').find('[data-fieldname="ShiftWork"]');
            if (compareTime(`${new Date().toLocaleTimeString().split(' ')[0]}`, '19:30:00')) {
                $(shiftInput).val(2);//đêm
            }
            else {
                $(shiftInput).val(1);//ngày
            }

            var Created = $('#modalCheckList').find('[data-fieldname="TECreatedBy"]');
            $(Created).val(res.Data);
            $(Created).data('userid', res.userId);
           

            $('#modalCheckList .modal-footer').children().remove();
            $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-default waves-effect" id="btn_SendFormClose" >Close</button>`);
            $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-primary waves-effect" id="btn_SendFormCreate">Send</button>`);
            var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");
            for (const item of arrFieldName) {
                $(item).prop('disabled', false);
            }
            $(Created).prop('disabled', true);
            formMode = 'add';

            $('#modalCheckList').modal('show');
        },
        error: function (res) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
        }
    });
});
$(document).on('click', '#btn_SendFormClose', function () {
    $('#modalCheckList').modal('hide');
});

//DetailChecklist
function DetailsCheckList(elm, e) {
    e.preventDefault();

    var checkListId = $(elm).data('id');
    var index = $(elm).closest('tr').index();
    //gọi ajax binding form data
    $.ajax({
        type: "Get",
        url: "/CheckList/GetCheckListById",
        contentType: "application/json;charset=utf-8",
        data: { checklistId: checkListId },
        success: function (response) {
            try {
                var jsonCheckList = JSON.parse(response.Data);
                shiftWork = jsonCheckList.ShiftWork;//1: Ngày, 2:Đêm

                var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");
                //binding form data
                for (const item of arrFieldName) {
                    $(item).prop('disabled', true);
                    const fieldName = $(item).data('fieldname');
                    const fieldValue = jsonCheckList[fieldName];

                    $(item).val(fieldValue);

                    if (fieldName == "DateTECreated") {
                        $(item).val(jsonCheckList.ChecklistCreateDate);
                    }
                    else if (fieldName == "TECreatedBy") {
                        $(item).val(response.User);
                        $(item).data('userid', jsonCheckList.TECreatedBy);
                    }
                }
                //bindting status checklist
                var statusCheckList = jsonCheckList.StatusConfirm;
                $('.status-checklist').empty();

                switch (statusCheckList) {
                    case 0: {
                        $('.status-checklist').append(`<span class="badge bg-info"><i class="bi bi-star me-1"></i> Chờ chuyền trưởng xác nhận</span>`);
                        break;
                    }
                    case 1: {
                        $('.status-checklist').append(`<span class="badge bg-warning"><i class="bi bi-star me-1"></i> Chờ IPQC xác nhận</span>`);
                        break;
                    }
                    case 2: {
                        $('.status-checklist').append(`<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i> IPQC đã xác nhận</span>`);
                        break;
                    }
                    case 3: {
                        $('.status-checklist').append(`<span class="badge bg-danger"><i class="bi bi-exclamation-octagon me-1"></i> Chuyền trưởng đã từ chối đơn</span>`);
                        break;
                    }
                    case 4: {
                        $('.status-checklist').append(`<span class="badge bg-danger"><i class="bi bi-exclamation-octagon me-1"></i> IPQC đã từ chối đơn</span>`);
                        break;
                    }
                }

                //binding lineleaderCheck
                var arrLineLeaderCheck = $('.lineLeaderCheck');
                for (const item of arrLineLeaderCheck) {
                    if (statusCheckList == 1 || statusCheckList == 2 || statusCheckList == 4) {
                        $(item).empty();
                        $(item).append(`<span class="text-success"><i class="bi bi-check-lg"></i></span>`);
                    }
                    else if (statusCheckList == 3) {
                        {
                            $(item).empty();
                            $(item).append(`<span class="text-danger"><i class="bi bi-x-lg"></i></span>`);
                        }
                    }
                    else {
                        $(item).empty();
                    }
                }              
                //binding iPQCCheck
                var arrIPQCCheck = $('.iPQCCheck');
                for (const item of arrIPQCCheck) {
                    if (statusCheckList == 2) {
                        $(item).empty();
                        $(item).append(`<span class="text-success"><i class="bi bi-check-lg"></i></span>`);
                    }
                    else if (statusCheckList == 4) {
                        {
                            $(item).empty();
                            $(item).append(`<span class="text-danger"><i class="bi bi-x-lg"></i></span>`);
                        }
                    }
                    else {
                        $(item).empty();
                    }
                }
                $('.lineLeaderCheckName').empty();
                if (jsonCheckList.LineLeaderConfirmByName) {
                    $('.lineLeaderCheckName').append(`<span class="text-success">${jsonCheckList.LineLeaderConfirmByName}</span>`);
                } else if (jsonCheckList.LineLeaderRejectByName) {
                    $('.lineLeaderCheckName').append(`<span class="text-danger"><b>Người từ chối đơn:</b> ${jsonCheckList.LineLeaderRejectByName}</span><br/><span><b>Lý do:</b> ${jsonCheckList.LineLeaderReasonReject}</span>`);
                }

                $('.iPQCCheckName').empty();
                if (jsonCheckList.IPQCConfirmByName) {
                    $('.iPQCCheckName').append(`<span class="text-success">${jsonCheckList.IPQCConfirmByName}</span>`);
                } else if (jsonCheckList.IPQCRejectByName) {
                    $('.iPQCCheckName').append(`<span class="text-danger"><b>Người từ chối đơn:</b> ${jsonCheckList.IPQCRejectByName}</span><br/><span><b>Lý do:</b> ${jsonCheckList.IPQCReasonReject}</span>`);
                }

                //binding nút bấm
                if (statusCheckList == 1) {
                    //xóa hết các nút bấm:
                    $('#modalCheckList .modal-footer').children().remove();
                    //xóa hết các nút bấm:
                    //$('#modalCheckList .modal-footer').append(`<button title="Xác nhận" data-id=${checkListId} class="btn btn-success" onclick="ConfirmCheckList(this, event, ${index})">Xác nhận</button>`);
                    //$('#modalCheckList .modal-footer').append(`<button title="Không xác nhận" data-id=${checkListId} class="btn btn-danger"  onclick="RejectCheckList(this, event, ${index})">Không xác nhận</button>`);
                    $('#modalCheckList .modal-footer').append(`<button title = "Đóng" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);

                    //show modal:
                    $("#modalCheckList").modal('show');

                }
                else if (statusCheckList == 2) {
                        //binding form thời gian rút kiểm:
                        $.ajax({
                            type: "GET",
                            url: "/Home/GetAllCheckListOnTime",
                            contentType: "application/json;charset=utf-8",
                            data: {
                                checkListFirstId: checkListId
                            },
                            dataType: "text",//Kieu du lieu tra ve
                            contentType: "application/json",
                            success: function (response) {
                                try {
                                    var jsonCLOnTimes = JSON.parse(response);

                                    $('#formCheckListOnTime').html(formCheckListOnTime);

                                    var stt = 0;
                                    //binding chữ ký hoặc nút ký:

                                    var arrTimeLine = $('.timeLine');
                                    for (var trTimeLine of arrTimeLine) {
                                        stt++;
                                        var arrInput = $(trTimeLine).parent().siblings().children();
                                        if (jsonCLOnTimes.length <= 0) {
                                            arrInput.each(function () {
                                                if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                    $(this).empty();
                                                    $(this).append(`<label class="badge bg-info">Chờ chuyền trưởng xác nhận</label>`);
                                                }
                                            })

                                            //xóa những timeLine không ở trong ca làm việc
                                            if (shiftWork == 1) {
                                                $('.timeLineNight').remove();
                                            }
                                            if (shiftWork == 2) {
                                                $('.timeLineDay').remove();
                                            }
                                        }
                                        else {
                                            for (const item of jsonCLOnTimes) {
                                                if (item.StatusCheckListOnTime == 1) {//chờ IPQC xác nhận
                                                    if ($(trTimeLine).data('timelineid') == item.TimeLineId) {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "PassQuantity") {
                                                                $(this).val(item.PassQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "FailQuantity") {
                                                                $(this).val(item.FailQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ReasonAndSolution") {
                                                                $(this).val(item.ReasonAndSolution);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderTestQuantity") {
                                                                $(this).val(item.LineLeaderTestQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                ($(this).append(`<span class="text-success">${item.LineLeaderConfirmByName}</span>`))
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<label class="badge bg-info">Chờ IPQC xác nhận</label>`);
                                                                //($(this).append(`<button data-checklistontimeid="${item.CheckListOnTimeId}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary" onclick="ConfirmCheckListOnTime(this, event)"><i class="bi bi-pen"></i> Ký</button>`))
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCTestQuantity") {
                                                                $(this).empty();
                                                                $(this).val(item.IPQCTestQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ICStatus") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ProgramPassFail") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Other") {
                                                                $(this).prop('disabled', true);
                                                            }

                                                            if ($(this).data('fieldname') == "PinNG") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).prop('disabled', true);
                                                            }
                                                        })
                                                        break;
                                                    }
                                                    else {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<label class="badge bg-info">Chờ IPQC xác nhận</label>`);
                                                            }
                                                        });
                                                    }
                                                }

                                                if (item.StatusCheckListOnTime == 2) {//IPQC đã xác nhận
                                                    if ($(trTimeLine).data('timelineid') == item.TimeLineId) {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "PassQuantity") {
                                                                $(this).val(item.PassQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "FailQuantity") {
                                                                $(this).val(item.FailQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ReasonAndSolution") {
                                                                $(this).val(item.ReasonAndSolution);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderTestQuantity") {
                                                                $(this).val(item.LineLeaderTestQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<span class="text-success">${item.LineLeaderConfirmByName}</span>`);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCTestQuantity") {
                                                                $(this).empty();
                                                                $(this).val(item.IPQCTestQuantity);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<span class="text-success">${item.IPQCConfirmByName}</span>`)
                                                            }
                                                            if ($(this).data('fieldname') == "ICStatus") {
                                                                $(this).val(item.ICStatus);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ProgramPassFail") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Other") {
                                                                $(this).prop('disabled', true);
                                                            }

                                                            if ($(this).data('fieldname') == "PinNG") {
                                                                $(this).val(item.PinNG);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                                $(this).prop('disabled', true);
                                                            }
                                                        })
                                                        break;
                                                    }
                                                    else {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<label class="badge bg-info">Chờ xác nhận</label>`);
                                                            }
                                                        })
                                                    }
                                                }

                                            }

                                            //xóa những timeLine không ở trong ca làm việc
                                            if (shiftWork == 1) {
                                                $('.timeLineNight').remove();
                                            }
                                            if (shiftWork == 2) {
                                                $('.timeLineDay').remove();
                                            }
                                        }

                                    }


                                    //binding pass/fail quantity => tỉ lệ:
                                    var sumOfPassQuantity = 0;
                                    var sumOfFailQuantity = 0;
                                    sumOfPassQuantity = jsonCLOnTimes.map(a => a.PassQuantity).reduce((a, b) => a + b, 0);
                                    sumOfFailQuantity = jsonCLOnTimes.map(a => a.FailQuantity).reduce((a, b) => a + b, 0);
                                    $('.sumOfPassQuantity').empty();
                                    $('.sumOfPassQuantity').append(`<label class="badge bg-success">${sumOfPassQuantity}</label>`);
                                    $('.sumOfFailQuantity').empty();
                                    $('.sumOfFailQuantity').append(`<label class="badge bg-danger">${sumOfFailQuantity}</label>`);
                                    $('.ratioPass').empty();
                                    var ratio = parseFloat(((sumOfPassQuantity - sumOfFailQuantity) / sumOfPassQuantity) * 100).toFixed(2);
                                    (ratio < 80) ? ($('.ratioPass').append(`<label class="badge bg-danger">${ratio}</label>`)) : ((ratio < 95) ? ($('.ratioPass').append(`<label class="badge bg-warning">${ratio}</label>`)) : ($('.ratioPass').append(`<label class="badge bg-success">${ratio}</label>`)));
                                } catch (e) {

                                }
                            },
                            error: function (res) {

                                alert('fail');
                            }
                        });
                        //xóa hết các nút bấm:
                        $('#modalCheckList .modal-footer').children().remove();
                        $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);
                        //show modal:
                        $("#modalCheckList").modal('show');

                }
                else {
                        //xóa hết các nút bấm:
                        $('#modalCheckList .modal-footer').children().remove();
                        $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);
                        //show modal:
                        $("#modalCheckList").modal('show');
                    }

            }
            catch (ex) {
                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            }

        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
        }
    });
}

// Send data checklist
$(document).on("click", "#btn_SendFormCreate", function () {
    var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");
    var rowIndex = $(this).data('index');
    //binding data
    var checkList = {}

    for (const item of arrFieldName) {
        $(item).prop('disabled', true);
        const fieldName = $(item).data('fieldname');

        if (fieldName == "TECreatedBy") {
            checkList[fieldName] = $(item).data('userid');
        }
        else if (fieldName == "DateTECreated") {
            checkList.ChecklistCreateDate = $(item).val();
        }
        else {
            checkList[fieldName] = $(item).val();
        }
    }

    checkList.Location = $('#location').val();
    if (formMode != 'add') checkList.CheckListFirstId = parseInt($(this).data('id'));

    //validate data:
    if (!validateField(checkList.MO, "MO", "MO không được để trống!")) return;
    if (!validateField(checkList.ChecklistCreateDate, "Thời gian", "Thời gian không được để trống!")) return;
    if (!validateField(checkList.ShiftWork, "Ca làm việc", "Chưa chọn ca làm việc")) return;
    if (!validateField(checkList.ModelName, "Tên hàng", "Tên hàng không được để trống!")) return;
    if (!validateField(checkList.ProgramName, "Tên chương trình", "Tên chương trình không được để trống!")) return;
    if (!validateField(checkList.Checksum, "Checksum", "Checksum không được để trống!")) return;
    if (!validateField(checkList.MaterialCode, "Mã liệu", "Mã liệu không được để trống!")) return;
    if (!validateField(checkList.MaterialCodeProducer, "Mã liệu của nhà sản xuất", "Mã liệu của nhà sản xuất không được để trống!")) return;
    if (!validateField(checkList.MachineCode, "Số máy", "Số máy không được để trống!")) return;
    if (!validateField(checkList.ICColor, "Màu sắc của IC", "Màu sắc của IC không được để trống!")) return;
    if (!validateField(checkList.CheckESD, "Check ESD", "Check ESD chưa được chọn!")) return;

    // Ajax calling
    var data = {
        checkList: checkList,
        mode: formMode
    };

    $.ajax({
        type: "POST",
        url: "/BanDau/BanDau/SaveCheckListFirst",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            if (res.status) {
                Swal.fire("Thành công", "Thành công, chờ chuyền trưởng và IPQC xác nhận", "success");
                $('#btn_SendFormClose').click();

                if (formMode == 'add') {
                    GetDatatable().rows().add(DrawTableRowsWork(JSON.parse(res.data), true));
                }
                else {
                    GetDatatable().rows().updateRow(rowIndex, DrawTableRowsWork(JSON.parse(res.data), true));
                }              
            }
            else {
                Swal.fire("Có lỗi xảy ra", res.message, "error");
            }
        },
        error: function (res) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
        }
    });
});
function validateField(fieldValue, fieldName, errorMessage) {
    if (!fieldValue.trim()) {
        Swal.fire("Empty", errorMessage, "warning");
        return false;
    }
    return true;
}


// Show edit modal
function EditCheckList(elm, e) {
    formMode = 'edit';
    checkListFirstId_Edit = parseInt($(elm).data('id'));
    var rowIndex = $(elm).closest('tr').index();

    $('#btn_SendFormCreate').data('id', checkListFirstId_Edit);
    $('#btn_SendFormCreate').data('index', rowIndex);
   
    //Delete formCheckListOnTime
    $("#formCheckListOnTime").html('');
    $("#formAddCheckList span").html('');

    //Remve and append button
    $('#modalCheckList .modal-footer').children().remove();
    $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-default waves-effect" id="btn_SendFormClose">Close</button>`);
    $('#modalCheckList .modal-footer').append(`<button type="button" id="btn_SendFormCreate" data-id="${checkListFirstId_Edit}" data-index="${rowIndex}" class="btn btn-primary waves-effect waves-light">Send</button>`);
    //gọi ajax binding form data
    $.ajax({
        type: "Get",
        url: "/CheckList/GetCheckListById",
        data: { checklistId: checkListFirstId_Edit },
        success: function (response) {
            var jsonCheckList = JSON.parse(response.Data);
            var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");

            //binding form data
            for (const item of arrFieldName) {
                $(item).prop('disabled', false);
                if ($(item).data('fieldname') == "MO") {
                    $(item).val(jsonCheckList.MO);
                }
                if ($(item).data('fieldname') == "DateTECreated") {
                    $(item).val(jsonCheckList.ChecklistCreateDate);
                }
                if ($(item).data('fieldname') == "ShiftWork") {
                    $(item).val(jsonCheckList.ShiftWork);
                }
                if ($(item).data('fieldname') == "ModelName") {
                    $(item).val(jsonCheckList.ModelName);
                }
                if ($(item).data('fieldname') == "ProgramName") {
                    $(item).val(jsonCheckList.ProgramName);
                }
                if ($(item).data('fieldname') == "SoftwareName") {
                    $(item).val(jsonCheckList.SoftwareName);
                }
                if ($(item).data('fieldname') == "Checksum") {
                    $(item).val(jsonCheckList.Checksum);
                }
                if ($(item).data('fieldname') == "MaterialCode") {
                    $(item).val(jsonCheckList.MaterialCode);
                }
                if ($(item).data('fieldname') == "MaterialCodeProducer") {
                    $(item).val(jsonCheckList.MaterialCodeProducer);
                }
                if ($(item).data('fieldname') == "MachineCode") {
                    $(item).val(jsonCheckList.MachineCode);
                }
                if ($(item).data('fieldname') == "ICColor") {
                    $(item).val(jsonCheckList.ICColor);
                }
                if ($(item).data('fieldname') == "PersonalColor") {
                    $(item).val(jsonCheckList.PersonalColor);
                }
                if ($(item).data('fieldname') == "CheckESD") {
                    $(item).val(jsonCheckList.CheckESD);
                }
                if ($(item).data('fieldname') == "TECreatedBy") {
                    $(item).attr('data-userid', jsonCheckList.TECreatedBy);
                    $(item).val(jsonCheckList.TeCreatedByName)
                }
            }
            //binding nút bấm
            if (jsonCheckList.StatusConfirm == 0) {
                $("#modalCheckList").modal('show');
            }
            else {
                //xóa hết các nút bấm:
                $('#modalCheckList .modal-footer').children().remove();
                $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-default waves-effect " data-dismiss="modal">Đóng</button>`);
                //show modal:
                $("#modalCheckList").modal('show');
            }
        },
        error: function (err) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. SDT: 31746", "error");
        }
    });
};

// Delete
function DeleteCheckList(elm, e) {
    var checkListId = parseInt($(elm).data('id'));
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
            //Xác nhận xóa:
            $.ajax({
                type: "POST",
                url: "/BanDau/BanDau/DeleteCheckList",
                data: { checkListId: checkListId },
                success: function (response) {
                    if (response == 1) {
                        Swal.fire("Xóa thành công", "Đã xóa!", "success");
                        GetDatatable().rows().remove(rowIndex);
                    }
                    else {
                        Swal.fire("Có lỗi xảy ra!", "Liên hệ bộ phận CPD-AIOT để được hỗ trợ! SDT: 31746", "error");
                    }
                },
                error: function (res) {
                    Swal.fire("Server Error!", "Có lỗi xảy ra. Hãy thử bấm 'Ctrl + F5' để tải lại trang hoặc liên hệ bộ phận CPD-AIOT để được hỗ trợ! SDT: 31746", "error");
                }
            });
        } else if (result.dismiss === "cancel") {
            //ko làm gì
        }
    });
}


