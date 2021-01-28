<template>
  <div class="map">
    <div id="GDMap" class="amap-wrapper"></div>
    <div id="panel"></div>
    <input id="tipinput" placeholder="输入关键词搜索位置，交叉路口，地标" type="text" />
  </div>
</template>

<script>
import store from '../store/index'
import loadMap from '../assets/js/loadMap'
export default {
  name: 'Map',
  store,
  data () {
    return {
      token: this.$route.query.jwt,
      inputContent: '',
      // 地图实例
      GDMap: null,
      plugins: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch',
        'AMap.OverView',
        'AMap.MouseTool',
        'AMap.PolyEditor',
        'AMap.RectangleEditor',
        'AMap.DistrictLayer',
        'AMap.CustomLayer'
      ],
      // key
      key: '2e2ab17c4ecb1fe2cb9b983f85b9457e',
      // 地图版本
      v: '1.4.4'
    }
  },
  mounted () {
    console.log(this.$route.query.jwt)
    if (!this.$store.state.token) {
      store.commit('putToken', this.$route.query.jwt)
    }

    loadMap(this.key, this.plugins, this.v)
      .then(AMap => {
        this.GDMap = new AMap.Map('GDMap', {
          zoom: 10
          // center: [119.947, 31.7728]
        })
        this.GDMap.on('complete', () => {
          console.log('completed')
          var auto = new AMap.Autocomplete({
            input: 'tipinput'
          })

          var placeSearch = new AMap.PlaceSearch({
            map: this.GDMap,
            pageSize: 1
          }) // 构造地点查询类
          AMap.event.addListener(auto, 'select', select) // 注册监听，当选中某条记录时会触发
          AMap.event.addListener(placeSearch, 'markerClick', (e) => {
            var that = this
            console.log(e.data.location.lng, e.data.location.lat)
            var cpoint = [e.data.location.lng, e.data.location.lat]
            AMap.service(['AMap.PlaceSearch'], function () {
              var cSearch = new AMap.PlaceSearch({
                type: '药房',
                pageSize: 1,
                pageIndex: 1,
                city: e.data.adcode,
                citylimit: true,
                map: that.GDMap
              })
              cSearch.searchNearBy('', cpoint, 5000, function (status, result) {
                if (status === 'no_data') {
                  alert('附近5公里内没有药房')
                } else {
                  var name = result.poiList.pois[0].name
                  console.log(name)
                  console.log(that.$store.state.token)
                  that.axios.post('http://139.196.191.187:8103/store', {
                    jwt: that.$store.state.token,
                    storeName: name
                  }).then(res => {
                    console.log(res.data)
                  })
                }
              })
            })
          })
          function select (e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name)
            alert('点击位置标签搜索该位置附近5公里内最近的药房')
          }
        })
      })
      .catch(() => {
        console.log('地图加载失败！')
      })
  },
  methods: {}
}
</script>

<style>
input{
  width: 80%;
  margin: 10px 20px 20px;
  height: 30px;
}
.amap-wrapper {
  width: 100%;
  margin: 0 auto;
  height: 700px;
}
.search-box {
    position: absolute;
    top: 25px;
    left: 20px;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
</style>
