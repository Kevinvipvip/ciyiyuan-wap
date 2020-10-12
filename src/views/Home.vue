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
          // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，
          // 也就意味着你可以在第一时间获取到swiper对象，
          // 假如你需要刚加载遍使用获取swiper对象来做什么事，
          // 那么这个属性一定要是true
          // notNextTick: true,
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
      }
    },
    mounted() {
      this.utils.ajax('index/slideList').then((slides) => {
        this.utils.aliyun_format(slides, 'pic');
        this.banner = slides;
      });
      this.utils.ajax('index/articleList', { page: 1, perpage: 5 }).then((res) => {
        this.information = res.list;
      });
      this.utils.ajax('index/collectCateList').then((res) => {
        this.utils.aliyun_format(res, 'pic', 2);
        let arr = [];
        for (let i = 0; i < this.cate_length; i++) {
          if (res[i]) {
            arr.push(res[i]);
          }
        }
        this.collect_cate = arr;
      })
    },
    methods: {
      // 点击前往资讯详情
      openInfoDetail(id) {
        this.$router.push({
          name: 'infodetail',
          query: {
            id: id
          }
        })
      },
      goToCollect(id, name) {
        this.$router.push({
          path: '/collectionsclassify',
          query: {
            id: id,
            name: name
          }
        })
      }
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

  }
</style>
