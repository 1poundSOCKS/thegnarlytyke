const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
const ViewContainer = require('./containers/view.container.cjs')
const LoadingContainer = require('./containers/loading.container.cjs')
const { CreateFeedContainer, LoadFeed, RefreshFeed } = require('./containers/feed.container.cjs')

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() );
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();

  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  // create the main page view and add the views
  const pageViewContainer = ViewContainer.Create()
  const loadingContainer = LoadingContainer.Create()
  const feedContainer = CreateFeedContainer()
  ViewContainer.AddView(pageViewContainer,loadingContainer,'loading')
  ViewContainer.AddView(pageViewContainer,feedContainer,'feed')
  
  const page = document.getElementById('page')
  const pageHeader = CreatePageHeader('feed',cookie,Config)
  page.appendChild(pageHeader.root)
  page.appendChild(pageViewContainer.root)

  ViewContainer.DisplayTemporaryView(pageViewContainer,'loading','feed', async () => {
    try {
      const feed = await LoadFeed(DataStorage)
      RefreshFeed(feedContainer,feed)
      return feed
    }
    catch( e ) {}
  })
}
