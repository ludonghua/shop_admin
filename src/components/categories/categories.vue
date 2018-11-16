<template>
  <div class="categories">
    <el-button type="success" plain @click="addCategoryShow">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="catList" width="100%" ref="catList">
      <!-- childKey: 指定子元素集合的属性名，默认值是children -->
      <!-- tree-key: 每个节点的唯一标识 默认值  id   cat_id -->
      <!-- parent-key： 指定当前节点的父节点， 如果不指定，没法收起来 -->
      <!-- level-key: 指定节点的层级 -->
      <el-element-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20"
      >
      </el-element-tree-column>
      <el-table-column label="是否有效" prop="cat_deleted">
        <template slot-scope="scope">
          {{catList.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" plain @click="editCategoryShow(scope.row.cat_id)"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" plain @click="delCategory(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size= pageSize
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addShow">
      <el-form :model="addForm" :rules="addRules" ref="addForm" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="cat_name">
          <el-input autocomplete="off" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父及名称" prop="cat_pid" :label-width="formLabelWidth">
          <el-cascader
            :options="options"
            v-model="addForm.cat_pid"
            change-on-select
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editShow">
      <el-form :model="editForm" :rules="addRules" ref="editForm" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="cat_name">
          <el-input
            autocomplete="off"
            v-model="editForm.cat_name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      // 添加分类数据
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      // 添加分类校验
      addRules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      // 控制添加分类显示
      addShow: false,
      formLabelWidth: '85px',
      // 级联
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editShow: false,
      editForm: {
        cat_name: '',
        cat_pid: ''
      }
    }
  },
  methods: {
    // 封装列表渲染
    async getCatList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      })
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.catList = data.result
        this.total = data.total
      }
    },
    // 分页部分
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCatList()
    },
    // 分页部分选择页跳转
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCatList()
    },
    // 点击添加分类显示对话框
    async addCategoryShow() {
      this.addShow = true
      // 发送请求获取数据
      let res = await this.axios.get(`categories?type=2`)
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    // 点击确定按钮添加分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 解构赋值
        let { cat_pid: catPid, cat_name: catName } = this.addForm
        let res = await this.axios.post(`categories`, {
          cat_pid: catPid[catPid.length - 1],
          cat_name: catName,
          cat_level: catPid.length
        })
        if (res.meta.status === 201) {
          console.log(res)

          // 重新渲染
          this.getCatList()
          // 关闭对话框
          this.addShow = false
          // 清空表单
          this.$refs.addForm.resetFields()
          // 提示成功
          this.$message.success('添加成功')
        }
      })
    },
    // 删除分类功能
    async delCategory(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${id}`)
        // console.log(res)
        if (res.meta.status === 200) {
          // 重新渲染
          this.getCatList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    // 修改分类显示对话框
    async editCategoryShow(id) {
      // 存id
      this.cat_pid = id
      this.editShow = true
      let res = await this.axios.get(`categories/${id}`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.editForm.cat_name = data.cat_name
      }
    },
    // 修改分类功能实现
    async editCategory() {
      let res = await this.axios.put(`categories/${this.cat_pid}`, {
        cat_name: this.editForm.cat_name
      })
      console.log(res)
      if (res.meta.status === 200) {
        // 重新渲染
        this.getCatList()
        this.editShow = false
        this.$message.success('修改成功')
      }
    }
  },
  created() {
    // 页面渲染
    this.getCatList()
  }
}
</script>

<style>
</style>
