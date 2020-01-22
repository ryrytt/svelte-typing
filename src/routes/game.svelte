<svelte:head>
  <title>{status}</title>
</svelte:head>

<template lang="pug">
  +if(`status === 'LOADING'`)
    .container(in:fade out:fade)
      Loading(on:complete="{onReady}")

  +if(`status === 'READY'`)
    .container(in:fade)
      CountDown(on:start="{run}")

  +if(`status === 'PLAYING'`)
    .container(out:fade="{{duration: 500}}")
      Typing(questions="{questions}" on:result="{result}")

  +if(`status === 'RESULT'`)
    .container
      .result
        .result-body
          p(in:scale="{{duration: 2000, delay: 1000, easing: elasticOut}}")
            span CLEAR TIME
            span.time {clearTime}
        .back(in:fly="{{x:100, duration: 1000, delay: 3000}}")
          a(href="./")
            Button(label="Back")

</template>

<script>
  import { fade, fly, scale } from 'svelte/transition'
  import { elasticOut } from 'svelte/easing'
  import Loading from '@/components/molecules/Loading'
  import CountDown from '@/components/molecules/CountDown'
  import Typing from '@/components/molecules/Typing'
  import Button from '@/components/atoms/Button'

  let status = 'LOADING'
  let questions
  let clearTime = ''

  function onReady(data) {
    questions = data.detail.questions
    status = 'READY'
  }

  function run() {
    status = 'PLAYING'
  }

  function result(data) {
    clearTime = data.detail.time
    status = 'RESULT'
  }
</script>

<style src="./__styles/game.styl"></style>
