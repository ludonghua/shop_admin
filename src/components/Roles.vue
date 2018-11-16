<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showRole">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" width="100%" ref="roleList">
      <!-- 控制表格展开 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0" style="text-align:center">
            <span style="color:red">占无数据</span>
          </el-row>
          <el-row  v-for="label1 in scope.row.children" :key="label1.id">
            <!-- 放一级 -->
            <el-col :span="4">
              <el-tag
                class="label1"
                closable
                :disable-transitions="false"
                @close="deleteRight(scope.row,label1.id)"
                >{{label1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="label2 in label1.children" :key="label2.id">
                <!-- 放二级 -->
                <el-col :span="4">
                  <el-tag
                    class="label2"
                    type="success"
                    closable
                    :disable-transitions="false"
                    @close="deleteRight(scope.row,label2.id)">
                    {{label2.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 放三级 -->
                  <el-tag
                    class="label3"
                    type="danger"
                    closable
                    :disable-transitions="false"
                    @close="deleteRight(scope.row,label3.id)"
                    v-for="label3 in label2.children"
                    :key="label3.id"
                    >{{label3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 表格序列号 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" plain @click="editRole(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" plain @click="delRole(scope.row)"></el-button>
          <el-button type="success" size="small" icon="el-icon-check" plain @click="showAccreditRole(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权对话框 -->
    <el-dialog
      title="角色授权"
      :visible.sync="accreditRole"
      width="50%">
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="accreditRole = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleShow"
      width="40%">
       <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="修改信息"
      :visible.sync="editRoleShow"
      width="40%">
       <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" @editRoleInfo.native = "editRoleInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      accreditRole: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addRoleShow: false,
      // 添加角色
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单验证
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述信息', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 修改角色信息
      editRoleForm: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },
      // 修改角色信息验证
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述信息', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      editRoleShow: false
    }
  },
  methods: {
    // 封装列表角色渲染功能
    async getRoleList() {
      let res = await this.axios.get('roles')
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 封装权限列表渲染功能
    async getRightList() {
      let res = await this.axios.get(`rights/tree`)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 点击标签删除对应标签
    async deleteRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
      }
    },
    // 点击权限分配弹出对话框并回显数据
    async showAccreditRole(role) {
      // 把roleId存起来，留提交分配时使用
      this.roleId = role.id
      // 显示对话框
      this.accreditRole = true
      // 获取到所有的权限信息
      this.getRightList()
      // 因为对话框显示的时候，属性还没有渲染，用nextTick()方法
      this.$nextTick(() => {
        let temp = []
        role.children.forEach(label1 => {
          label1.children.forEach(label2 => {
            label2.children.forEach(label3 => {
              temp.push(label3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 点击分配，分配权限
    async assignRight() {
      let aa = this.$refs.tree.getCheckedKeys()
      let bb = this.$refs.tree.getHalfCheckedKeys()
      let rids = aa.concat(bb)
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: rids.join()
      })
      let { meta: { status } } = res
      if (status === 200) {
        // 重新渲染角色列表
        this.getRoleList()
        // 关闭对话框
        this.accreditRole = false
      }
    },
    // 添加角色功能。
    showRole() {
      this.addRoleShow = true
    },
    // 点击添加角色功能确认键
    addRoleInfo() {
      this.$refs.addRoleForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('roles', {
            roleName: this.addRoleForm.roleName,
            roleDesc: this.addRoleForm.roleDesc
          })
          // console.log(res)
          let { meta: { status } } = res
          if (status === 201) {
            // 重新渲染角色列表
            this.getRoleList()
            // 关闭对话框
            this.addRoleShow = false
            // 清空form 表单
            this.$refs.addRoleForm.resetFields()
          }
        } else {
          console.log('添加失败')
          return false
        }
      })
    },
    // 点击删除按钮功能
    async delRole(role) {
      let res = await this.axios.delete(`roles/${role.id}`)
      let { meta: { status } } = res
      if (status === 200) {
        // 重新渲染
        this.getRoleList()
      }
    },
    // 点击修改显示对话框并回显
    editRole(role) {
      // 显示对话框
      this.editRoleShow = true
      // 数据回显
      this.editRoleForm = role
    },
    // 点击确定修改数据
    editRoleInfo() {
      let { roleName, roleDesc, id } = this.editRoleForm
      this.$refs.editRoleForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`roles/${id}`, {
            roleName: roleName,
            roleDesc: roleDesc
          })
          let { meta: { status } } = res
          if (status === 200) {
            // 重新渲染
            this.getRoleList()
            // 关闭模态框
            this.editRoleShow = false
          }
        } else {
          console.log('修改失败')
          return false
        }
      })
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.label2 {
  margin-bottom: 13px;
}
.label3 {
  margin: 0 10px 5px 0;
}
</style>
