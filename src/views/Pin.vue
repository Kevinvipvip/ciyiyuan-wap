<template>
  <div class="pin page">
    <div class="pin-box">
      <div @click="pin(index)" :id="index" class="image-box" v-for="(item,index) in pin_list" :key="index"
           :style="'order: '+item.order">
        <img :src="item.image"/>
        <div class="shadow" v-if="choose_index === index"></div>
      </div>
    </div>
    <div @click="start" class="start" v-if="status === 0 || status === 1 || status === 3">{{start_text}}</div>
    <div class="start" v-if="status === 2">{{pin_count}}</div>

    <div class="start-count" v-if="status === 1">
      <div class="count-down">{{start_count}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        status: 0,  // 0.未开始 1.倒计时 2.拼图中 3.倒计时结束
        start_text: '开始游戏',
        start_count: 3,
        pin_count: 60,
        count_seed: 0,  // 倒计时种子
        pin_list: [
          {
            image: this.config.aliyun + 'static/pin/pin1.jpg',
            order: 1
          }, {
            image: this.config.aliyun + 'static/pin/pin2.jpg',
            order: 2
          }, {
            image: this.config.aliyun + 'static/pin/pin3.jpg',
            order: 3
          }, {
            image: this.config.aliyun + 'static/pin/pin4.jpg',
            order: 4
          }, {
            image: this.config.aliyun + 'static/pin/pin5.jpg',
            order: 5
          }, {
            image: this.config.aliyun + 'static/pin/pin6.jpg',
            order: 6
          }, {
            image: this.config.aliyun + 'static/pin/pin7.jpg',
            order: 7
          }, {
            image: this.config.aliyun + 'static/pin/pin8.jpg',
            order: 8
          }, {
            image: this.config.aliyun + 'static/pin/pin9.jpg',
            order: 9
          }],
        choose_index: -1
      };
    },
    methods: {
      start() {
        this.status = 1;

        this.count_seed = setInterval(() => {
          if (this.start_count !== 1) {
            this.start_count = this.start_count - 1;
          } else {
            window.clearInterval(this.count_seed);
            this.status = 2;

            // 打乱拼图
            this.disorganize();

            this.count_seed = setInterval(() => {
              if (this.pin_count >= 0) {
                this.pin_count = Number(this.pin_count - 0.01).toFixed(2);
              } else {
                window.clearInterval(this.count_seed);
                this.$dialog.alert({
                  message: '很遗憾，您没有完成拼图',
                  confirmButtonColor: '#b38146'
                }).then(() => {
                  this.status = 3;
                  this.start_count = 3;
                  this.pin_count = 60;
                  this.choose_index = -1;
                  this.start_text = '重新开始';
                });
              }
            }, 10);
          }
        }, 1000);
      },
      // 拼图方法
      pin(index) {
        if (this.status === 2) {
          let choose_index = this.choose_index;
          let order, choose_order;

          if (choose_index === -1) {
            this.choose_index = index;
          } else if (choose_index === index) {
            this.choose_index = -1;
          } else {
            order = this.pin_list[index].order;
            choose_order = this.pin_list[choose_index].order;
            // setTimeout(() => {
            this.pin_list[index].order = choose_order;
            this.pin_list[choose_index].order = order;
            this.choose_index = -1;
            if (this.is_complete()) {
              window.clearInterval(this.count_seed);
              this.$dialog.alert({
                message: '恭喜您已完成拼图',
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.start_text = '重新开始';
                this.status = 3;
                this.start_count = 3;
                this.pin_count = 60;
              });
            }
            // }, 100);
          }
        }
      },
      // 随机打乱拼图
      disorganize() {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        arr.sort(() => {
          return Math.random() > .5 ? -1 : 1;
        });

        let pin_list = this.pin_list;
        for (let i = 0; i < pin_list.length; i++) {
          pin_list[i].order = arr[i];
        }

        this.pin_list = pin_list;
      },
      // 计算拼图是否拼好
      is_complete() {
        let pin_list = this.pin_list;
        let order_text = '';
        for (let i = 0; i < pin_list.length; i++) {
          order_text += pin_list[i].order + ',';
        }
        order_text = order_text.slice(0, -1);

        return order_text === '1,2,3,4,5,6,7,8,9';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pin {
    height: calc(100vh - 80px);
    overflow: hidden;

    .pin-box {
      /*width: 90%;*/
      margin: 24px;
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #fff;

      .image-box {
        width: 30%;
        flex-grow: 1;
        height: 28vh;
        border: 1px solid #fff;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
        }

        .shadow {
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 1;
          background: rgba(0, 0, 0, 0.3);
        }
      }
    }

    .start {
      width: 26vh;
      font-size: 36px;
      line-height: 64px;
      text-align: center;
      height: 60px;
      color: #ffffff;
      background-color: #b38146;
      box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
      border-radius: 10px;
      position: fixed;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 20px;
    }

    .start-count {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;

      .count-down {
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 8px 8px #ddd;
        border-radius: 50%;
        background: #fcebd7;
        color: #49382f;
        box-sizing: border-box;
        font-size: 36px;
      }
    }
  }
</style>
