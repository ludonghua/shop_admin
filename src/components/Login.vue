<template>
  <div class="login">
    <el-form :model="form" label-width="80px" :rules="rules" ref="form" status-icon>
      <div class="logo"></div>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input >
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" @keyup.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button @click="logout">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 判断用户名非空
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'change' }
        ],
        // 判断密码非空
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios
            .post('http://localhost:8888/api/private/v1/login', {
              username: this.form.username,
              password: this.form.password
            })
            .then(res => {
              console.log(res.data)
              this.$message({
                message: res.data.meta.msg,
                type: 'success'
              })
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
            })
        } else {
          this.$message.error('用户名或密码错误！')
          return false
        }
      })
    },
    logout() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang=less scoped>
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin-left: 50%;
    margin-top: 200px;
    transform: translateX(-50%);
    border: 1px solid #ccc;
    padding: 75px 50px 15px;
    border-radius: 20px;
    position: relative;
    background-color: #fff;
    .logo {
      width: 110px;
      height: 110px;
      position: absolute;
      left: 50%;
      top: -80px;
      transform: translateX(-50%);
      background-image: url('../assets/avatar.jpg');
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button:nth-child(2) {
      margin-left: 90px;
    }
  }
}
</style>
