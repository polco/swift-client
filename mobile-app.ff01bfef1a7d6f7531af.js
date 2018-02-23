webpackJsonp([2],{"./src/mobile/app.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js"),i=s("./node_modules/react-dom/index.js");s("./src/shared/styles/core.less");const o=s("./src/mobile/views/Main.tsx");localStorage.setItem("debug","swift*");const r=document.getElementById("swift");r.classList.add("mobile"),i.render(n.createElement(o.default,null),r)},"./src/mobile/views/Main.less":function(e,t){},"./src/mobile/views/Main.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/mobx/lib/mobx.module.js"),i=s("./node_modules/mobx-react-devtools/index.js"),o=s("./node_modules/react/index.js");i.configureDevtool({logEnabled:!0});const r=s("./src/shared/context.ts"),a=s("./src/shared/Store.ts"),c=s("./src/shared/views/CreateSession.tsx"),d=s("./src/shared/views/JoinSession.tsx"),l=s("./src/shared/views/Sessions.tsx"),h=s("./src/shared/views/SessionViewer.tsx"),u=s("./src/shared/views/tabs.tsx"),p=s("./src/shared/components/Tabs.tsx");s("./src/mobile/views/Main.less");const m={sessions:l.default,create:c.default,join:d.default};class f extends o.PureComponent{constructor(e,t){super(e,t),this.selectTab=(e=>{0===this.state.category?this.setState({tabId:"session",sessionId:e}):this.setState({tabId:e})}),this.navigateToSession=(e=>{this.setState({tabId:"session",sessionId:e,category:0})}),this.navigateToTab=(e=>{this.setState({tabId:e,category:1})}),this.store=new a.default,this.state={tabId:"create",tabs:[[],u.TabsInfo],category:1,sessionId:null},this.sessionsObserverDispose=n.observe(this.store.sessionList,()=>{this.setState({tabs:[this.store.sessionList.map(e=>{const t=this.store.getSession(e);return{tabId:e,Label:()=>t.name}}),u.TabsInfo]})})}componentWillUnmount(){this.sessionsObserverDispose()}getChildContext(){return{store:this.store}}render(){const{tabId:e,tabs:t,category:s,sessionId:n}=this.state,i="session"===e?h.default:m[e];return o.createElement("div",{className:"Main"},o.createElement("div",{className:"Main__tab-container"},o.createElement(i,{navigateToSession:this.navigateToSession,navigateToTab:this.navigateToTab,sessionId:n})),o.createElement(p.default,{tabs:t,categoryIndex:s,currentTabId:"session"===e&&n?n:e,onTabSelect:this.selectTab}),!1)}}f.childContextTypes=r.contextTypes,t.default=f},"./src/shared/GatewayClient.ts":function(e,t,s){"use strict";var n=this&&this.__awaiter||function(e,t,s,n){return new(s||(s=Promise))(function(i,o){function r(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?i(e.value):new s(function(t){t(e.value)}).then(r,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/debug-logger/debug-logger.js"),o=s("./node_modules/events/events.js"),r=s("./node_modules/socket.io-client/lib/index.js"),a=i("swift:GatewayClient");t.default=class extends o.EventEmitter{constructor(){super(),this.isConnecting=!1,this.socket=r("https://swift-gateway.herokuapp.com",{transports:["websocket"],autoConnect:!1}),this.socket.on("data",(e,t)=>{a("received data",t),this.emit("data",e,t)}),this.socket.on("error",e=>a(e)),this.socket.on("disconnect",()=>{a("Disconnected from the gateway"),this.emit("disconnected")}),this.socket.on("join",(e,t)=>{this.emit("join",e,t)}),this.socket.on("sessionClient",(e,t)=>{this.emit("sessionClient",e,t)})}connect(){return this.isConnecting||this.socket.connected?Promise.resolve():(this.isConnecting=!0,new Promise((e,t)=>{this.socket.connect(),this.socket.once("connect",()=>{this.isConnecting=!1,a("Connected to the gateway"),this.socket.removeListener("connect_error"),this.socket.removeListener("connect_timeout"),e()}),this.socket.once("connect_error",t),this.socket.once("connect_timeout",t)}))}openSession(e){return n(this,void 0,void 0,function*(){this.socket.connected||(yield this.connect()),this.socket.emit("openSession",e)})}closeSession(e){return n(this,void 0,void 0,function*(){this.socket.connected||(yield this.connect()),this.socket.emit("closeSession",e),this.disconnect()})}joinSession(e){return n(this,void 0,void 0,function*(){this.socket.connected||(yield this.connect()),this.socket.emit("join",e)})}disconnect(){this.socket.connected&&(this.isConnecting=!1,this.socket.disconnect(),this.socket.removeListener("connect_error"),this.socket.removeListener("connect_timeout"))}send(e,t){return n(this,void 0,void 0,function*(){this.socket.connected||(yield this.connect()),a("sending",t,"to",e),this.socket.emit("data",e,t)})}}},"./src/shared/RTCClient.ts":function(e,t,s){"use strict";var n=this&&this.__awaiter||function(e,t,s,n){return new(s||(s=Promise))(function(i,o){function r(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?i(e.value):new s(function(t){t(e.value)}).then(r,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/debug-logger/debug-logger.js"),o=s("./node_modules/events/events.js"),r=i("swift:RTCClient");class a extends o.EventEmitter{on(e,t){return o.EventEmitter.prototype.on.call(this,e,t),this}emit(e,t){return o.EventEmitter.prototype.emit.call(this,e,t)}}t.default=class extends a{constructor(e,t){super(),this.sendChannel=null,this.sessionCreating=!1,this.sessionCreated=!1,this.onGatewayMessage=((e,t)=>n(this,void 0,void 0,function*(){if(e===this.remoteClientId)if("offer"===t.type){this.pc.setRemoteDescription(new RTCSessionDescription(t.sessionDescription));const e=yield this.pc.createAnswer();this.pc.setLocalDescription(e),this.gatewayClient.send(this.remoteClientId,{type:"answer",sessionDescription:e})}else if("answer"===t.type)this.pc.setRemoteDescription(t.sessionDescription);else if("candidate"===t.type){const e=new RTCIceCandidate({sdpMLineIndex:t.candidate.sdpMLineIndex,candidate:t.candidate.candidate});this.pc.addIceCandidate(e)}})),this.onSendChannelOpen=(e=>{r("data channel opened"),this.setupDataChannel()}),this.onSendChannelClose=(e=>{r("onSendChannelClose",e)}),this.onSendChannelError=(e=>{r("onSendChannelError",e)}),this.onDataChannel=(e=>{r("data channel opened"),this.sendChannel=e.channel,this.setupDataChannel()}),this.onLocalIceCandidate=(e=>{e.candidate&&this.gatewayClient.send(this.remoteClientId,{type:"candidate",candidate:{sdpMLineIndex:e.candidate.sdpMLineIndex,sdpMid:e.candidate.sdpMid,candidate:e.candidate.candidate}})}),this.gatewayClient=t,this.gatewayClient.on("data",this.onGatewayMessage),this.remoteClientId=e,this.pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),this.pc.onicecandidate=this.onLocalIceCandidate,this.pc.ondatachannel=this.onDataChannel}initiateConnection(){return n(this,void 0,void 0,function*(){r("initiateConnection"),this.sendChannel=this.pc.createDataChannel("Swift Data Channel with "+this.remoteClientId),this.sendChannel.onopen=this.onSendChannelOpen,this.sendChannel.onclose=this.onSendChannelClose,this.sendChannel.onerror=this.onSendChannelError,r("create offer");const e=yield this.pc.createOffer();r("offer created"),yield this.pc.setLocalDescription(e),this.gatewayClient.send(this.remoteClientId,{type:"offer",sessionDescription:e})})}setupDataChannel(){this.sendChannel.onmessage=(e=>{const{type:t,data:s}=JSON.parse(e.data);this.emit(t,s)}),this.gatewayClient.removeListener("data",this.onGatewayMessage),this.emit("connect",this.sendChannel)}getDataChannel(){return this.sendChannel}sendMessage(e,t){this.sendChannel?this.sendChannel.send(JSON.stringify({type:e,data:t})):r("trying to send a message before the channel is opened")}}},"./src/shared/Store.ts":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/crdt/index.js"),o=s("./node_modules/debug-logger/debug-logger.js"),r=s("./node_modules/mobx/lib/mobx.module.js"),a=s("./node_modules/rtc-dcstream/index.js"),c=s("./node_modules/uuid/v4.js"),d=s("./src/shared/GatewayClient.ts"),l=s("./src/shared/actions/CreateDoc.ts"),h=s("./src/shared/actions/UpdateDoc.ts"),u=s("./src/shared/models/User.ts"),p=s("./src/shared/RTCClient.ts"),m=o("swift:RTCClient");class f{constructor(){this.sessionList=[],this.docs={},this.userName="user buehehe",this.RTCClients={},this.crdts={},this.updating={},this.pendingSeqActions=[],this.userIdPerSessionId={},this.onJoin=((e,t)=>{if(this.crdts[e]||this.createCRDT(e),this.RTCClients[t])return;const s=this.RTCClients[t]=new p.default(t,this.gatewayClient);this.setupClient(s),s.on("connect",t=>{const s=a(t);s.pipe(this.crdts[e].createStream()).pipe(s)})}),this.onSessionUser=((e,t)=>{if(this.crdts[e]||this.createCRDT(e),this.RTCClients[t])return;const s=this.RTCClients[t]=new p.default(t,this.gatewayClient);this.setupClient(s),s.initiateConnection(),s.on("connect",t=>{const s=a(t);s.pipe(this.crdts[e].createStream()).pipe(s)})}),window.store=this,this.gatewayClient=new d.default,this.gatewayClient.on("join",this.onJoin),this.gatewayClient.on("sessionClient",this.onSessionUser)}applyPendingSeqAction(){this.pendingSeqActions.length&&(this.pendingSeqActions.forEach(e=>e()),this.pendingSeqActions=[])}getDoc(e){return this.docs[e]}addDoc(e){this.docs[e.id]=e}createCRDT(e){const t=this.crdts[e]=new i.Doc,s="user-"+c();this.userIdPerSessionId[e]=s,this.updating[s]=!0;const n=new u.default(this,t,s,"user");this.addDoc(n),delete this.updating[s],t.on("row_update",t=>{const s=t.get("id");this.updating[s]||(this.updating[s]=!0,this.docs[s]?this.executeAction(new h.default(s,this.docs[s].changes)):this.executeAction(new l.default(t.toJSON(),e)),delete this.updating[s])})}setupClient(e){}openSession(e){this.createCRDT(e),this.gatewayClient.openSession(e)}closeSession(e){this.gatewayClient.closeSession(e)}join(e){return this.createCRDT(e),this.gatewayClient.joinSession(e),new Promise(t=>{const s=r.observe(this.sessionList,()=>{this.sessionList.includes(e)&&(s(),t())})})}getSession(e){return this.docs[e]}removeSession(e){if(!this.docs[e])return m("trying to remove an inexisting session",e);delete this.docs[e]}getUser(e){return this.docs[e]}getItem(e){return this.docs[e]}executeAction(e,t=!1){return e.run(this),e}}n([r.observable],f.prototype,"sessionList",void 0),t.default=f},"./src/shared/actions/Action.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/mobx/lib/mobx.module.js");t.default=class{constructor(e){this.type=e}run(e){this.store=e,n.action(this.type,()=>this.execute())()}}},"./src/shared/actions/CreateDoc.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./src/shared/models/docClass.ts"),i=s("./src/shared/models/Session.ts"),o=s("./src/shared/actions/Action.ts");t.default=class extends o.default{constructor(e,t){super("createDoc"),this.row=e,this.sessionId=t}execute(){const e=n.default[this.row.type].instantiate(this.store,this.store.crdts[this.sessionId],this.row);return this.store.addDoc(e),e instanceof i.default&&!this.store.sessionList.includes(this.row.id)&&this.store.sessionList.push(this.row.id),this.store.applyPendingSeqAction(),!0}}},"./src/shared/actions/CreateSession.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./src/shared/models/Session.ts"),i=s("./src/shared/actions/Action.ts");t.default=class extends i.default{constructor(e,t,s){super("createSession"),this.id=e,this.name=t,this.ownerId=s}execute(){this.store.crdts[this.id]||this.store.createCRDT(this.id),this.store.updating[this.id]=!0;const e=new n.default(this.store,this.store.crdts[this.id],this.id,this.name,this.ownerId);return delete this.store.updating[this.id],this.store.addDoc(e),this.store.sessionList.push(this.id),!0}}},"./src/shared/actions/UpdateDoc.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./src/shared/actions/Action.ts");t.default=class extends n.default{constructor(e,t){super("updateDoc"),this.docId=e,this.changes=t}execute(){const e=this.store.getDoc(this.docId);for(const t in this.changes)e[t]=this.changes[t];return this.store.applyPendingSeqAction(),!0}}},"./src/shared/components/Button.less":function(e,t){},"./src/shared/components/Button.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js"),i=s("./src/shared/spur/ButtonPlugin.ts"),o=s("./src/shared/spur/Factory.tsx");s("./src/shared/components/Button.less");t.default=class extends n.PureComponent{constructor(e,t){super(e,t),this.div=null,this.onTap=(e=>{this.props.onTap(this,e)}),this.onDoubleTap=(e=>{this.props.onDoubleTap(this,e)}),this.onRef=(e=>{this.div=e,this.props.elementRef&&this.props.elementRef(e)});const s=new i.default;this.plugins={button:s},s.setEnable(!e.disabled),s.repeat=!!e.repeat,this.props.onTap&&s.on("tap",this.onTap),this.props.onDoubleTap&&s.on("doubleTap",this.onDoubleTap)}componentWillReceiveProps(e){const t=this.plugins.button;t.setEnable(!e.disabled),t.repeat=!!e.repeat,e.onTap&&!t.hasListener("tap")&&t.on("tap",this.onTap),e.onDoubleTap&&!t.hasListener("doubleTap")&&t.on("doubleTap",this.onDoubleTap)}render(){const{className:e,disabled:t,children:s,style:i}=this.props,r={className:"button"+(e?" "+e:"")+(t?" disabled":""),elementRef:this.onRef,plugins:this.plugins,style:i};return n.createElement(o.Pdiv,r,s)}}},"./src/shared/components/SessionItem.tsx":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/mobx-react/index.module.js"),o=s("./node_modules/qrcode.react/lib/index.js"),r=s("./node_modules/react/index.js"),a=s("./src/shared/components/Button.tsx"),c=s("./src/shared/context.ts");let d=class extends r.Component{constructor(e,t){super(e,t),this.enterSession=(()=>{this.props.onEnterSession(this.props.sessionId)}),this.displayInfo=(()=>{this.setState({info:!this.state.info})}),this.state={info:!1}}render(){const{sessionId:e}=this.props,{info:t}=this.state,s=this.context.store,n=s.getSession(e);return r.createElement(a.default,{className:"SessionItem"+(t?" SessionItem_info":""),onTap:this.enterSession},r.createElement("div",null,n.name),r.createElement(a.default,{onTap:this.displayInfo},"Info"),t&&r.createElement("div",{className:"SessionItem__info"},r.createElement("div",{className:"user-select"},n.id),r.createElement(o,{value:n.id,size:256})),r.createElement("div",{className:"SessionItem__user-list"},n.userIds.map(e=>r.createElement("div",{className:"SessionItem__user",key:e},s.getUser(e).name))),r.createElement("div",{className:"SessionItem__item-count"},n.itemIds.length))}};d.contextTypes=c.contextTypes,d=n([i.observer],d),t.default=d},"./src/shared/components/SessionScanner.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/debug-logger/debug-logger.js"),i=s("./node_modules/instascan/index.js"),o=s("./node_modules/react/index.js"),r=n("swift:SessionScanner");t.default=class extends o.PureComponent{constructor(){super(...arguments),this.videoElt=null,this.scan=(()=>i.Camera.getCameras().then(e=>{if(!(e.length>0))throw r("No cameras found."),new Error("No cameras found.");this.scanner.start(e[1]||e[0])})),this.stop=(()=>{this.scanner.stop()})}componentDidMount(){this.scanner=new i.Scanner({video:this.videoElt,mirror:!1}),this.scanner.addListener("scan",e=>{this.scanner.stop(),this.props.onSessionScanned(e)})}render(){return o.createElement("video",{ref:e=>this.videoElt=e,className:"session-scanner"})}}},"./src/shared/components/Tabs.less":function(e,t){},"./src/shared/components/Tabs.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js"),i=s("./src/shared/components/Button.tsx");s("./src/shared/components/Tabs.less");const o=i.default,r=100;t.default=class extends n.PureComponent{constructor(){super(...arguments),this.indicator=null,this.tabsRef={},this.tabWidth={},this.labelUpdated=!1,this.positionIndicator=(()=>{if(this.labelUpdated){this.labelUpdated=!1;for(const e in this.tabsRef){const t=this.tabsRef[e];t&&(this.tabWidth[e]=t.div.clientWidth)}}const{currentTabId:e,tabs:t,categoryIndex:s}=this.props;let n=0,i=!1,o=0;for(const{tabId:r}of t[s]){r===e&&(i=!0);const t=this.tabWidth[r];i||(o+=t),n+=t}o-=n/2,this.indicator.style.transform=`translate3d(${o+r/2}px, 0, 0) scaleX(${this.tabWidth[e]/r})`}),this.selectTab=(e=>{this.props.onTabSelect(e.props.tabId)}),this.onLabelUpdate=(()=>{this.labelUpdated=!0})}componentDidMount(){this.positionIndicator()}componentDidUpdate(){this.positionIndicator()}render(){const{currentTabId:e,tabs:t,categoryIndex:s}=this.props;return n.createElement("div",{className:"Tabs"},n.createElement("div",{className:"Tabs__container",style:{transform:`translate3d(0, ${-100*s}%,0)`}},t.map((t,s)=>n.createElement("div",{className:"Tabs__category",key:s},n.createElement("div",{className:"Tabs__category_container",key:s},t.map(({tabId:t,Label:s})=>n.createElement(o,{key:t,className:"Tabs__tab"+(e===t?" Tabs__tab_active":""),onTap:this.selectTab,tabId:t,ref:e=>this.tabsRef[t]=e},n.createElement(s,{onUpdate:this.onLabelUpdate}))))))),n.createElement("div",{className:"Tabs__indicator",ref:e=>this.indicator=e}))}}},"./src/shared/components/TextField.less":function(e,t){},"./src/shared/components/TextField.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js");s("./src/shared/components/TextField.less");t.default=class extends n.PureComponent{constructor(e,t){super(e,t),this.mainDiv=null,this.input=null,this.content="",this.onChange=(()=>{this.content=this.input.value}),this.onMainRef=(e=>{this.mainDiv=e}),this.onBlur=(()=>{this.mainDiv.className=this.generateClassName()}),this.onInputRef=(e=>{this.input=e}),this.state={hasContent:!1}}generateClassName(){return"TextField"+(this.content.length?" TextField_hasContent":"")}getValue(){return this.content}render(){const{label:e,placeholder:t}=this.props;return n.createElement("div",{className:this.generateClassName(),ref:this.onMainRef},n.createElement("div",{className:"TextField__label"},e),n.createElement("input",{className:"TextField__input",placeholder:t,onChange:this.onChange,onBlur:this.onBlur,ref:this.onInputRef}))}}},"./src/shared/context.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/prop-types/index.js");t.contextTypes={store:n.object}},"./src/shared/models/Doc.ts":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/mobx/lib/mobx.module.js");function o(e,t){const s=new i.Atom(t),n=function(){return s.reportObserved(),this.__data[t]},o=function(e){this.__data[t]!==e&&(this.__data[t]=e,this.row&&this.row.get(t)!==e&&this.row.set(t,e),s.reportChanged())};delete e[t]&&Object.defineProperty(e,t,{get:n,set:o})}t.linked=o;class r{constructor(e,t,s){this.__data={},this.store=e,this.id=t,this.type=s,this.changes={}}initCRDT(e){this.row=e.get(this.id),this.row.get("type")||this.row.set(this.toModel()),this.row.on("change",e=>{Object.assign(this.changes,e)})}createDoc(e){return Object.assign(e,{id:this.id,type:this.type})}}n([o],r.prototype,"id",void 0),n([o],r.prototype,"type",void 0),t.default=r},"./src/shared/models/Item.ts":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./src/shared/models/Doc.ts");class o extends i.default{constructor(e,t,s,n,i,o){super(e,s,"item"),this.creatorId=n,this.creationDate=i,this.itemContent=o,this.initCRDT(t)}static instantiate(e,t,{id:s,creatorId:n,creationDate:i,itemContent:r}){return new o(e,t,s,n,i,r)}toModel(){return this.createDoc({creationDate:this.creationDate,creatorId:this.creatorId,itemContent:this.itemContent})}}n([i.linked],o.prototype,"creatorId",void 0),n([i.linked],o.prototype,"creationDate",void 0),n([i.linked],o.prototype,"itemContent",void 0),t.default=o},"./src/shared/models/Session.ts":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/mobx/lib/mobx.module.js"),o=s("./src/shared/models/Doc.ts"),r=s("./src/shared/models/createSeq.ts");class a extends o.default{constructor(e,t,s,n,i){super(e,s,"session"),this.name=n,this.ownerId=i,this.userIds=[],this.itemIds=[],this.initCRDT(t),r.default(t,e,"type","item",this.itemIds,e=>e.get("id")),r.default(t,e,"type","user",this.userIds,e=>e.get("id"))}static instantiate(e,t,{id:s,name:n,ownerId:i}){return new a(e,t,s,n,i)}toModel(){return this.createDoc({ownerId:this.ownerId,name:this.name})}}n([o.linked],a.prototype,"ownerId",void 0),n([o.linked],a.prototype,"name",void 0),n([i.observable],a.prototype,"userIds",void 0),n([i.observable],a.prototype,"itemIds",void 0),t.default=a},"./src/shared/models/User.ts":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./src/shared/models/Doc.ts");class o extends i.default{constructor(e,t,s,n){super(e,s,"user"),this.name=n,this.initCRDT(t)}static instantiate(e,t,{id:s,name:n}){return new o(e,t,s,n)}toModel(){return this.createDoc({name:this.name})}}n([i.linked],o.prototype,"name",void 0),t.default=o},"./src/shared/models/createSeq.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,s,n,i,o){const r=e.createSeq(s,n);return r.forEach(e=>i.push(o(e))),r.on("add",e=>{const s=r.indexOf(e);if(-1!==s){const n=o(e);t.pendingSeqActions.push(()=>{i.splice(s,0,n)})}}),r.on("remove",e=>{const s=o(e),n=i.indexOf(s);-1!==n&&t.pendingSeqActions.push(()=>{i.splice(n,1)})}),i}},"./src/shared/models/docClass.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./src/shared/models/Item.ts"),i=s("./src/shared/models/Session.ts"),o=s("./src/shared/models/User.ts"),r={session:i.default,user:o.default,item:n.default};t.default=r},"./src/shared/spur/ButtonPlugin.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/spur-events/index.js"),i=s("./src/shared/spur/interactionLock.ts"),o=s("./src/shared/spur/Plugin.ts");function r(e){t.current.plugins.length&&(t.current.plugins.forEach(s=>{t.current.longTapFired&&e===s.DOMNode||s.cancel()}),t.current.plugins=[])}t.current={plugins:[],tapFired:!1,doubleTapFired:!1,longTapFired:!1},n.addListener(window,"pointerup",function(e){t.current.plugins=[]}),i.default.on("element-lock",r),i.default.on("container-lock",r);const a=700,c=300,d=15;t.default=class extends o.default{constructor(e={}){super(),this.enable=!0,this.lockId=null,this.lastTap=0,this.currentTap=null,this.pointerId="",this.cancelled=!1,this.longTapTimeout=0,this.boundingBox={left:0,top:0,width:0,height:0},this.DOMNode=null,this.minBoxWidth=d,this.minBoxHeight=d,this.isPressed=!1,this.repeatTimeout=0,this.repeatCount=0,this.repeat=!1,this.repeat=!!e.repeat}setMinBoxDimensions(e,t){this.minBoxWidth=Math.max(e,d),this.minBoxHeight=Math.max(t,d)}press(e){this.isPressed=!0,this.repeat&&(this.repeatCount=0,this.repeatTap()),this.emit("press",e)}release(e){this.isPressed=!1,this.emit("release",e)}tap(e){this.emit("tap",e)}doubleTap(e){this.emit("doubleTap",e)}longTap(e){this.emit("longTap",e)}setEnable(e){this.enable=e}reset(){this.lockId&&(i.default.releaseLock(this.lockId),this.lockId=null),window.clearTimeout(this.repeatTimeout),window.clearTimeout(this.longTapTimeout),n.removeListener(document,"pointermove",this.onPointerMove,{context:this}),n.removeListener(document,"pointerup",this.onPointerUp,{context:this})}repeatTap(){const e=0===this.repeatCount?300:20;this.repeatTimeout=window.setTimeout(()=>{this.repeatCount+=1,this.tap(this.currentTap),this.repeatTap()},e)}cancel(){this.isPressed&&(this.cancelled=!0,this.release(!0)),this.reset()}onPointerMove(e){e.pointerId===this.pointerId&&(e.clientX<this.boundingBox.left||e.clientX>this.boundingBox.left+this.boundingBox.width||e.clientY<this.boundingBox.top||e.clientY>this.boundingBox.top+this.boundingBox.height)&&this.cancel()}onPointerDown(e){if(!this.enable||3===e.originalEvent.which||i.default.isLocked(e.target))return;t.current.plugins.push(this),this.pointerId=e.pointerId,this.cancelled=!1;const s={x:e.clientX,y:e.clientY},o=e.target,r=this.DOMNode.getBoundingClientRect();this.boundingBox.top=r.top,this.boundingBox.left=r.left,r.width<this.minBoxWidth?(this.boundingBox.width=this.minBoxWidth,this.boundingBox.left-=(this.minBoxWidth-r.width)/2):this.boundingBox.width=r.width,r.height<this.minBoxHeight?(this.boundingBox.height=this.minBoxHeight,this.boundingBox.top-=(this.minBoxHeight-r.height)/2):this.boundingBox.height=r.height,this.repeat&&(this.currentTap=new n.SpurEvent(e.type),this.currentTap=Object.assign(this.currentTap,e)),this.press(s),t.current.tapFired=t.current.doubleTapFired=t.current.longTapFired=!1,this.hasListener("longTap")&&!this.repeat&&(window.clearTimeout(this.longTapTimeout),this.longTapTimeout=window.setTimeout(()=>{this.lockId=i.default.requestLockOn(o),this.lockId&&(this.longTap(s),t.current.longTapFired=!0)},a)),n.addListener(document,"pointermove",this.onPointerMove,{context:this}),n.addListener(document,"pointerup",this.onPointerUp,{context:this})}onPointerUp(e){if(e.pointerId===this.pointerId&&!this.cancelled&&(this.reset(),this.release(!1),!t.current.longTapFired)){const s=Date.now(),n=s-this.lastTap;if(this.lastTap=s,!t.current.tapFired&&this.hasListener("tap")&&(t.current.tapFired=!0,this.tap(e)),n<c)return this.lastTap=0,void(!t.current.doubleTapFired&&this.hasListener("doubleTap")&&(t.current.doubleTapFired=!0,e.preventDefault(),this.doubleTap(e)))}}componentDidMount(e){this.DOMNode=e,n.addListener(this.DOMNode,"pointerdown",this.onPointerDown,{context:this})}componentWillUnmount(){n.removeListener(this.DOMNode,"pointerdown",this.onPointerDown,{context:this}),this.reset(),this.DOMNode=null,window.clearTimeout(this.repeatTimeout)}}},"./src/shared/spur/Factory.tsx":function(e,t,s){"use strict";var n=this&&this.__rest||function(e,t){var s={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(s[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&(s[n[i]]=e[n[i]])}return s};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/react/index.js");class o extends i.PureComponent{constructor(e,t){super(e,t);for(const t in e.plugins){e.plugins[t].setComponentInstance(this)}}componentWillMount(){const e=this.props.plugins;for(const t in e){e[t].componentWillMount()}}componentDidMountWithElement(e){const t=this.props.plugins;for(const s in t){t[s].componentDidMount(e)}}componentWillReceiveProps(e){const t=this.props.plugins;for(const s in t){t[s].componentWillReceiveProps(e)}}componentWillUpdate(e){const t=this.props.plugins;for(const s in t){t[s].componentWillUpdate(e)}}componentDidUpdate(){const e=this.props.plugins;for(const t in e){e[t].componentDidUpdate()}}componentWillUnmount(){const e=this.props.plugins;for(const t in e){const s=e[t];s.componentWillUnmount(),s.removeEventListeners()}}}function r(e){return class extends o{constructor(e,t){super(e,t),this.element=null,this.onRef=this.onRef.bind(this)}componentDidMount(){this.componentDidMountWithElement(this.element)}onRef(e){this.element=e,this.props.elementRef&&this.props.elementRef(e)}render(){const t=e,s=this.props,{children:o,plugins:r,elementRef:a}=s,c=n(s,["children","plugins","elementRef"]);return i.createElement(t,Object.assign({},c,{ref:this.onRef}),o)}}}t.PlugComponent=o,t.createPlugTagComponent=r,t.Pdiv=r("div"),t.Pspan=r("span")},"./src/shared/spur/Plugin.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this.listeners={}}setComponentInstance(e){}componentDidMount(e){}componentWillMount(){}componentWillReceiveProps(e){}componentWillUpdate(e){}componentDidUpdate(){}componentWillUnmount(){}on(e,t,s=this){e in this.listeners?this.listeners[e].push({callback:t,context:s}):this.listeners[e]=[{callback:t,context:s}]}removeEventListeners(){this.listeners={}}emit(e,t){const s=this.listeners[e];if(s)for(let e=0,n=s.length;e<n;e+=1){const n=s[e];n.callback.call(n.context,t)}}hasListener(e){return!!this.listeners[e]}}},"./src/shared/spur/interactionLock.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/events/events.js");t.default=new class extends n.EventEmitter{constructor(){super(...arguments),this.lockNodes={},this.lockContainerNodes={},this.lockId=0}isLocked(e){for(const t in this.lockNodes){let s=this.lockNodes[t];for(;null!==s;){if(s===e)return!0;s=s.parentNode}}for(const t in this.lockContainerNodes){const s=this.lockContainerNodes[t];let n=e;for(;null!==n;){if(n===s)return!0;n=n.parentNode}}return!1}requestLockOn(e){return this.isLocked(e)?null:(this.lockId+=1,this.lockNodes[this.lockId]=e,this.emit("element-lock",e),this.lockId)}requestContainerLockOn(e){return this.isLocked(e)?null:(this.lockId+=1,this.lockContainerNodes[this.lockId]=e,this.emit("container-lock",e),this.lockId)}releaseLock(e){const t=this.lockNodes[e]||this.lockContainerNodes[e];t&&(delete this.lockNodes[e],delete this.lockContainerNodes[e],this.lockId-=1,this.emit("unlock",t))}}},"./src/shared/styles/core.less":function(e,t){},"./src/shared/views/CreateSession.less":function(e,t){},"./src/shared/views/CreateSession.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js"),i=s("./node_modules/uuid/v4.js"),o=s("./src/shared/actions/CreateSession.ts"),r=s("./src/shared/components/Button.tsx"),a=s("./src/shared/components/TextField.tsx"),c=s("./src/shared/context.ts");s("./src/shared/views/CreateSession.less");class d extends n.PureComponent{constructor(){super(...arguments),this.createSession=(()=>{const e=this.sessionNameField.getValue();if(""===e)return;const t="session-"+i(),s=this.context.store;s.openSession(t),s.executeAction(new o.default(t,e,s.userIdPerSessionId[t])),this.props.navigateToSession(t)})}render(){return n.createElement("div",{className:"CreateSession"},n.createElement("div",{className:"view__explanation"},"Create a session to allow another device to connect."),n.createElement("form",{className:"view__box",onSubmit:this.createSession},n.createElement("div",{className:"view__column"},n.createElement(a.default,{label:"choose a name for your session",placeholder:"My session",ref:e=>this.sessionNameField=e})),n.createElement("div",{className:"view__column CreateSession__create-column"},n.createElement(r.default,{className:"action-button  CreateSession__Create",onTap:this.createSession},"Create"))))}}d.contextTypes=c.contextTypes,t.default=d},"./src/shared/views/JoinSession.less":function(e,t){},"./src/shared/views/JoinSession.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/react/index.js"),i=s("./src/shared/components/Button.tsx"),o=s("./src/shared/components/SessionScanner.tsx"),r=s("./src/shared/context.ts");s("./src/shared/views/JoinSession.less");class a extends n.PureComponent{constructor(e,t){super(e,t),this.scanner=null,this.input=null,this.onSessionScanned=(e=>{this.setState({isScanning:!1}),this.join(e)}),this.stopScanning=(()=>{this.setState({isScanning:!1},()=>this.scanner.stop())}),this.startScanning=(()=>{try{this.scanner.scan(),this.setState({isScanning:!0})}catch(e){}}),this.validateSession=(()=>{const e=this.input.value;e&&this.join(e)}),this.state={isScanning:!1}}join(e){this.context.store.join(e).then(()=>{this.props.navigateToSession(e)})}render(){const{isScanning:e}=this.state;return n.createElement("div",{className:"JoinSession"+(e?" JoinSession_scanning":"")},n.createElement("div",{className:"view__explanation"},"Join an existing session by scanning its QR code or entering its ID."),n.createElement("div",{className:"view__box"},n.createElement("div",{className:"view__header"},"Scan a QR Code"),n.createElement(i.default,{onTap:this.startScanning,className:"action-button"},"Start Scanning"),n.createElement("div",{className:"JoinSession__scanner"},n.createElement(o.default,{onSessionScanned:this.onSessionScanned,ref:e=>this.scanner=e}),n.createElement(i.default,{onTap:this.stopScanning,className:"action-button JoinSession__StopScanning"},"Stop Scanning"))),n.createElement("form",{className:"view__box",onSubmit:this.validateSession},n.createElement("div",{className:"view__header"},"Enter a session ID"),n.createElement("input",{className:"JoinSession__id-input",ref:e=>this.input=e}),n.createElement(i.default,{onTap:this.validateSession,className:"action-button"},"Join")))}}a.contextTypes=r.contextTypes,t.default=a},"./src/shared/views/SessionViewer.less":function(e,t){},"./src/shared/views/SessionViewer.tsx":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/mobx-react/index.module.js"),o=s("./node_modules/react/index.js"),r=s("./node_modules/uuid/v4.js"),a=s("./src/shared/actions/CreateDoc.ts"),c=s("./src/shared/components/Button.tsx"),d=s("./src/shared/context.ts");s("./src/shared/views/SessionViewer.less");let l=class extends o.Component{constructor(){super(...arguments),this.closingTimeout=-1,this.addText=(()=>{const e=this.input.value,t=this.props.sessionId;if(""===e||!t)return;const s="item-"+r();this.context.store.executeAction(new a.default({id:s,type:"item",creatorId:this.context.store.userIdPerSessionId[t],creationDate:(new Date).toISOString(),itemContent:{type:"text",content:e}},t)),this.input.value=""}),this.goBack=(()=>{this.props.navigateToTab("sessions")})}componentWillUnmount(){window.clearTimeout(this.closingTimeout)}open(e){this.setState({sessionId:e})}render(){const e=this.context.store,{sessionId:t}=this.props,s=t&&e.getSession(t)||null;return o.createElement("div",{className:"SessionViewer"},o.createElement("div",{className:"SessionViewer__header"},o.createElement(c.default,{className:"SessionViewer__name"},s&&s.name),o.createElement(c.default,{className:"SessionViewer__back",onTap:this.goBack},"Back")),o.createElement("div",{className:"SessionViewer__body"},s&&o.createElement(o.Fragment,null,o.createElement("div",{className:"SessionItem__user-list"},s.userIds.map(t=>o.createElement("div",{className:"SessionItem__user",key:t},e.getUser(t).name))),o.createElement("div",{className:"SessionItem__item-list"},s.itemIds.map(t=>o.createElement("div",{className:"SessionItem__item",key:t},e.getItem(t).itemContent.content))),o.createElement("div",{className:"SessionItem_add-text"},o.createElement("input",{className:"SessionItem_text-input",ref:e=>this.input=e}),o.createElement(c.default,{onTap:this.addText},"Send text")))))}};l.contextTypes=d.contextTypes,l=n([i.observer],l),t.default=l},"./src/shared/views/Sessions.tsx":function(e,t,s){"use strict";var n=this&&this.__decorate||function(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};Object.defineProperty(t,"__esModule",{value:!0});const i=s("./node_modules/mobx-react/index.module.js"),o=s("./node_modules/react/index.js"),r=s("./src/shared/components/SessionItem.tsx"),a=s("./src/shared/context.ts");let c=class extends o.Component{constructor(){super(...arguments),this.onEnterSession=(e=>{this.props.navigateToSession(e)})}render(){const e=this.context.store.sessionList;return o.createElement("div",{className:"Sessions"},e.map(e=>o.createElement(r.default,{sessionId:e,key:e,onEnterSession:this.onEnterSession})))}};c.contextTypes=a.contextTypes,c=n([i.observer],c),t.default=c},"./src/shared/views/tabs.tsx":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s("./node_modules/mobx-react/index.module.js"),i=s("./src/shared/context.ts"),o=n.observer(function(e){e.onUpdate();const t=this.context.store.sessionList;return"My sessions"+(t.length?` (${t.length})`:"")});o.contextTypes=i.contextTypes,t.TabMap={sessions:o,create:()=>"Create Session",join:()=>"Join Session"},t.TabOrder=["sessions","create","join"],t.TabsInfo=t.TabOrder.map(e=>({tabId:e,Label:t.TabMap[e]}))},0:function(e,t){},1:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){}},["./src/mobile/app.tsx"]);
//# sourceMappingURL=mobile-app.ff01bfef1a7d6f7531af.js.map