<template>
  <div class="classify">
    <ul>
      <li :class="classifyId == index ? 'on':''" v-for="(v,index) in data" :key="index"
          @click="classifyChange(index,v.id)">{{v.cate_name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Classify',
    props: {
      data: Array
    },
    data() {
      return {
        classifyId: 0
      }
    },
    methods: {
      classifyChange(index, id) {
        // console.log(id)
        this.classifyId = index;
        this.$emit('choseCateGoods', id);
      }
    }
  }
</script>

<style scoped lang="scss">
  .classify {
    height: 100%;
    width: 100%;

    ul {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      li {
        height: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 30px;
        color: #666666;
        padding: 0 5px;
      }

      .on {
        color: #000;
        border-bottom: 1px solid #666;
      }
    }
  }
</style>
