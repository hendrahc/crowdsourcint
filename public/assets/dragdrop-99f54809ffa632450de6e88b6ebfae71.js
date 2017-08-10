if(Object.isUndefined(Effect))throw"dragdrop.js requires including script.aculo.us' effects.js library";var Droppables={drops:[],remove:function(e){this.drops=this.drops.reject(function(t){return t.element==$(e)})},add:function(e){e=$(e);var t=Object.extend({greedy:!0,hoverclass:null,tree:!1},arguments[1]||{});if(t.containment){t._containers=[];var n=t.containment;Object.isArray(n)?n.each(function(e){t._containers.push($(e))}):t._containers.push($(n))}t.accept&&(t.accept=[t.accept].flatten()),Element.makePositioned(e),t.element=e,this.drops.push(t)},findDeepestChild:function(e){for(deepest=e[0],i=1;i<e.length;++i)Element.isParent(e[i].element,deepest.element)&&(deepest=e[i]);return deepest},isContained:function(e,t){var n;return n=t.tree?e.treeNode:e.parentNode,t._containers.detect(function(e){return n==e})},isAffected:function(e,t,n){return n.element!=t&&(!n._containers||this.isContained(t,n))&&(!n.accept||Element.classNames(t).detect(function(e){return n.accept.include(e)}))&&Position.within(n.element,e[0],e[1])},deactivate:function(e){e.hoverclass&&Element.removeClassName(e.element,e.hoverclass),this.last_active=null},activate:function(e){e.hoverclass&&Element.addClassName(e.element,e.hoverclass),this.last_active=e},show:function(e,t){if(this.drops.length){var n,i=[];this.drops.each(function(n){Droppables.isAffected(e,t,n)&&i.push(n)}),i.length>0&&(n=Droppables.findDeepestChild(i)),this.last_active&&this.last_active!=n&&this.deactivate(this.last_active),n&&(Position.within(n.element,e[0],e[1]),n.onHover&&n.onHover(t,n.element,Position.overlap(n.overlap,n.element)),n!=this.last_active&&Droppables.activate(n))}},fire:function(e,t){return this.last_active?(Position.prepare(),this.isAffected([Event.pointerX(e),Event.pointerY(e)],t,this.last_active)&&this.last_active.onDrop?(this.last_active.onDrop(t,this.last_active.element,e),!0):void 0):void 0},reset:function(){this.last_active&&this.deactivate(this.last_active)}},Draggables={drags:[],observers:[],register:function(e){0==this.drags.length&&(this.eventMouseUp=this.endDrag.bindAsEventListener(this),this.eventMouseMove=this.updateDrag.bindAsEventListener(this),this.eventKeypress=this.keyPress.bindAsEventListener(this),Event.observe(document,"mouseup",this.eventMouseUp),Event.observe(document,"mousemove",this.eventMouseMove),Event.observe(document,"keypress",this.eventKeypress)),this.drags.push(e)},unregister:function(e){this.drags=this.drags.reject(function(t){return t==e}),0==this.drags.length&&(Event.stopObserving(document,"mouseup",this.eventMouseUp),Event.stopObserving(document,"mousemove",this.eventMouseMove),Event.stopObserving(document,"keypress",this.eventKeypress))},activate:function(e){e.options.delay?this._timeout=setTimeout(function(){Draggables._timeout=null,window.focus(),Draggables.activeDraggable=e}.bind(this),e.options.delay):(window.focus(),this.activeDraggable=e)},deactivate:function(){this.activeDraggable=null},updateDrag:function(e){if(this.activeDraggable){var t=[Event.pointerX(e),Event.pointerY(e)];this._lastPointer&&this._lastPointer.inspect()==t.inspect()||(this._lastPointer=t,this.activeDraggable.updateDrag(e,t))}},endDrag:function(e){this._timeout&&(clearTimeout(this._timeout),this._timeout=null),this.activeDraggable&&(this._lastPointer=null,this.activeDraggable.endDrag(e),this.activeDraggable=null)},keyPress:function(e){this.activeDraggable&&this.activeDraggable.keyPress(e)},addObserver:function(e){this.observers.push(e),this._cacheObserverCallbacks()},removeObserver:function(e){this.observers=this.observers.reject(function(t){return t.element==e}),this._cacheObserverCallbacks()},notify:function(e,t,n){this[e+"Count"]>0&&this.observers.each(function(i){i[e]&&i[e](e,t,n)}),t.options[e]&&t.options[e](t,n)},_cacheObserverCallbacks:function(){["onStart","onEnd","onDrag"].each(function(e){Draggables[e+"Count"]=Draggables.observers.select(function(t){return t[e]}).length})}},Draggable=Class.create({initialize:function(e){var t={handle:!1,reverteffect:function(e,t,n){var i=.02*Math.sqrt(Math.abs(2^t)+Math.abs(2^n));new Effect.Move(e,{x:-n,y:-t,duration:i,queue:{scope:"_draggable",position:"end"}})},endeffect:function(e){var t=Object.isNumber(e._opacity)?e._opacity:1;new Effect.Opacity(e,{duration:.2,from:.7,to:t,queue:{scope:"_draggable",position:"end"},afterFinish:function(){Draggable._dragging[e]=!1}})},zindex:1e3,revert:!1,quiet:!1,scroll:!1,scrollSensitivity:20,scrollSpeed:15,snap:!1,delay:0};(!arguments[1]||Object.isUndefined(arguments[1].endeffect))&&Object.extend(t,{starteffect:function(e){e._opacity=Element.getOpacity(e),Draggable._dragging[e]=!0,new Effect.Opacity(e,{duration:.2,from:e._opacity,to:.7})}});var n=Object.extend(t,arguments[1]||{});this.element=$(e),n.handle&&Object.isString(n.handle)&&(this.handle=this.element.down("."+n.handle,0)),this.handle||(this.handle=$(n.handle)),this.handle||(this.handle=this.element),!n.scroll||n.scroll.scrollTo||n.scroll.outerHTML||(n.scroll=$(n.scroll),this._isScrollChild=Element.childOf(this.element,n.scroll)),Element.makePositioned(this.element),this.options=n,this.dragging=!1,this.eventMouseDown=this.initDrag.bindAsEventListener(this),Event.observe(this.handle,"mousedown",this.eventMouseDown),Draggables.register(this)},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown),Draggables.unregister(this)},currentDelta:function(){return[parseInt(Element.getStyle(this.element,"left")||"0"),parseInt(Element.getStyle(this.element,"top")||"0")]},initDrag:function(e){if((Object.isUndefined(Draggable._dragging[this.element])||!Draggable._dragging[this.element])&&Event.isLeftClick(e)){var t=Event.element(e);if((tag_name=t.tagName.toUpperCase())&&("INPUT"==tag_name||"SELECT"==tag_name||"OPTION"==tag_name||"BUTTON"==tag_name||"TEXTAREA"==tag_name))return;var n=[Event.pointerX(e),Event.pointerY(e)],i=Position.cumulativeOffset(this.element);this.offset=[0,1].map(function(e){return n[e]-i[e]}),Draggables.activate(this),Event.stop(e)}},startDrag:function(e){if(this.dragging=!0,this.delta||(this.delta=this.currentDelta()),this.options.zindex&&(this.originalZ=parseInt(Element.getStyle(this.element,"z-index")||0),this.element.style.zIndex=this.options.zindex),this.options.ghosting&&(this._clone=this.element.cloneNode(!0),this._originallyAbsolute="absolute"==this.element.getStyle("position"),this._originallyAbsolute||Position.absolutize(this.element),this.element.parentNode.insertBefore(this._clone,this.element)),this.options.scroll)if(this.options.scroll==window){var t=this._getWindowScroll(this.options.scroll);this.originalScrollLeft=t.left,this.originalScrollTop=t.top}else this.originalScrollLeft=this.options.scroll.scrollLeft,this.originalScrollTop=this.options.scroll.scrollTop;Draggables.notify("onStart",this,e),this.options.starteffect&&this.options.starteffect(this.element)},updateDrag:function(event,pointer){if(this.dragging||this.startDrag(event),this.options.quiet||(Position.prepare(),Droppables.show(pointer,this.element)),Draggables.notify("onDrag",this,event),this.draw(pointer),this.options.change&&this.options.change(this),this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window)with(this._getWindowScroll(this.options.scroll))p=[left,top,left+width,top+height];else p=Position.page(this.options.scroll),p[0]+=this.options.scroll.scrollLeft+Position.deltaX,p[1]+=this.options.scroll.scrollTop+Position.deltaY,p.push(p[0]+this.options.scroll.offsetWidth),p.push(p[1]+this.options.scroll.offsetHeight);var speed=[0,0];pointer[0]<p[0]+this.options.scrollSensitivity&&(speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity)),pointer[1]<p[1]+this.options.scrollSensitivity&&(speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity)),pointer[0]>p[2]-this.options.scrollSensitivity&&(speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity)),pointer[1]>p[3]-this.options.scrollSensitivity&&(speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity)),this.startScrolling(speed)}Prototype.Browser.WebKit&&window.scrollBy(0,0),Event.stop(event)},finishDrag:function(e,t){if(this.dragging=!1,this.options.quiet){Position.prepare();var n=[Event.pointerX(e),Event.pointerY(e)];Droppables.show(n,this.element)}this.options.ghosting&&(this._originallyAbsolute||Position.relativize(this.element),delete this._originallyAbsolute,Element.remove(this._clone),this._clone=null);var i=!1;t&&(i=Droppables.fire(e,this.element),i||(i=!1)),i&&this.options.onDropped&&this.options.onDropped(this.element),Draggables.notify("onEnd",this,e);var s=this.options.revert;s&&Object.isFunction(s)&&(s=s(this.element));var o=this.currentDelta();s&&this.options.reverteffect?(0==i||"failure"!=s)&&this.options.reverteffect(this.element,o[1]-this.delta[1],o[0]-this.delta[0]):this.delta=o,this.options.zindex&&(this.element.style.zIndex=this.originalZ),this.options.endeffect&&this.options.endeffect(this.element),Draggables.deactivate(this),Droppables.reset()},keyPress:function(e){e.keyCode==Event.KEY_ESC&&(this.finishDrag(e,!1),Event.stop(e))},endDrag:function(e){this.dragging&&(this.stopScrolling(),this.finishDrag(e,!0),Event.stop(e))},draw:function(e){var t=Position.cumulativeOffset(this.element);if(this.options.ghosting){var n=Position.realOffset(this.element);t[0]+=n[0]-Position.deltaX,t[1]+=n[1]-Position.deltaY}var i=this.currentDelta();t[0]-=i[0],t[1]-=i[1],this.options.scroll&&this.options.scroll!=window&&this._isScrollChild&&(t[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft,t[1]-=this.options.scroll.scrollTop-this.originalScrollTop);var s=[0,1].map(function(n){return e[n]-t[n]-this.offset[n]}.bind(this));this.options.snap&&(s=Object.isFunction(this.options.snap)?this.options.snap(s[0],s[1],this):Object.isArray(this.options.snap)?s.map(function(e,t){return(e/this.options.snap[t]).round()*this.options.snap[t]}.bind(this)):s.map(function(e){return(e/this.options.snap).round()*this.options.snap}.bind(this)));var o=this.element.style;this.options.constraint&&"horizontal"!=this.options.constraint||(o.left=s[0]+"px"),this.options.constraint&&"vertical"!=this.options.constraint||(o.top=s[1]+"px"),"hidden"==o.visibility&&(o.visibility="")},stopScrolling:function(){this.scrollInterval&&(clearInterval(this.scrollInterval),this.scrollInterval=null,Draggables._lastScrollPointer=null)},startScrolling:function(e){(e[0]||e[1])&&(this.scrollSpeed=[e[0]*this.options.scrollSpeed,e[1]*this.options.scrollSpeed],this.lastScrolled=new Date,this.scrollInterval=setInterval(this.scroll.bind(this),10))},scroll:function(){var current=new Date,delta=current-this.lastScrolled;if(this.lastScrolled=current,this.options.scroll==window){with(this._getWindowScroll(this.options.scroll))if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1e3;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1])}}else this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1e3,this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1e3;Position.prepare(),Droppables.show(Draggables._lastPointer,this.element),Draggables.notify("onDrag",this),this._isScrollChild&&(Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer),Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1e3,Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1e3,Draggables._lastScrollPointer[0]<0&&(Draggables._lastScrollPointer[0]=0),Draggables._lastScrollPointer[1]<0&&(Draggables._lastScrollPointer[1]=0),this.draw(Draggables._lastScrollPointer)),this.options.change&&this.options.change(this)},_getWindowScroll:function(w){var T,L,W,H;with(w.document)w.document.documentElement&&documentElement.scrollTop?(T=documentElement.scrollTop,L=documentElement.scrollLeft):w.document.body&&(T=body.scrollTop,L=body.scrollLeft),w.innerWidth?(W=w.innerWidth,H=w.innerHeight):w.document.documentElement&&documentElement.clientWidth?(W=documentElement.clientWidth,H=documentElement.clientHeight):(W=body.offsetWidth,H=body.offsetHeight);return{top:T,left:L,width:W,height:H}}});Draggable._dragging={};var SortableObserver=Class.create({initialize:function(e,t){this.element=$(e),this.observer=t,this.lastValue=Sortable.serialize(this.element)},onStart:function(){this.lastValue=Sortable.serialize(this.element)},onEnd:function(){Sortable.unmark(),this.lastValue!=Sortable.serialize(this.element)&&this.observer(this.element)}}),Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(e){for(;"BODY"!=e.tagName.toUpperCase();){if(e.id&&Sortable.sortables[e.id])return e;e=e.parentNode}},options:function(e){return(e=Sortable._findRootElement($(e)))?Sortable.sortables[e.id]:void 0},destroy:function(e){e=$(e);var t=Sortable.sortables[e.id];t&&(Draggables.removeObserver(t.element),t.droppables.each(function(e){Droppables.remove(e)}),t.draggables.invoke("destroy"),delete Sortable.sortables[t.element.id])},create:function(e){e=$(e);var t=Object.extend({element:e,tag:"li",dropOnEmpty:!1,tree:!1,treeTag:"ul",overlap:"vertical",constraint:"vertical",containment:e,handle:!1,only:!1,delay:0,hoverclass:null,ghosting:!1,quiet:!1,scroll:!1,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,elements:!1,handles:!1,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});this.destroy(e);var n={revert:!0,quiet:t.quiet,scroll:t.scroll,scrollSpeed:t.scrollSpeed,scrollSensitivity:t.scrollSensitivity,delay:t.delay,ghosting:t.ghosting,constraint:t.constraint,handle:t.handle};t.starteffect&&(n.starteffect=t.starteffect),t.reverteffect?n.reverteffect=t.reverteffect:t.ghosting&&(n.reverteffect=function(e){e.style.top=0,e.style.left=0}),t.endeffect&&(n.endeffect=t.endeffect),t.zindex&&(n.zindex=t.zindex);var i={overlap:t.overlap,containment:t.containment,tree:t.tree,hoverclass:t.hoverclass,onHover:Sortable.onHover},s={onHover:Sortable.onEmptyHover,overlap:t.overlap,containment:t.containment,hoverclass:t.hoverclass};Element.cleanWhitespace(e),t.draggables=[],t.droppables=[],(t.dropOnEmpty||t.tree)&&(Droppables.add(e,s),t.droppables.push(e)),(t.elements||this.findElements(e,t)||[]).each(function(s,o){var r=t.handles?$(t.handles[o]):t.handle?$(s).select("."+t.handle)[0]:s;t.draggables.push(new Draggable(s,Object.extend(n,{handle:r}))),Droppables.add(s,i),t.tree&&(s.treeNode=e),t.droppables.push(s)}),t.tree&&(Sortable.findTreeElements(e,t)||[]).each(function(n){Droppables.add(n,s),n.treeNode=e,t.droppables.push(n)}),this.sortables[e.id]=t,Draggables.addObserver(new SortableObserver(e,t.onUpdate))},findElements:function(e,t){return Element.findChildren(e,t.only,t.tree?!0:!1,t.tag)},findTreeElements:function(e,t){return Element.findChildren(e,t.only,t.tree?!0:!1,t.treeTag)},onHover:function(e,t,n){if(!(Element.isParent(t,e)||n>.33&&.66>n&&Sortable.options(t).tree))if(n>.5){if(Sortable.mark(t,"before"),t.previousSibling!=e){var i=e.parentNode;e.style.visibility="hidden",t.parentNode.insertBefore(e,t),t.parentNode!=i&&Sortable.options(i).onChange(e),Sortable.options(t.parentNode).onChange(e)}}else{Sortable.mark(t,"after");var s=t.nextSibling||null;if(s!=e){var i=e.parentNode;e.style.visibility="hidden",t.parentNode.insertBefore(e,s),t.parentNode!=i&&Sortable.options(i).onChange(e),Sortable.options(t.parentNode).onChange(e)}}},onEmptyHover:function(e,t,n){var i=e.parentNode,s=Sortable.options(t);if(!Element.isParent(t,e)){var o,r=Sortable.findElements(t,{tag:s.tag,only:s.only}),l=null;if(r){var a=Element.offsetSize(t,s.overlap)*(1-n);for(o=0;o<r.length;o+=1){if(!(a-Element.offsetSize(r[o],s.overlap)>=0)){if(a-Element.offsetSize(r[o],s.overlap)/2>=0){l=o+1<r.length?r[o+1]:null;break}l=r[o];break}a-=Element.offsetSize(r[o],s.overlap)}}t.insertBefore(e,l),Sortable.options(i).onChange(e),s.onChange(e)}},unmark:function(){Sortable._marker&&Sortable._marker.hide()},mark:function(e,t){var n=Sortable.options(e.parentNode);if(!n||n.ghosting){Sortable._marker||(Sortable._marker=($("dropmarker")||Element.extend(document.createElement("DIV"))).hide().addClassName("dropmarker").setStyle({position:"absolute"}),document.getElementsByTagName("body").item(0).appendChild(Sortable._marker));var i=Position.cumulativeOffset(e);Sortable._marker.setStyle({left:i[0]+"px",top:i[1]+"px"}),"after"==t&&("horizontal"==n.overlap?Sortable._marker.setStyle({left:i[0]+e.clientWidth+"px"}):Sortable._marker.setStyle({top:i[1]+e.clientHeight+"px"})),Sortable._marker.show()}},_tree:function(e,t,n){for(var i=Sortable.findElements(e,t)||[],s=0;s<i.length;++s){var o=i[s].id.match(t.format);if(o){var r={id:encodeURIComponent(o?o[1]:null),element:e,parent:n,children:[],position:n.children.length,container:$(i[s]).down(t.treeTag)};r.container&&this._tree(r.container,t,r),n.children.push(r)}}return n},tree:function(e){e=$(e);var t=this.options(e),n=Object.extend({tag:t.tag,treeTag:t.treeTag,only:t.only,name:e.id,format:t.format},arguments[1]||{}),i={id:null,parent:null,children:[],container:e,position:0};return Sortable._tree(e,n,i)},_constructIndex:function(e){var t="";do e.id&&(t="["+e.position+"]"+t);while(null!=(e=e.parent));return t},sequence:function(e){e=$(e);var t=Object.extend(this.options(e),arguments[1]||{});return $(this.findElements(e,t)||[]).map(function(e){return e.id.match(t.format)?e.id.match(t.format)[1]:""})},setSequence:function(e,t){e=$(e);var n=Object.extend(this.options(e),arguments[2]||{}),i={};this.findElements(e,n).each(function(e){e.id.match(n.format)&&(i[e.id.match(n.format)[1]]=[e,e.parentNode]),e.parentNode.removeChild(e)}),t.each(function(e){var t=i[e];t&&(t[1].appendChild(t[0]),delete i[e])})},serialize:function(e){e=$(e);var t=Object.extend(Sortable.options(e),arguments[1]||{}),n=encodeURIComponent(arguments[1]&&arguments[1].name?arguments[1].name:e.id);return t.tree?Sortable.tree(e,arguments[1]).children.map(function(e){return[n+Sortable._constructIndex(e)+"[id]="+encodeURIComponent(e.id)].concat(e.children.map(arguments.callee))}).flatten().join("&"):Sortable.sequence(e,arguments[1]).map(function(e){return n+"[]="+encodeURIComponent(e)}).join("&")}};Element.isParent=function(e,t){return e.parentNode&&e!=t?e.parentNode==t?!0:Element.isParent(e.parentNode,t):!1},Element.findChildren=function(e,t,n,i){if(!e.hasChildNodes())return null;i=i.toUpperCase(),t&&(t=[t].flatten());var s=[];return $A(e.childNodes).each(function(e){if(!e.tagName||e.tagName.toUpperCase()!=i||t&&!Element.classNames(e).detect(function(e){return t.include(e)})||s.push(e),n){var o=Element.findChildren(e,t,n,i);o&&s.push(o)}}),s.length>0?s.flatten():[]},Element.offsetSize=function(e,t){return e["offset"+("vertical"==t||"height"==t?"Height":"Width")]};