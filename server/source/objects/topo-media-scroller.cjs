let TopoMediaScroller = function(element, crag, edit) {
  this.element = element;
  this.crag = crag;
  this.currentTopoContainer = null;
  this.edit = edit;
}

TopoMediaScroller.prototype.AddTopo = function(topo) {
  const container = this.element.appendChild(CreateTopoImageContainer(topo.id));
  let canvas = document.createElement('canvas');
  canvas.classList.add('topo-image');
  canvas = container.appendChild(canvas);
  canvas.onclick = event => this.OnTopoSelected(event.target.parentElement);
  return canvas;
}

TopoMediaScroller.prototype.OnTopoSelected = function(topoContainer) {
  if( this.currentTopoContainer ) this.currentTopoContainer.classList.remove('topo-container-selected');

  this.currentTopoContainer = topoContainer;

  this.currentTopoContainer.classList.add('topo-container-selected');
  let selectedTopoID = GetSelectedTopoID();

  RefreshIcons();
  RefreshMainTopoView();
  RefreshTopoRouteTable(this.crag, selectedTopoID);
  RefreshCragRouteTable(this.crag, selectedTopoID);

  document.getElementById('main-topo-container').classList.remove('do-not-display');

  if( this.edit ) _mainTopoImage.AddMouseHandler();
}

module.exports = TopoMediaScroller;
