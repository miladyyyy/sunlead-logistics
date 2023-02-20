<template>
  <div class="login-container">
    <div class="shadow">
      <video src="@/assets/video/video.mp4" loop autoplay muted></video>
      <div class="login-form">
        <el-form :model="formData" ref="form" :rules="rules">
          <div class="title-container">
            <img src="@/assets/img/logo1.png" />
          </div>
          <el-form-item prop="account">
            <el-input placeholder="账号" v-model="formData.account">
              <template #prefix>
                <img class="icon-img" src="@/icon/user.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              type="password"
              show-password
              v-model="formData.password"
            >
              <template #prefix>
                <img class="icon-img" src="@/icon/lock.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input placeholder="验证码" v-model="formData.code">
              <template #prefix>
                <img class="icon-img" src="@/icon/validate.png" />
              </template>
              <template #suffix>
                <img class="code-img" :src="captchaUrl" @click="getCaptcha" />
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" class="login-button" @click="login">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getCaptchaAPI, loginAPI } from '@/api/permission'
import { mapMutations } from 'vuex'

export default {
  name: 'LoginView',
  data () {
    return {
      form: '',
      captchaUrl: '',
      formData: {
        account: 'shenlingadmin',
        password: '123456',
        key: '',
        code: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },

  created () {
    this.formData.key = Array.from(
      window.crypto.getRandomValues(new Uint32Array(4)),
      (x) => x.toString(16).padStart(8, '0')
    ).join('')
    this.getCaptcha()
  },
  methods: {
    ...mapMutations('user', ['handleLogin']),

    async getCaptcha () {
      const { data } = await getCaptchaAPI(this.formData.key)
      const blob = new Blob([data]) // 返回的文件流数据
      const url = window.URL.createObjectURL(blob) // 将他转化为路径
      this.captchaUrl = url
    },

    async  login () {
      await this.$refs.form.validate()
      try {
        const { data: { data } } = await loginAPI(this.formData)
        this.handleLogin(data)
        this.$router.push('/')
      } catch (error) {
        this.getCaptcha()
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  background-size: 100% 100%;
  height: 100vh;
  overflow-y: hidden;
  position: relative;

  .shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // opacity: .3;
    // background: #1a1c41;

    video {
      object-fit: fill;
      height: 100%;
      width: 100%;
    }

    .login-form {
      position: absolute;
      top: 45%;
      left: 45%;
      width: 450px;
      height: 467px;
      background: #fff;
      margin: -180px 0 0 -160px;
      padding: 36px 40px;
      border-radius: 10px;
    }

    .title-container {
      position: relative;
      margin-bottom: 28px;
      text-align: center;

      img {
        height: 54px;
      }
    }
    ::v-deep .el-form-item__content .el-input__inner {
      padding-left: 48px;
      height: 50px;

      ::v-deep .el-input__icon {
        font-size: 20px;
      }
    }

    .login-button {
      width: 100%;
      height: 54px;
      margin-bottom: 14px;
      margin-top: 22px;
      font-size: 18px;
      color: #fff;
      font-weight: 700;
    }
  }
}

.icon-img {
  width: 21px;
  height: 21px;
  position: absolute;
  left: 14px;
  top: 13px;
}
.code-img {
  vertical-align: top;
  width: 71px;
  height: 32px;
  cursor: pointer;
  margin-left: 10px;
  position: absolute;
  right: 10px;
  top: 9px;
}
</style>
