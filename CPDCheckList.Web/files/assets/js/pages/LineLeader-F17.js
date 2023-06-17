var checkListId_global;
var shiftWork;
$(document).ready(function () {
    loadDataCheckList();
    btnDetailCheckListOnclick();
    btn_Confirm_ChecklistOnClick();
    btn_Reject_ChecklistOnclick();

    btnConfirmChecklistOntimeOnClick();

    setInterval(function () {
        loadDataCheckList();
    }, 180000);
})

//load data check list new
function loadDataCheckList() {
    onload();
    $.ajax({
        type: "Get",
        url: "/CheckList/GetAllCheckListFirst",
        data: {
            location: "F17"
        },
        success: function (response) {
            try {
                endload();
                var jsonCheckList = JSON.parse(response);
                //binding table data
                var t = $('#table_Checklist').DataTable({
                    order: [[5, 'desc']],
                    destroy: true,
                });
                t.clear();
                for (const item of jsonCheckList) {
                    t.row.add([`${item.MO}`, `${item.ModelName}`, `${item.MachineCode}`, `${item.TeCreatedByName}`, `${(item.ShiftWork == 1) ? 'Ngày' : 'Đêm'}`, `${formatDateyyyyMMdd(item.ChecklistCreateDate)}`,
                    `${(item.StatusConfirm == 0) ? `<label class="badge badge-inverse-info">Chờ chuyền trưởng xác nhận</label>` : ((item.StatusConfirm == 1) ? `<label class="badge badge-inverse-warning">Chờ IPQC xác nhận</label>` : ((item.StatusConfirm == 2) ? `<label class="badge badge-success">IPQC đã xác nhận</label>` : ((item.StatusConfirm == 3) ? `<label class="badge badge-danger">Chuyền trưởng từ chối đơn</label>` : `<label class="badge badge-danger">IPQC từ chối đơn</label>`)))}`,
                    `${(item.StatusConfirm == 0) ? `<button title="Chi tiết" data-id=${item.CheckListFirstId} class="btn btn-info btn-outline-info btn-detail-checklist"><i class="icofont icofont-info-square"></i></button> <button title="Xác nhận" data-id=${item.CheckListFirstId} class="btn btn-success btn-outline-success btn_Confirm_Checklist"><i class="icofont icofont-check-circled"></i></button> <button title="Không xác nhận" data-id=${item.CheckListFirstId} class="btn btn-danger btn-outline-danger btn_Reject_Checklist"><i class="icofont icofont-close-line"></i></button>` : `<button title="Chi tiết" data-id=${item.CheckListFirstId} class="btn btn-info btn-outline-info btn-detail-checklist"><i class="icofont icofont-info-square"></i></button>`}`]).draw(false);
                }
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

//click btn-detail-checklist
function btnDetailCheckListOnclick() {
    $(document).on('click', '.btn-detail-checklist', function () {
        $("#modalCheckList .modal-body #formCheckListOnTime").remove();
        checkListId_global = $(this).data('id');
        //gọi ajax binding form data
        $.ajax({
            type: "Get",
            url: "/CheckList/GetCheckListById",
            data: { checklistId: checkListId_global },
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

                    (statusCheckList == 0) ? ($('.status-checklist').append(`Trạng thái đơn: <label class="badge badge-inverse-info">Chờ chuyền trưởng xác nhận</label>`))
                        : ((statusCheckList == 1) ? ($('.status-checklist').append(`Trạng thái đơn: <label class="badge badge-inverse-warning">Chờ IPQC xác nhận</label>`))
                            : ((statusCheckList == 2) ? ($('.status-checklist').append(`Trạng thái đơn: <label class="badge badge-success">IPQC đã xác nhận</label>`))
                                : ((statusCheckList == 3) ? ($('.status-checklist').append(`Trạng thái đơn: <label class="badge badge-danger">Chuyền trưởng đã từ chối đơn</label>`))
                                    : ($('.status-checklist').append(`Trạng thái đơn: <label class="badge badge-danger">IPQC đã từ chối đơn</label>`)))));

                    //binding lineleaderCheck
                    var arrLineLeaderCheck = $('.lineLeaderCheck');
                    for (const item of arrLineLeaderCheck) {
                        if (statusCheckList == 1 || statusCheckList == 2 || statusCheckList == 4) {
                            $(item).empty();
                            $(item).append(`<span class="text-success"><i class="icofont icofont-check f-20"></i></span>`);
                        }
                        else if (statusCheckList == 3) {
                            {
                                $(item).empty();
                                $(item).append(`<span class="text-danger"><i class="icofont icofont-close"></i></span>`);
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
                            $(item).append(`<span class="text-success"><i class="icofont icofont-check f-20"></i></span>`);
                        }

                        else
                            if (statusCheckList == 4) {
                                {
                                    $(item).empty();
                                    $(item).append(`<span class="text-danger"><i class="icofont icofont-close"></i></span>`);
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
                        $("#modalCheckList .modal-body #formCheckListOnTime").remove();
                        //xóa hết các nút bấm:
                        $('#modalCheckList .modal-footer').children().remove();
                        //append lại các nút bấm cần thiết:
                        $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-primary waves-effect waves-light btn_Confirm_Checklist"><i class="icofont icofont-check-circled"></i>Xác nhận</button>`);
                        $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-danger waves-effect waves-light btn_Reject_Checklist"><i class="icofont icofont-close-line"></i>Không xác nhận</button>`);
                        $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-inverse waves-effect " data-dismiss="modal">Đóng</button>`);


                        //show modal:
                        $("#modalCheckList").modal('show');

                    } else
                        if (statusCheckList == 2) {

                            //binding form thời gian rút kiểm:
                            $.ajax({
                                type: "GET",
                                url: "/Home/GetAllCheckListOnTime",
                                data: {
                                    checkListFirstId: checkListId_global
                                },
                                dataType: "text",//Kieu du lieu tra ve
                                contentType: "application/json",
                                success: function (response) {
                                    try {
                                        var jsonCLOnTimes = JSON.parse(response);
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
                                        $("#modalCheckList .modal-body #formCheckListOnTime").remove();
                                        $("#modalCheckList .modal-body").append(formCheckListOnTimeHTML);

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
                                                        //$(this).append(`<button type="button" class="tabledit-edit-button btn btn-primary waves-effect waves-light" style="float: none;margin: 5px;"><span class="icofont icofont-ui-edit"></span></button>`);
                                                        $(this).append(`<button data-checklistid="${checkListId_global}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary btn-confirm-checklist-ontime"><i class="icofont icofont-pencil"></i>Ký</button>`);
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
                                                                    ($(this).append(`<label class="badge badge-inverse-info">Chờ xác nhận</label>`))
                                                                }
                                                            })
                                                            break;
                                                        }
                                                        else {
                                                            arrInput.each(function () {
                                                                if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                    $(this).empty();
                                                                    $(this).append(`<button data-checklistid="${checkListId_global}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary btn-confirm-checklist-ontime"><i class="icofont icofont-pencil"></i>Ký</button>`);
                                                                }
                                                                if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                    $(this).empty();
                                                                    $(this).append(`<label class="badge badge-inverse-info">Chờ xác nhận</label>`);
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
                                                                if ($(this).data('fieldname') == "LineLeaderConfirmByName") {
                                                                    $(this).empty();
                                                                    $(this).append(`<button data-checklistid="${checkListId_global}" data-timelineid="${stt}" title="Ký tên" class="btn btn-primary btn-confirm-checklist-ontime"><i class="icofont icofont-pencil"></i>Ký</button>`);
                                                                }
                                                                if ($(this).data('fieldname') == "IPQCConfirmByName") {
                                                                    $(this).empty();
                                                                    $(this).append(`<label class="badge badge-inverse-info">Chờ xác nhận</label>`);
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
                                        $('.sumOfPassQuantity').append(`<label class="badge badge-success">${sumOfPassQuantity}</label>`);
                                        $('.sumOfFailQuantity').empty();
                                        $('.sumOfFailQuantity').append(`<label class="badge badge-danger">${sumOfFailQuantity}</label>`);
                                        $('.ratioPass').empty();
                                        var ratio = parseFloat(((sumOfPassQuantity - sumOfFailQuantity) / sumOfPassQuantity) * 100).toFixed(2);
                                        (ratio < 80) ? ($('.ratioPass').append(`<label class="badge badge-danger">${ratio}</label>`)) : ((ratio < 95) ? ($('.ratioPass').append(`<label class="badge badge-warning">${ratio}</label>`)) : ($('.ratioPass').append(`<label class="badge badge-success">${ratio}</label>`)));
                                    } catch (e) {

                                    }
                                },
                                error: function (res) {

                                    alert('fail');
                                }
                            });

                            //xóa hết các nút bấm:
                            $('#modalCheckList .modal-footer').children().remove();
                            $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-inverse waves-effect " data-dismiss="modal">Đóng</button>`);
                            //show modal:
                            $("#modalCheckList").modal('show');

                        }
                        else {
                            //xóa form thời gian rút kiểm:
                            $("#modalCheckList .modal-body #formCheckListOnTime").remove();
                            //xóa hết các nút bấm:
                            $('#modalCheckList .modal-footer').children().remove();
                            $('#modalCheckList .modal-footer').append(`<button type="button" class="btn btn-inverse waves-effect " data-dismiss="modal">Đóng</button>`);
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
    })
}

//click btn_Confirm_Checklist
function btn_Confirm_ChecklistOnClick() {
    $(document).on('click', '.btn_Confirm_Checklist', function () {
        if (!checkListId_global) {
            checkListId_global = $(this).data('id');
        }
        Swal.fire({
            title: 'Chọn mail để gửi đơn:',
            icon: "warning",
            //html: "<input id='lineLeaderReasonReject' class='swal2-input' required/>",
            html: `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                                                <option value="">select mail</option>
                                                                <option value="F17_IPQC">Mail to IPQC_MBD_F17</option>
                                                            </select>`,
            confirmButtonText: 'Gửi',
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ!",
            reverseButtons: true,
            preConfirm: () => {
                if (document.getElementById('mailSelected').value) {
                    var mailSelected = document.getElementById('mailSelected').value.trim();
                    $.ajax({
                        type: "POST",
                        url: "/BanDau/BanDau/ConfirmCheckList",
                        data: {
                            checkListId: checkListId_global,
                            mailSelected: mailSelected
                        },
                        success: function (response) {
                            try {
                                if (response == 1) {
                                    Swal.fire("Thành công", "Đã từ chối đơn !", "success");
                                    if ($('#modalCheckList').hasClass('show')) {
                                        //nếu modal đang mở
                                        $("#modalCheckList").modal('hide');//đóng modal
                                        loadDataCheckList();
                                        checkListId_global = null;
                                    }
                                    else {
                                        loadDataCheckList();
                                        checkListId_global = null;
                                    }
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
        })
    })
}

//click btn_Reject_CheckList
function btn_Reject_ChecklistOnclick() {
    $(document).on('click', '.btn_Reject_Checklist', function () {
        if (!checkListId_global) {
            checkListId_global = $(this).data('id');
        }
        Swal.fire({
            title: 'Lý do không xác nhận?',
            icon: "warning",
            //html: "<input id='lineLeaderReasonReject' class='swal2-input' required/>",
            html: `<textarea id="lineLeaderReasonReject" class='swal2-textarea' required rows="6" cols="30">`,
            confirmButtonText: 'Gửi',
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ!",
            reverseButtons: true,
            preConfirm: () => {
                if (document.getElementById('lineLeaderReasonReject').value) {
                    var lineLeaderReasonReject = document.getElementById('lineLeaderReasonReject').value;
                    $.ajax({
                        type: "POST",
                        url: "/BanDau/BanDau/RejectCheckList",
                        data: {
                            checkListId: checkListId_global,
                            lineLeaderReasonReject: lineLeaderReasonReject
                        },
                        success: function (response) {
                            try {
                                if (response == 1) {
                                    Swal.fire("Thành công", "Đã từ chối đơn !", "success");
                                    if ($('#modalCheckList').hasClass('show')) {
                                        //nếu modal đang mở
                                        $("#modalCheckList").modal('hide');//đóng modal
                                        loadDataCheckList();
                                        checkListId_global = null;
                                    }
                                    else {
                                        loadDataCheckList();
                                        checkListId_global = null;
                                    }
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
    })
}

//click btn-confirm-checklist-ontime
function btnConfirmChecklistOntimeOnClick() {
    $(document).on('click', '.btn-confirm-checklist-ontime', function () {
        //binding data:
        var checkListOnTime = {};
        //lấy tất cả input:
        var arrFieldNameOnTime = $(this).parent().parent().siblings().children();

        //binding checkListOnTime
        for (const item of arrFieldNameOnTime) {
            if ($(item).data('fieldname') == "PassQuantity") {
                checkListOnTime.PassQuantity = $(item).val();
            }
            if ($(item).data('fieldname') == "FailQuantity") {
                checkListOnTime.FailQuantity = $(item).val();
            }
            if ($(item).data('fieldname') == "ReasonAndSolution") {
                checkListOnTime.ReasonAndSolution = $(item).val();
            }
            if ($(item).data('fieldname') == "LineLeaderTestQuantity") {
                checkListOnTime.LineLeaderTestQuantity = $(item).val();
            }
        }

        //validate empty:
        if (!checkListOnTime.PassQuantity.trim()) {
            Swal.fire("Empty", "Chưa lấy được giá trị ô hiệu suất thực tế!", "warning");
        }
        else {
            if (!checkListOnTime.FailQuantity.trim()) {
                Swal.fire("Empty", "Chưa lấy được giá trị ô số lượng lỗi!", "warning");
            }
            else {
                if (!checkListOnTime.LineLeaderTestQuantity.trim()) {
                    Swal.fire("Empty", "Chưa lấy được giá trị ô số lượng kiểm tra mẫu!", "warning");
                }
                else {
                    var checkListId = $(this).data('checklistid');
                    var timeLineId = $(this).data('timelineid');

                    //khi bấm ký
                    var data = {};
                    data.CheckListFirstId = checkListId;
                    data.TimeLineId = timeLineId;
                    data.PassQuantity = parseInt(checkListOnTime.PassQuantity);
                    data.FailQuantity = parseInt(checkListOnTime.FailQuantity);
                    data.ReasonAndSolution = checkListOnTime.ReasonAndSolution;
                    data.LineLeaderTestQuantity = parseInt(checkListOnTime.LineLeaderTestQuantity);
                    Swal.fire({
                        title: 'Chọn mail để gửi đơn:',
                        icon: "warning",
                        //html: "<input id='lineLeaderReasonReject' class='swal2-input' required/>",
                        html: `<select name="select" id="mailSelected" class='swal2-input' required class="form-control form-control-primary">
                                                                <option value="">select mail</option>
                                                                <option value="F17_IPQC">Mail to IPQC_MBD_F17</option>
                                                            </select>`,
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
                                    contentType: "application/json",
                                    success: function (response) {
                                        try {
                                            if (response == 0) {
                                                Swal.fire("Lỗi", "Hiện tại chưa thể thực hiện kí, liên hệ bộ phận MBD-AIOT để được trợ giúp. Số máy: 31746", "error");
                                            }
                                            else {
                                                Swal.fire("Thành công", "Đã ký xác nhận", "success");
                                                //hide modal:
                                                $(".modal-checklist").modal("hide");
                                                //load lại data:
                                                loadDataCheckList();
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


    })
}