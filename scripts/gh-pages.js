var ghpages = require('gh-pages');

ghpages.publish(
  '__sapper__/export/svelte-typing',// <-- replace yourproject with your repo name
  {
    branch: 'master',
    repo: 'https://github.com/ryrytt/svelte-typing.git',
    user: {
      name: 'ryrytt'
    }
  },
  () => {
    console.log('Deploy Complete!')
  }
)