<template>
  <div id="login">
    <div class="models">
      <div class="models__wrapper">
        <div class="models__wrapper__container">
          <div class="main"></div>
          <div class="form">
            <h3 @click="showRegister">创建账户</h3>
            <transition name="fade">
              <div v-show="isShowRegister" class="register">
                <input
                  v-model="register.username"
                  type="text"
                  placeholder="用户名"
                />
                <input
                  v-model="register.password"
                  type="password"
                  placeholder="密码"
                />

                <p :class="{ error: register.isError }">
                  {{ register.notice }}
                </p>
                <div @click="onRegister" class="button">创建账号</div>
              </div>
            </transition>
            <h3 @click="showLogin">登录</h3>
            <transition name="fade">
              <div v-show="isShowLogin" class="login">
                <input
                  v-model="login.username"
                  type="text"
                  placeholder="输入用户名"
                />
                <input
                  v-model="login.password"
                  type="password"
                  placeholder="密码"
                />
                <p :class="{ error: login.isError }">{{ login.notice }}</p>
                <div @click="onLogin" class="button">登录</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/helper/request";
import Auth from "@/apis/auth";
import bus from "@/helper/bus";
import { mapState, mapActions, mapGetters } from "vuex";
Auth.getInfo().then((data) => {
  console.log(data);
});
export default {
  name: "Login",
  data() {
    return {
      isShowLogin: true,
      isShowRegister: false,
      login: {
        username: "sunrui",
        password: "123456",
        notice: "请输入用户名和密码",
        isError: false,
      },
      register: {
        username: "sunrui",
        password: "123456",
        notice: "创建账号号请输入用户名和密码",
        isError: false,
      },
    };
  },
  methods: {
    ...mapActions({
      loginUser: "login",
      registerUser: "register",
    }),
    showRegister() {
      (this.isShowRegister = true), (this.isShowLogin = false);
    },
    showLogin() {
      (this.isShowRegister = false), (this.isShowLogin = true);
    },
    onRegister() {
      console.log("register");
      let result1 = this.validUsername(this.register.username);
      if (!result1.isValid) {
        //如果其结果为true,则下面的代码没有生效
        this.register.isError = true;
        this.register.notice = result1.notice;
        return;
      }
      let result2 = this.validPassword(this.register.password);
      if (!result2.isValid) {
        //如果其结果为true,则下面的代码没有生效
        this.register.isError = true;
        this.register.notice = result2.notice;
        return;
      }
      console.log(
        `注册成功,用户名是${this.register.username},密码是${this.register.password}`
      );
      //注册数据接口
      this.registerUser({
        username: this.register.username,
        password: this.register.password,
      })
        .then(() => {
          this.register.isError = false;
          this.register.notice = "";
          // this.$router.push({ path: "/notebooks" });
          console.log(data);
        })
        .catch((data) => {
          this.register.isError = true;
          this.register.notice = data.msg;
          console.log(data);
        });
    },
    onLogin() {
      console.log("login");
      let result1 = this.validUsername(this.login.username);
      if (!result1.isValid) {
        this.login.isError = true;
        this.login.notice = result1.notice;
        return;
      }
      let result2 = this.validPassword(this.login.password);
      if (!result2.isValid) {
        this.login.isError = true;
        this.login.notice = result2.notice;
        return;
      }

      console.log(
        `登录成功,用户名是${this.register.username},密码是${this.register.password}`
      );
      // 登录数据接口
      this.loginUser({
        username: this.login.username,
        password: this.login.password,
      })
        .then(() => {
          this.login.isError = false;
          this.login.notice = "";
          this.$router.push({ path: "/notebooks" });
          console.log("start redirect...");
        })
        .catch((data) => {
          this.login.isError = true;
          this.login.notice = data.msg;
          console.log(data);
        });
    },
    validUsername(username) {
      return {
        isValid: /^[\w\u4e00-\u9fa5]{3,15}$/.test(username),
        notice: "用户名必须是3-15个字符，仅限数组字母下划线",
      };
    },
    validPassword(password) {
      return {
        isValid: /^.{6,16}$/.test(password),
        notice: "密码长度为6-16位字符",
      };
    },
  },
};
</script>

<style  lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.models {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
  &__wrapper {
    display: table-cell;
    vertical-align: middle;
    &__container {
      width: 800px;
      height: 500px;
      margin: 0px auto;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      display: flex;
      .main {
        flex: 1;
        background: #36bc64
          url(//cloud.hunger-valley.com/17-12-13/38476998.jpg-middle) center
          center no-repeat;
        background-size: contain;
      }
      .form {
        width: 270px;
        border-left: 1px solid #ccc;

        h3 {
          padding: 10px 20px;
          font-weight: normal;
          font-size: 16px;
          border-top: 1px solid #eee;
          cursor: pointer;
          &:nth-of-type(2) {
            border-bottom: 1px solid #eee;
          }
        }

        .button {
          background-color: #2bb964;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-weight: bold;
          color: #fff;
          border-radius: 4px;
          margin-top: 18px;
          cursor: pointer;
        }
        .login,
        .register {
          padding: 10px 20px;
          border-top: 1px solid #eee;

          input {
            display: block;
            width: 100%;
            height: 35px;
            line-height: 35px;
            padding: 0 6px;
            border-radius: 4px;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            margin-top: 10px;
          }
          input:focus {
            border: 3px solid #9dcaf8;
          }

          p {
            font-size: 12px;
            margin-top: 10px;
            color: #444;
          }
          .error {
            color: red;
          }
        }
        .login {
          border-top: 0;
        }
      }
    }
  }
}
</style>