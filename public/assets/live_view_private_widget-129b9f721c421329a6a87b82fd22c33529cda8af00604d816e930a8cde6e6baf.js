!function(e){"use strict";function t(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function n(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();Object.defineProperty(e,"__esModule",{value:!0});var s="1.0.0",r={connecting:0,open:1,closing:2,closed:3},a=1e4,c={closed:"closed",errored:"errored",joined:"joined",joining:"joining"},u={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},h={longpoll:"longpoll",websocket:"websocket"},l=function(){function e(t,n,o,s){i(this,e),this.channel=t,this.event=n,this.payload=o||{},this.receivedResp=null,this.timeout=s,this.timeoutTimer=null,this.recHooks=[],this.sent=!1}return o(e,[{key:"resend",value:function(e){this.timeout=e,this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}},{key:"send",value:function(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref}))}},{key:"receive",value:function(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}},{key:"matchReceive",value:function(e){var t=e.status,n=e.response;e.ref;this.recHooks.filter(function(e){return e.status===t}).forEach(function(e){return e.callback(n)})}},{key:"cancelRefEvent",value:function(){this.refEvent&&this.channel.off(this.refEvent)}},{key:"cancelTimeout",value:function(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}},{key:"startTimeout",value:function(){var e=this;this.timeoutTimer||(this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,function(t){e.cancelRefEvent(),e.cancelTimeout(),e.receivedResp=t,e.matchReceive(t)}),this.timeoutTimer=setTimeout(function(){e.trigger("timeout",{})},this.timeout))}},{key:"hasReceived",value:function(e){return this.receivedResp&&this.receivedResp.status===e}},{key:"trigger",value:function(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}}]),e}(),f=e.Channel=function(){function e(t,n,o){var s=this;i(this,e),this.state=c.closed,this.topic=t,this.params=n||{},this.socket=o,this.bindings=[],this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new l(this,u.join,this.params,this.timeout),this.pushBuffer=[],this.rejoinTimer=new d(function(){return s.rejoinUntilConnected()},this.socket.reconnectAfterMs),this.joinPush.receive("ok",function(){s.state=c.joined,s.rejoinTimer.reset(),s.pushBuffer.forEach(function(e){return e.send()}),s.pushBuffer=[]}),this.onClose(function(){s.socket.log("channel","close "+s.topic),s.state=c.closed,s.socket.remove(s)}),this.onError(function(e){s.socket.log("channel","error "+s.topic,e),s.state=c.errored,s.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",function(){s.state===c.joining&&(s.socket.log("channel","timeout "+s.topic,s.joinPush.timeout),s.state=c.errored,s.rejoinTimer.scheduleTimeout())}),this.on(u.reply,function(e,t){s.trigger(s.replyEventName(t),e)})}return o(e,[{key:"rejoinUntilConnected",value:function(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this.rejoin()}},{key:"join",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];if(this.joinedOnce)throw"tried to join multiple times. 'join' can only be called a single time per channel instance";return this.joinedOnce=!0,this.rejoin(e),this.joinPush}},{key:"onClose",value:function(e){this.on(u.close,e)}},{key:"onError",value:function(e){this.on(u.error,function(t){return e(t)})}},{key:"on",value:function(e,t){this.bindings.push({event:e,callback:t})}},{key:"off",value:function(e){this.bindings=this.bindings.filter(function(t){return t.event!==e})}},{key:"canPush",value:function(){return this.socket.isConnected()&&this.state===c.joined}},{key:"push",value:function(e,t){var n=arguments.length<=2||void 0===arguments[2]?this.timeout:arguments[2];if(!this.joinedOnce)throw"tried to push '"+e+"' to '"+this.topic+"' before joining. Use channel.join() before pushing events";var i=new l(this,e,t,n);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}},{key:"leave",value:function(){var e=this,t=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0],n=function(){e.socket.log("channel","leave "+e.topic),e.trigger(u.close,"leave")},i=new l(this,u.leave,{},t);return i.receive("ok",function(){return n()}).receive("timeout",function(){return n()}),i.send(),this.canPush()||i.trigger("ok",{}),i}},{key:"onMessage",value:function(){}},{key:"isMember",value:function(e){return this.topic===e}},{key:"sendJoin",value:function(e){this.state=c.joining,this.joinPush.resend(e)}},{key:"rejoin",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];this.sendJoin(e)}},{key:"trigger",value:function(e,t,n){this.onMessage(e,t,n),this.bindings.filter(function(t){return t.event===e}).map(function(e){return e.callback(t,n)})}},{key:"replyEventName",value:function(e){return"chan_reply_"+e}}]),e}(),p=(e.Socket=function(){function e(t){var n=this,o=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];i(this,e),this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.timeout=o.timeout||a,this.transport=o.transport||window.WebSocket||p,this.heartbeatIntervalMs=o.heartbeatIntervalMs||3e4,this.reconnectAfterMs=o.reconnectAfterMs||function(e){return[1e3,2e3,5e3,1e4][e-1]||1e4},this.logger=o.logger||function(){},this.longpollerTimeout=o.longpollerTimeout||2e4,this.params=o.params||{},this.endPoint=t+"/"+h.websocket,this.reconnectTimer=new d(function(){n.disconnect(function(){return n.connect()})},this.reconnectAfterMs)}return o(e,[{key:"protocol",value:function(){return location.protocol.match(/^https/)?"wss":"ws"}},{key:"endPointURL",value:function(){var e=v.appendParams(v.appendParams(this.endPoint,this.params),{vsn:s});return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?this.protocol()+":"+e:this.protocol()+"://"+location.host+e}},{key:"disconnect",value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()}},{key:"connect",value:function(e){var t=this;e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=e),this.conn||(this.conn=new this.transport(this.endPointURL()),this.conn.timeout=this.longpollerTimeout,this.conn.onopen=function(){return t.onConnOpen()},this.conn.onerror=function(e){return t.onConnError(e)},this.conn.onmessage=function(e){return t.onConnMessage(e)},this.conn.onclose=function(e){return t.onConnClose(e)})}},{key:"log",value:function(e,t,n){this.logger(e,t,n)}},{key:"onOpen",value:function(e){this.stateChangeCallbacks.open.push(e)}},{key:"onClose",value:function(e){this.stateChangeCallbacks.close.push(e)}},{key:"onError",value:function(e){this.stateChangeCallbacks.error.push(e)}},{key:"onMessage",value:function(e){this.stateChangeCallbacks.message.push(e)}},{key:"onConnOpen",value:function(){var e=this;this.log("transport","connected to "+this.endPointURL(),this.transport.prototype),this.flushSendBuffer(),this.reconnectTimer.reset(),this.conn.skipHeartbeat||(clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs)),this.stateChangeCallbacks.open.forEach(function(e){return e()})}},{key:"onConnClose",value:function(e){this.log("transport","close",e),this.triggerChanError(),clearInterval(this.heartbeatTimer),this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})}},{key:"onConnError",value:function(e){this.log("transport",e),this.triggerChanError(),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})}},{key:"triggerChanError",value:function(){this.channels.forEach(function(e){return e.trigger(u.error)})}},{key:"connectionState",value:function(){switch(this.conn&&this.conn.readyState){case r.connecting:return"connecting";case r.open:return"open";case r.closing:return"closing";default:return"closed"}}},{key:"isConnected",value:function(){return"open"===this.connectionState()}},{key:"remove",value:function(e){this.channels=this.channels.filter(function(t){return!t.isMember(e.topic)})}},{key:"channel",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=new f(e,t,this);return this.channels.push(n),n}},{key:"push",value:function(e){var t=this,n=e.topic,i=e.event,o=e.payload,s=e.ref,r=function(){return t.conn.send(JSON.stringify(e))};this.log("push",n+" "+i+" ("+s+")",o),this.isConnected()?r():this.sendBuffer.push(r)}},{key:"makeRef",value:function(){var e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}},{key:"sendHeartbeat",value:function(){this.isConnected()&&this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.makeRef()})}},{key:"flushSendBuffer",value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[])}},{key:"onConnMessage",value:function(e){var t=JSON.parse(e.data),n=t.topic,i=t.event,o=t.payload,s=t.ref;this.log("receive",(o.status||"")+" "+n+" "+i+" "+(s&&"("+s+")"||""),o),this.channels.filter(function(e){return e.isMember(n)}).forEach(function(e){return e.trigger(i,o,s)}),this.stateChangeCallbacks.message.forEach(function(e){return e(t)})}}]),e}(),e.LongPoll=function(){function e(t){i(this,e),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(t),this.readyState=r.connecting,this.poll()}return o(e,[{key:"normalizeEndpoint",value:function(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+h.websocket),"$1/"+h.longpoll)}},{key:"endpointURL",value:function(){return v.appendParams(this.pollEndpoint,{token:this.token})}},{key:"closeAndRetry",value:function(){this.close(),this.readyState=r.connecting}},{key:"ontimeout",value:function(){this.onerror("timeout"),this.closeAndRetry()}},{key:"poll",value:function(){var e=this;this.readyState!==r.open&&this.readyState!==r.connecting||v.request("GET",this.endpointURL(),"application/json",null,this.timeout,this.ontimeout.bind(this),function(t){if(t){var n=t.status,i=t.token,o=t.messages;e.token=i}else var n=0;switch(n){case 200:o.forEach(function(t){return e.onmessage({data:JSON.stringify(t)})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=r.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw"unhandled poll status "+n}})}},{key:"send",value:function(e){var t=this;v.request("POST",this.endpointURL(),"application/json",e,this.timeout,this.onerror.bind(this,"timeout"),function(e){e&&200===e.status||(t.onerror(status),t.closeAndRetry())})}},{key:"close",value:function(){this.readyState=r.closed,this.onclose()}}]),e}()),v=e.Ajax=function(){function e(){i(this,e)}return o(e,null,[{key:"request",value:function(e,t,n,i,o,s,r){if(window.XDomainRequest){var a=new XDomainRequest;this.xdomainRequest(a,e,t,i,o,s,r)}else{var a=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhrRequest(a,e,t,n,i,o,s,r)}}},{key:"xdomainRequest",value:function(e,t,n,i,o,s,r){var a=this;e.timeout=o,e.open(t,n),e.onload=function(){var t=a.parseJSON(e.responseText);r&&r(t)},s&&(e.ontimeout=s),e.onprogress=function(){},e.send(i)}},{key:"xhrRequest",value:function(e,t,n,i,o,s,r,a){var c=this;e.timeout=s,e.open(t,n,!0),e.setRequestHeader("Content-Type",i),e.onerror=function(){a&&a(null)},e.onreadystatechange=function(){if(e.readyState===c.states.complete&&a){var t=c.parseJSON(e.responseText);a(t)}},r&&(e.ontimeout=r),e.send(o)}},{key:"parseJSON",value:function(e){return e&&""!==e?JSON.parse(e):null}},{key:"serialize",value:function(e,t){var i=[];for(var o in e)if(e.hasOwnProperty(o)){var s=t?t+"["+o+"]":o,r=e[o];"object"===("undefined"==typeof r?"undefined":n(r))?i.push(this.serialize(r,s)):i.push(encodeURIComponent(s)+"="+encodeURIComponent(r))}return i.join("&")}},{key:"appendParams",value:function(e,t){if(0===Object.keys(t).length)return e;var n=e.match(/\?/)?"&":"?";return""+e+n+this.serialize(t)}}]),e}();v.states={complete:4};var d=(e.Presence={syncState:function(e,t,n,i){var o=this,s={},r={};this.map(e,function(e,n){t[e]||(r[e]=o.clone(n))}),this.map(t,function(t,n){var i=e[t];i?!function(){var e=n.metas.map(function(e){return e.phx_ref}),a=i.metas.map(function(e){return e.phx_ref}),c=n.metas.filter(function(e){return a.indexOf(e.phx_ref)<0}),u=i.metas.filter(function(t){return e.indexOf(t.phx_ref)<0});c.length>0&&(s[t]=n,s[t].metas=c),u.length>0&&(r[t]=o.clone(i),r[t].metas=u)}():s[t]=n}),this.syncDiff(e,{joins:s,leaves:r},n,i)},syncDiff:function(e,n,i,o){var s=n.joins,r=n.leaves;i||(i=function(){}),o||(o=function(){}),this.map(s,function(n,o){var s=e[n];if(e[n]=o,s){var r;(r=e[n].metas).unshift.apply(r,t(s.metas))}i(n,s,o)}),this.map(r,function(t,n){var i=e[t];if(i){var s=n.metas.map(function(e){return e.phx_ref});i.metas=i.metas.filter(function(e){return s.indexOf(e.phx_ref)<0}),o(t,i,n),0===i.metas.length&&delete e[t]}})},list:function(e,t){return t||(t=function(e,t){return t}),this.map(e,function(e,n){return t(e,n)})},map:function(e,t){return Object.getOwnPropertyNames(e).map(function(n){return t(n,e[n])})},clone:function(e){return JSON.parse(JSON.stringify(e))}},function(){function e(t,n){i(this,e),this.callback=t,this.timerCalc=n,this.timer=null,this.tries=0}return o(e,[{key:"reset",value:function(){this.tries=0,clearTimeout(this.timer)}},{key:"scheduleTimeout",value:function(){var e=this;clearTimeout(this.timer),this.timer=setTimeout(function(){e.tries=e.tries+1,e.callback()},this.timerCalc(this.tries+1))}}]),e}())}("undefined"==typeof exports?window.Phoenix=window.Phoenix||{}:exports),function(){}.call(this);