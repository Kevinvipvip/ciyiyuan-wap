<template>
  <div class="booking page">
    <div class="common-title">填写预约信息</div>
    <div class="paiqi-box">
      <div class="paiqi">
        <van-cell title="参观日期" :value="date" @click="show_calender" value-class="date-color" is-link/>
        <van-calendar
                color="#b38146"
                v-model="show"
                v-if="paiqi.length>0"
                :min-date="new Date(paiqi[0].use_date)"
                :max-date="new Date(paiqi[paiqi.length-1].use_date)"
                @confirm="onConfirm"
                :formatter="formatter"/>
      </div>
    </div>

    <div class="ticket-interval" v-if="show_interval">
      <h3>入馆时段</h3>
      <ul>
        <li v-for="(item,index) in paiqi_detail" :key="'paiqi-detail'+index" :class="interval_id===item.id?'on':''">
          <p v-if="parseInt(item.surplus)===0">
            <span>{{item.start_time}} - {{item.end_time}}</span>
            <span>余{{item.surplus}}</span>
          </p>
          <p v-else @click="interval_id=item.id">
            <span>{{item.start_time}} - {{item.end_time}}</span>
            <span>余{{item.surplus}}</span>
          </p>
        </li>
      </ul>
    </div>

    <div class="tourist-info">
      <h3>观众信息</h3>
      <div class="btn-add" @click="fn_add_tourist" v-if="tourist.length < 6">+添加参观者（限6人)</div>
      <ul v-if="tourist.length">
        <li v-for="item in tourist" :key="item.id">
          <div class="delete" @click="fn_delete(item.idcard)">删除</div>
          <p>{{item.name}}</p>
          <p><span>身份证</span>{{item.idcard}}</p>
          <p>普通观众</p>
          <p><span>门票价格</span>￥{{item.price}}</p>
        </li>
      </ul>
    </div>
    <div class="btn-submit" @click="submit" v-if="btn_click">确定预约</div>
    <div class="btn-submit none-click" v-else>确定预约</div>

    <!--弹出添加游客-->
    <div class="add-tourist" @click="add_tour = false" :class="add_tour?'show':''">
      <div class="add-cont" @click.stop>
        <h3>观众信息</h3>
        <div class="input">
          <label>门票类型</label>
          <div class="check-box">
            <div class="check"><img :src="check_img_one"/></div>
            <span>普通观众</span>
          </div>
        </div>
        <div class="input">
          <label for="name">观众姓名</label>
          <div class="ipt-box"><input type="text" checked id="name" v-model="name" placeholder="请输入姓名"></div>
        </div>
        <div class="input">
          <label for="cardType">证件类型</label>
          <div class="ipt-box"><input type="text" checked id="cardType" disabled value="身份证"></div>
        </div>
        <div class="input">
          <label for="IDcard">证件号码</label>
          <div class="ipt-box"><input type="text" checked id="IDcard" onkeyup="value=value.replace(/[^\w]/g,'');"
                                      maxlength="18" v-model="IDcard" placeholder="请输入证件号码"></div>
        </div>
        <div class="input">
          <label for="cardType">门票价格</label>
          <div class="ipt-box price"><input type="text" checked id="price" disabled :value="'￥'+price"></div>
        </div>
        <!--<div class="input">-->
        <!--<div class="check-box">-->
        <!--&lt;!&ndash;<div class="check"><img :src="check_img_two"/></div>&ndash;&gt;-->
        <!--<span>门票价格</span>-->
        <!--</div>-->
        <!--<p>￥{{price}}</p>-->
        <!--</div>-->

        <div class="btn-add-box">
          <p @click="fn_reset">重置</p>
          <p @click="fn_add">确认添加</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        token: '',
        paiqi: [],
        price: '0.00',
        date: '',
        show: false, add_tour: false,

        comfig_type: 1,//是否是点击提交是弹出的日历，是则提示toast
        show_interval: false,//是否显示时段
        interval_id: 0,//选择的时段id
        tourist: [],//观众列表
        btn_click: true,

        // 添加观众
        name: '',
        IDcard: '',
        check_img_one: this.config.aliyun + 'static/ticket-checked.png',
        check_img_two: this.config.aliyun + 'static/ticket-check.png'
      };
    },
    mounted() {
      this.token = localStorage.getItem('token');
      this.utils.ajax(this, 'ticket/ticketDetail').then(res => {
        this.price = res.price;
      });
      if (this.token) {
        this.getVisitorList();

      }
    },
    methods: {
      // 点击参观日期
      show_calender() {
        this.comfig_type = 1;
        this.get_calender()
      },


      // 点击添加参观者
      fn_add_tourist() {
        if (this.token) {
          this.add_tour = true;
        } else {
          this.$router.push({
            name: 'login',
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          })
        }
      },


      // 点击重置按钮
      fn_reset() {
        this.name = '';
        this.IDcard = '';
      },
      // 点击确认添加按钮
      fn_add() {
        if (!this.name.trim()) {
          this.$toast("请输入姓名")
        } else if (!this.IDcard.trim()) {
          this.$toast("请输入证件号码")
        } else {
          let post = {
            name: this.name,
            idcard: this.IDcard
          };
          this.utils.ajax(this, 'ticket/addVisitor', post).then(() => {
            this.$dialog.alert({
              message: '添加成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.name = '';
              this.IDcard = '';
              this.add_tour = false;
              this.getVisitorList(length => {
                if (length === 6) {
                  this.$toast('可预约人数已达上限');
                }
              });
            });
          })
        }
      },
      // 点击删除按钮
      fn_delete(IDcard) {
        this.utils.ajax(this, 'ticket/visitorDelete', { idcard: IDcard }).then(() => {
          this.$dialog.alert({
            message: '已删除',
            confirmButtonColor: '#b38146'
          }).then(() => {
            this.getVisitorList();
          });
        })
      },
      getVisitorList(complete) {
        this.utils.ajax(this, 'ticket/visitorList').then(list => {
          this.tourist = list;
          if (complete) {
            complete(list.length);
          }
        })
      },
// 获取提交的参观人id
      submitVisitor() {
        let arr = [];
        for (let i = 0; i < this.tourist.length; i++) {
          arr.push(this.tourist[i].id);
        }
        return arr.join(',');
      },
      // 点击预约按钮
      submit() {
        if (this.token) {
          if (!this.date) {
            this.comfig_type = 2;
            this.get_calender();
            return;
          }if (this.interval_id===0){
            this.$dialog.alert({
              message: "请选择入馆时段",
              confirmButtonColor: '#b38146'
            })
            return;
          }
          if (this.tourist.length <= 0) {
            this.$dialog.alert({
              message: "请添加参观者",
              confirmButtonColor: '#b38146'
            })
          } else {
            if (this.btn_click) {
              this.btn_click = false;
              let data = {
                visitor_ids: this.submitVisitor(),
                time_id:this.interval_id
              };
              this.$dialog.confirm({
                message: '您即将提交' + this.tourist.length + '个人的预约门票',
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.utils.ajax(this, 'ticket/purchase', data, [46, 55, 56]).then(res => {
                  if (res.paid) {
                    this.btn_click = true;
                    this.$dialog.confirm({
                      message: "预约成功",
                      confirmButtonText: "查看订单",
                      confirmButtonColor: '#b38146',
                      cancelButtonText: "继续预约",
                      cancelButtonColor: '#b38146'
                    }).then(() => {
                      this.btn_click = true;
                      this.$router.push({
                        name: 'history'
                      })
                    }).catch(() => {
                      this.btn_click = true;
                      this.date = '';
                      this.tourist = [];
                    });
                  } else {
                    this.$router.push({ name: 'pay', query: { pay_order_sn: res.pay_order_sn } });
                  }
                }).catch(err => {
                  console.log(err);
                  let text;
                  if (this.tourist.length > 5) {
                    text = err.message;
                  } else {
                    text = err.data;
                  }
                  this.$dialog.alert({
                    message: text,
                    confirmButtonColor: '#b38146'
                  }).then(() => {
                    this.btn_click = true
                  });
                });
              }).catch(() => {
                this.btn_click = true;
              });
            }
          }
        } else {
          this.$router.push({
            name: 'login',
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          })
        }

      },
      formatDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString()[1] ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate().toString()[1] ? date.getDate() : '0' + date.getDate()}`
      },
      onConfirm(date) {
        this.show = false;
        this.btn_click = true;
        this.date = this.formatDate(date);
        if (this.comfig_type === 2) {
          this.$toast('日期选择成功，再次点击购买');
        }
        this.getPaiqiDetail()
      },
      formatter(day) {
        let date_str = this.utils.date_format(day.date, 'yyyy-MM-dd');
        for (let i = 0; i < this.paiqi.length; i++) {
          // console.log(date_str)
          if (date_str === this.paiqi[i].use_date) {
            if (this.paiqi[i].status == 0) {
              day.bottomInfo = this.paiqi[i].desc;
              day.type = 'disabled';
            } else {
              if (this.paiqi[i].surplus <= 0) {
                day.bottomInfo = '已满';
                day.type = 'disabled';
              } else {
                day.bottomInfo = '余' + this.paiqi[i].surplus;
              }
            }
            return day
          }
        }
        if (date_str > this.paiqi[0].use_date && date_str < this.paiqi[this.paiqi.length - 1].use_date) {
          day.bottomInfo = '无';
          day.type = 'disabled';
        }
        return day;
      },
      get_calender() {
        this.utils.ajax(this, 'ticket/paiqiList').then((res) => {
          // console.log(res)
          if (res.length > 0) {
            this.paiqi = res;
            this.show = true
          } else {
            this.$dialog.alert({
              message: '馆方还没有开放售票，敬请期待',
              confirmButtonColor: '#b38146'
            })
          }
        })
      },

      // 获取入馆时段
      getPaiqiDetail() {
        this.utils.ajax(this, 'ticket/paiqiDetail', { use_date: this.date }).then((res) => {
          console.log(res);
          if (res.time_list.length) {
            this.show_interval = true;
            this.paiqi_detail = res.time_list;
            // if (id) {
            //   for (let i = 0; i < res.time_list.length; i++) {
            //     if (res.time_list[i].id === id) {
            //       this.two_date = res.use_date + " " + res.time_list[i].start_time + "-" + res.time_list[i].end_time;
            //       if (this.date !== '请选择')
            //         this.succ_date = this.utils.date_format(new Date(this.date), 'MM月dd日 周w') + " " + res.time_list[i].start_time + "-" + res.time_list[i].end_time;
            //     }
            //   }
            // }
          } else {
            this.show_interval = false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .booking {
    .paiqi-box {
      margin: 30px 24px;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
    }

    .paiqi-box .paiqi {
      margin: 15px 25px;

      .van-cell--clickable:active {
        background-color: transparent;
      }

      .van-cell {
        font-size: 30px;
        color: #000;

        .van-cell__title {
          flex-shrink: 0;
          flex: unset;
          margin-right: 27px;
        }

        .date-color {
          text-align: left;
          font-size: 30px;
          color: #b38146;
        }

        .van-cell__right-icon {
          color: #b38146;
        }

        &:not(:last-child)::after {
          border: none;
        }
      }

    }

    /*入馆时段*/
    .ticket-interval {
      margin-bottom: 14px;
      overflow: hidden;
      background-color: #ffffff;

      h3 {
        margin: 40px 26px 0;
        font-size: 32px;
        color: #333333;
        font-weight: normal;
      }

      ul {
        display: flex;
        align-items: center;
        margin: 40px 26px;
        flex-wrap: wrap;

        li {
          border-radius: 10px;
          border: 2px solid #efefef;
          margin: 20px;
          color: #666666;

          p {
            padding: 10px 20px;
            font-size: 26px;

            span:first-child {
              margin-right: 40px;
            }
          }

          &.on {
            color: #cf903a;
            border-color: #cf903a;
          }
        }
      }
    }

    .tourist-info {
      padding: 24px;
      box-sizing: border-box;
      margin: 30px 24px 110px;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);

      h3 {
        font-size: 30px;
        color: #000;
        font-weight: normal;
      }

      .btn-add {
        margin: 27px 0;
        height: 70px;
        border-radius: 35px;
        border: dashed 2px #b38146;
        font-size: 24px;
        color: #b38146;
        line-height: 70px;
        text-align: center;
      }

      ul {
        li {
          background-color: #fcfaf7;
          padding: 29px 23px;
          box-sizing: border-box;
          position: relative;
          margin-top: 27px;

          .delete {
            position: absolute;
            top: 29px;
            right: 23px;
            font-size: 28px;
            color: #ff3f3f;
          }

          p {
            margin-top: 23px;
            font-size: 28px;
            color: #333333;

            span {
              margin-right: 25px;
            }

            &:first-child {
              margin-top: 0;
            }
          }
        }
      }
    }


    .add-tourist {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      opacity: 0;

      .add-cont {
        background-color: #ffffff;
        transition: 0.5s;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0;

        h3 {
          text-align: center;
          margin: 30px 0;
          font-size: 28px;
          font-weight: normal;
          color: #000;
        }

        .input {
          display: flex;
          /*justify-content: space-between;*/
          align-items: center;
          height: 60px;
          margin: 0 30px 18px;

          label {
            margin-right: 27px;
            font-size: 28px;
            color: #584e43;
            flex-shrink: 0;
          }

          .ipt-box {
            flex-grow: 1;
            height: 100%;
            border: solid 2px #b5b5b5;
            box-sizing: border-box;
            padding: 0 15px;

            input {
              display: block;
              font-size: 28px;
              color: #000;
              background: unset;
              outline: none;
              height: 100%;
              width: 100%;
              border: none;
            }

            &.price {
              border: none;

              input {
                color: #ff4c4c;
              }
            }
          }

          .check-box {
            /*flex-grow: 1;*/
            display: flex;
            align-items: center;
            margin-right: 27px;
            font-size: 28px;
            color: #584e43;

            .check {
              width: 24px;
              height: 24px;
              border: solid 2px #b38146;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
            }

            span {
              font-size: 28px;
              color: #000;
            }
          }

          p {
            font-size: 30px;
            color: #ff4c4c;
          }
        }

        .btn-add-box {
          display: flex;
          height: 98px;

          p {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background-color: rgb(179, 129, 70);
            font-size: 28px;
            color: #ffffff;
            box-sizing: border-box;

            &:first-child {
              border-right: 2px solid rgb(126, 65, 19);
            }
          }
        }
      }

      &.show {
        opacity: 1;
        z-index: 2001;

        .add-cont {
          height: 581px;
        }
      }
    }

    .btn-submit {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 98px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      color: #ffffff;
      background-color: #b38146;
      z-index: 2000;
    }
  }
</style>
