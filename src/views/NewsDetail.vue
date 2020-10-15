<template>
  <div class="news-detail page">
    <div class="info-detail">
      <div class="info-img" :style="'background-image: url('+new_detail.pic+'?x-oss-process=image/resize,w_750)'"></div>
      <div class="info-title">{{new_detail.title}}</div>
      <div class="info-text" v-html="new_detail.content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        news_id: 0,

        new_detail: {},
      };
    },
    mounted() {
      this.news_id = parseInt(this.$route.query.id);

      this.utils.ajax(this, 'index/getArticleDetail', { id: this.news_id }).then((res) => {
        this.utils.aliyun_format(res, 'pic');
        // res.content = res.content.replace(/\/ueditor\/php\/upload\//g, this.config.url + 'ueditor/php/upload/');
        this.new_detail = res;
      })
    }
  };
</script>

<style lang="scss" scoped>
  .news-detail {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .info-detail {
      margin: 20px 30px 0;

      .info-img {
        height: 380px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .info-title {
        width: 60vw;
        margin: 20px auto;
        text-align: center;
        font-size: 28px;
        color: #333333;
        font-weight: bold;
      }

      .info-text {
        text-align: justify;
        font-size: 26px;
        line-height: 36px;
        color: #666666;

        /deep/ img {
          max-width: 100%;
        }
      }
    }
  }
</style>
