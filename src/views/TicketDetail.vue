<template>
  <div class="ticket-detail page">
    <div class="common-title">订单详情</div>
    <div class="detail" v-if="detail.list">
      <div class="status">{{detail.status_tip}}</div>
      <p>预约编号：{{detail.pay_order_sn}}</p>
      <p>预约时间：{{detail.create_time}}</p>
      <p>参观日期：{{detail.use_date}}</p>
      <p>参观时段：{{`${detail.start_time} - ${detail.end_time}`}}</p>
      <p>总金额：￥{{detail.total_price}}</p>
    </div>
    <ul>
      <li v-for="(item,index) in detail.list" :key="item.id" @click="fn_choose_checkbox(index)">
        <div class="cont" :style="item.status_type===2?'opacity: 0.4;':''">
          <p>{{item.name}}</p>
          <p>身份证：{{item.idcard}}</p>
          <div class="has-checkbox">
            <i v-if="item.status_type===1" :class="show_checkbox?'show':''">
              <img :src="item.is_checked?inactiveIcon:''"/>
            </i>
            <div class="p-box">
              <p>门票价格：￥{{detail.unit_price}}</p>
              <p v-if="item.check_time">核销时间：{{item.check_time}}</p>
              <p class="status">{{item.status_tip}}</p>
            </div>
          </div>
        </div>
        <!--<span>0</span>-->
        <span v-if="item.status_type===1" @click="createCode(index)"><img src="../assets/icon-check-code.png"/></span>
      </li>
    </ul>
    <div class="fill-bottom"></div>
    <div class="btn" v-if="detail.btn_type === 3">
      <p @click="to_pay(detail.pay_order_sn)">去支付</p>
      <!--<p v-else class="none-click">退票</p>-->
    </div>
    <div class="btn" v-else-if="detail.btn_type === 1">
      <p @click="show_checkbox = !show_checkbox" v-if="detail.refund_btn">退票</p>
      <p v-else class="none-click">退票</p>
    </div>

    <div class="btn-refund" :class="last_refund?'show':''">
      <span>退款总计：￥{{refund_price}}</span>
      <p @click="fn_refund">确认退票</p>
    </div>
    <div class="qr-code" @click="close_qrcode" :class="show_qrcode?'show':''">
      <div class="code-box">
        <img :src="code_bg">
        <div class="qrcode">
          <div id="qrCode" class="code" ref="qrCodeDiv"></div>
        </div>
        <div class="tip-bg">
          <p>请保持屏幕亮度</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'

  export default {
    data() {
      return {
        inactiveIcon: this.config.aliyun + 'static/ticket-checked.png',
        id: 0,
        detail: {},

        show_checkbox: false,
        last_refund: false,
        refund_ticket: [],//选中的要退的票

        refund_price: '0.00',//退款总计
        show_qrcode: false,//显示二维码
        code_bg: this.config.aliyun + 'static/ticket-code-bg.png',

        clock: 0,
        ckeck_clock: 0,//一分钟以内可重复扫码
        check_list_clock: 0,//列表中一分钟内可以重复调出二维码
        setTimeout: 0,
        closeTimeout: 120
      };
    },
    mounted() {
      this.initCode();
      this.id = parseInt(this.$route.query.id);
      this.getOrderDetail();
    },
    destroyed() {
      window.clearTimeout(this.clock);
      window.clearTimeout(this.check_clock);
      window.clearTimeout(this.check_list_clock);
    },
    methods: {
      to_pay(pay_order_sn) {
        this.$router.push({ name: 'pay', query: { pay_order_sn: pay_order_sn } });
      },

      // 点击退票按钮
      fn_refund() {
        let post = { order_id: this.id, list_id: this.refund_ticket };
        this.$dialog.confirm({
          message: '确认退票吗？',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/ticketOrderRefund', post).then(() => {
            this.$dialog.alert({
              message: '退票成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.last_refund = false;
              this.getOrderDetail();
            });
          });
        }).catch(() => {
        })
      },
      // 选择要退的票
      fn_choose_checkbox(index) {
        if (this.show_checkbox) {
          if (this.detail.list[index].refund !== 1) {
            let arr = [];
            let price = 0;
            this.detail.list[index].is_checked = !this.detail.list[index].is_checked;
            for (let i = 0; i < this.detail.list.length; i++) {
              if (this.detail.list[i].is_checked) {
                arr.push(this.detail.list[i].id);
                price += parseFloat(this.detail.unit_price);
              }
            }
            this.refund_ticket = arr;
            this.refund_price = price;
            if (this.refund_ticket.length > 0) {
              this.last_refund = true;
            } else {
              this.last_refund = false;
            }
            // console.log(arr);
          }
        }
      },

      // 点击关闭二维码
      close_qrcode() {
        this.show_qrcode = false;
        this.setTimeout = 0;
        window.clearTimeout(this.clock);
        window.clearTimeout(this.ckeck_clock);
        this.getOrderDetail();
      },

      // 获取订单详情
      getOrderDetail() {
        this.utils.ajax(this, 'my/ticketOrderDetail', { order_id: this.id }).then((detail) => {
          detail.status_tip = this.utils.get_status(detail.status, detail.refund, detail.check, detail.expire);
          detail.create_time = this.utils.date_format(detail.create_time, 'yyyy-MM-dd hh:mm:ss');
          detail.btn_type = this.utils.get_status(detail.status, detail.refund, detail.check, detail.expire, 'type');
          console.log(detail)
          for (let i = 0; i < detail.list.length; i++) {
            detail.list[i].is_checked = false;
            if (detail.status === 1) {
              if (detail.list[i].expire === 0) {
                if (detail.list[i].refund === 0) {
                  if (detail.list[i].check === 0) {
                    detail.list[i].status_tip = '待检票';
                    detail.list[i].status_type = 1;
                  } else {
                    detail.list[i].check_time = this.utils.date_format(detail.list[i].check_time, 'yyyy-MM-dd hh:mm:ss');
                    detail.list[i].status_type = 2;
                    detail.list[i].status_tip = '已核销';
                  }
                } else {
                  detail.list[i].status_type = 2;
                  detail.list[i].status_tip = '已退票';
                }
              } else {
                detail.list[i].status_tip = '已过期';
                detail.list[i].status_type = 2;
              }
            } else {
              detail.list[i].status_tip = '待支付';
              detail.list[i].status_type = 3;
            }
          }
          this.detail = detail;
        })
      },

      initCode() {
        this.qrcode = new QRCode(this.$refs.qrCodeDiv, {
          text: '',
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        });
      },
      createCode(index) {
        this.utils.ajax(this, 'my/genQrcodeStr', { list_id: this.detail.list[index].id }, [44]).then((res) => {
          // console.log(res);
          this.show_qrcode = true;
          this.fn_createCode(res);
          this.lookOrderStatus(index)
        }).catch(() => {
          this.$dialog.alert({ message: '仅在入馆当天方可生成入馆二维码', confirmButtonColor: '#b38146' })
        });
      },
      fn_createCode(str) {
        this.qrcode.clear();
        this.qrcode.makeCode(str);
      },

      lookOrderStatus(index) {
        this.utils.ajax(this, 'my/ticketOrderStatus', { list_id: this.detail.list[index].id }).then((res) => {
          if (res.check === 0) {
            this.setTimeout += 2;
            if (this.setTimeout < this.closeTimeout) {
              this.clock = setTimeout(() => {
                this.lookOrderStatus(index)
              }, 2000);
            }
          } else {
            this.show_qrcode = false;
            this.getOrderDetail();
          }
        });
      }
    }
  }
  ;
</script>

<style lang="scss" scoped>
  .ticket-detail {
    .detail {
      margin: 30px 24px;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
      padding: 34px 24px;
      box-sizing: border-box;
      position: relative;

      .status {
        font-size: 24px;
        color: #b38146;
        position: absolute;
        top: 30px;
        right: 24px;
      }

      p {
        font-size: 24px;
        color: #333333;
        line-height: 45px;
      }
    }

    ul {
      margin: 24px;

      li {
        background-color: #ffffff;
        margin-bottom: 24px;
        box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
        padding: 34px 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          width: 80px;
          height: 80px;
          /*box-sizing: border-box;*/
          /*padding: 15px;*/
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #b38146;
          box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
          border-radius: 10px;

          img {
            width: 80%;
          }
        }

        p {
          font-size: 24px;
          color: #333333;
          line-height: 45px;
        }

        .has-checkbox {
          display: flex;
          align-items: center;

          i {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 0;
            height: 24px;
            transition: 0.5s;

            img {
              width: 80%;
            }

            &.show {
              margin-right: 15px;
              border: 2px solid #b38146;
              width: 24px;
            }
          }

          .p-box {

            .status {
              color: #b38146;
              margin-top: 20px;
            }
          }
        }
      }
    }

    .fill-bottom {
      height: 114px;
    }

    .btn {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 50px;
      display: flex;
      justify-content: center;

      p {
        margin: 0 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 64px;
        background-color: #b38146;
        box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
        border-radius: 10px;
        font-size: 28px;
        color: #ffffff;
      }
    }

    .btn-refund {
      position: fixed;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 115px;
      left: 0;
      right: 0;
      bottom: -114px;
      z-index: 9;
      transition: 0.2s;

      &.show {
        bottom: 0;
      }

      span {
        font-size: 28px;
        color: #333333;
        margin-left: 24px;
      }

      p {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #b38146;
        height: 100%;
        font-size: 28px;
        color: #ffffff;
        box-sizing: border-box;
      }
    }

    .qr-code {
      position: fixed;
      transition: 200ms;
      overflow: hidden;
      top: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;

      &.show {
        top: 0;
      }

      .code-box {
        width: calc(100% - 120px);
        position: relative;

        .qrcode {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .code {
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
          }
        }

        .tip-bg {
          background-color: rgb(179, 129, 70);
          height: 120px;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          &:before {
            content: '';
            display: block;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: rgb(51, 50, 49);
            top: -13px;
            left: -10px;
            position: absolute;
          }

          &:after {
            content: '';
            display: block;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: rgb(51, 50, 49);
            top: -13px;
            right: -10px;
            position: absolute;
          }

          p {
            color: #ffffff;
            font-size: 35px;
          }
        }
      }
    }
  }
</style>
