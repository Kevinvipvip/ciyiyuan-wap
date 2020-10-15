<template>
  <div class="calligraphy">
    <Author :data="author" :type="1"></Author>
    <div class="classify-box">
      <Classify :data="calligraphyClassify" @choseCateGoods="getCateCalligrahy"></Classify>
    </div>
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <TcyList :data="calligraphyList"></TcyList>
    </van-list>
  </div>
</template>

<script>
  import Classify from '../components/Classify'
  import TcyList from '../components/TcyList'
  import Author from '../components/Author'

  export default {
    name: 'Calligraphy',
    data() {
      return {
        calligraphyClassify: [],
        calligraphyList: [],
        author: [],
        page: 0,
        loading: false,
        finished: false,
        count: 0,
        cate_id: 0
      }
    },
    created() {
      // 获取书画院作家列表
      this.utils.ajax(this, 'picture/authorList').then((author) => {
        this.utils.aliyun_format(author, 'pic');
        this.author = author;
      }).then(() => {
        // 获取书画作品分类列表
        this.utils.ajax(this, 'picture/cateList').then((res) => {
          // console.log(res[0].id);
          this.calligraphyClassify = res;
          this.cate_id = res[0].id;
        })
      })
    },
    methods: {
      onLoad() {
        this.page++;
        this.getCalligrahy(this.page, () => {
          this.loading = false;
          if (this.calligraphyList.length >= this.count) {
            this.finished = true;
          }
        })
      },
      getCateCalligrahy(id) {
        console.log(id);
        this.calligraphyList = [];
        this.page = 0;
        this.loading = false;
        this.finished = false;
        this.count = 0;
        this.cate_id = id;
        this.onLoad();
      },
      getCalligrahy(page, callback) {
        // console.log(this.cate_id)
        let data = {
          cate_id: this.cate_id,
          page: page,
          perpage: 10
        };
        this.utils.ajax(this, 'picture/pictureList', data).then((res) => {
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover');
          for (let i = 0; i < res.list.length; i++) {
            this.calligraphyList.push(res.list[i]);
          }
        }).then(() => {
          callback();
        })
      }
    },
    components: {
      Classify,
      TcyList,
      Author
    }
  }
</script>

<style scoped lang="scss">
  .calligraphy {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .classify-box {
      margin: 20px 40px;
      height: auto;
    }
  }
</style>
