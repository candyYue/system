<template>
  <div id="dailog">
    <transition enter-active-class="animated fadeIn">
      <Modal v-if="Modal" v-model="Modal" :title="Title" :mask-closable="false" >
        <a slot="close" @click="cancel"><Icon type="ios-close-empty"></Icon></a>

        <div slot="footer">
          <Button type="primary" size="large" @click="comfirm">确定</Button>
          <Button size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
    </transition>
  </div>
</template>
<script>
export default {
  name: "dailog",
  data: () => ({

  })
}
</script>
<style scoped>
</style>
