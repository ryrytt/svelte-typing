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
    .container
      p Playing
</template>

<script>
  import { fade } from 'svelte/transition'
  import Loading from '@/components/molecules/Loading'
  import CountDown from '@/components/molecules/CountDown'

  let status = 'LOADING'
  let questions

  function onReady(data) {
    console.log(data)
    questions = data.detail.questions
    status = 'READY'
  }

  function run() {
    status = 'PLAYING'
  }
</script>
