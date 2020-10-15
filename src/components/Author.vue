<template>
  <div class="author">
    <swiper v-if="data.length>3" :options="authorSwiper" class="swiper-wrap" ref="mySwiper">
      <swiper-slide v-for="(item,index) in data" :key="index" class="my-swiper-item">
        <div class="author-box">
          <div class="author-img" :style="'background-image: url('+item.pic+'?x-oss-process=image/resize,w_250)'"
               @click="openAuthor(item.id,type)"></div>
          <p class="author-name">{{item.name}}</p>
        </div>
      </swiper-slide>
    </swiper>
    <div v-else-if="data.length>0" class="author-item-box">
      <div class="author-item" v-for="(item,index) in data" :key="index">
        <div class="author-box">
          <div class="author-img" :style="'background-image: url('+item.pic+'?x-oss-process=image/resize,w_250)'"
               @click="openAuthor(item.id,type)"></div>
          <p class="author-name">{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'// 这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  import { swiper, swiperSlide } from 'vue-awesome-swiper' // 引入slider组件

  export default {
    name: 'Author',
    props: {
      data: Array,
      type: Number
    },
    data () {
      return {
        authorSwiper: {
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          speed: 800,
          direction: 'horizontal',
          slidesPerView: 3
        }
      }
    },
    methods: {
      openAuthor (id, type) {
        this.$router.push({
          name: 'authordetail',
          query: {
            id: id,
            type: type
          }
        })
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style scoped lang="scss">
  .author {
    padding: 20px 25px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .swiper-wrap {
      .my-swiper-item {

        .author-box {
          margin: 0 5px;

          .author-img {
            height: 280px;
            border-radius: 10px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }

          p {
            font-size: 26px;
            line-height: 50px;
            text-align: center;
            color: #000000;
          }
        }

      }
    }

    .author-item-box {
      display: flex;
      justify-content: space-around;

      .author-item {
        width: 33.33%;

        .author-box {
          margin: 0 5px;

          .author-img {
            height: 280px;
            border-radius: 10px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }

          p {
            font-size: 26px;
            line-height: 50px;
            text-align: center;
            color: #000000;
          }
        }
      }
    }
  }
</style>
