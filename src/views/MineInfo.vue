<template>
  <div class="mine-info page">
    <div class="info">
      <div class="info-item">
        <div class="label">头像</div>
        <div class="img"><img :src="avatar"/></div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item">
        <div class="label">昵称</div>
        <div class="ipt-box"><input type="text" v-model="nickname"></div>
        <div class="iconfont icon-right icon"></div>
      </div>
      <div class="info-item">
        <div class="label">手机号</div>
        <div class="ipt-box"><input type="text" v-model="tel"></div>
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
      };
    },
    mounted() {
      this.utils.ajax(this, 'my/getUserInfo').then((res) => {
        console.log(res);
        if (res.avatar)
          this.avatar = res.avatar;
        if (res.nickname)
          this.nickname = res.nickname;
        this.tel = this.utils.hide_middle_content(res.tel, 'phone');
      });
    },
    methods: {
      save() {
        console.log('保存成功')
      }
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

        .img {
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;
          height: 90%;

          img {
            height: 100%;
            width: auto;
            background-color: #333333;
            border-radius: 50%;
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
          }
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
