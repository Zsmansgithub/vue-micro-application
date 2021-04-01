<template>
  <div style="padding: 20px">
    <div class="operation">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="listQuery.name"
            placeholder="菜单名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.common_type"
            @change="getList"
            clearable
            placeholder="是否公共菜单"
          >
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.menu_type"
            @change="getList"
            clearable
            placeholder="菜单类型"
          >
            <el-option label="目录菜单" :value="0"></el-option>
            <el-option label="路由菜单" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-cascader
            ref="cascaderQuery"
            v-model="listQuery.menu_parent"
            :options="options"
            @change="getList"
            placeholder="上级菜单"
            :props="{
              checkStrictly: true,
              emitPath: false,
              expandTrigger: 'hover'
            }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          @click="getList"
          icon="el-icon-search"
          >搜索
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="handleReset"
          >重置
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          @click="addMenu"
          icon="el-icon-plus"
          >新增菜单
        </el-button>
      </el-form>
    </div>
    <el-table :data="tableData" border>
      <el-table-column label="菜单名称" prop="title" />
      <el-table-column label="菜单路由名称">
        <template slot-scope="prop">
          <el-link
            type="primary"
            :underline="false"
            @click="go(prop.row.name)"
            >{{ prop.row.name }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="菜单路径" prop="path" />
      <el-table-column label="上级菜单" prop="menu_parent_title" />
      <el-table-column
        width=""
        label="菜单类型"
        prop="menu_type"
        :formatter="
          (row, column, v) => {
            return v === 0 ? '目录菜单' : '路由菜单';
          }
        "
      />
      <el-table-column label="菜单ICON" prop="icon" />
      <el-table-column label="路由组件路径" prop="component" />
      <el-table-column label="启用状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status" size="medium"
            >启用</el-tag
          >
          <el-tag type="danger" v-if="!scope.row.status" size="medium"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="small"
            circle
            @click.stop="openEditAppForm(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            circle
            @click.stop="doDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="visible">
      <el-form
        ref="menuItem"
        :model="menuItem"
        inlineblock
        :rules="rulesMenu"
        label-width="140px"
        style="width: 100%;padding-right: 20px;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="菜单名称"
              class="menu-list-item"
              min-width="100"
              prop="title"
            >
              <el-input
                v-model="menuItem.title"
                placeholder="输入路由title"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="前端路由名称"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="name"
            >
              <el-input
                v-model="menuItem.name"
                placeholder="输入路由name(不能与现有重复)"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="路由组件路径"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="component"
            >
              <el-input
                v-model="menuItem.component"
                placeholder="输入组件路径(例:views/dashboard/index)"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="菜单路径"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="path"
            >
              <el-input
                v-model="menuItem.path"
                placeholder="输入路由路径(path，例:/index)"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="菜单类型"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="menu_type"
            >
              <el-radio v-model="menuItem.menu_type" :label="0"
                >目录菜单</el-radio
              >
              <el-radio v-model="menuItem.menu_type" :label="1"
                >路由菜单</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="启用状态"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="status"
            >
              <el-radio v-model="menuItem.status" :label="true">启用</el-radio>
              <el-radio v-model="menuItem.status" :label="false">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="菜单排序"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="meta.sort"
            >
              <el-input v-model="menuItem.meta.sort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否公共菜单"
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="common_type"
            >
              <el-radio v-model="menuItem.common_type" :label="true"
                >是</el-radio
              >
              <el-radio v-model="menuItem.common_type" :label="false"
                >否</el-radio
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="菜单ICON"
              class="menu-list-item"
              inlineblock
              min-width="100"
            >
              <el-input
                v-model="menuItem.icon"
                placeholder="输入菜单icon"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="重定向(redirect)"
              class="menu-list-item"
              inlineblock
              min-width="100"
            >
              <el-input
                v-model="menuItem.redirect"
                placeholder="例:noRedirect"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="是否隐藏"
              class="menu-list-item"
              inlineblock
              min-width="100"
            >
              <el-radio v-model="menuItem.hidden" :label="true">是</el-radio>
              <el-radio v-model="menuItem.hidden" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="显示(alwaysShow)"
              class="menu-list-item"
              inlineblock
              min-width="100"
            >
              <el-radio v-model="menuItem.alwaysShow" :label="true"
                >是</el-radio
              >
              <el-radio v-model="menuItem.alwaysShow" :label="false"
                >否</el-radio
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="上级菜单"
              class="menu-list-item"
              inlineblock
              min-width="100"
            >
              <el-cascader
                ref="cascader"
                v-model="menuItem.menu_parent"
                :options="options"
                :props="{
                  checkStrictly: true,
                  emitPath: false,
                  expandTrigger: 'hover'
                }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="menu-list-item"
              inlineblock
              min-width="100"
              prop="meta.basePath"
            >
              <template slot="label">
                <span
                  ><el-tooltip
                    class="item"
                    effect="dark"
                    content="子项目基础路径，子项目所有页面保持一致, 一级目录必填"
                    placement="top-end"
                  >
                    <svg-icon
                      class-name="help-svg"
                      icon-class="help"
                      style="width: 18px; height:18px"
                    /> </el-tooltip
                  >基础路径</span
                >
              </template>
              <el-input
                v-model="menuItem.meta.basePath"
                placeholder="请输入（例：FBXT）"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getMenu,
  addMenu,
  editMenu,
  delMenu,
  getMenuParent
} from "@/api/manage_monitor/route_menu";
import ManageMonitorRouter from "../../router/modules/manage_monitor";
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: undefined,
        common_type: undefined,
        menu_type: undefined,
        menu_parent: undefined,
        page: 1,
        limit: 20
      },
      menuItem: {
        icon: undefined, // ICON
        title: undefined, // 菜单名称
        name: undefined, // 前端路由名称
        path: undefined, // 前端路由路径
        component: undefined, // 组件路径
        menu_type: 1, // 菜单类型
        menu_parent: undefined, // 上级菜单id (name属性)
        menu_parent_title: undefined, // 上级菜单label
        status: true, // 启用状态
        hidden: undefined, // 是否隐藏
        redirect: undefined, // 重定向(redirect)
        alwaysShow: undefined, // 显示(alwaysShow)
        route_type: true, // 是否在左侧菜单
        common_type: false, // 是否是公共菜单(不做权限控制)
        meta: {
          sort: 1,
          basePath: undefined
        } // 扩展数据
      },
      tableData: [],
      total: 5,
      visible: false,
      rulesMenu: {
        title: [{ required: true, message: "请填写菜单名称", trigger: "blur" }],
        name: [{ required: true, message: "请填写路由名称", trigger: "blur" }],
        path: [{ required: true, message: "请填写路由路径", trigger: "blur" }],
        component: [
          { required: true, message: "请填写路由组件路径", trigger: "blur" }
        ],
        menu_type: [
          { required: true, message: "请选择菜单类型", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择启用状态", trigger: "blur" }
        ],
        common_type: [
          { required: true, message: "请选择是否公共菜单", trigger: "blur" }
        ],
        "meta.sort": [
          { required: true, message: "请填写菜单排序", trigger: "blur" }
        ]
      },
      title: "新增菜单",
      options: undefined,
      cmdbData: undefined
    };
  },
  mounted() {
    this.getList();
    this.getMenuParent();
  },
  methods: {
    go(name) {
      this.$router.push({ name });
    },
    getList() {
      getMenu(this.listQuery)
        .then(res => {
          this.tableData = res.results;
          this.total = res.count;
        })
        .catch(e => {
          console.error(e);
        });
    },
    getMenuParent() {
      getMenuParent()
        .then(res => {
          const resData = [...res];
          const fn = items => {
            return items
              .sort((a, b) => {
                return a.meta.sort - b.meta.sort;
              })
              .reduce((list, item) => {
                if (item.children && item.children.length > 0)
                  item.children = fn(item.children);
                if (item.children && item.children.length === 0)
                  delete item.children;
                list.push(item);
                return list;
              }, []);
          };
          this.options = fn(resData);
        })
        .catch(e => {
          console.error(e);
        });
    },
    openEditAppForm(item) {
      this.title = "编辑菜单";
      this.menuItem = Object.assign({}, this.menuItem, item);
      this.visible = true;
    },
    addMenu() {
      this.title = "新增菜单";
      this.menuItem = this.$options.data().menuItem;
      this.visible = true;
    },
    doDelete(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMenu(item.id).then(res => {
            this.$message.success("删除成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    onSub() {
      this.$refs.menuItem.validate(valid => {
        if (valid) {
          const done = (res, msg) => {
            if (res.status === "error") {
              this.$message.error(res.res);
            } else {
              this.$message.success(msg);
              this.menuItem = this.$options.data().menuItem;
              this.visible = false;
              this.getList();
            }
          };
          if (this.menuItem.menu_parent) {
            this.menuItem.menu_parent_title = this.$refs.cascader
              .getCheckedNodes()[0]
              .pathLabels.join(" / ");
          }
          const menuItem = this.menuItem;
          Object.keys(menuItem).map(v => {
            if (
              menuItem[v] === null ||
              menuItem[v] === undefined ||
              menuItem[v] === ""
            )
              delete menuItem[v];
          });
          if (this.title === "新增菜单") {
            addMenu(menuItem)
              .then(res => {
                done(res, "添加成功");
              })
              .catch(e => {
                console.error(e);
              });
          }
          if (this.title === "编辑菜单") {
            editMenu(menuItem, menuItem.id)
              .then(res => {
                done(res, "编辑成功");
              })
              .catch(e => {
                console.error(e);
              });
          }
        } else {
          return false;
        }
      });
    },
    handleReset() {
      this.listQuery = this.$options.data().listQuery;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.operation {
  padding-bottom: 10px;
  // text-align: right;
}
.menu-list-item {
  box-sizing: border-box;
}
</style>
