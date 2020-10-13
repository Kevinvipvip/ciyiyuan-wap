<template>
  <div class="collection page">
    <ul>
      <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
        <li v-for="(v,index) in collection" :key="index">
          <div class="img-box" @click="openCollectionsDetail(v.id)"
               :style="'background-image:url('+v.cover+'?x-oss-process=image/resize,w_750)'"></div>
          <h4>{{v.title}}</h4>
          <p>{{v.dynasty}}</p>
        </li>
      </van-list>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        collection: [],
        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    methods: {
      onLoad() {
        this.page++;
        this.getCollectListList(this.page, () => {
          this.loading = false;
          if (this.collection.length >= this.count) {
            this.finished = true;
          }
        })
      },
      // 点击前往藏品详情
      openCollectionsDetail(id) {
        this.$router.push({
          path: '/collectionsdetail',
          query: {
            id: id
          }
        })
      },

      // 获取藏品列表
      getCollectListList(page, callback) {
        this.utils.ajax('collect/collectList', { page: page, perpage: 10 }).then((res) => {
          // console.log(res);
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover');
          for (let i = 0; i < res.list.length; i++) {
            this.collection.push(res.list[i]);
          }
        }).then(() => {
          if (callback) {
            callback()
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .collection {
    overflow: hidden;
    box-sizing: border-box;

    ul {
      margin: 20px 40px;

      li {
        background-color: #f2f2f2;
        overflow: hidden;
        margin-bottom: 25px;
        border-radius: 15px;

        .img-box {
          height: 340px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }

        h4 {
          font-size: 26px;
          line-height: 45px;
          margin: 20px 15px 0;
          color: #666666;
        }

        p {
          margin: 14px 15px;
          width: 90px;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #00a0e9;
          font-size: 24px;
          border-radius: 5px;
          color: #ffffff;
        }
      }
    }
  }
</style>
