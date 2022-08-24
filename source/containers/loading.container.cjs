let Create = () => {
  const div = document.createElement('div')
  div.classList.add('loading-container')
  div.innerText = 'loading...'
  return {root:div}
}

exports.Create = Create
