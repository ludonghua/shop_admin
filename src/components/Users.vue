<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div>
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="addShow = true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949" @change="changeStatus(scope.row)">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="editShow(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="del(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain @click="assignRoleShow(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addShow">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input autocomplete="off" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input autocomplete="off" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input autocomplete="off" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input autocomplete="off" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改信息" :visible.sync="editUserShow" width="40%">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-tag type="info" v-model="editForm.username">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input autocomplete="off" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input autocomplete="off" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="角色分配" :visible.sync="assignShow" width="40%">
      <el-form :model="assignForm" :rules="assignRules" ref="assignForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-tag type="info" v-model="assignForm.username">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth" prop="rid">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignShow = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      query: '',
      // 当前页
      pagenum: 1,
      // 每页条数
      pagesize: 2,
      // 总条数
      total: 0,
      // 增加功能显示
      addShow: false,
      formLabelWidth: '85px',
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户校验
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            Pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      editUserShow: false,
      // 修改用户数据
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 修改用户校验
      editRules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            Pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 角色分配
      assignForm: {
        username: '',
        roleName: '',
        id: '',
        rid: ''
      },
      // 角色分配表单验证
      assignRules: {
        rid: [{ required: true, message: '请选择一个权限', trigger: 'blur' }]
      },
      // 角色分配显示隐藏
      assignShow: false,
      // 下拉框数据列表
      roleList: {},
      value: ''
    }
  },
  methods: {
    // 获取所有角色信息
    async getRoleList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      // console.log(res)
      if (status === 200) {
        this.roleList = data
      }
    },
    // 封装列表渲染
    getUserList() {
      this.axios
        .get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          // console.log(res)
          if (res.meta.status === 200) {
            this.userList = res.data.users
            this.total = res.data.total
          }
        })
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getUserList()
    },
    // 搜索关键字
    search() {
      this.pagenum = 1
      this.getUserList()
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 发送ajax请求
          this.axios({
            method: 'post',
            url: 'users',
            data: this.addForm,
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            // 提示成功
            this.$message.success('恭喜，添加成功了')
            // 显示最后一页
            this.total++
            this.pagenum = Math.ceil(this.total / this.pagesize)
            // 重新渲染
            this.getUserList()
            // 关闭对话框
            this.addShow = false
            // 清空表单内容
            this.$refs.addForm.resetFields()
          })
        }
      })
    },
    // 删除用户
    del(id) {
      this.$confirm('你确定删除该用户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(`users/${id}`, {
              headers: {
                Authorization: localStorage.getItem('token')
              }
            })
            .then(res => {
              if (res.meta.status === 200) {
                if (this.userList.length === 1 && this.pagenum > 1) {
                  this.pagenum--
                }
                this.$message.success('删除成功')
                this.getUserList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改用户状态
    changeStatus({ id, mg_state: mgStatus }) {
      this.axios.put(`users/${id}/state/${mgStatus}`).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('修改成功了')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 点修改显示对话框并回显数据
    editShow({ id, username, email, mobile }) {
      // 显示对话框
      this.editUserShow = true
      // 数据回显
      this.editForm.id = id
      this.editForm.username = username
      this.editForm.email = email
      this.editForm.mobile = mobile
    },
    // 点击确认按钮修改
    editUser() {
      let { email, mobile } = this.editForm
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        this.axios
          .put(`users/${this.editForm.id}`, {
            email,
            mobile
          })
          .then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              // 重新渲染
              this.getUserList()
              // 关闭对话框
              this.editUserShow = false
            }
          })
      })
    },
    // 点击显示分配角色对话框
    async assignRoleShow(role) {
      // 显示对话框
      this.assignShow = true
      this.assignForm.id = role.id
      this.assignForm.username = role.username
      // 获取角色数据
      // 发送请求获取角色id
      let res = await this.axios.get(`users/${this.assignForm.id}`)
      // console.log(res)
      let { meta: { status }, data: { rid } } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
      // 获取角色列表
      this.getRoleList()
    },
    // 点确定实现分配角色功能
    assignRole() {
      // 验证表单
      this.$refs.assignForm.validate(async valid => {
        if (valid) {
          let { id, rid } = this.assignForm
          let res = await this.axios.put(`users/${id}/role`, {
            rid
          })
          // console.log(res)
          let { meta: { status } } = res
          if (status === 200) {
            // 隐藏对话框
            this.assignShow = false
            // 重新渲染
            this.getRoleList()
            // 提示成功
            this.$message.success('分配成功')
            // 清空表单
            this.$refs.assignForm.resetFields()
          }
        }
      })
    }
  },
  created() {
    // 列表渲染
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
