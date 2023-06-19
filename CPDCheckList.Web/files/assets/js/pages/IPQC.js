var shiftWork;
var thisYear = new Date().getFullYear();
var thisMonth = new Date().getMonth() + 1;
var thisDay = new Date().getDate();

var isLoadingData = false;

$(document).ready(function () {
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
    $("#modalCheckList .modal-body #formCheckListOnTime").remove();
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
                var jsonCheckList = JSON.parse(response);
                shiftWork = jsonCheckList.ShiftWork;//1: Ngày, 2:Đêm

                var arrFieldName = $("#formAddCheckList input,#formAddCheckList select");
                //binding form data
                for (const item of arrFieldName) {
                    $(item).prop('disabled', true);
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
                    if ($(item).data('fieldname') == "TestQuantityFirst") {
                        $(item).val(jsonCheckList.TestQuantityFirst);
                    }
                }


                //bindting status checklist
                var statusCheckList = jsonCheckList.StatusConfirm;
                $('.status-checklist').empty();

                (statusCheckList == 0) ? ($('.status-checklist').append(`<span class="badge bg-info"><i class="bi bi-star me-1"></i> Chờ chuyền trưởng xác nhận</span>`))
                    : ((statusCheckList == 1) ? ($('.status-checklist').append(`<span class="badge bg-warning"><i class="bi bi-star me-1"></i> Chờ IPQC xác nhận</span>`))
                        : ((statusCheckList == 2) ? ($('.status-checklist').append(`<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i> IPQC đã xác nhận</span>`))
                            : ((statusCheckList == 3) ? ($('.status-checklist').append(`<span class="badge bg-danger"><i class="bi bi-exclamation-octagon me-1"></i> Chuyền trưởng đã từ chối đơn</span>`))
                                : ($('.status-checklist').append(`<span class="badge bg-danger"><i class="bi bi-exclamation-octagon me-1"></i> IPQC đã từ chối đơn</span>`)))));

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

                                    //form thời gian rut kiem
                                    var formCheckListOnTimeHTML = $(`<div id="formCheckListOnTime">
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <!-- Thời gian rút kiểm -->
                                                                        <div class="card-block">
                                                                            <div class="table-responsive">
                                                                                <table class="table table-bordered" id="example-1">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>時間</th>
                                                                                            <th>實際產出</th>
                                                                                            <th>不良數</th>
                                                                                            <th>未達成原因</th>
                                                                                            <th colspan="8">时段抽检数量（抽检数量为时段产能1%以上）<br />Kiểm tra mẫu theo thời gian, tỉ lệ rút kiểm 1% trở lên</th>
                                                                                        </tr>
                                                                                        <tr class="trOnTime">
                                                                                            <th rowspan="2">Thời gian</th>
                                                                                            <th rowspan="2">Hiệu suất thực tế</th>
                                                                                            <th rowspan="2">Số lượng lỗi</th>
                                                                                            <th rowspan="2">Nguyên nhân không đạt<br />Phương thức và kết quả xử lý</th>
                                                                                            <th rowspan="2">抽驗數量<br />Số lượng kiểm tra mẫu</th>
                                                                                            <th rowspan="2">線長<br />Chuyền trưởng</th>
                                                                                            <th rowspan="2">抽驗數量<br />Số lượng kiểm tra mẫu</th>
                                                                                            <th rowspan="2">QA ký tên</th>
                                                                                            <th>Program (Pass/Fail)</th>
                                                                                            <th>極性 <br />Cực IC</th>
                                                                                            <th>PIN NG</th>
                                                                                            <th>其它 <br />Cái khác</th>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>QA</th>
                                                                                            <th>QA</th>
                                                                                            <th>QA</th>
                                                                                            <th>QA</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="1" class="timeLine">07:30 - 09:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="tabledit-view-mode text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>                                         
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="2" class="timeLine">09:30 - 11:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="3" class="timeLine">11:30 - 13:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="4" class="timeLine">13:30 - 15:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="5" class="timeLine">15:30 - 17:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="tabledit-view-mode text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineDay">
                                                                                            <td scope="row"><span data-timelineid="6" class="timeLine">17:30 - 19:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="7" class="timeLine">19:30 - 21:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="8" class="timeLine">21:30 - 23:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="9" class="timeLine">23:30 - 01:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="10" class="timeLine">01:30 - 03:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="11" class="timeLine">03:30 - 05:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- IPQC kiểm tra -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end IPQC kiểm tra -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                        <tr class="timeLineNight">
                                                                                            <td scope="row"><span data-timelineid="12" class="timeLine">05:30 - 07:30</span></td>
                                                                                            <!-- Hiệu suất thực tế -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="PassQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end hiệu suất thực tế -->
                                                                                            <!-- Số lượng lỗi -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="FailQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng lỗi -->
                                                                                            <!-- Nguyên nhân không đạt -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="ReasonAndSolution" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Nguyên nhân không đạt -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="LineLeaderTestQuantity" class="tabledit-input form-control input-sm" type="number" min="0" value="">
                                                                                            </td>
                                                                                            <!-- end Số lượng kiểm tra mẫu -->
                                                                                            <!-- Chuyền trưởng -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="LineLeaderConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- End Chuyền trưởng -->
                                                                                            <!-- Số lượng kiểm tra mẫu -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="IPQCTestQuantity" class="tabledit-input form-control input-sm" type="number" value="">
                                                                                            </td>
                                                                                            <!-- End Số lượng kiểm tra mẫu -->
                                                                                            <!-- QA ký tên -->
                                                                                            <td class="text-center">
                                                                                                <span data-fieldname="IPQCConfirmByName">
                                                                                                    
                                                                                                </span>
                                                                                            </td>
                                                                                            <!-- end QA ký tên -->
                                                                                            <!-- Checksum -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <select data-fieldname="ProgramPassFail" class="form-control">
                                                                                                    <option value="1">Pass</option>
                                                                                                    <option value="2">Fail</option>
                                                                                                </select>
                                                                                            </td>
                                                                                            <!-- End Checksum -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="ICStatus" class="form-control">
                                                                                                    <option value="1">OK</option>
                                                                                                    <option value="2">NG</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- PIN NG -->
                                                                                            <td>
                                                                                                <!-- Cực IC -->
                                                                                                <select data-fieldname="PinNG" class="form-control">
                                                                                                    <option value="1">NO</option>
                                                                                                    <option value="2">YES</option>
                                                                                                </select>
                                                                                                <!-- End Cực IC -->
                                                                                            </td>
                                                                                            <!-- End PIN NG -->
                                                                                            <!-- Cái khắc -->
                                                                                            <td class="tabledit-view-mode">
                                                                                                <input data-fieldName="Other" class="tabledit-input form-control input-sm" type="text" value="">
                                                                                            </td>
                                                                                            <!-- End Cái khác -->
                                                                                        </tr>
                                                                                    </tbody>
                                                                                    <tfoot>
                                                                                        <tr>
                                                                                            <td rowspan="2"></td>
                                                                                            <td scope="row">總完成數<br />Tổng số đạt tiêu chuẩn</td>
                                                                                            <td scope="row">總不良數<br />Tổng số hàng lỗi</td>
                                                                                            <td scope="row">達成率<br />Tỉ lệ đạt được</td>
                                                                                            <td colspan="8" rowspan="2">
                                                                                                注意：<br />
                                                                                                1. Viêt số lượng lỗi lần lượt theo các nét của chữ 正.<br />
                                                                                                2. Reset theo mốc thời gian đã chia sẵn ở bảng ghi chép. 
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="text-center">
                                                                                                <!-- Tổng số đạt tiêu chuẩn -->
                                                                                                <span class="sumOfPassQuantity"></span>
                                                                                                <!-- End Tổng số đạt tiêu chuẩn -->
                                                                                            </td>
                                                                                            <td class="text-center">
                                                                                                <!-- Tổng số hàng lỗi-->
                                                                                                <span class="sumOfFailQuantity"><label class="badge badge-danger">0</label></span>
                                                                                                
                                                                                                <!-- End Tổng số hàng lỗi -->
                                                                                            </td>
                                                                                            <td class="text-center">
                                                                                                <!-- Tỉ lệ đạt được -->
                                                                                                <span class="ratioPass"></span>
                                                                                                <!-- Tỉ lệ đạt được -->
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colspan="12">
                                                                                                <!-- Gợi ý -->
                                                                                                <h6>REMARK: Gợi ý</h6>
                                                                                                <p>
                                                                                                    1.每 2 小 時 IPQC 必 須 做 極 性 確 認  .  Cứ 2 giờ thì IPQC phải kiểm tra cực IC <br />
                                                                                                    Every 2 Hours The IPQC To Double Check The IC Polarity OK. 
                                                                                                    2.每 2 小 時 IPQC 必 須 做 確 認 動 作 , 未 確 認 操 機 員 勿 燒 碼 .<br />
                                                                                                    Cứ 2 giờ IPQC phải làm xác nhận chương trình, nếu không xác nhận thì nhân viên không làm sao chép<br />
                                                                                                    (確 認 OK 之 IC 請 打 上 黄 色 記 號)        Xác nhận xong IC đánh dấu màu đỏ<br />
                                                                                                     Every 2 Hours The IPQC To Double Check The IC Program OK,No Verify Don't Programming.
                                                                                                </p>
                                                                                                <!-- Gợi ý -->
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style="border: 0px;" colspan="10">保存期限﹕三個月<br />Thời hạn lưu giữ: 3 tháng</td>
                                                                                            <td style="border: 0px;" colspan="2">表單編號:FM3NVA012017D<br />Mã số bảng: FM3NVA012017D</td>
                                                                                        </tr>
                                                                                    </tfoot>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                        <!-- end Thời gian rút kiểm -->
                                                                    </div>
                                                                </div>
                                                            </div>`);
                                    $("#modalCheckList .modal-body").append(formCheckListOnTimeHTML);

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
                                                            }
                                                            if ($(this).data('fieldname') == "FailQuantity") {
                                                                $(this).val(item.FailQuantity);
                                                            }
                                                            if ($(this).data('fieldname') == "ReasonAndSolution") {
                                                                $(this).val(item.ReasonAndSolution);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderTestQuantity") {
                                                                $(this).val(item.LineLeaderTestQuantity);
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
                                                        })
                                                    }
                                                }

                                                if (item.StatusCheckListOnTime == 2) {//IPQC đã xác nhận
                                                    if ($(trTimeLine).data('timelineid') == item.TimeLineId) {
                                                        arrInput.each(function () {
                                                            if ($(this).data('fieldname') == "PassQuantity") {
                                                                $(this).val(item.PassQuantity);
                                                            }
                                                            if ($(this).data('fieldname') == "FailQuantity") {
                                                                $(this).val(item.FailQuantity);
                                                            }
                                                            if ($(this).data('fieldname') == "ReasonAndSolution") {
                                                                $(this).val(item.ReasonAndSolution);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderTestQuantity") {
                                                                $(this).val(item.LineLeaderTestQuantity);
                                                            }
                                                            if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<span class="text-success">${item.LineLeaderConfirmByName}</span>`);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCTestQuantity") {
                                                                $(this).empty();
                                                                $(this).val(item.IPQCTestQuantity);
                                                            }
                                                            if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                $(this).empty();
                                                                $(this).append(`<span class="text-success">${item.IPQCConfirmByName}</span>`)
                                                            }
                                                            if ($(this).data('fieldname') == "ICStatus") {
                                                                $(this).val(item.ICStatus);
                                                            }
                                                            if ($(this).data('fieldname') == "PinNG") {
                                                                $(this).val(item.PinNG);
                                                            }
                                                            if ($(this).data('fieldname') == "Checksum") {
                                                                $(this).empty();
                                                                $(this).val(item.Checksum);
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

