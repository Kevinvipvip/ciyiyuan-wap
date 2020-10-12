<template>
  <div class="collect page">
    <div class="collect-img">
      <swiper v-if="collect.pics.length>0" :options="swiperOption" class="swiper-wrap" ref="mySwiper">
        <swiper-slide v-for="(item,index) in collect.pics" :key="index" class="my-swiper-item"
                      :style="'background-image: url('+item+'?x-oss-process=image/resize,w_750)'">
        </swiper-slide>
        <!-- 常见的小圆点 -->
        <div class="swiper-pagination" v-for="(item,index) in collect.pics" :key="index" slot="pagination"></div>
      </swiper>
    </div>
    <h3>{{collect.title}}</h3>
    <div class="listen">
      <!--@ended="endPlay"音乐结束时执行的时间-->
      <aplayer repeat="repeat-one" class="audio" theme='#000' :music="music"></aplayer>
    </div>
    <div class="introduce-box" v-html="collect.detail"></div>
    <div class="title">推荐</div>
    <div class="recommend-collect">
      <div class="recommend-collect-img" v-for="(v,index) in recommendCollect" @click="openCollectDetail(v.id)"
           :key="index" :style="'background-image: url('+v.cover+'?x-oss-process=image/resize,w_300)'"></div>
    </div>
  </div>
</template>

<script>
  import Aplayer from 'vue-aplayer'
  import 'swiper/dist/css/swiper.css'// 这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  import { swiper, swiperSlide } from 'vue-awesome-swiper' // 引入slider组件

  export default {
    name: 'CollectionsDetail',
    data() {
      return {
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

        collect: {
          pics: []
        },
        recommendCollect: [],
        isPlay: 'icon-play',
        flag: true,
        music: {
          title: '',
          src: '',
          pic: '',
          artist: '语音导览'
        }
      }
    },
    created() {
      let id = parseInt(this.$route.query.id);
      this.getCollections(id)
    },
    // 跳转本页是参数变化后重新调取商品详情数据
    beforeRouteUpdate(to, from, next) {
      this.getCollections(to.query.id);
      next()
    },
    methods: {
      openCollectDetail(id) {
        this.collect.pics = [];
        this.$router.replace({
          path: '/collectionsdetail',
          query: {
            id: id
          }
        });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      getCollections(id) {
        this.$toast({
          duration: 0,
          forbidClick: true,
          type: 'loading',
          message: '数据加载中...'
        });
        this.utils.ajax('collect/collectDetail', { id: id }).then((res) => {
          // console.log(res);
          this.utils.aliyun_format(res, 'audio_url');
          this.utils.aliyun_format(res.pics);
          res.img = res.pics[0];
          let music = {
            title: res.title,
            src: res.audio_url,
            pic: res.img,
            artist: '语音导览'
          };
          this.collect = res;
          this.music = music
        }).then(() => {
          this.utils.ajax('collect/similarCollectList', { id: id }).then((res) => {
            this.utils.aliyun_format(res, 'cover', 2);
            this.recommendCollect = res;
            this.$toast.clear()
          })
        })
      }
    },
    components: {
      swiper,
      swiperSlide,
      Aplayer
    }
  }
</script>

<style scoped lang="scss">
  .collect {
    overflow: hidden;
    box-sizing: border-box;

    .collect-img {
      height: 750px;

      .swiper-wrap {
        height: 100%;

        .my-swiper-item {
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
    }

    h3 {
      font-size: 34px;
      font-weight: normal;
      text-align: center;
      margin: 38px 0 20px;
      line-height: 42px;
      color: #000000;
    }

    .desc-box {
      margin: 0 40px;
      font-size: 28px;
      line-height: 42px;
      color: #888888;
      text-align: justify;
    }

    .listen {
      margin: 24px 40px 35px;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;

      .audio {
        width: 100%;
        background: #eee;
      }
    }

    .introduce-box {
      margin: 0 40px;
      text-align: justify;
      font-size: 30px;
      line-height: 42px;
      color: #888888;

      /deep/ img {
        max-width: 100%;
      }
    }

    .title {
      margin: 36px 40px 0;
      font-size: 30px;
      line-height: 42px;
      color: #000000;
    }

    .recommend-collect {
      margin: 25px 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .recommend-collect-img {
        margin-bottom: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 48.5%;
        height: 280px;
        border-radius: 10px;
      }
    }
  }

</style>
