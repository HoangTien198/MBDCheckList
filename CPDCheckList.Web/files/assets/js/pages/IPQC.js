var shiftWork;
var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

var formCheckListOnTime = $('#formCheckListOnTime').html();

var isLoadingData = false;

$(document).ready(function () {
    $('#page_name').text(`Check List - ${$('#location').val()}`);
    loadDataCheckList();

    console.log(CheckShiftWork());

});

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
                    var row = await DrawTableRowsIPQC(item);
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
                            var row = await DrawTableRowsIPQC(item, true);
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

//DetailChecklist
function DetailsCheckList(elm, e) {
    e.preventDefault();
    $('#formCheckListOnTime').html('');

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
                $('.lineLeaderCheckName').empty();
                (jsonCheckList.LineLeaderConfirmByName) ? ($('.lineLeaderCheckName').append(`<span class="text-success">${jsonCheckList.LineLeaderConfirmByName}</span>`)) : ((jsonCheckList.LineLeaderRejectByName) ? ($('.lineLeaderCheckName').append(`<span class="text-danger"><b>Người từ chối đơn:</b> ${jsonCheckList.LineLeaderRejectByName}</span><br/><span><b>Lý do:</b> ${jsonCheckList.LineLeaderReasonReject}</span>`)) : ``);

                //binding iPQCCheck
                var arrIPQCCheck = $('.iPQCCheck');
                for (const item of arrIPQCCheck) {
                    if (statusCheckList == 2) {
                        $(item).empty();
                        $(item).append(`<span class="text-success"><i class="bi bi-check-lg"></i></span>`);
                    }

                    else
                        if (statusCheckList == 4) {
                            {
                                $(item).empty();
                                $(item).append(`<span class="text-danger"><i class="bi bi-x-lg"></i></span>`);
                            }
                        }
                        else {
                            $(item).empty();
                        }
                }
                $('.iPQCCheckName').empty();
                (jsonCheckList.IPQCConfirmByName) ? ($('.iPQCCheckName').append(`<span class="text-success">${jsonCheckList.IPQCConfirmByName}</span>`)) : ((jsonCheckList.IPQCRejectByName) ? ($('.iPQCCheckName').append(`<span class="text-danger"><b>Người từ chối đơn:</b> ${jsonCheckList.IPQCRejectByName}</span><br/><span><b>Lý do:</b> ${jsonCheckList.IPQCReasonReject}</span>`)) : ``);

                //binding nút bấm
                if (statusCheckList == 1) {
                    //xóa hết các nút bấm:
                    $('#modalCheckList .modal-footer').children().remove();
                    //xóa hết các nút bấm:
                    $('#modalCheckList .modal-footer').append(`<button title="Xác nhận" data-id=${checkListId} class="btn btn-success" onclick="ConfirmCheckList(this, event, ${index})">Xác nhận</button>`);
                    $('#modalCheckList .modal-footer').append(`<button title="Không xác nhận" data-id=${checkListId} class="btn btn-danger"  onclick="RejectCheckList(this, event, ${index})">Không xác nhận</button>`);
                    $('#modalCheckList .modal-footer').append(`<button title = "Đóng" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);

                    //show modal:
                    $("#modalCheckList").modal('show');

                }
                else
                    if (statusCheckList == 2) {
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
                                                                //($(this).append(`<span class="text-success">${item.IPQCConfirmByName}</span>`))
                                                                ($(this).append(`<button data-checklistontimeid="${item.CheckListOnTimeId}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary" onclick="ConfirmCheckListOnTime(this, event)"><i class="bi bi-pen"></i> Ký</button>`))
                                                            }
                                                        })
                                                        break;
                                                    }
                                                    else {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                //$(this).append(`<button data-timelineid="${stt}" title="Ký tên" class="btn btn-primary btn-confirm-checklist-ontime"><i class="icofont icofont-pencil"></i>Ký</button>`);
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
//Confirm Checklist
function ConfirmCheckList(elm, e, index = null) {
    e.preventDefault();

    var checkListId = $(elm).data('id');
    if (index == null) {
        index = $(elm).closest('tr').index();
    }

    $.ajax({
        type: "POST",
        url: "/BanDau/BanDau/IPQCConfirmCheckList",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ checkListId: checkListId }),
        success: function (response) {
            try {
                if (response.status == 1) {
                    var jsonData = JSON.parse(response.Data);

                    dataTable.rows().updateRow(index, DrawTableRowsIPQC(jsonData, true));

                    Swal.fire("Thành công", "Đã hoàn thành xác nhận", "success");
                    $("#modalCheckList").modal('hide');
                }
                else {
                    Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
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
//Reject CheckList
function RejectCheckList(elm, e, index = null) {
    e.preventDefault();
    $("#modalCheckList").modal('hide');
    var checkListId = $(elm).data('id');
    if (index == null) {
        index = $(elm).closest('tr').index();
    }

    Swal.fire({
        title: 'Lý do không xác nhận?',
        icon: "warning",
        html: '<textarea id="iPQCReasonReject" class="form-control" rows="5"></textarea>',
        confirmButtonText: 'Gửi',
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true,
        preConfirm: () => {
            if ($('#iPQCReasonReject').val()) {
                var Senđata = {
                    checkListId: checkListId,
                    iPQCReasonReject: $('#iPQCReasonReject').val()
                }
                $.ajax({
                    type: "POST",
                    url: "/BanDau/BanDau/IPQCRejectCheckList",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Senđata),
                    success: function (response) {
                        try {
                            if (response.status == 1) {
                                var jsonData = JSON.parse(response.Data);

                                dataTable.rows().updateRow(index, DrawTableRowsIPQC(jsonData, true));

                                Swal.fire("Thành công", "Đã từ chối đơn !", "success");
                                $("#modalCheckList").modal('hide');
                            }
                            else {
                                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
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
            } else {
                Swal.showValidationMessage('Hãy nhập vào lý do!');
            }
        }
    })
}
//confirm checklist ontime
async function ConfirmCheckListOnTime(elm, e) {
    e.preventDefault();

    //binding data:
    var checkListOnTime = {
        checkListOnTimeId: $(elm).data('checklistontimeid'),
        IPQCTestQuantity: -1,
        ICStatus: -1,
        PinNG: -1,
        ReasonAndSolution: ""
    };
    //lấy tất cả input:
    var arrFieldNameOnTime = $(elm).closest('tr').find('[data-fieldname]');

    //binding checkListOnTime
    await $.each(arrFieldNameOnTime, function (k, item) {
        if ($(item).data('fieldname') == "IPQCTestQuantity") {
            checkListOnTime.IPQCTestQuantity = parseInt($(item).val());
        }
        if ($(item).data('fieldname') == "ICStatus") {
            checkListOnTime.ICStatus = parseInt($(item).val());
        }
        if ($(item).data('fieldname') == "PinNG") {
            checkListOnTime.PinNG = parseInt($(item).val());
        }
        if ($(item).data('fieldname') == "ReasonAndSolution") {
            checkListOnTime.ReasonAndSolution = $(item).val();
        }
    });

    if (checkListOnTime.IPQCTestQuantity.toString() == "NaN") {
        Swal.fire("Lỗi", "Chưa nhập Số lượng kiểm tra mẫu", "error");
        return;
    }
    // Ký
    $.ajax({
        type: "POST",
        url: "/BanDau/BanDau/ConfirmCheckListOnTimeIPQC",
        data: JSON.stringify(checkListOnTime),
        dataType: "json",//Kieu du lieu tra ve
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            try {
                if (response.status == 0) {
                    Swal.fire("Lỗi", "Hiện tại chưa thể thực hiện kí, liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                }
                else {
                    var userJson = JSON.parse(response.Data);
                    var spanField = $(elm).closest('tr').find('[data-fieldname="IPQCConfirmByName"]');
                    $(spanField).html(userJson.UserFullName);
                    $(spanField).addClass('text-success');

                    $(arrFieldNameOnTime).prop('disabled', true);
                }
            } catch (e) {
                Swal.fire("Lỗi", "Có lỗi xảy ra, liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
            }
        },
        error: function (res) {
            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
        }
    });
}

