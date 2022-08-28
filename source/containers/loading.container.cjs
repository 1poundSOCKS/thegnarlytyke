let Create = () => {
  const root = document.createElement('div')
  root.classList.add('loading-container')

  const header = document.createElement('div')

  // div.innerText = 'loading...'

  // <i class="fa fa-spinner" aria-hidden="true"></i>

  const spinner = document.createElement('i')
  spinner.classList.add('fa','fa-spinner','fa-spin')

  root.appendChild(header)
  root.appendChild(spinner)

  return {root:root,header:header}
}

exports.Create = Create
exports.DisplayTemporaryView = DisplayTemporaryView
