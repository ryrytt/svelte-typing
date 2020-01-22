<template lang="pug">
  .loading
    +await(`promise`)
      p Loading...
      +then()
        p OK
      +catch(`error`)
        p ERROR
</template>

<script>
  import { createEventDispatcher } from 'svelte'
  import Sleep from '@/assets/script/Sleep'

  const dispatch = createEventDispatcher()

  let promise = fetchQuestionData()

  async function fetchQuestionData() {
    const res = await fetch(`./data/questions.json`)
    const json = await res.json()

    if (res.ok) {
      await Sleep(1000)
      dispatch('complete', json)
      return json
    } else {
      const text = await res.text()
      throw new Error(text)
    }
  }
</script>

<style src="./__styles/Loading.styl"></style>
