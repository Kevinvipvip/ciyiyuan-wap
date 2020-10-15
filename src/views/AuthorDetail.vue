<template>
  <div class="author">
    <div class="author-title">
      <div class="author-img" :style="'background-image: url('+authorDetail.pic+'?x-oss-process=image/resize,w_100)'"></div>
      <div class="author-cont">
        <p>作者：{{authorDetail.name}}</p>
        <p>头衔：{{authorDetail.title}}</p>
      </div>
    </div>
    <div class="author-brief" v-html="authorDetail.desc">
      <!--<p>{{authorDetail.brief}}</p>-->
    </div>
    <div class="author-works">
      <h3>作品</h3>
      <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
      >
        <div class="works">
          <div class="works-img" v-for="(v,index) in authorWorks" @click="openWorksDetail(v.id,type)" :key="index"
               :style="'background-image: url('+v.cover+'?x-oss-process=image/resize,w_250)'"></div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthorDetail',
    data() {
      return {
        authorDetail: {},
        authorWorks: [],
        type: 0,
        page: 0,
        loading: false,
        finished: false,
        count: 0
      }
    },
    created() {
      let id = parseInt(this.$route.query.id);
      let type = parseInt(this.$route.query.type);
      this.type = type;

      this.$toast({
        duration: 0,
        forbidClick: true,
        type: 'loading',
        message: '数据加载中...'
      });
      if (type === 1) {
        this.utils.ajax(this, 'picture/authorDetail', { id: id }).then((res) => {
          console.log(res);
          this.utils.aliyun_format(res, 'pic');
          this.authorDetail = res;
        }).then(() => {
          this.$toast.clear();
        })
      } else if (type === 2) {
        this.utils.ajax(this, 'photo/authorDetail', { id: id }).then((res) => {
          this.utils.aliyun_format(res, 'pic');
          this.authorDetail = res;
        }).then(() => {
          this.$toast.clear();
        })
      }
    },
    methods: {
      onLoad() {
        this.page++;
        if (this.type === 1) {
          this.getAuthorworksList('picture/pictureList', this.page, () => {
            this.loading = false;
            if (this.authorWorks.length >= this.count) {
              this.finished = true;
            }
          })
        } else if (this.type === 2) {
          this.getAuthorworksList('photo/pictureList', this.page, () => {
            this.loading = false;
            if (this.authorWorks.length >= this.count) {
              this.finished = true;
            }
          })
        }
      },
      openWorksDetail(id, type) {
        this.$router.push({
          path: '/worksdetail',
          query: {
            worksId: id,
            type: type //1代表书画院，2代表摄影
          }
        })
      },
      getAuthorworksList(url, page, callback) {
        let id = parseInt(this.$route.query.id);
        let data = {
          author_id: id,
          page: page,
          perpage: 10
        }
        this.utils.ajax(url, data).then((res) => {
          // console.log(res)
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover', 2);
          for (let i = 0; i < res.list.length; i++) {
            this.authorWorks.push(res.list[i]);
          }
        }).then(() => {
          callback();
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .author {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .author-title {
      margin: 30px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .author-img {
        margin: 0 60px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }

      .author-cont {
        height: 150px;
        display: flex;
        flex-flow: column;
        justify-content: space-around;

        p {
          font-size: 28px;
          line-height: 42px;
          color: #666666;
        }
      }
    }

    .author-brief {
      margin: 0 40px;
      text-align: justify;
      font-size: 28px;
      line-height: 42px;
      color: #888888;

      /deep/ img {
        max-width: 100%;
      }
    }

    .author-works {
      margin-top: 60px;
      overflow: hidden;

      h3 {
        margin-left: 42px;
        font-size: 32px;
        font-weight: normal;
        line-height: 42px;
        color: #000000;
      }

      .works {
        margin: 20px 20px 0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .works-img {
          height: 275px;
          width: 48.5%;
          margin-bottom: 20px;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
</style>
