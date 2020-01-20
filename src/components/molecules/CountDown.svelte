<template lang="pug">
  .countdown
    +if(`count > 0`)
      p { count }
</template>

<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Sleep from '@/assets/script/Sleep'

  const dispatch = createEventDispatcher()

  let count
  let timer

  onMount(async () => {
    await Sleep(1000)
    count = 3
    runCounter()
  })

  async function runCounter() {
    await Sleep(1000)
    count--
    if(count < 0) {
      dispatch('start')
    } else {
      runCounter()
    }
  }
</script>

<style src="./__styles/CountDown.styl"></style>
