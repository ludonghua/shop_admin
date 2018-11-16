<template>
  <div class="goodsAdd">
    <!-- 步骤条 -->
    <el-steps :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏切换 -->
    <el-tabs tab-position="left" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="addForm" ref="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="addForm.goods_cat"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          :headers="headers"
          :on-success="handleSuccess"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="height:200px">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        pics: []
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      options: [],
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    handleClick(tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    // 下一步
    next(active, activeName) {
      this.activeName = activeName
      this.active = active
    },
    // 图片上传on-success方法
    handleSuccess(res) {
      // console.log(res)
      let { meta: { status }, data: { tmp_path: tmpPath } } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpPath
        })
        // console.log(this.addForm.pics)
      }
    },
    async addGood() {
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加成功 了')
      }
    }
  },
  async created() {
    let res = await this.axios.get(`categories?type=3`)
    // console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-container {
    height: 250px;
  }
}
</style>
