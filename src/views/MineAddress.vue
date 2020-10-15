<template>
  <div class="address">
    <div class="address-cont">
      <ul>
        <li v-for="(v,index) in addressList" :key="index" @click="addressChoise(v.id)">
          <div class="icon-box" @click.stop="editAddress(v.id)"><i class="iconfont icon-edit"></i></div>
          <p><span>{{v.username}}</span><span class="address-tel">{{v.tel}}</span></p>
          <div class="address-detail">
            <span v-if="v.default == 1">默认</span>
            <p>{{v.provincename+v.cityname+v.countyname+v.detail}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn-new-address" @click="addAddress">添加地址</div>
  </div>
</template>

<script>
  export default {
    name: 'Address',
    data() {
      return {
        addressList: [],
        shop_id: 0,
        num: 0,
        link_type: 0,
        attr_id: 0,
        ids: []
      }
    },
    created() {
      let shop_id = this.$route.query.shop_id;
      let num = this.$route.query.num;
      let link_type = parseInt(this.$route.query.link_type);
      let attr_id = parseInt(this.$route.query.attr_id);
      let ids = this.$route.query.ids;

      // 将获取的地址参数存放到data
      this.shop_id = shop_id;
      this.num = num;
      this.link_type = link_type;
      this.ids = ids;
      this.attr_id = attr_id;

      this.$toast({
        duration: 0,
        forbidClick: true,
        type: 'loading',
        message: '数据加载中...'
      });
      this.utils.ajax(this, 'my/addressList').then((res) => {
        this.addressList = res;
        this.$toast.clear();
      })
    },
    methods: {
      addressChoise(addressId) {
        switch (this.link_type) {
          case 0: // 个人中心进来的
            break;
          case 1: // 商品结算进来的
            this.$router.replace({
              name: 'shopsubmit',
              query: {
                shop_id: this.shop_id,
                num: this.num,
                attr_id: this.attr_id,
                address_id: addressId
              }
            });
            break;
          case 2: // 购物车结算进来的
            this.$router.replace({
              name: 'shopsubmitcart',
              query: {
                ids: this.ids,
                address_id: addressId
              }
            });
            break;
        }
      },
      editAddress(id) {
        switch (this.link_type) {
          case 0: // 个人中心进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                id: id,
                type: 1,
                link_type: this.link_type
              }
            });
            break;
          case 1: // 商品结算进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                id: id,
                type: 1,
                shop_id: this.shop_id,
                attr_id: this.attr_id,
                num: this.num,
                link_type: this.link_type
              }
            });
            break;
          case 2: // 购物车结算进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                id: id,
                type: 1,
                ids: this.ids,
                link_type: this.link_type
              }
            });
            break;
        }
      },
      addAddress() {
        switch (this.link_type) {
          case 0: // 个人中心进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                type: 0,
                link_type: this.link_type
              }
            });
            break;
          case 1: // 商品结算进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                type: 0,
                shop_id: this.shop_id,
                attr_id: this.attr_id,
                num: this.num,
                link_type: this.link_type
              }
            });
            break;
          case 2: // 购物车结算进来的
            this.$router.replace({
              name: 'editaddress',
              query: {
                type: 0,
                ids: this.ids,
                link_type: this.link_type
              }
            });
            break;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .address {
    margin-top: 80px;
    overflow: hidden;
    background-color: rgb(242, 242, 242);
    box-sizing: border-box;
    min-height: calc(100vh - 80px);

    .address-cont {
      ul {
        li {
          position: relative;
          margin: 20px;
          padding: 0 30px;
          overflow: hidden;
          background-color: #ffffff;
          border-radius: 10px;

          .icon-box {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;

            i {
              font-size: 30px;
              color: #ff4c4c;
            }
          }

          p {
            margin: 25px 0 15px;
            font-size: 30px;
            /*line-height: 42px;*/
            color: #333333;

            .address-tel {
              margin-left: 45px;
              color: #666666;
            }
          }

          .address-detail {
            display: flex;
            justify-content: flex-start;
            /*align-items: center;*/
            margin-bottom: 25px;

            span {
              width: 70px;
              height: 35px;
              text-align: center;
              background-color: #ff4c4c;
              border-radius: 15px;
              flex-shrink: 0;
              font-size: 24px;
              display: block;
              margin-top: 5px;
              margin-right: 25px;
              color: #ffffff;
            }

            p {
              flex-grow: 1;
              margin: 0;
            }
          }
        }
      }
    }

    .btn-new-address {
      margin: 120px auto 50px;
      width: 565px;
      height: 72px;
      background-color: #ff4c4c;
      text-align: center;
      line-height: 72px;
      border-radius: 15px;
      font-size: 28px;
      color: #ffffff;
    }
  }
</style>
