/**
 * スリープ処理
 * @param {number} ms - 停止するミリ秒
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default sleep
