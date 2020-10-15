<template>
  <div class="order-center">
    <div class="my-tabs">
      <van-tabs
              v-model="active"
              background="rgb(242,242,242)"
              color="#666666"
              :line-height="2"
              @click="getTitle"
              :swipe-threshold="6">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="待发货"></van-tab>
        <van-tab title="待收货"></van-tab>
        <van-tab title="已完成"></van-tab>
      </van-tabs>
    </div>
    <div class="order-list">
      <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
        <!--<div class="tips-none" v-if="orderList.length<1">此项无数据</div>-->
        <ul>
          <li v-for="(v,index) in orderList" :key="index">
            <div class="tips-order-box">{{v.tip_text}}</div>
            <h3>订单编号：{{v.pay_order_sn}}</h3>
            <div class="shop-cont">
              <ul>
                <li v-for="(item,index) in v.child" :key="index">
                  <div class="shop-img" :style="'background-image:url('+item.cover+')'"></div>
                  <div class="shop-info">
                    <div class="shop-info-title">
                      <h4>{{item.goods_name}}</h4>
                      <p>产品规格：{{item.attr}}</p>
                    </div>
                    <div class="shop-info-num">
                      <p>￥{{item.unit_price}}</p>
                      <span>数量：{{item.num}}</span>
                      <!--<span class="aftermarket" v-if="!showButton">{{v.aftermarket}}</span>-->
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="btn-box" v-if="v.showButton">
              <p @click="clickFirstButton(v.status,v.id)" v-if="v.showOneButton">{{v.firstButtonText}}</p>
              <p class="change-color" @click="clickSecondButton(v.status,v.id,v.pay_order_sn)">
                {{v.secondButtonText}}</p>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OrderCenter',
    data() {
      return {
        showButton: true,
        showOneButton: true,
        active: 0,
        orderList: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,

        status: '',

        btn_click: true
      }
    },
    created() {
      this.active = parseInt(this.$route.query.id);

      switch (this.active) {
        case 0:
          this.status = '';
          break;
        case 1:
          this.status = 0;
          break;
        case 2:
          this.status = 1;
          break;
        case 3:
          this.status = 2;
          break;
        case 4:
          this.status = 3;
          break;
      }
    },
    methods: {
      onLoad() {
        this.page++;
        this.getOrderList(this.status, () => {
          this.loading = false;
          if (this.orderList.length >= this.count) {
            this.finished = true;
          }
        })
      },
      getTitle(index) {
        // alert('进来了' + index)
        this.orderList = [];
        this.page = 0;
        this.loading = true;
        this.finished = false;
        this.count = 0;
        console.log(index);
        switch (index) {
          case 0:
            this.status = '';
            break;
          case 1:
            this.status = 0;
            break;
          case 2:
            this.status = 1;
            break;
          case 3:
            this.status = 2;
            break;
          case 4:
            this.status = 3;
            break;
        }

        this.onLoad();
      },
      clickFirstButton(type, id) {
        if (type === 0) {
          this.$dialog.confirm({
            message: '确定要取消订单吗？'
          }).then(() => {
            // 点击确认按钮
            this.utils.ajax(this, 'my/orderCancel', { id: id }).then((res) => {
              console.log(res);
              this.$toast('订单已取消');
              this.page = 1;
              this.orderList = [];
              this.getOrderList(0);
            })
          }).catch(() => {
            // 点击取消按钮
            console.log('已取消')
          })
        } else if (type === 3) {
          // this.$router.push({
          //   path: '/viewlogistics',
          //   query: {
          //     id: id
          //   }
          // })
        }
      },
      clickSecondButton(type, id, order_num) {
        console.log(type, id, order_num)
        //   if (type === 0) {
        //     if (this.btn_click) {
        //       this.btn_click = false
        //       this.utils.ajax(this, 'wxpay/orderPay', { pay_order_sn: order_num }).then((res) => {
        //         WeixinJSBridge.invoke('getBrandWCPayRequest', {
        //           debug: true,
        //           appId: res.appId, // 公众号名称，由商户传入
        //           timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
        //           nonceStr: res.nonceStr, // 随机串
        //           package: res.package,
        //           signType: 'MD5', // 微信签名方式：
        //           paySign: res.paySign // 微信签名
        //         }, (res) => {
        //           if (res.err_msg === 'get_brand_wcpay_request:ok') {
        //             // 使用以上方式判断前端返回,微信团队郑重提示：
        //             // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        //
        //             const toast = this.$toast({
        //               duration: 0,       // 持续展示 toast
        //               forbidClick: true, // 禁用背景点击
        //               mask: true,
        //               message: '支付成功\n3秒后跳转'
        //             })
        //
        //             let second = 3
        //             const timer = setInterval(() => {
        //               second--
        //               if (second) {
        //                 toast.message = `支付成功\n${second}秒后跳转`
        //               } else {
        //                 clearInterval(timer)
        //                 this.$toast.clear()
        //                 this.btn_click = true
        //                 let status = type + 1
        //                 this.active = type + 2
        //                 this.page = 1
        //                 this.orderList = []
        //                 this.getOrderList(status)
        //               }
        //             }, 1000)
        //           } else {
        //             this.$toast('支付失败')
        //             this.btn_click = true
        //             this.page = 1
        //             this.orderList = []
        //             this.active = type + 1
        //             this.getOrderList(type)
        //           }
        //         })
        //       })
        //     }
        //   } else if (type === 1) {
        //     this.$router.push({
        //       name: 'refund',
        //       query: {
        //         id: id
        //       }
        //     })
        //   } else if (type === 2) {
        //     this.$dialog.confirm({
        //       message: '确定收货？'
        //     }).then(() => {
        //       // 点击确认按钮
        //       this.utils.ajax(this, 'my/orderConfirm', { id: id }).then((res) => {
        //         console.log(res)
        //         this.$toast('已成功')
        //         this.page = 1
        //         this.orderList = []
        //         this.active = type + 2
        //         this.getOrderList(type + 1)
        //       })
        //     }).catch(() => {
        //       // 点击取消按钮
        //       console.log('已取消')
        //     })
        //   } else if (type === 3) {
        //     // this.$router.push({
        //     //   name: 'evaluation',
        //     //   query: {
        //     //     order_id: id
        //     //   }
        //     // })
        //   }
      },
      getOrderList(status, callback) {
        let data = {
          page: this.page,
          perpage: 10,
          status: status
        };
        // console.log(data)
        this.utils.ajax(this, 'my/orderList', data).then((res) => {
          console.log(res);
          this.count = res.count;
          for (let i = 0; i < res.list.length; i++) {
            this.utils.fixed_img_path(res.list[i].child, 'cover', 2);
            if (res.list[i].status === 0) {
              res.list[i].showButton = true;
              res.list[i].showOneButton = true;
              res.list[i].firstButtonText = '取消订单';
              res.list[i].secondButtonText = '立即付款';
              res.list[i].tip_text = '等待付款';
            } else if (res.list[i].status === 1) {
              res.list[i].showButton = true;
              res.list[i].showOneButton = false;
              res.list[i].firstButtonText = '';
              res.list[i].secondButtonText = '申请退款';
              res.list[i].tip_text = '等待发货';
            } else if (res.list[i].status === 2) {
              res.list[i].showButton = true;
              res.list[i].showOneButton = true;
              res.list[i].firstButtonText = '查看物流';
              res.list[i].secondButtonText = '确认收货';
              res.list[i].tip_text = '等待收货';
            } else if (res.list[i].status === 3) {
              res.list[i].showButton = true;
              res.list[i].showOneButton = false;
              res.list[i].firstButtonText = '';
              res.list[i].secondButtonText = '添加评价';
              res.list[i].tip_text = '交易完成';
            }
          }
          for (let i = 0; i < res.list.length; i++) {
            this.orderList.push(res.list[i]);
          }
        }).then(() => {
          callback()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .order-center {
    background: rgb(242, 242, 242);
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .order-list {
      /deep/ .tips-none {
        margin-top: 30px;
        text-align: center;
        font-size: 30px;
      }

      ul {
        li {
          overflow: hidden;
          margin: 0 20px 20px;
          background-color: #ffffff;
          border-radius: 10px;
          position: relative;

          .tips-order-box {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #ff4c4c;
          }

          h3 {
            margin: 15px 25px;
            font-size: 20px;
            font-weight: normal;
            line-height: 42px;
            color: #666666;
          }

          .shop-cont {
            border-bottom: 2px solid #dcdcdc;

            ul {
              li {
                margin: 0;
                padding: 0 20px 20px;
                display: flex;

                .shop-img {
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: cover;
                  width: 220px;
                  height: 175px;
                  flex-shrink: 0;
                  border-radius: 12px;
                }

                .shop-info {
                  flex-grow: 1;
                  margin-left: 35px;
                  display: flex;
                  flex-flow: column;
                  justify-content: space-between;

                  h4 {
                    font-size: 26px;
                    font-weight: normal;
                    color: #000000;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                  }

                  p {
                    margin-top: 10px;
                    color: #666;
                  }

                  .shop-info-num {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    p {
                      margin: 0;
                      font-size: 24px;
                      color: #ff0000;
                    }

                    span {
                      font-size: 22px;
                      color: #666666;
                    }
                  }
                }
              }
            }
          }

          .btn-box {
            display: flex;
            justify-content: flex-end;

            p {
              margin: 16px 20px;
              width: 200px;
              /*text-align: center;*/
              display: flex;
              justify-content: center;
              align-items: center;
              height: 56px;
              border-radius: 10px;
              box-sizing: border-box;
              border: solid 2px #dcdcdc;
              font-size: 27px;
              /*line-height: 56px;*/
              color: #666666;
            }

            .change-color {
              color: #ff4c4c;
              border: solid 2px #ff4c4c;
            }
          }
        }
      }
    }
  }
</style>
