<template>
  <div class="collect-classify page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <div class="classify-box">
        <ul>
          <li v-for="(v,index) in leftArray" :key="index">
            <div class="img-box" @click="openCollectDetail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+'?x-oss-process=image/resize,w_300)'}"></div>
            <h3>{{v.title}}</h3>
            <p>{{v.dynasty}}</p>
          </li>
        </ul>
        <ul>
          <li v-for="(v,index) in rightArray" :key="index">
            <div class="img-box" @click="openCollectDetail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+'?x-oss-process=image/resize,w_300)'}"></div>
            <h3>{{v.title}}</h3>
            <p>{{v.dynasty}}</p>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
  export default {
    name: 'CollectionsClassify',
    data() {
      return {
        cate_id: 0,

        leftArray: [],
        rightArray: [],
        left_height: 0,
        right_height: 0,
        page: 0,
        loading: false,
        finished: false,
        count: 0
      }
    },
    beforeRouteEnter(to, from, next) {
      // console.log(from.path);
      if (from.path === '/collectionsdetail') {
        to.meta.isBack = true
      }
      next();
    },
    activated() {
      if (!this.$route.meta.isBack) {
        this.reset();
        this.onLoad();
      }
      this.$route.meta.isBack = false
    },
    created() {
      this.cate_id = parseInt(this.$route.query.id);
    },
    methods: {
      reset() {
        this.cate_name = this.$route.query.name;
        this.cate_id = parseInt(this.$route.query.id);
        this.leftArray = [];
        this.rightArray = [];
        this.left_height = 0;
        this.right_height = 0;
        this.page = 0;
        this.loading = false;
        this.finished = false
      },
      onLoad() {
        this.page++;
        this.getCollectList(this.page, () => {
          this.loading = false;
          if ((this.leftArray.length + this.rightArray.length) >= this.count) {
            this.finished = true
          }
          // console.log(this.leftArray.length, this.leftArray.length, this.count)
        })
      },
      openCollectDetail(id) {
        this.$router.push({
          path: '/collectionsdetail',
          query: {
            id: id
          }
        })
      },
      getCollectList(page, callback) {
        let data = {
          cate_id: this.cate_id,
          page: page,
          perpage: 10
        };
        this.utils.ajax('collect/collectList', data).then((res) => {
          // console.log(res)
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover', 2);
          for (let i = 0; i < res.list.length; i++) {
            if (this.left_height <= this.right_height) {
              this.leftArray.push(res.list[i]);
              this.left_height += res.list[i].height / res.list[i].width + 0.3599;
            } else {
              this.rightArray.push(res.list[i]);
              this.right_height += res.list[i].height / res.list[i].width + 0.3599;
            }
          }
          // this.rightArray = res.list;
        }).then(() => {
          callback();
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .collect-classify {
    overflow: hidden;
    box-sizing: border-box;

    .classify-box {
      display: flex;
      justify-content: space-between;
      margin: 20px 40px;

      ul {
        width: 48%;

        li {
          border-radius: 10px;
          margin-bottom: 30px;
          background-color: #f2f2f2;
          overflow: hidden;

          .img-box {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          h3 {
            margin: 10px 16px;
            font-size: 26px;
            font-weight: normal;
            line-height: 45px;
            color: #666666;
          }

          p {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90px;
            height: 35px;
            margin: 0 16px 16px;
            background-color: #00a0e9;
            font-size: 24px;
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
