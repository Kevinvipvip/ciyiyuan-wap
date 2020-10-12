<template>
  <div class="footer">
    <div class="footer-top">
      <div class="logo-img">
        <router-link to="/"><img :src="fooetr.logo" alt=""></router-link>
      </div>
      <p class="address">地址：{{fooetr.address}}</p>
      <p>电话：{{fooetr.tel}}</p>
      <p>邮箱：{{fooetr.email}}</p>
    </div>
    <div class="code-box">
      <div class="code">
        <div class="code-img"><img :src="fooetr.tcy_qrcode"/></div>
        <p>关注微信公众号</p>
      </div>
      <div class="code">
        <div class="code-img"><img :src="fooetr.bwgsd_qrcode"/></div>
        <p>关注博物馆商店</p>
      </div>
    </div>
    <div class="copyright">
      <p>版权所有 Copyright©2018-天津瓷艺园 </p>
      <p><a href="https://www.wcip.net">技术支持:山海文化有限公司</a></p>
      <p><a href="http://www.beian.miit.gov.cn" target="_blank">津ICP备18008293号</a></p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return { fooetr: {} };
    }, mounted() {
      this.utils.ajax('index/aboutUs').then((res) => {
        // console.log(res);
        // res.tcy_qrcode = res.tcy_qrcode.replace(/https:\/\/mp.tjtcy.cn/g, 'https://mp.tjtcy.cn/');
        this.utils.aliyun_format(res, 'logo');
        this.fooetr = res;
      });
    }
  };
</script>

<style lang="scss" scoped>
  .footer {
    overflow: hidden;

    .footer-top {
      width: 400px;
      margin: 60px auto 0;

      .logo-img {
        margin-bottom: 50px;

        img {
          width: 100%;
          display: block;
        }
      }

      p {
        font-size: 28px;
        color: #7d8a93;
        line-height: 40px;
      }

      .address {
        margin-bottom: 30px;
      }
    }

    .code-box {
      width: 500px;
      margin: 50px auto;
      display: flex;
      justify-content: space-between;

      .code {
        width: 200px;

        .code-img {
          width: 100%;
          height: 200px;

          img {
            display: block;
            height: 100%;
            width: 100%;
          }
        }

        p {
          font-size: 28px;
          text-align: center;
          color: #000;
        }
      }
    }

    .copyright {
      background: #333;

      p {
        color: #fff;
        font-size: 28px;
        text-align: center;
        line-height: 50px;

        a {
          color: #fff;
          display: block;
        }
      }
    }
  }
</style>
