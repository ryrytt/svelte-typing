<template lang="pug">
  .typing
    p.timer
      span TIME:
      | {playTimeText}
    .body
      p.question {currentQuestion.content}
      p.rubi {currentQuestion.kana}

      .answer
        p.input {inputChar}
        p.guide {guideChar}
</template>

<svelte:window on:keydown={handleKeydown}/>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import Sleep from '@/assets/script/Sleep'
  import { CODE_TABLE, CHAR_TABLE } from '@/constants/TypingData'

  export let questions

  const dispatch = createEventDispatcher()

  let score = 0                 // 得点
  let level = 1                 // 問題の難易度
  let reqExp = 5                // レベルアップに必要な得点
  let currentQuestion = ''      // 出題中の問題
  let validChar = []            // 出題中の問題を1文字づつローマ字表記したのを格納
  let questionList = []         // 現在のレベルに応じた問題一覧
  let inputChar = ''            // 入力した文字列
  let guideChar = ''            // 入力した文字列
  let playTime = 0              // ゲームのプレイ時間
  let timerId = null            // プレイ時間のタイマー
  let startTime = 0             // ゲーム開始時間
  let playTimeText = ''         // 表示用のプレイ時間
  let clearScore = 15           // クリアに必要な得点
  let isGameEnd = false         // ゲームが終了したか

  onMount(() => {
    createQuestionList()
    setNextQuestion()
    runTimer()
  })

  onDestroy(() => {
    if (timerId) clearTimeout(timerId)
  })

  /**
   * キー入力イベントハンドラ
   */
  function handleKeydown(e) {
    let _char = codeToChar(e.keyCode, e.shiftKey)
    if (!_char) return

    let _judged = jadgeInputChar(_char)
    if(_judged === false) {
      console.log('type miss')
      return
    }

    if(_judged === 0){
      success()
    } else {
      displayCharacters()
    }
  }

  /**
   * レベルに応じた問題リストを作成
   */
  function createQuestionList() {
    questionList = [...questions[level]]
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  }

  /**
   * 次の問題の設定
   */
  function setNextQuestion() {
    currentQuestion = questionList[score - (level * reqExp) + reqExp]
    inputChar = ''
    validChar = kanaToChar(currentQuestion.kana)
    displayCharacters()
  }

  /**
   * タイマー起動
   */
  function runTimer() {
    startTime = new Date().getTime()
    timerHandler()
  }

  function timerHandler() {
    let _now = new Date().getTime()
    let _diff = new Date(_now - startTime)
    let ms = ~~( (_diff.getMilliseconds() / 1000) * 100 ) + ''
    let sec = _diff.getSeconds() + ''
    let min = _diff.getMinutes() + ''

    playTimeText = `${ ('00' + min).slice(-2) }'${ ('00' + sec).slice(-2) }"${ ('00' + ms).slice(-2) }`

    if(!isGameEnd) timerId = setTimeout( timerHandler, 10 )
  }

  /**
   * 現在の問題に正解
   */
  function success() {
    score++
    const _lv = Math.max(1, Math.ceil(score / reqExp))
    if(level !== _lv) {
      level = _lv
      createQuestionList()
    }

    if(score >= clearScore) {
      onGameEnd()
    } else {
      setNextQuestion()
    }
  }

  /**
   * ゲームセット
   */
  async function onGameEnd() {
    isGameEnd = true
    await Sleep(50)
    dispatch('result', { time: playTimeText })
  }

  /**
   * タイプされたキーコードを対応文字列に変換
   */
  function codeToChar(keycode, shiftKey) {
    if(CODE_TABLE[keycode]){
      return shiftKey ? CODE_TABLE[keycode][1] : CODE_TABLE[keycode][0]
    }
    return false
  }

  /**
   * 入力された文字の判定
   */
  function jadgeInputChar(chr) {
    if(isGameEnd) return

    for(let i = 0; i < validChar[0].length; i++){
      if(validChar[0][i].substr(0, 1) === chr){
        inputChar += chr

        for(let j = 0; j < validChar[0].length; j++){
          if(validChar[0][j].substr(0, 1) === chr){
            validChar[0][j] = validChar[0][j].substr(1)

            if(validChar[0][j].length === 0){
              validChar.shift()
              break
            }
          } else {
            validChar[0].splice(j, 1)
            j--
          }
        }
        return validChar.length
      }
    }

    return false
  }

  /**
   * 入力された文字を表示
   */
  function displayCharacters() {
    let _guide = inputChar
    for (let i in validChar){
      _guide += validChar[i][0]
    }
    guideChar = _guide
  }

  /**
   * 仮名をローマ字表記に変換
   */
  function kanaToChar(str) {
    const characters = []

    for(let i = 0; i < str.length; i++){
      let list = []
      let s1 = str.substr(i, 1)
      let s2 = str.substr(i + 1, 1)
      let s3 = str.substr(i + 2, 1)
      let s4 = str.substr(i + 3, 1)
      let c1 = s1 ? CHAR_TABLE[s1] : ""
      let c2 = s2 ? CHAR_TABLE[s2] : ""
      let c3 = s3 ? CHAR_TABLE[s3] : ""
      let c4 = s4 ? CHAR_TABLE[s4] : ""
      let cA = s1 && s2 ? CHAR_TABLE[s1 + s2] : ""
      let cB = s2 && s3 ? CHAR_TABLE[s2 + s3] : ""
      let cC = s3 && s4 ? CHAR_TABLE[s3 + s4] : ""

      if(cA) {
        for(let iA in cA) list.push(cA[iA])
        for(let i1 in c1) for(let i2 in c2) list.push(c1[i1] + c2[i2])

        i = i + 1
      } else if(s1 == "ん") {
        if(s2 == "っ") {
          if(!c3 || c3[0].match(/^(A|I|U|E|O|N)/) || c3[0].length == 1) {
            list.push("NNXTU")
            list.push("NNLTU")
            list.push("NNXTSU")
            list.push("NNLTSU")
            list.push("NXTU")
            list.push("NLTU")
            list.push("NXTSU")
            list.push("NLTSU")

            i = i + 1
          } else if(cC) {
            for(let iC in cC) {
              list.push("NN"     + cC[iC].substr(0, 1) + cC[iC])
              list.push("NNXTU"  + cC[iC])
              list.push("NNLTU"  + cC[iC])
              list.push("NNXTSU" + cC[iC])
              list.push("NNLTSU" + cC[iC])
              list.push("N"      + cC[iC].substr(0, 1) + cC[iC])
              list.push("NXTU"   + cC[iC])
              list.push("NLTU"   + cC[iC])
              list.push("NXTSU"  + cC[iC])
              list.push("NLTSU"  + cC[iC])
            }
            for(let i3 in c3) {
              for(let i4 in c4) {
                list.push("NN"     + c3[i3].substr(0, 1) + c3[i3] + c4[i4])
                list.push("NNXTU"  + c3[i3] + c4[i4])
                list.push("NNLTU"  + c3[i3] + c4[i4])
                list.push("NNXTSU" + c3[i3] + c4[i4])
                list.push("NNLTSU" + c3[i3] + c4[i4])
                list.push("N"      + c3[i3].substr(0, 1) + c3[i3] + c4[i4])
                list.push("NXTU"   + c3[i3] + c4[i4])
                list.push("NLTU"   + c3[i3] + c4[i4])
                list.push("NXTSU"  + c3[i3] + c4[i4])
                list.push("NLTSU"  + c3[i3] + c4[i4])
              }
            }
            i = i + 3
          } else {
            for(let i3 in c3) {
              list.push("NN"     + c3[i3].substr(0, 1) + c3[i3])
              list.push("NNXTU"  + c3[i3])
              list.push("NNLTU"  + c3[i3])
              list.push("NNXTSU" + c3[i3])
              list.push("NNLTSU" + c3[i3])
              list.push("N"      + c3[i3].substr(0, 1) + c3[i3])
              list.push("NXTU"   + c3[i3])
              list.push("NLTU"   + c3[i3])
              list.push("NXTSU"  + c3[i3])
              list.push("NLTSU"  + c3[i3])
            }
            i = i + 2
          }
        } else if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/)) {
          list.push("NN")
        } else if(cB) {
          for(let iB in cB) {
            list.push("NN" + cB[iB])
            list.push("N" + cB[iB])
          }
          for(let i2 in c2) for(let i3 in c3) {
            list.push("NN" + c2[i2] + c3[i3])
            list.push("N" + c2[i2] + c3[i3])
          }
          i = i + 2
        } else {
          for(let i2 in c2) {
            list.push("NN" + c2[i2])
            list.push("N" + c2[i2])
          }
          i = i + 1
        }
      } else if(s1 == "っ") {
        if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/) || c2[0].length == 1) {
          list.push("XTU")
          list.push("LTU")
          list.push("XTSU")
          list.push("LTSU")
        } else if(cB) {
          for(let iB in cB) {
            list.push(cB[iB].substr(0, 1) + cB[iB])
            list.push("XTU" + cB[iB])
            list.push("LTU" + cB[iB])
            list.push("XTSU" + cB[iB])
            list.push("LTSU" + cB[iB])
          }
          for(let i2 in c2) for(let i3 in c3) {
            list.push(c2[i2].substr(0, 1) + c2[i2] + c3[i3])
            list.push("XTU" + c2[i2] + c3[i3])
            list.push("LTU" + c2[i2] + c3[i3])
            list.push("XTSU" + c2[i2] + c3[i3])
            list.push("LTSU" + c2[i2] + c3[i3])
          }
          i = i + 2
        } else {
          for(let i2 in c2) {
            list.push(c2[i2].substr(0, 1) + c2[i2])
            list.push("XTU" + c2[i2])
            list.push("LTU" + c2[i2])
            list.push("XTSU" + c2[i2])
            list.push("LTSU" + c2[i2])
          }
          i = i + 1
        }
      } else {
        for(let i1 in c1) list.push(c1[i1])
      }
      characters.push(list)
    }

    return characters
  }
</script>

<style src="./__styles/Typing.styl"></style>
