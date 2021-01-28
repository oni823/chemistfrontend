<template>
  <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
    <li v-for="(che, index) in list" :key="index" class="infinite-list-item">{{ che.storeName }}</li>
  </ul>
</template>

<script>
import store from '../store/index'
export default {
  name: 'List',
  store,
  data () {
    return {
      token: store.state.token,
      list: []
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.axios.get('http://139.196.191.187:8103/store?jwt=' + this.token).then(res => {
        console.log(res.data)
        this.list = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
