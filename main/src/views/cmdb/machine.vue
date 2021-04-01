<template>
  <div class="app-container">
    <el-tabs v-model="listQuery.activeName" @tab-click="handleClick">
      <el-tab-pane label="机房视图" name="machineRoomView">
        <machine-View></machine-View>
      </el-tab-pane>
      <el-tab-pane label="机房信息管理" name="machineRoom">
        <div class="filter-container">
          <el-form ref="listQuery" :model="listQuery" :inline="true">
            <el-form-item>
              <el-select
                v-model="listQuery.name"
                placeholder="机房名称"
                filterable
                clearable
                class="filter-item"
                style="width: 250px"
                @change="FilterMachineRoom"
              >
                <el-option
                  v-for="item in fraAndRackOptions"
                  :key="item.key"
                  :label="item.machineroom"
                  :value="item.machineroom"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="FilterMachineRoom"
              >搜索</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                plain
                icon="el-icon-refresh"
                @click="handleResetM"
              >重置</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                @click="dialogInserMactVisible = true"
              >新增机房</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          border
          stripe
          highlight-current-row
        >
          <el-table-column
            label="ID"
            prop="id"
            sortable
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机房名称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="房间号码" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.roomNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机房地址" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.user }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.phoneNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleBatchEdit(scope.row)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleDeleteMachineRoom(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          style="padding-top: 5px;margin-top: 10px;"
          @pagination="getMachineRoomInf"
        />
        <el-dialog
          title="修改机房信息"
          :visible.sync="dialogVisible"
          width="30%"
          @close="dialogVisible = false"
        >
          <el-form
            ref="ModifyMForm"
            :model="machineRoomEdit"
            :rules="rules"
            label-width="100px"
            style="padding-right: 30px;"
          >
            <el-form-item v-if="false" label="ID" min-width="100">
              <el-input
                v-model.trim="machineRoomEdit.id"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机房名称" min-width="100" prop="name">
              <el-input
                v-model.trim="machineRoomEdit.name"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机房地址" min-width="100" prop="address">
              <el-input
                v-model.trim="machineRoomEdit.address"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="负责人" min-width="100" prop="user">
              <el-input
                v-model.trim="machineRoomEdit.user"
                type="text"
                placeholder="多个负责人已“，”分割"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="联系电话" min-width="100" prop="phoneNumber">
              <el-input
                v-model.trim="machineRoomEdit.phoneNumber"
                type="text"
                placeholder="多个联系电话已“，”分割"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="房间号码" min-width="100" prop="roomNumber">
              <el-input
                v-model.trim="machineRoomEdit.roomNumber"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="eidtManchineRoomInf('ModifyMForm')"
            >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-dialog
          title="新增机房信息"
          :visible.sync="dialogInserMactVisible"
          width="500px"
          @close="handleCloseMachine"
        >
          <el-form
            ref="addMachineRoomForm"
            :model="MachineRoomInsert"
            :rules="rules"
            label-width="100px"
            style="padding-right: 30px;"
          >
            <el-form-item label="机房名称" min-width="100" prop="name">
              <el-input
                v-model.trim="MachineRoomInsert.name"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机房地址" min-width="100" prop="address">
              <el-input
                v-model.trim="MachineRoomInsert.address"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="负责人" min-width="100" prop="user">
              <el-input
                v-model.trim="MachineRoomInsert.user"
                type="text"
                auto-complete="off"
                placeholder="多个负责人已“，”分割"
              />
            </el-form-item>
            <el-form-item label="联系电话" min-width="100" prop="phoneNumber">
              <el-input
                v-model.trim="MachineRoomInsert.phoneNumber"
                type="text"
                auto-complete="off"
                placeholder="多个联系电话已，分割"
              />
            </el-form-item>
            <el-form-item label="房间号码" min-width="100" prop="roomNumber">
              <el-input
                v-model.trim="MachineRoomInsert.roomNumber"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCloseMachine">取 消</el-button>
            <el-button
              type="primary"
              @click="
                AddMachineRoomInf('addMachineRoomForm', MachineRoomInsert)
              "
            >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="详情" name="McRoomAndframe">
        <div class="filter-container">
          <el-form ref="listQuery" :model="listQuery" :inline="true">
            <el-form-item>
              <el-select
                v-model="listQuery.machineroom"
                placeholder="机房名称"
                filterable
                clearable
                class="filter-item"
                style="width: 250px"
                @change="handleFilter"
              >
                <el-option
                  v-for="item in fraAndRackOptions"
                  :key="item.key"
                  :label="item.machineroom"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="listQuery.frame_name"
                placeholder="通道名称"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="listQuery.rack_number"
                placeholder="机柜名称"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
                >搜索</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                plain
                icon="el-icon-refresh"
                @click="handleReset"
                >重置</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                @click="dialogInsertVisible = true"
                >新增机架机柜</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table v-loading="listLoading" :data="FirstTableData" border stripe>
          <el-table-column
            label="ID"
            prop="id"
            sortable
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机房名称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.mach_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="通道名称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.frame_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机柜名称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.frame_name + scope.row.rack_number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机柜高度" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.size }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配线架高度" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.distribution_frame_size }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可容纳服务器数" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.total_numberof_servers }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已上架服务器数" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.used_servers_count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余可上架服务器数" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.remain_servers_count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.row)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalAll > 0"
          :total="totalAll"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          style="padding-top: 5px;margin-top: 10px;"
          @pagination="getFrameAndRack"
        />
        <el-dialog
          title="修改机架机柜信息"
          :visible.sync="dialogFormVisible"
          width="500px"
          @close="dialogFormVisible = false"
        >
          <el-form
            ref="dataForm"
            :model="frameAndRackEdit"
            :rules="rules"
            label-width="110px"
            style="padding-right: 30px;"
          >
            <el-form-item v-if="false" label="ID" min-width="100">
              <el-input
                v-model.trim="frameAndRackEdit.id"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机房名称" min-width="100" prop="mach_name">
              <el-input
                v-model.trim="frameAndRackEdit.mach_name"
                type="text"
                auto-complete="off"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="通道名称" min-width="100" prop="frame_name">
              <el-input
                v-model.trim="frameAndRackEdit.frame_name"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机柜名称" min-width="100" prop="rack_number">
              <el-input
                v-model.trim="frameAndRackEdit.rack_number"
                type="number"
                min="0"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机柜高度" min-width="100" prop="size">
              <el-input
                v-model.trim="frameAndRackEdit.size"
                type="number"
                max="48"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="配线架高度" min-width="100">
              <el-input
                v-model.trim="frameAndRackEdit.distribution_frame_size"
                type="number"
                max="48"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="可容纳服务器数" min-width="100">
              <el-input
                v-model.trim="frameAndRackEdit.total_numberof_servers"
                type="number"
                max="48"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="备注" min-width="100">
              <el-input
                v-model.trim="frameAndRackEdit.comments"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="eidtFrameAndRackInf('dataForm')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-dialog
          title="新增机架机柜信息"
          :visible.sync="dialogInsertVisible"
          width="500px"
          @close="handleClose"
        >
          <el-form
            ref="addFAndRForm"
            :model="frameAndRackInsertF"
            :rules="rules"
            label-width="110px"
            style="padding-right: 30px;"
          >
            <el-form-item label="机房名称" prop="machineroom_id">
              <el-select
                v-model="frameAndRackInsertF.machineroom_id"
                placeholder="机房名称"
                filterable
                clearable
                class="filter-item"
                style="width:327px"
              >
                <el-option
                  v-for="item in fraAndRackOptions"
                  :key="item.key"
                  :label="item.machineroom"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="通道名称" min-width="100" prop="frame_name">
              <el-input
                v-model.trim="frameAndRackInsertF.frame_name"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="机柜名称" prop="start_rack_number">
              <el-input-number
                class="rack_number"
                v-model.trim="frameAndRackInsertF.start_rack_number"
                :min="0"
                :max="50"
                placeholder="请输入起始Number"
                @change="setEndRackNumber"
                :controls="false"
                style="width:100%; text-align:left"
              />
            </el-form-item>
            <el-form-item prop="end_rack_number">
              <el-input-number
                class="rack_number"
                v-model.trim="frameAndRackInsertF.end_rack_number"
                value="frameAndRackInsertF.start_rack_number"
                type="number"
                :min="end_rack_number_min"
                :max="50"
                placeholder="请输入结束Number"
                :controls="false"
                style="width:100%; text-align:left"
              />
            </el-form-item>
            <el-form-item label="机柜高度" min-width="100" prop="size">
              <el-input
                v-model.trim="frameAndRackInsertF.size"
                type="number"
                auto-complete="off"
                max="48"
              />
            </el-form-item>
            <el-form-item label="配线架高度" min-width="100">
              <el-input
                v-model.trim="frameAndRackInsertF.distribution_frame_size"
                type="number"
                max="48"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="可容纳服务器数" min-width="100">
              <el-input
                v-model.trim="frameAndRackInsertF.total_numberof_servers"
                type="number"
                max="48"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="备注" min-width="100">
              <el-input
                v-model.trim="frameAndRackInsertF.comments"
                type="text"
                auto-complete="off"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialogInsertVisible">取 消</el-button>
            <el-button
              type="primary"
              @click="AddFrameAndRackInf('addFAndRForm', frameAndRackInsertF)"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getMachineRoom,
  eidtManchineRoom,
  getFrameAndRackDetails,
  getMachineRoomNp,
  eidtFrameAndRack,
  deleteFrameAndRack
} from "@/api/cmdb";
import { addFrameAndRack, AddMachineRoom, deleteMachineRoom } from "@/api/cmdb";
import Pagination from "@/components/Pagination";
import resize from "@/components/Charts/mixins/resize";
import sessionListQuery from '@/components/mixins/sessionListQuery'
import machineView from "./components/machine_view";
import { setTimeout } from "timers";
import { throws } from "assert";

var validPhone = (rule, value, callback) => {
  if (!/^(1[345789]\d{9}[,，]*)*$/.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};

var sizeValidator = (rule, value, callback) => {
  if (value > 48) {
    callback(new Error("机柜高度不能高于48"));
  } else if (value < 0) {
    callback(new Error("机柜高度必须大于0"));
  } else {
    callback();
  }
};

var startRackValidator = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error("机柜名称不能为负"));
  } else {
    callback();
  }
};
var endRackValidator = (rule, value, callback) => {
  if (value > 50) {
    callback(new Error("机柜名称不能大于50"));
  } else {
    callback();
  }
};

export default {
  components: { Pagination, machineView },
  mixins: [resize, sessionListQuery],
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogFormVisible: false,
      dialogInsertVisible: false,
      dialogInserMactVisible: false,
      end_rack_number_min: 0,
      tableData: null,
      FirstTableData: null,
      total: 0,
      totalAll: 0,
      fraAndRackOptions: [],
      confirmOptions: {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--danger",
        type: "warning"
      },
      rules: {
        name: [
          { required: true, message: "请输入机房名称", trigger: "blur" },
          { max: 50, message: "长度不能超过50个字符", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入机房地址", trigger: "blur" },
          { max: 200, message: "长度不能超过200个字符", trigger: "blur" }
        ],
        user: [
          { required: true, message: "请输入机房负责人", trigger: "blur" },
          { max: 50, message: "长度不能超过50个字符", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入负责人联系电话", trigger: "blur" },
          { validator: validPhone, trigger: "blur" }
        ],
        roomNumber: [
          { required: true, message: "请输入房间号码", trigger: "blur" }
        ],
        machineroom_id: [
          { required: true, message: "请选择机房名称", trigger: "blur" }
        ],
        frame_name: [
          { required: true, message: "请输入通道名称", trigger: "blur" }
        ],
        rack_number: [
          { required: true, message: "请输入机柜名称", trigger: "blur" }
        ],
        size: [
          { required: true, message: "请输入机柜高度", trigger: "blur" },
          { validator: sizeValidator, trigger: "blur" }
        ],
        start_rack_number: [
          { required: true, message: "请输入机柜开始Number", trigger: "blur" },
          { validator: startRackValidator, trigger: "blur" }
        ],
        end_rack_number: [
          { required: true, message: "请输入机柜结束Number", trigger: "blur" },
          { validator: endRackValidator, trigger: "blur" }
        ]
      },
      machineRoomEdit: {
        id: "",
        name: "",
        address: "",
        user: "",
        phoneNumber: "",
        roomNumber: ""
      },
      MachineRoomInsert: {
        name: "",
        address: "",
        user: "",
        phoneNumber: "",
        roomNumber: ""
      },
      frameAndRackEdit: {
        id: "",
        mach_name: "",
        frame_name: "",
        rack_number: "",
        size: "",
        distribution_frame_size: "",
        total_numberof_servers: "",
        comments: ""
      },
      frameAndRackInsertF: {
        machineroom: "",
        frame_name: "",
        start_rack_number: 0,
        end_rack_number: 1,
        size: 42,
        distribution_frame_size: 0,
        total_numberof_servers: 16,
        comments: ""
      },
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        machineroom: undefined,
        rack_number: undefined,
        frame_name: undefined,
        activeName: "machineRoomView",
      },
      listMachineRoom: {
        machineroom: undefined
      }
    };
  },
  created() {
    this.getFrameAndRack();
    this.getMachineRoomNpInf();
  },
  methods: {
    setEndRackNumber(value) {
      this.frameAndRackInsertF.end_rack_number = value;
      this.end_rack_number_min = this.frameAndRackInsertF.end_rack_number;
    },
    handleBatchEdit(row) {
      this.dialogVisible = true;
      this.machineRoomEdit.id = row.id;
      this.machineRoomEdit.name = row.name;
      this.machineRoomEdit.address = row.address;
      this.machineRoomEdit.user = row.user;
      this.machineRoomEdit.phoneNumber = row.phoneNumber;
      this.machineRoomEdit.roomNumber = row.roomNumber;
    },
    closeDialogInsertVisible() {
      this.dialogInsertVisible = false;
      this.resetFrameAndRackInsert();
    },
    eidtManchineRoomInf(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          eidtManchineRoom(this.machineRoomEdit.id, this.machineRoomEdit)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 3000
              });
              this.getMachineRoomInf();
            })
            .catch(error => {
              if (
                error.response.data.name ==
                "machine room inf with this 机房名称 already exists."
              ) {
                this.$notify({
                  title: "修改失败",
                  message: "该机房信息已存在，请勿重复添加",
                  type: "error",
                  duration: 3000
                });
              }
            });
          this.dialogVisible = false;
        }
      });
    },
    AddFrameAndRackInf(formName, frameAndRackInsertF) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogInsertVisible = false;
          for (
            var i = frameAndRackInsertF.start_rack_number;
            i <= frameAndRackInsertF.end_rack_number;
            i++
          ) {
            var frameAndRackInsert = {
              machineroom: "",
              frame_name: "",
              rack_number: "",
              size: "",
              distribution_frame_size: 0,
              comments: ""
            };
            frameAndRackInsert.machineroom = frameAndRackInsertF.machineroom_id;
            frameAndRackInsert.frame_name = frameAndRackInsertF.frame_name.toUpperCase();
            frameAndRackInsert.size = frameAndRackInsertF.size;
            frameAndRackInsert.rack_number = i;
            frameAndRackInsert.distribution_frame_size = frameAndRackInsertF.distribution_frame_size;
            frameAndRackInsert.total_numberof_servers = frameAndRackInsertF.total_numberof_servers;
            frameAndRackInsert.comments = frameAndRackInsertF.comments
            addFrameAndRack(frameAndRackInsert);
          }
          this.$notify({
            title: "成功",
            message: "提交成功",
            type: "success",
            duration: 3000
          });
          this.getFrameAndRack();
          this.$refs[formName].resetFields();
        }
      });
    },
    resetFrameAndRackInsert() {
      this.frameAndRackInsertF = {
        machineroom: "",
        frame_name: "",
        start_rack_number: 0,
        end_rack_number: 1,
        size: 42,
        distribution_frame_size: 0,
        total_numberof_servers: 16,
        comments: ""
      };
    },
    AddMachineRoomInf(formName, MachineRoomInsert) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var MachienRoomAdd = {
            name: "",
            address: "",
            user: "",
            phoneNumber: "",
            roomNumber: ""
          };
          MachienRoomAdd.name = MachineRoomInsert.name;
          MachienRoomAdd.address = MachineRoomInsert.address;
          MachienRoomAdd.user = MachineRoomInsert.user;
          MachienRoomAdd.phoneNumber = MachineRoomInsert.phoneNumber;
          MachienRoomAdd.roomNumber = MachineRoomInsert.roomNumber;
          AddMachineRoom(MachienRoomAdd)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "机房信息添加成功",
                type: "success",
                duration: 3000
              });
              this.getMachineRoomInf();
              this.dialogInserMactVisible = false;
            })
            .catch(error => {
              this.dialogInserMactVisible = false;
              if (
                error.response.data.name ==
                "machine room inf with this 机房名称 already exists."
              ) {
                this.$notify({
                  title: "添加失败",
                  message: "该机房信息已存在，请勿重复添加",
                  type: "error",
                  duration: 3000
                });
              }
            });
          this.$refs[formName].resetFields();
        }
      });
    },
    eidtFrameAndRackInf(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          eidtFrameAndRack(
            this.frameAndRackEdit.id,
            this.frameAndRackEdit
          ).then(response => {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 3000
            });
            this.getFrameAndRack();
          });
          this.dialogFormVisible = false;
        }
      });
    },
    handleCloseMachine() {
      this.dialogInserMactVisible = false;
      this.$refs["addMachineRoomForm"].resetFields();
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs["addFAndRForm"].resetFields();
    },
    handleClick(tab, event) {
      this.resetlistQuery();
      this.getMachineRoomInf();
      this.getMachineRoomNpInf();
      this.getFrameAndRack();
    },
    getMachineRoomNpInf() {
      getMachineRoomNp(this.listQuery).then(response => {
        const fraAndRackOptions = [];
        for (const i of response) {
          fraAndRackOptions.push({
            machineroom: i.name,
            key: i.id
          });
        }
        this.fraAndRackOptions = fraAndRackOptions;
      });
    },
    getMachineRoomInf() {
      this.listLoading = true;
      getMachineRoom(this.listQuery).then(response => {
        this.tableData = response.results;
        this.total = response.count;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 10);
      });
    },
    getFrameAndRack() {
      this.listLoading = true;
      getFrameAndRackDetails(this.listQuery).then(response => {
        this.FirstTableData = response.results;
        this.totalAll = response.count;
        this.listLoading = false;
      });
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1;
      this.$refs["listQuery"].validate(valid => {
        if (valid) {
          this.getFrameAndRack();
        }
      });
    },
    FilterMachineRoom(listQuery) {
      this.$refs["listQuery"].validate(valid => {
        if (valid) {
          this.getMachineRoomInf();
        }
      });
    },
    handleReset() {
      this.resetlistQuery();
      this.getFrameAndRack();
    },
    handleResetM() {
      this.resetlistQuery();
      this.getMachineRoomInf();
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.frameAndRackEdit.id = row.id;
      this.frameAndRackEdit.mach_name = row.mach_name;
      this.frameAndRackEdit.frame_name = row.frame_name;
      this.frameAndRackEdit.rack_number = row.rack_number;
      this.frameAndRackEdit.size = row.size;
      this.frameAndRackEdit.distribution_frame_size = row.distribution_frame_size;
      this.frameAndRackEdit.total_numberof_servers = row.total_numberof_servers;
      this.frameAndRackEdit.comments = row.comments;
    },
    handleDelete(row) {
      var msg = "确认删除该机架机柜信息吗？";
      this.$confirm(msg, "提示", this.confirmOptions).then(
        () => {
          deleteFrameAndRack(row.id)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 3000
              });
              this.getFrameAndRack();
            })
            .catch(error => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 3000
              });
              console.log(error);
            });
        },
        () => {
          return false;
        }
      );
    },
    handleDeleteMachineRoom(row) {
      var msg = "确认删除该机房信息吗？";
      this.$confirm(msg, "提示", this.confirmOptions).then(
        () => {
          deleteMachineRoom(row.id)
            .then(response => {
              if (response.code == 4006) {
                this.$notify({
                  title: "失败",
                  message: "该机房正在使用中，请勿删除",
                  type: "error",
                  duration: 3000
                });
              } else {
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 3000
                });
              }
              this.getMachineRoomInf();
              this.getMachineRoomNpInf();
            })
            .catch(error => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 3000
              });
              console.log(error);
            });
        },
        () => {
          return false;
        }
      );
    },
    resetlistQuery() {
      this.listQuery = Object.assign({}, this.listQuery, {
        page: 1,
        limit: 20,
        name: undefined,
        machineroom: undefined,
        rack_number: undefined,
        frame_name: undefined,
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rack_number .el-input__inner {
  text-align: left;
}
</style>
