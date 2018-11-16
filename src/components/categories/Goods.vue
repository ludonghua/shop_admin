<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodsList">
      <el-table-column type="index" :index="indexFn"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      query: '',
      currentpage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    // 封装页面渲染
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentpage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let { meta: { status }, data: { goods, total } } = res
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.currentpage = 1
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.getGoodsList()
    },
    // 表格前序列号
    indexFn(index) {
      return this.pageSize * (this.currentpage - 1) + index + 1
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
