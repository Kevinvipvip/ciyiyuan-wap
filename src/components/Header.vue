<template>
  <div class="header" :style="'background-color:'+bgColor">
    <div class="nav-box" @click="showNav"><i class="iconfont icon-gengduo-2"></i></div>
    <div class="logo-box">{{title}}</div>
    <van-popup v-model="show" position="left" :overlay="true"
               :overlay-style="{'background-color': 'rgba(0,0,0,0.3)'}">
      <div class="nav">
        <h3>
          <router-link to="/">首页</router-link>
        </h3>
        <ul>
          <!--<li>-->
          <!--<router-link to="/activitie">专题活动</router-link>-->
          <!--</li>-->
          <li>
          <router-link to="/news">资讯中心</router-link>
          </li>
          <!--<li>-->
          <!--<router-link to="/calligraphy">书画</router-link>-->
          <!--</li>-->
          <!--<li>-->
          <!--<router-link to="/photography">摄影</router-link>-->
          <!--</li>-->
          <li>
            <router-link to="/ticket">门票</router-link>
          </li>
          <li>
            <router-link to="/collections">馆藏精品</router-link>
          </li>
          <!--<li>-->
          <!--<router-link to="/shop">文创产品</router-link>-->
          <!--</li>-->
          <!--<li>-->
          <!--<router-link to="/identify">文物鉴定</router-link>-->
          <!--</li>-->
          <!--<li>-->
          <!--<router-link to="/subscribe">预约摄影</router-link>-->
          <!--</li>-->
          <li>
            <router-link to="/mine">个人中心</router-link>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
        title: '瓷艺园',
        show: false,
        bgColor: '#dcdcdc',
      }
    },
    watch: {
      $route(to) {
        this.show = false;
        this.bgColor = '#dcdcdc';
        switch (to.name) {
          case 'collectionsclassify':
            this.title = to.query.name;
            break;
          default:
            this.title = to.meta.title;
            if (to.meta.title_bg) {
              this.bgColor = to.meta.title_bg;
            }
            break;
        }
        // console.log(to, 'to');
      }
    },
    methods: {
      showNav() {
        this.show = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: #fff;
    right: 0;
    height: 80px;
    line-height: 80px;

    .logo-box {
      margin: 0 100px;
      font-size: 38px;
      color: #000000;
      text-align: center;
    }

    .nav-box {
      display: flex;
      justify-content: center;
      align-items: center;
      float: right;
      width: 100px;
      height: 100%;

      i {
        font-size: 42px;
      }
    }

    .nav {
      height: 100vh;
      overflow: hidden;
      width: 55vw;
      color: #333;

      h3 {
        margin: 20px 50px;
        font-weight: normal;

        a {
          line-height: 80px;
          font-size: 38px;
          color: #010101;
        }
      }

      ul {
        margin-left: 50px;

        li {
          height: 80px;
          line-height: 80px;

          a {
            display: block;
            height: 100%;
            font-size: 30px;
            color: #010101;
          }
        }
      }
    }
  }
</style>
