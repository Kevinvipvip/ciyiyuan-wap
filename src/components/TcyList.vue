<template>
  <div class="tcy-list">
    <ul>
      <li v-for="(v,index) in data" :key="index">
        <div class="img-box" @click="openWorksDetail(v.id)">
          <img :src="v.cover+'?x-oss-process=image/resize,w_450'"/>
        </div>
        <div class="list-cont">
          <div class="cont">
            <p>材质：{{v.material}}</p>
            <p>价格：{{v.price == 0 ?'待定':'￥'+v.price}}</p>
          </div>
          <div class="cont">
            <p>作者：{{v.author}}</p>
            <p>尺寸：{{v.size}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'TcyList',
    props: {
      data: Array
    },
    created() {
      // console.log(this.data)
    },
    methods: {
      openWorksDetail(id) {
        this.$router.push({
          name: 'worksdetail',
          query: {
            worksId: id,
            type: 1 //1代表书画院，2代表摄影
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .tcy-list {
    ul {
      li {
        .img-box {
          width: 100%;
          /*min-height: 200px;*/
          /*background-color: #7d8a93;*/

          img {
            width: 100%;
            display: block;
          }
        }

        .list-cont {
          margin: 20px 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .cont {
            padding-right: 80px;

            p {
              font-size: 28px;
              line-height: 42px;
              color: #666666;
            }
          }
        }
      }
    }
  }
</style>
