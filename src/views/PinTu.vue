<template>
  <div class="pin-index page">
    <ul>
      <li v-for="(item,index) in imgs" :key="index" :class="active === index?'on':''" @click="choice_img(index)">
        <div class="img" :style="'background-image:url('+item+')'"></div>
      </li>
    </ul>
    <div class="btn">
      <div class="btn-start" @click="jump" v-if="active === 0">开始游戏</div>
      <div class="btn-start none-click" v-else>开始游戏</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 0,
        imgs: [
          this.config.aliyun + 'static/pin/1.jpg',
          this.config.aliyun + 'static/pin/2.jpg',
          this.config.aliyun + 'static/pin/3.jpg',
          this.config.aliyun + 'static/pin/4.jpg',
        ]
      };
    },
    methods: {
      choice_img(num) {
        this.active = num;
      },
      jump() {
        this.$router.push({
          name: 'pin'
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pin-index {
    overflow: hidden;

    ul {
      display: flex;
      justify-content: space-between;
      margin: 24px 24px 100px;
      flex-wrap: wrap;

      li {
        width: calc(50% - 12px);
        height: 500px;
        margin-top: 24px;

        &:nth-child(-n+2) {
          margin-top: 0;
        }

        &.on {
          /*box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);*/
          border: 2px solid #b38146;
          box-sizing: border-box;
        }

        .img {
          width: 100%;
          height: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }

    .btn {
      position: fixed;
      height: 100px;
      background: #ffffff;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;

      .btn-start {
        font-size: 36px;
        line-height: 64px;
        text-align: center;
        width: 460px;
        height: 60px;
        margin: 20px auto;
        color: #ffffff;
        background-color: #b38146;
        box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
        border-radius: 10px;
      }
    }
  }
</style>
