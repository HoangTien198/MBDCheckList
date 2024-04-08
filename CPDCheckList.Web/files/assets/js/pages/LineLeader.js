var shiftWork;
var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

var formCheckListOnTime = $('#formCheckListOnTime').html();

var isLoadingData = false;

$(document).ready(function () {
    $('#page_name').text(`Check List - ${$('#location').val()}`);
    loadDataCheckList();
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
                    var row = await DrawTableRowsLead(item);
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
            endload();
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
                            var row = await DrawTableRowsLead(item, true);
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

                var statusCheckList = jsonCheckList.StatusConfirm;
                $('.status-checklist').empty();
                //bindting status checklist
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
                if (statusCheckList == 0) {
                    //xóa form thời gian rút kiểm:
                    $("#modalCheckList .modal-body #formCheckListOnTime").html('');
                    //xóa hết các nút bấm:
                    $('#modalCheckList .modal-footer').children().remove();
                    //xóa hết các nút bấm:
                    $('#modalCheckList .modal-footer').append(`<button title="Xác nhận" data-id=${checkListId} class="btn btn-success" onclick="ConfirmCheckList(this, event, ${index})">Xác nhận</button>`);
                    $('#modalCheckList .modal-footer').append(`<button title="Không xác nhận" data-id=${checkListId} class="btn btn-danger"  onclick="RejectCheckList(this, event, ${index})">Không xác nhận</button>`);
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

                                    //binding chữ ký hoặc nút ký
                                    var arrTimeLine = $('.timeLine');
                                    for (var trTimeLine of arrTimeLine) {

                                        stt++;
                                        var arrInput = $(trTimeLine).parent().siblings().children();

                                        if (jsonCLOnTimes.length <= 0) {
                                            arrInput.each(function () {
                                                if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                    $(this).empty();
                                                    $(this).append(`<button data-checklistid="${checkListId}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary" onclick="ConfirmCheckListOnTime(this, event)"><i class="bi bi-pen"></i> Ký</button>`);
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
                                                if (item.StatusCheckListOnTime == 1) { //Chờ IPQC xác nhận
                                                    if ($(trTimeLine).data('timelineid') == item.TimeLineId) {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "PassQuantity") {
                                                                $(this).val(item.PassQuantity);
                                                                $(this).prop("disabled", true);
                                                            }
                                                            if ($(this).data('fieldname') == "FailQuantity") {
                                                                $(this).val(item.FailQuantity);
                                                                $(this).prop("disabled", true);
                                                            }
                                                            if ($(this).data('fieldname') == "ReasonAndSolution") {
                                                                $(this).val(item.ReasonAndSolution);
                                                                $(this).prop("disabled", true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderTestQuantity") {
                                                                $(this).val(item.LineLeaderTestQuantity);
                                                                $(this).prop("disabled", true);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                ($(this).append(`<span class="text-success">${item.LineLeaderConfirmByName}</span>`))

                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                ($(this).append(`<label class="badge bg-info">Chờ xác nhận</label>`))
                                                            }
                                                        })
                                                        break;
                                                    }
                                                    else {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<button data-checklistid="${checkListId}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary" onclick="ConfirmCheckListOnTime(this, event)"><i class="bi bi-pen"></i> Ký</button>`);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                //$(this).append(`<label class="badge bg-info">Chờ xác nhận</label>`);
                                                            }
                                                        })
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
                                                            if ($(this).data('fieldname') == "PinNG") {
                                                                $(this).val(item.PinNG);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "ProgramPassFail") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                            if ($(this).data('fieldname') == "Other") {
                                                                $(this).prop('disabled', true);
                                                            }
                                                        })
                                                        break;
                                                    }
                                                    else {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<button data-checklistid="${checkListId}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary" onclick="ConfirmCheckListOnTime(this, event)"><i class="bi bi-pen"></i> Ký</button>`);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                var passQty = $(this).closest('tr').find('[data-fieldname="PassQuantity"]').val();
                                                                $(this).empty();
                                                                if (passQty > 0) {
                                                                    $(this).append(`<label class="badge bg-info">Chờ xác nhận</label>`);
                                                                }                                                               
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
                                    console.log(e);
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
                        //xóa form thời gian rút kiểm:
                        $("#modalCheckList .modal-body #formCheckListOnTime").html('');
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
//click btn_Confirm_Checklist
function ConfirmCheckList(elm, e, index = null) {
    e.preventDefault();

    var checkListId = $(elm).data('id');
    if (index == null) {
        index = $(elm).closest('tr').index();
    }

    var htmlstring = '';
    if ($('#location').val() == "F06") {
        htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="">select mail</option>
                                      <option value="Arlo">Mail to IPQC_ARLO</option>
                                      <option value="Netgear">Mail to IPQC_NETGEAR</option>
                                  </select>`;
    }
    else {
        htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="">select mail</option>
                                      <option value="F17_IPQC">Mail to F17_IPQC</option>
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
            if (document.getElementById('mailSelected').value) {
                var SendData = {
                    checkListId: checkListId,
                    mailSelected: document.getElementById('mailSelected').value.trim()
                }
                $.ajax({
                    type: "POST",
                    url: "/BanDau/BanDau/ConfirmCheckListLineLeader",
                    data: JSON.stringify(SendData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (response) {
                        try {
                            if (response.status == 1) {

                                var jsonData = JSON.parse(response.Data);

                                dataTable.rows().updateRow(index, DrawTableRowsLead(jsonData, true));

                                Swal.fire("Thành công", "Đã hoàn thành xác nhận!", "success");
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
                Swal.showValidationMessage('Hãy chọn mail!');
            }
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
                    lineLeaderReasonReject: $('#iPQCReasonReject').val()
                }
                $.ajax({
                    type: "POST",
                    url: "/BanDau/BanDau/RejectCheckListLineLeader",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Senđata),
                    success: function (response) {
                        try {
                            if (response.status == 1) {
                                var jsonData = JSON.parse(response.Data);

                                dataTable.rows().updateRow(index, DrawTableRowsLead(jsonData, true));

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
    var cTable = $(elm).closest('tbody').find('tr');
    //binding data:
    var data = {};

    //lấy tất cả input:
    var arrFieldNameOnTime = $(elm).closest('tr').find('[data-fieldname]');

    //binding checkListOnTime
    await $.each(arrFieldNameOnTime, function (k, item) {
        if ($(item).data('fieldname') == "PassQuantity") {
            data.PassQuantity = parseInt($(item).val());
        }
        if ($(item).data('fieldname') == "FailQuantity") {
            data.FailQuantity = parseInt($(item).val());
        }
        if ($(item).data('fieldname') == "ReasonAndSolution") {
            data.ReasonAndSolution = $(item).val();
        }
        if ($(item).data('fieldname') == "LineLeaderTestQuantity") {
            data.LineLeaderTestQuantity = $(item).val();
        }
    });

    //validate empty:
    if (!data.PassQuantity) {
        Swal.fire("Empty", "Chưa lấy được giá trị ô hiệu suất thực tế!", "warning");
    }
    else {
        if(!data.LineLeaderTestQuantity) {
            Swal.fire("Empty", "Chưa lấy được giá trị ô số lượng kiểm tra mẫu!", "warning");
        }
            else {
            data.CheckListFirstId = $(elm).data('checklistid');
            data.timeLineId = $(elm).data('timelineid');

            var htmlstring = '';
            if ($('#location').val() == "F06") {
                htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="">select mail</option>
                                      <option value="Arlo">Mail to IPQC_ARLO</option>
                                      <option value="Netgear">Mail to IPQC_NETGEAR</option>
                                  </select>`;
            }
            else {
                htmlstring = `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                      <option value="">select mail</option>
                                      <option value="F17_IPQC">Mail to F17_IPQC</option>
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
                    if (document.getElementById('mailSelected').value) {
                        var mailSelected = document.getElementById('mailSelected').value.trim();
                        data.MailSelected = mailSelected.trim();
                        $.ajax({
                            type: "POST",
                            url: "/BanDau/BanDau/ConfirmCheckListOnTimeLineLeader",
                            data: JSON.stringify(data),
                            dataType: "json",//Kieu du lieu tra ve
                            contentType: "application/json;charset=utf-8",
                            success: function (response) {
                                try {
                                    if (response.status == 0) {
                                        Swal.fire("Lỗi", "Hiện tại chưa thể thực hiện kí, liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                                    }
                                    else {
                                        var userJson = JSON.parse(response.Data);
                                        var spanField_leader = $(elm).closest('tr').find('[data-fieldname="LineLeaderConfirmByName"]');
                                        var spanField_ipqc = $(elm).closest('tr').find('[data-fieldname="IPQCConfirmByName"]');

                                        $(spanField_leader).html(userJson.UserFullName);
                                        $(spanField_leader).addClass('text-success');



                                        $(spanField_ipqc).html('<label class="badge bg-info">Chờ xác nhận</label>');

                                        for (let i = 0; i < 4; i++) {
                                            $(arrFieldNameOnTime[i]).prop('disabled', true);
                                        }

                                        {
                                            //binding pass/fail quantity => tỉ lệ:
                                            var sumOfPassQuantity = 0;
                                            var sumOfFailQuantity = 0;

                                            $.each(cTable, (k, item) => {
                                                let iPass = $(item).find('[data-fieldname="PassQuantity"]').val();
                                                let iFail = $(item).find('[data-fieldname="FailQuantity"]').val();

                                                if (iPass != "") {
                                                    sumOfPassQuantity += parseInt(iPass);
                                                    sumOfFailQuantity += parseInt(iFail);
                                                }
                                            });

                                            $('.sumOfPassQuantity').empty();
                                            $('.sumOfPassQuantity').append(`<label class="badge bg-success">${sumOfPassQuantity}</label>`);
                                            $('.sumOfFailQuantity').empty();
                                            $('.sumOfFailQuantity').append(`<label class="badge bg-danger">${sumOfFailQuantity}</label>`);

                                            $('.ratioPass').empty();
                                            var ratio = parseFloat(((sumOfPassQuantity - sumOfFailQuantity) / sumOfPassQuantity) * 100).toFixed(2);
                                            if (ratio < 80) {
                                                $('.ratioPass').append(`<label class="badge bg-danger">${ratio}</label>`);

                                            }
                                            else if (ratio < 95) {
                                                $('.ratioPass').append(`<label class="badge bg-warning">${ratio}</label>`);
                                            }
                                            else {
                                                $('.ratioPass').append(`<label class="badge bg-success">${ratio}</label>`);
                                            }
                                        } // Tính lại tỷ lệ


                                        Swal.fire("SUCCESS", "Ký thành công", "success");
                                    }
                                } catch (e) {
                                    Swal.fire("Lỗi", "Có lỗi xảy ra, liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                                }
                            },
                            error: function (res) {
                                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                            }
                        });
                    } else {
                        Swal.showValidationMessage('Hãy chọn mail!');
                    }
                }
            })

        }
    }
}

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