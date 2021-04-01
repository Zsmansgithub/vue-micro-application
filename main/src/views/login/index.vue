<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title" style="margin-top: 50px;position: relative;top: 100px;visibility: hidden;">圆通星辰系统</h3>
    </div>
    <div class="login_base">
      <div style="text-align: left">
        <img class="img_bg" src="../../assets/login_bg.png"/>
      </div>
      <div class="login_wrapper">
        <div class="login_icon_content">
          <svg-icon class='qrcode-ytom' :style="loginType ? stydiannao : styQR" :icon-class="loginType?'icon_diannao':'icon_QR'"
                    @click="loginType=!loginType"/>
          <div class="login_title"><img src="./../../assets/xclogo.png" alt="">
            <div>圆通星辰系统</div>
          </div>
        </div>
        <div v-show="loginType" id="login_container"></div>
        <div v-show="!loginType" class="login_user_info">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" class="login-form"
                   label-position="left">
            <!--            <div class="login_form_label">用户名</div>-->
            <el-form-item prop="username" class="user_form">
              <span class="svg-container">
                <svg-icon icon-class="user"/>
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                clearable
                auto-complete="on"
              />
            </el-form-item>
            <!--            <div class="login_form_label">密码</div>-->
            <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
              <el-form-item prop="password" class="user_form">
                <span class="svg-container">
                  <svg-icon icon-class="password"/>
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                </span>
              </el-form-item>
            </el-tooltip>
            <el-button :loading="loading" type="primary" class="login_form_sub"
                       @click.native.prevent="handleLogin">登录
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {validUsername} from '@/utils/validate'
  import SocialSign from './components/SocialSignin'

  export default {
    name: 'Login',
    components: {SocialSign},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value || !validUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }
      return {
        mian_deng_code: null,
        loginType: true,
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined,
        styQR: {
          width: '45px',
          height: '45px',
          'margin-top': '10px',
        },
        stydiannao: {
          width: '50px',
          height: '50px',
          'margin-top': '5px',
        }
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {

      // window.addEventListener('storage', this.afterQRScan)
      //   if (typeof window.addEventListener != 'undefined') {
      //       window.addEventListener('message', this.hanndleMessage, false);
      //   } else if (typeof window.attachEvent != 'undefined') {
      //       window.attachEvent('onmessage', this.hanndleMessage);
      //   }
      // const link = document.createElement('script');
      //  link.type = 'text/javascript';
      //   link.src = 'https://g.alicdn.com/dingding/dinglogin/0.0.2/ddLogin.js';
      //   document.body.appendChild(link);
    },
    mounted() {
      // if (this.loginForm.username === '') {
      //   this.$refs.username.focus()
      // } else if (this.loginForm.password === '') {
      //   this.$refs.password.focus()
      // }

      var hanndleMessage = function (event) {
        var origin = event.origin;
        let url = encodeURIComponent("http://xc.yto.net.cn/logindd");
        var goto = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoakbc91puxlsvvss4r&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + url;
        if (origin == "https://login.dingtalk.com") {

          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          window.location.href = goto + "&loginTmpCode=" + loginTmpCode;
        }

      };
      if (typeof window.addEventListener != "undefined") {
        window.addEventListener("message", hanndleMessage, false);
      } else if (typeof window.attachEvent != "undefined") {
        window.attachEvent("onmessage", hanndleMessage);
      }

      let url = encodeURIComponent("http://xc.yto.net.cn/logindd");
      var goto = encodeURIComponent("https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoakbc91puxlsvvss4r&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + url);
      var obj = this.DDLogin({
        id: "login_container",
        goto: goto,
        style: "border:none;background-color:#ffffff;",
        // style: 'padding: 0;margin: 0;',
        width: "200",
        height: "200"
      });
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)

    },
    methods: {
      DDLogin(a) {
        var c = document.createElement("iframe"),
          d = "https://login.dingtalk.com/login/qrcode.htm?goto=" + a.goto;
        d += a.style ? "&style=" + a.style : "";
        d += a.href ? "&href=" + a.href : "";
        c.src = d;
        c.id = 'iframe';
        c.frameBorder = "0";
        c.allowTransparency = "true";
        c.scrolling = "no";
        c.width = "320px";
        c.height = "300px";
        var e = document.getElementById(a.id);
        e.innerHTML = "";
        e.appendChild(c);
      },
      hanndleMessage(event) {
        // var dd_appid = 'dingoaroe7pejhwgpiyyrw';
        // var redirect_url = 'http://.yto.net.cn/authjwt';
        // var gotoUrl = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
        // '?appid=' + dd_appid +
        // '&response_type=code' +
        // '&scope=snsapi_login' +
        // '&state=STATE&redirect_uri=' + encodeURIComponent(redirect_url);
        var origin = event.origin;
        console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          console.log("loginTmpCode", loginTmpCode);
          window.location.href = gotoUrl + '&loginTmpCode=' + loginTmpCode
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({path: this.redirect || '/'})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })

        }

      },
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || '/'})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #c9b6d4;
  $light_gray: rgba(0, 0, 0, 1);
  $cursor: #000000;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  .login_base_xx {
    position: absolute;
  }

  /* reset element-ui css */
  .login-container {
    text-align: center;
    width: 100%;
    // min-width: 1400px;

    .el-input {
      display: inline-block;
      height: 40px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 40px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-head {
    position: relative;
  }

  .login-container {
    text-align: center;
    min-height: 100%;
    /*background-image: url('../../assets/login_bg.png');*/
    /*background-repeat: no-repeat;*/
    background-color: rgb(12, 38, 126);
    width: 100%;
    min-width: 100%;
    overflow: hidden;

    .login-form {
      width: 520px;
      /*height: 273px;*/
      max-width: 100%;
      padding: 65px 25px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 0 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }

  .el-main {
    text-align: center;
    line-height: 160px;
  }

  .loginsss-form {
    height: 300px;
  }

  .login_wrapper {
    text-align: center;
    width: 340px;
    /*height: 335px;*/
    height: 410px;
    padding-top: 92px;
    position: absolute;
    right: 18%;
    top: 130px;
    background-color: #f9f9f9;
    overflow: hidden;
    border-radius: 5px;

    .login_icon_content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: right;
      z-index: 333;

      .qrcode-ytom {
        margin-right: 10px;
      }

      .login_title {
        padding-left: 62px;
        margin-top: -10px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;

        & > img {
          width: 60px;
          flex: 0 0 70px;
          padding-right: 10px;
        }
      }
    }

    #login_container {
      position: absolute;
      top: 90px;
      left: 10px;
    }

    .login_user_info {
      position: absolute;
      top: 90px;
      left: 0;
      width: 100%;

      .user_form {
        margin-bottom: 36px;
        height: 40px
      }
    }

    .login_form_title {
      text-align: left;
      font-weight: bold;
      position: relative;
      top: -35px;
      padding-bottom: 2px;
    }

    .login_form_label {
      text-align: left;
      padding: 9px 0;
    }

    .login_form_sub {
      width: 100%;
      height: 40px;
      background-color: rgb(11, 36, 119);
      border-color: rgb(11, 36, 119);

      &:hover {
        opacity: .9;
      }
    }

    /deep/ .el-input__inner {
      &:focus {
        border-color: rgb(11, 36, 119);
      }
    }
  }

  .login_base {
    position: relative;
    width: 100%;
    height: 645px;
    // min-width: 1400px;
    .img_bg {
      width: 751px;
      height: 641px;
      margin-left: 9%;
    }
  }

  @media only screen and (max-width: 1680px) {
    .login_base {
      .img_bg {
        width: 665px;
        height: 567px;
      }
    }
    .login_wrapper {
      /*width: 310px;*/
      /*height: 335px;*/
      right: 18%;
      top: 110px;

      .login_user_info {
        /*top: 25px;*/
      }
    }
  }

  @media only screen and (max-width: 1440px) {
    .title-container {
      margin-bottom: 0;

      h3 {
        margin-top: 0 !important;
      }
    }
    .login_base {
      height: 550px;

      .img_bg {
        width: 623px;
        height: 531px;
        margin-left: 7%;
      }
    }
    .login_wrapper {
      right: 15%;
      top: 100px;
    }
  }

  @media only screen and (max-width: 1380px) {
    .title-container {
      display: none;
    }
  }

  @media only screen and (max-width: 1200px) {
    .login_wrapper {
      right: 5%;
    }
  }

  @media only screen and (max-width: 800px) {
    .login_base {
      height: 300px;

      .img_bg {
        width: 500px;
        height: 100%;
        margin-left: 0;
      }
    }
    .login_wrapper {
      top: 20px;
      width: 280px;

      .login_icon_content {
        .login_title {
          padding-left: 20px;
        }
      }

      #login_container {
        padding-left: 0;
        margin-left: -30px;
      }
    }
  }
</style>
