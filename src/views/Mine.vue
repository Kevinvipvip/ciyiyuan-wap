<template>
  <div class="mine page">
    <div class="mine-title">
      <div class="title-top">
        <router-link tag="div" :to="{path: '/login',query: {url: this.$route.path,params: this.$route.query}}"
                     class="btn-cont" v-if="is_login">点击登录
        </router-link>
        <div class="mine-cont" @click="mine_info" v-else>
          <div class="mine-img" :style="'background-image:url('+mine.avatar+')'"></div>
          <div class="mine-nickname">id：{{mine.uid}}</div>
          <div class="mine-nickname">{{mine.nickname}}</div>
        </div>
      </div>
      <div class="my-order-box">
        <div class="mask-login" @click="to_login" v-if="!mine.tel"></div>
        <div class="my-order-title">
          <h3>我的订单</h3>
          <div class="look-more" @click="goToOrder(0)">查看更多<i class="iconfont icon-right"></i></div>
        </div>
        <div class="mine-order-status">
          <ul>
            <li v-for="(v,index) in orderClassify" :key="index" @click="goToOrder(v.id)">
              <i :class="'iconfont '+v.class"></i>
              <p>{{v.name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mine-list">
      <div class="mask-login" @click="to_login" v-if="!mine.tel"></div>
      <ul>
        <li v-for="(v,index) in myService" :key="index">
          <router-link :to="v.url">
            <div class="my-list-item">
              <i :class="'iconfont '+v.class"></i>
              <p>{{v.name}}</p>
            </div>
            <i class="iconfont icon-right"></i>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import avatar from '../assets/mine-avatar-detail.png'

  export default {
    data() {
      return {
        token: '',
        is_login: false,
        // is_auth: false,

        // 我的订单
        orderClassify: [
          {
            id: 1,
            class: 'icon-payment',
            name: '待付款'
          }, {
            id: 2,
            class: 'icon-pshipped',
            name: '待发货'
          }, {
            id: 3,
            class: 'icon-received',
            name: '待收货'
          }, {
            id: 4,
            class: 'icon-evaluate',
            name: '待评价'
          }, {
            id: 5,
            class: 'icon-refund',
            name: '售后'
          }
        ],
        // 我的服务
        myService: [
          // {
          //   url: '/shoppingcart',
          //   class: 'icon-cart',
          //   name: '购物车'
          // },
          {
            url: '/history',
            class: 'icon-record',
            name: '购票记录'
          }, {
            url: '/address?link_type=0',
            class: 'icon-address',
            name: '收货地址'
          },
          // {
          //   url: '/mycollect',
          //   class: 'icon-collect',
          //   name: '我的收藏'
          // }, {
          //   url: '/reservation?type=0',
          //   class: 'icon-appraisal',
          //   name: '预约鉴定'
          // }, {
          //   url: '/reservation?type=1',
          //   class: 'icon-photography',
          //   name: '预约摄影'
          // }
        ],
        mine: {}
      };
    },
    mounted() {
      // console.log(this.utils.hide_middle_content("450881199602066557"));
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.utils.ajax(this, 'my/getUserInfo').then((res) => {
          if (!res.avatar) {
            res.avatar = avatar;
            res.nickname = '添加昵称';
          }
          if (!res.uid) {
            res.uid = '绑定手机号后拥有';
          }
          this.is_login = false;
          this.mine = res;
          console.log(res);
          if (res.manager === 1) {
            let add_obj = {
              url: '/check_history',
              class: 'icon-hexiao',
              name: '核销记录'
            };
            this.myService.push(add_obj);
          }
        }).catch(() => {
          this.is_login = true;
        });
      } else {
        this.is_login = true;
      }
    },
    methods: {
      // 点击修改个人资料
      mine_info() {
        this.$router.push({ name: 'info' });
      },
      // 点击进去我的订单
      goToOrder(id) {
        console.log(id);
        this.$dialog.alert({
          message: '待开发',
          confirmButtonColor: '#b38146'
        }).then(() => {

        })
        // if (id === 5) {
        //   this.$router.push({
        //     name: 'aftermarket'
        //   })
        // } else {
        //   this.$router.push({
        //     name: 'ordercenter',
        //     query: {
        //       id: id
        //     }
        //   })
        // }
      },

      // 没有登录时，点击提示
      to_login() {
        this.$dialog.confirm({
          message: '需要登录后操作，是否前往登录？',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.$router.push({
            path: '/login',
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          });
        }).catch(() => {
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .mine {
    box-sizing: border-box;
    overflow: hidden;
    background-color: rgb(242, 242, 242);

    .mask-login {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
    }

    .mine-title {
      background: url("../assets/mine-title.png") no-repeat center;
      background-size: cover;
      height: 420px;
      position: relative;
      border-radius: 10px;
      margin: 20px;

      .title-top {
        height: 270px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        .btn-cont {
          text-align: center;
          font-size: 30px;
          color: #ffffff;
          border: 2px solid #aaa;
          padding: 10px 20px;
          box-sizing: border-box;
          border-radius: 10px;
        }

        .mine-cont {
          height: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;

          .mine-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 20px 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .mine-nickname {
            font-size: 30px;
            line-height: 42px;
            color: #ffffff;
          }
        }
      }

      .my-order-box {
        background-color: #ffffff;
        border-radius: 10px;
        position: absolute;
        bottom: -25px;
        left: 13px;
        right: 13px;

        .my-order-title {
          display: flex;
          height: 60px;
          justify-content: space-between;
          align-items: center;
          margin: 0 26px;

          h3 {
            font-size: 32px;
            font-weight: normal;
            color: #000000;
          }

          .look-more {
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 22px;
            color: #888888;

            i {
              font-size: 24px;
              color: #888888;
            }
          }
        }
      }

      .mine-order-status {

        ul {
          display: flex;
          justify-content: space-around;
          align-items: center;

          li {
            width: 20%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            height: 100%;
            align-items: center;

            i {
              font-size: 50px;
              color: #666;
            }

            p {
              font-size: 28px;
              color: #666666;
            }
          }
        }
      }
    }

    .mine-list {
      margin: 44px 20px;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;

      ul {
        /*margin-bottom: 20px;*/

        li {
          height: 80px;
          margin: 0 30px;
          overflow: hidden;

          a {
            display: flex;
            height: 100%;
            width: 100%;
            align-items: center;
            justify-content: space-between;

            .my-list-item {
              display: flex;
              align-items: center;
              height: 100%;
              font-size: 30px;
              color: #000000;

              i {
                margin-right: 20px;
                font-size: 40px;
              }
            }

            i {
              font-size: 40px;
              color: #888888;
            }
          }
        }
      }
    }
  }
</style>
