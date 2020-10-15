<template>
  <div class="edit-address">
    <van-address-edit
      :area-list="areaList"
      :show-delete="showDelete"
      :address-info="addressInfo"
      show-set-default
      show-search-result
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"></van-address-edit>
  </div>
</template>

<script>
  import areaList from '../area'

  export default {
    name: 'AddressEdit',
    data () {
      return {
        address_id: 0,
        searchResult: [],
        addressInfo: {},
        showDelete: true,
        areaList: areaList,

        type: 0,
        link_type: 0,
        num: 0,
        shop_id: 0,
        attr_id: 0,
        ids: ''
      }
    },
    created () {
      let type = parseInt(this.$route.query.type);
      let id = parseInt(this.$route.query.id);
      this.link_type = parseInt(this.$route.query.link_type);
      this.num = parseInt(this.$route.query.num);
      this.shop_id = parseInt(this.$route.query.shop_id);
      this.attr_id = parseInt(this.$route.query.attr_id);
      this.ids = this.$route.query.ids;
      this.address_id = id;

      this.type = type;
      if (type === 0) {
        this.showDelete = false;
      } else {
        this.showDelete = true;
        this.$toast({
          duration: 0,
          forbidClick: true,
          type: 'loading',
          message: '数据加载中...'
        });
        this.utils.ajax(this, 'my/addressDetail', { id: id }).then((res) => {
          let address = {
            name: res.username,
            tel: res.tel,
            province: res.provincename,
            city: res.cityname,
            county: res.countyname,
            areaCode: res.area_code,
            addressDetail: res.detail,
            isDefault: res.default === 1
          };
          this.addressInfo = address;
          this.$toast.clear();
        })
      }
    },
    methods: {
      onSave (res) {
        if (this.type === 0) {
          let data = {
            provincename: res.province,
            cityname: res.city,
            countyname: res.county,
            area_code: res.areaCode,
            detail: res.addressDetail,
            tel: res.tel,
            username: res.name,
            default: res.isDefault ? 1 : 0
          };
          // console.log(data)
          this.utils.ajax(this, 'my/addressAdd', data).then((res) => {
            console.log(res)
            this.$dialog.confirm({
              message: '地址添加成功'
            }).then(() => {
              this.returnAddress(this.link_type)
            })
          })
        } else {
          let data = {
            id: this.address_id,
            provincename: res.province,
            cityname: res.city,
            countyname: res.county,
            area_code: res.areaCode,
            detail: res.addressDetail,
            tel: res.tel,
            username: res.name,
            default: res.isDefault ? 1 : 0
          };
          this.utils.ajax(this, 'my/addressMod', data).then(() => {
            this.$dialog.confirm({
              message: '地址修改成功'
            }).then(() => {
              this.returnAddress(this.link_type)
            })
          })
        }
      },
      onDelete () {
        this.utils.ajax(this, 'my/addressDel', { id: this.address_id }).then(() => {
          // console.log(res)
          this.$dialog.alert({
            message: '收货地址已删除'
          }).then(() => {
            this.returnAddress(this.link_type)
          })
        })
      },
      returnAddress (link_type) {
        switch (link_type) {
          case 0: // 个人中心进来的
            this.$router.replace({
              name: 'address',
              query: {
                link_type: this.link_type
              }
            })
            break
          case 1: // 商品结算进来的
            this.$router.replace({
              name: 'address',
              query: {
                shop_id: this.shop_id,
                attr_id: this.attr_id,
                num: this.num,
                link_type: this.link_type
              }
            })
            break
          case 2: // 购物车结算进来的
            this.$router.replace({
              name: 'address',
              query: {
                ids: this.ids,
                link_type: this.link_type
              }
            })
            break
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .edit-address {
    margin-top: 80px;
    overflow: hidden;
    box-sizing: border-box;
    min-height: calc(100vh - 80px);
  }

</style>
