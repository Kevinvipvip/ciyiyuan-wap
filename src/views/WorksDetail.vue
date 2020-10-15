<template>
  <div class="works">
    <div class="swiper">
      <swiper v-if="worksDetail.pics.length>0" :options="swiperOption" class="swiper-wrap" ref="mySwiper">
        <swiper-slide v-for="(item,index) in worksDetail.pics" :key="index" class="my-swiper-item"
                      :style="'background-image: url('+item+'?x-oss-process=image/resize,w_400)'">
        </swiper-slide>
        <!-- 常见的小圆点 -->
        <div class="swiper-pagination" v-for="(item,index) in worksDetail.pics" :key="index" slot="pagination"></div>
      </swiper>
    </div>
    <div class="works-attr">
      <div class="works-attr-cont">
        <p>材质：{{worksDetail.material}}</p>
        <p>价格：{{worksDetail.price == 0 ?'待定':'￥'+worksDetail.price}}</p>
      </div>
      <div class="works-attr-cont">
        <p>作者：{{worksDetail.author}}</p>
        <p>分类：{{worksDetail.cate_name}}</p>
      </div>
      <div class="works-attr-cont">
        <p>规格：{{worksDetail.attr}}</p>
        <p>尺寸：{{worksDetail.size}}</p>
      </div>
    </div>
    <div class="title">作品介绍</div>
    <div class="works-brief" v-html="worksDetail.desc">
      <!--<p>{{worksDetail.brief}}</p>-->
    </div>
    <div class="title">推荐</div>
    <div class="recommend-works">
      <div class="recommend-works-img" v-for="(v,index) in recommendWorks" @click="openWorksDetail(v.id)"
           :key="index" :style="'background-image: url('+v.cover+'?x-oss-process=image/resize,w_250)'"></div>
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'// 这里注意具体看使用的版本是否需要引入样式，以及具体位置。
  import { swiper, swiperSlide } from 'vue-awesome-swiper' // 引入slider组件
  import { ImagePreview } from 'vant'

  var images = [];
  var imgPrev = '';

  export default {
    name: 'WorksDetail',
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        id: 0,
        worksDetail: {
          pics: []
        },
        title: '书画详情',
        type: 0,
        recommendWorks: [],
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
          },
          on: {
            click() {
              // console.log(images)
              console.log(this.realIndex, 'swiper');
              let index = this.realIndex;
              imgPrev = ImagePreview({
                images: images,
                startPosition: index,
                onClose() {
                  // do something
                }
              })
            }
          }
        }
      }
    },
    mounted() {
      this.id = parseInt(this.$route.query.worksId);
      this.type = parseInt(this.$route.query.type);
      if (this.type === 1) {
        this.getCollectionsDetail(this.id);
      } else if (this.type === 2) {
        this.getPhotoDetail(this.id);
      }
    },

    destroyed() {
      // console.log(imgPrev)
      imgPrev.close();
    },
    // 跳转本页是参数变化后重新调取商品详情数据
    beforeRouteUpdate(to, from, next) {
      console.log(to);
      if (to.query.type === 1) {
        this.getCollectionsDetail(to.query.worksId);
      } else if (to.query.type === 2) {
        this.getPhotoDetail(to.query.worksId);
      }
      next()
    },
    methods: {
      openWorksDetail(id) {
        if (this.type === 1) {
          // this.getCollectionsDetail(id)
          this.$router.replace({
            name: 'worksdetail',
            query: {
              worksId: id,
              type: 1 //1代表书画院，2代表摄影
            }
          })
        } else if (this.type === 2) {
          this.$router.replace({
            name: 'worksdetail',
            query: {
              worksId: id,
              type: 2 //1代表书画院，2代表摄影
            }
          })
          // this.getPhotoDetail(id)
        }
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      getCollectionsDetail(id) {
        this.worksDetail = { pics: [] };
        this.utils.ajax(this, 'picture/pictureDetail', { id: id }).then((res) => {
          this.utils.aliyun_format(res.pics);
          this.worksDetail = res;
          images = res.pics;
        }).then(() => {
          this.utils.ajax(this, 'picture/similarPictureList', { id: id }).then((res) => {
            this.utils.aliyun_format(res, 'cover');
            this.recommendWorks = res;
          })
        })
      },
      getPhotoDetail(id) {
        this.worksDetail = { pics: [] };
        this.utils.ajax(this, 'photo/pictureDetail', { id: id }).then((res) => {
          this.utils.aliyun_format(res.pics);
          this.worksDetail = res;
          images = res.pics;
        }).then(() => {
          this.utils.ajax(this, 'photo/similarPictureList', { id: id }).then((res) => {
            this.utils.aliyun_format(res, 'cover');
            this.recommendWorks = res;
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .works {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .swiper {
      height: 370px;

      .swiper-wrap {
        height: 100%;

        .my-swiper-item {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }

    /*.works-img {*/
    /*height: 370px;*/
    /*width: 100%;*/
    /*background-repeat: no-repeat;*/
    /*background-position: center;*/
    /*background-size: cover;*/
    /*}*/

    .works-attr {
      overflow: hidden;
      margin: 25px 20px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .works-attr-cont {
        margin: 10px 30px 10px 0;

        p {
          font-size: 28px;
          line-height: 42px;
          color: #666666;
        }
      }
    }

    .title {
      margin: 40px 20px 0;
      font-size: 32px;
      line-height: 42px;
      color: #000000;
    }

    .works-brief {
      margin: 20px;

      p {
        text-align: unset;
        font-size: unset;
        line-height: unset;
        color: unset;
      }

      /deep/ img {
        max-width: 100%;
      }
    }

    .recommend-works {
      margin: 25px 20px 0;
      height: auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .recommend-works-img {
        height: 285px;
        width: 48.5%;
        margin-bottom: 20px;
        border-radius: 10px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
  }
</style>
