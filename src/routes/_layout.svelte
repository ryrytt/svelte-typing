<template lang="pug">
  .content
    Nav({segment})

    main
      slot()
</template>

<script>
  import Nav from '../components/Nav.svelte'

  export let segment
</script>

<style src="./__styles/layout.styl"></style>