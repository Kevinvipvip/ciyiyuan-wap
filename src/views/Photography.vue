<template>
  <div class="photography">
    <Author :data="photoAuthor" :type="2"></Author>
    <div class="classify-box">
      <Classify :data="photographyClassify" @choseCateGoods="getCatePhoto"></Classify>
    </div>
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <div class="photography-list">
        <ul>
          <li v-for="(v,index) in leftArray" :key="index">
            <div class="img-box" @click="opnWorksDetail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+')'}"></div>
            <h3>{{v.title}}</h3>
            <p>{{v.cate_name}}</p>
          </li>
        </ul>
        <ul>
          <li v-for="(v,index) in rightArray" :key="index">
            <div class="img-box" @click="opnWorksDetail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+')'}"></div>
            <h3>{{v.title}}</h3>
            <p>{{v.cate_name}}</p>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
  import Classify from '../components/Classify'
  import Author from '../components/Author'

  export default {
    name: 'Photography',
    data() {
      return {
        cate_id: 0,
        photographyClassify: [],
        photoAuthor: [],
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
    created() {
      this.utils.ajax(this, 'photo/authorList').then((res) => {
        this.utils.aliyun_format(res, 'pic');
        this.photoAuthor = res;
      }).then(() => {
        this.utils.ajax(this, 'photo/cateList').then((res) => {
          this.photographyClassify = res;
          this.cate_id = res[0].id;
          // this.getPhotoList(res[0].id, 1, 10)
        })
      })
    },
    methods: {
      onLoad() {
        this.page++;
        this.getPhotoList(this.page, () => {
          this.loading = false;
          if ((this.leftArray.length + this.rightArray.length) >= this.count) {
            this.finished = true;
          }
          // console.log(this.leftArray.length, this.leftArray.length, this.count)
        })
      },
      getCatePhoto(id) {
        this.leftArray = [];
        this.rightArray = [];
        this.left_height = 0;
        this.right_height = 0;

        this.page = 0;
        this.loading = false;
        this.finished = false;
        this.count = 0;
        this.cate_id = id;
        this.onLoad();
      },
      opnWorksDetail(id) {
        this.$router.push({
          name: 'worksdetail',
          query: {
            worksId: id,
            type: 2 //1代表书画院，2代表摄影
          }
        })
      },
      getPhotoList(page, callback) {
        let data = {
          cate_id: this.cate_id,
          // author_id: aid,
          page: page,
          perpage: 10
        };
        this.utils.ajax(this, 'photo/pictureList', data).then((res) => {
          // console.log(res)
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover');
          for (let i = 0; i < res.list.length; i++) {
            if (this.left_height <= this.right_height) {
              this.leftArray.push(res.list[i]);
              this.left_height += res.list[i].height / res.list[i].width + 0.3599;
            } else {
              this.rightArray.push(res.list[i]);
              this.right_height += res.list[i].height / res.list[i].width + 0.3599;
            }
          }
        }).then(() => {
          callback();
        })
      }
    },
    components: {
      Classify,
      Author
    }
  }
</script>

<style scoped lang="scss">
  .photography {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .classify-box {
      margin: 20px 100px;
    }

    .photography-list {
      display: flex;
      justify-content: space-between;
      margin: 30px 40px;

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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
