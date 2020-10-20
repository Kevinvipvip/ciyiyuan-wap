<template>
  <div class="mine-info page">
    <div class="info">
      <div class="info-item">
        <div class="label">头像</div>
        <div class="upload-box">
          <van-uploader :max-size="512000"
                        :after-read="uploadAfter"
                        @oversize="oversize">
            <div class="img"><img :src="avatar"/></div>
          </van-uploader>
        </div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item">
        <div class="label">昵称</div>
        <div class="ipt-box"><input type="text" v-model="nickname"></div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item" v-if="tel">
        <div class="label">手机号</div>
        <div class="ipt-box"><input type="text" disabled v-model="tel"></div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item" @click="bind_tel" v-else>
        <div class="label">手机号</div>
        <div class="bind">绑定手机号</div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item" v-if="wxauth">
        <div class="label">微信号</div>
        <div class="bind">已绑定</div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item" @click="wx_auth" v-else>
        <div class="label">微信号</div>
        <div class="bind">绑定微信号</div>
        <div class="iconfont icon-right icon"></div>
      </div>
    </div>
    <div class="btn" @click="save">保存</div>
  </div>
</template>

<script>
  import avatar from '../assets/mine-avatar-detail.png'

  export default {
    data() {
      return {
        avatar: avatar,
        nickname: "设置昵称",
        tel: '',
        wxauth: false,

        old_nickname: '',//修改前的nickname
        upload_img: '',//上传的图片路径
      };
    },
    mounted() {
      let params = this.utils.get_params();
      this.auth_code = params['code'];
      let wxauth = localStorage.getItem('wxauth');
      if (!wxauth) {
        if (this.auth_code) {
          this.wx_auth_login(this.auth_code);
        }
      }
      this.getMineInfo();
    },
    methods: {
      save() {
        let post = {};
        if (this.upload_img)
          post.avatar = this.upload_img;
        if (this.nickname !== this.old_nickname)
          post.nickname = this.nickname;
        if (Object.keys(post).length) {
          this.utils.ajax(this, 'my/modifyUserInfo', post).then(() => {
            this.$dialog.alert({
              message: '保存成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.upload_img = '';
              this.old_nickname = this.nickname;
            });
          });
        } else {
          this.$toast('未做任何修改');
        }
      },
      // 点击绑定手机号
      bind_tel() {
        console.log('绑定手机号');
        this.$router.push({
          path: '/bind_tel',
          query: {
            url: this.$route.path,
            params: this.$route.query
          }
        });
      },
      // 点击绑定微信
      wx_auth() {
        this.utils.auth(this.$route.fullPath);
      },
      wx_auth_login(code) {
        this.$toast.loading({
          mask: true,
          duration: 10000,
          message: '登录中'
        });

        this.utils.ajax(this, 'login/bindWeixin', { code: code }).then(res => {
          localStorage.setItem('avatar', res.avatar);
          localStorage.setItem('nickname', res.nickname);
          localStorage.setItem('wxauth', res.wxauth);
          this.$toast.clear();
          this.$dialog.alert({
            message: '绑定成功',
            confirmButtonColor: '#b38146'
          }).then(() => {
            this.getMineInfo();
          });
        });
      },
      getMineInfo() {
        this.utils.ajax(this, 'my/getUserInfo').then((res) => {
          this.wxauth = res.wxauth;
          if (res.avatar)
            this.avatar = res.avatar;
          if (res.nickname) {
            this.old_nickname = res.nickname;
            this.nickname = res.nickname;
          }
          if (res.tel)
            this.tel = this.utils.hide_middle_content(res.tel, 'phone');
        });
      },

      //上传图片
      uploadAfter(file) {
        let post = new FormData();
        post.append('file', file.file);
        this.utils.ajax(this, 'upload/uploadFile', post).then(img => {
          this.upload_img = img;
          this.avatar = this.utils.aliyun_format(img);
        });
      },
      // 上传图片大小超出限制
      oversize(file, detail) {
        console.log(file, detail);
        this.$toast('请上传小于512kb的图片');
      },
    }
  };
</script>

<style lang="scss" scoped>
  .mine-info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;

    .info {
      overflow: hidden;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        border-bottom: 2px solid;
        margin: 20px 24px;

        .label {
          font-size: 36px;
          flex-shrink: 0;
          margin-right: 10px;
        }

        .icon {
          margin-left: 5px;
          font-size: 40px;
          flex-shrink: 0;
        }

        .upload-box {
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;

          .img {
            width: 75px;
            height: 75px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            overflow: hidden;

            img {
              height: 100%;
            }
          }
        }

        .ipt-box {
          flex-grow: 1;
          height: 100%;
          box-sizing: border-box;

          input {
            border: none;
            display: block;
            width: 100%;
            height: 100%;
            font-size: 36px;
            text-align: right;
            background: none;
            outline: none;
          }
        }

        .bind {
          flex-grow: 1;
          height: 100%;
          line-height: 80px;
          font-size: 36px;
          text-align: right;
        }
      }
    }

    .btn {
      width: 80%;
      height: 80px;
      color: #ffffff;
      font-size: 36px;
      line-height: 80px;
      text-align: center;
      border-radius: 10px;
      background-color: #b38146;
      box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
      margin: 0 auto 30px;
    }
  }
</style>
