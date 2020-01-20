<template lang="pug">
  section
    h1 Svelte Typing Game
    .start
      a(href="game")
        Button(label="START")
</template>

<script>
  import Button from '@/components/atoms/Button'
</script>

<style src="./__styles/GameTop.styl"></style>
