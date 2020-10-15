<template>
  <div class="news page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul>
        <li v-for="(v,index) in news_list" :key="index" @click="openDetail(v.id)">
          <div class="news-img" :style="'background-image: url('+v.pic+'?x-oss-process=image/resize,w_750)'"></div>
          <div class="info-box">
            <h3>{{v.title}}</h3>
            <span>{{v.create_time}}</span>
          </div>
          <!--<div class="btn-more" >查看更多<i class="iconfont icon-right"></i></div>-->
        </li>
      </ul>
    </van-list>
  </div>
</template>
<script>
  export default {
    name: 'News',
    data() {
      return {
        news_list: [],
        page: 0,
        loading: false,
        finished: false,
        count: 0
      }
    },

    methods: {
      onLoad() {
        this.page++;
        this.getArticleList(this.page, () => {
          this.loading = false;
          if (this.news_list.length >= this.count) {
            this.finished = true;
          }
        })
      },

      openDetail(id) {
        this.$router.push({
          name: 'newsdetail',
          query: {
            id: id
          }
        })
      },


      getArticleList(page, callback) {
        this.utils.ajax(this, 'index/articleList', { page: page, perpage: 10 }).then((res) => {
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'pic', 2);
          for (let i = 0; i < res.list.length; i++) {
            this.news_list.push(res.list[i]);
          }
        }).then(() => {
          callback();
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .news {
    overflow: hidden;

    ul {
      li {
        background-color: #eeeeee;
        border-radius: 10px;
        margin: 20px;
        overflow: hidden;
        display: flex;

        .news-img {
          flex-shrink: 0;
          margin: 20px;
          width: 200px;
          height: 150px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .info-box {
          flex-grow: 1;
          height: 150px;
          margin: 20px 20px 20px 0;
          display: flex;
          flex-flow: column;
          justify-content: space-between;

          h3 {
            font-size: 26px;
            font-weight: normal;
            color: #333333;
            text-align: justify;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          span {
            display: block;
            text-align: right;
            font-size: 20px;
            color: #888888;
          }
        }
      }
    }
  }
</style>
