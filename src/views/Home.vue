<template>
  <div class="home page">
    <!--轮播图-->
    <div class="swiper">
      <swiper v-if="banner.length>0" :options="swiperOption" class="swiper-wrap" ref="mySwiper">
        <swiper-slide v-for="(item,index) in banner" :key="index" class="my-swiper-item"
                      :style="'background-image: url('+item.pic+'?x-oss-process=image/resize,w_750)'">
          <router-link v-if="item.url" class="router-link" :to="item.url"></router-link>
        </swiper-slide>
        <!-- 常见的小圆点 -->
        <div class="swiper-pagination" v-for="(item,index) in banner" :key="index" slot="pagination"></div>
      </swiper>
    </div>
    <!--资讯-->
    <div class="information">
      <p class="information-title">资讯</p>
      <swiper v-if="information.length>0" :options="informationOption" class="information-wrap" ref="mySwiper">
        <swiper-slide v-for="(item,index) in information" :key="index" class="information-wrap-item">
          <p @click="openInfoDetail(item.id)">{{item.title}}</p>
        </swiper-slide>
      </swiper>
    </div>
    <!--公共的标题-->
    <div class="title">
      <span>|</span>
      <h3>藏品分类</h3>
      <span>|</span>
    </div>
    <div class="collect-cate">
      <ul>
        <li v-for="(item,index) in collect_cate" :key="index" @click="goToCollect(item.id,item.cate_name)"
            :style="'background-image:url('+item.pic+')'">
          {{item.cate_name}}
        </li>
      </ul>
    </div>

    <!--公共的标题-->
    <div class="title">
      <span>|</span>
      <h3>瓷艺园介绍</h3>
      <span>|</span>
    </div>
    <div class="brief">
      <div class="img"><img :src="about.intro_cover+'?x-oss-process=image/resize,w_750'"/></div>
      <div class="brief-cont">
        <p>{{about.desc}}</p>
      </div>
      <div class="video-box">
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)">
        </video-player>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'// 这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  import { swiper, swiperSlide } from 'vue-awesome-swiper' // 引入slider组件

  export default {
    name: 'Home',
    components: {
      swiper,
      swiperSlide,
    },
    data() {
      return {
        banner: [],
        swiperOption: {
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          speed: 800,
          direction: 'horizontal',
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: 'bullets'
          }
        },
        // 资讯
        information: [],
        informationOption: {
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          speed: 800,
          direction: 'vertical',
          grabCursor: true
        },

        cate_length: 4,//显示在首页的分类个数
        collect_cate: [],//藏品分类

        about: {},//关于瓷艺园
        playerOptions: {//视频播放器配置
          autoplay: false,
          muted: false, // 默认情况下将会消除任何音频。
          loop: true, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'video/mp4',
            src: ''
          }],
          // 你的封面地址
          poster: '',
          width: document.documentElement.clientWidth,
          // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          notSupportedMessage: '此视频暂无法播放，请稍后再试'
        },
      }
    },
    mounted() {
      this.utils.ajax(this, 'index/slideList').then((slides) => {//获取轮播图列表
        this.utils.aliyun_format(slides, 'pic');
        this.banner = slides;
      });
      this.utils.ajax(this, 'index/articleList', { page: 1, perpage: 5 }).then((res) => {//获取资讯列表
        this.information = res.list;
      });
      this.utils.ajax(this, 'index/collectCateList').then((res) => {//获取馆藏精品分类
        this.utils.aliyun_format(res, 'pic', 2);
        let arr = [];
        for (let i = 0; i < this.cate_length; i++) {
          if (res[i]) {
            arr.push(res[i]);
          }
        }
        this.collect_cate = arr;
      });
      this.utils.ajax(this, 'index/aboutUs').then((res) => {//获取瓷艺园简介
        this.playerOptions.sources = [{
          type: 'video/mp4',
          src: res.video_url
        }];
        this.playerOptions.poster = res.intro_cover + '?x-oss-process=image/resize,w_750';
        this.utils.aliyun_format(res, 'logo');
        this.about = res;
      });
    },
    methods: {
      openInfoDetail(id) {// 点击前往资讯详情
        this.$router.push({
          name: 'newsdetail',
          query: {
            id: id
          }
        })
      },

      goToCollect(id, name) {// 点击前往藏品分类列表
        this.$router.push({
          path: '/collectionsclassify',
          query: {
            id: id,
            name: name
          }
        })
      },
      onPlayerPlay() {
        console.log('播放')
      },
      onPlayerPause() {
        console.log('暂停')
      },
    }
  }
</script>
<style scoped lang="scss">
  .home {
    /*公共的标题*/
    .title {
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        line-height: 30px;
        font-weight: normal;
        color: #000;
        font-size: 28px;
      }

      h3 {
        font-size: 38px;
        padding: 0 20px;
        font-weight: normal;
        color: #000;
      }
    }

    /*轮播图*/
    .swiper {
      height: 350px;

      .swiper-wrap {
        height: 100%;

        .my-swiper-item {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          .router-link {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    /*资讯*/
    .information {
      height: 80px;
      overflow: hidden;
      margin: 10px 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .information-title {
        width: 70px;
        height: 45px;
        flex-shrink: 0;
        background-color: #000000;
        border-radius: 10px;
        font-size: 24px;
        color: #ffffff;
        margin-right: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .information-wrap {
        height: 100%;
        flex-grow: 0;

        .information-wrap-item {
          height: 100%;
          display: flex;
          align-items: center;

          p {
            font-size: 26px;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    /*藏品分类*/
    .collect-cate {
      margin: 10px 40px 40px;

      ul {
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;

        li {
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          width: 155px;
          height: 155px;
          background-color: #000000;
          border-radius: 10px;
          color: #fff;
          font-size: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          margin-right: 16.6px;

          &:nth-child(-n+4) {
            margin-top: 0;
          }

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }


    .brief {
      margin: 10px 40px;

      .img {
        min-height: 300px;
      }

      .brief-cont {
        margin-top: 26px;
        margin-bottom: 20px;

        p {
          text-align: justify;
          font-size: 26px;
          line-height: 40px;
          color: #666666;
        }
      }

      .video-box {
        /deep/ .vjs-custom-skin {
          .video-js .vjs-big-play-button {
            width: 100px !important;
            height: 100px !important;
            border-radius: 50%;
            z-index: 100;
            margin: 0 !important;
            transform: translate(-50%, -50%);
            border: solid 1px #979797;
          }

          .video-js .vjs-big-play-button {
            line-height: 100px !important;
          }
        }
      }

    }
  }
</style>
