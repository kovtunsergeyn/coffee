!function(t){function e(o){if(i[o])return i[o].exports;var s=i[o]={exports:{},id:o,loaded:!1};return t[o].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){var o=i(1);window.Dashboard={el:"#dashboard",data:function(){return _.extend({editing:{},update:{}},window.$data)},created:function(){var t=this;this.Widgets=this.$resource("admin/dashboard{/id}"),this.$set("widgets",this.widgets.filter(function(e,i){return t.getType(e.type)?(e.idx=void 0===e.idx?i:e.idx,e.column=void 0===e.column?0:e.column,!0):!1})),this.checkVersion()},ready:function(){var t=this,e=$(this.$el).find(".uk-sortable[data-column]").each(function(){UIkit.sortable(this,{group:"widgets",dragCustomClass:"pk-sortable-dragged-panel",handleClass:"pk-icon-handle"})}).on("change.uk.sortable",function(i,o,s,n){if(n)switch(o=o.element?o:o.data("sortable"),n){case"added":case"moved":var a,r=t.widgets,l=parseInt(o.element.data("column"),10),d={};o.element.children("[data-idx]").each(function(t){a=_.find(r,"id",this.getAttribute("data-id")),a.column=l,a.idx=t}),r.forEach(function(t){d[t.id]=t}),t.$http.post("admin/dashboard/savewidgets",{widgets:d}).then(function(){e.children().each(function(){this.children.length||$(this).remove()})})}})},filters:{column:function(t,e){return e=parseInt(e||0,10),_.sortBy(t.filter(function(t){return t.column==e}),"idx")}},computed:{columns:function(){var t=0;return _.groupBy(this.widgets,function(){return t++%3})},hasUpdate:function(){return this.update&&o.compare(this.update.version,this.version,">")}},methods:{add:function(t){var e=0,i=$("#dashboard").find(".uk-sortable[data-column]");i.each(function(t){e=this.children.length<i.eq(e)[0].children.length?t:e}),this.Widgets.save({widget:_.merge({type:t.id,column:e,idx:100},t.defaults)}).then(function(t){var e=t.data;this.widgets.push(e),this.editing[e.id]=!0})},save:function(t){var e={widget:t};this.$broadcast("save",e),this.Widgets.save({id:t.id},e)},remove:function(t){this.Widgets["delete"]({id:t.id}).then(function(){this.widgets.splice(_.findIndex(this.widgets,{id:t.id}),1)})},getType:function(t){return _.find(this.getTypes(),"id",t)},getTypes:function(){var t=[];return _.forIn(this.$options.components,function(e,i){var o=e.options||{},s=o.type;s&&(s.component=i,t.push(s))}),t},checkVersion:function(){this.$http.get(this.api+"/api/update",{},{cache:60}).then(function(t){var e=t.data["nightly"==this.channel?"nightly":"latest"];e&&this.$set("update",e)})}},components:{panel:i(10),feed:i(8),location:i(9)}},Vue.ready(window.Dashboard)},function(t,e){e.compare=function(t,e,i){this.php_js=this.php_js||{},this.php_js.ENV=this.php_js.ENV||{};var o,s,n=0,a={dev:-6,alpha:-5,a:-5,beta:-4,b:-4,RC:-3,rc:-3,"#":-2,p:1,pl:1},r=function(t){return t=(""+t).replace(/[_\-+]/g,"."),t=t.replace(/([^.\d]+)/g,".$1.").replace(/\.{2,}/g,"."),t.length?t.split("."):[-8]},l=function(t){return t?isNaN(t)?a[t]||-7:parseInt(t,10):0};for(t=r(t),e=r(e),s=Math.max(t.length,e.length),o=0;s>o;o++)if(t[o]!=e[o]){if(t[o]=l(t[o]),e[o]=l(e[o]),t[o]<e[o]){n=-1;break}if(t[o]>e[o]){n=1;break}}if(!i)return n;switch(i){case">":case"gt":return n>0;case">=":case"ge":return n>=0;case"<=":case"le":return 0>=n;case"==":case"=":case"eq":return 0===n;case"<>":case"!=":case"ne":return 0!==n;case"":case"<":case"lt":return 0>n;default:return null}}},function(t,e){"use strict";t.exports={type:{id:"feed",label:"Feed",description:function(){},defaults:{count:5,url:"http://pagekit.com/blog/feed",content:""}},replace:!1,props:["widget","editing"],data:function(){return{status:"",feed:{}}},filters:{count:function(t){return t?t.slice(0,this.$get("widget.count")):[]}},watch:{"widget.url":function(t){t||this.$parent.edit(!0),this.load()},"widget.count":function(t,e){var i=this.$get("feed.entries");i&&t>e&&t>i.length&&this.load()}},ready:function(){this.$get("widget.url")&&this.load()},methods:{load:function(){this.$set("feed",{}),this.$set("status",""),this.$get("widget.url")&&(this.$set("status","loading"),this.$http.jsonp("//ajax.googleapis.com/ajax/services/feed/load",{v:"1.0",q:this.$get("widget.url"),num:this.$get("widget.count")}).then(function(t){var e=t.data;200===e.responseStatus?(this.$set("feed",e.responseData.feed),this.$set("status","done")):this.$set("status","error")},function(){this.$set("status","error")}))}}}},function(t,e){"use strict";t.exports={type:{id:"location",label:"Location",disableToolbar:!0,description:function(){},defaults:{units:"metric"}},replace:!1,props:["widget","editing"],data:function(){return{status:"",timezone:{},icon:"",temp:0,time:0,format:"shortTime"}},ready:function(){var t,e=this;UIkit.autocomplete(this.$els.autocomplete,{source:function(i){e.$http.get("admin/dashboard/weather",{action:"find",data:{q:this.input.val(),type:"like"}}).then(function(e){var o=e.data;t=o.list||[],i(t)},function(){i([])})},template:'<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">	                              {{~items}}<li :data-value="$item.name" :data-id="$item.id"><a>{{$item.name}} <span>, {{$item.sys.country}}</span></a></li>{{/items}}	                              {{^items.length}}<li class="uk-skip"><a class="uk-text-muted">{{msgNoResults}}</a></li>{{/end}} 	                           </ul>',renderer:function(t){this.dropdown.append(this.template({items:t||[],msgNoResults:e.$trans("No location found.")})),this.show()}}).on("selectitem.uk.autocomplete",function(i,o){var s=_.find(t,"id",o.id);Vue.nextTick(function(){e.$els.location.blur()}),s&&(e.$set("widget.uid",s.id),e.$set("widget.city",s.name),e.$set("widget.country",s.sys.country),e.$set("widget.coords",s.coord))}),this.timer=setInterval(this.updateClock(),6e4)},watch:{"widget.uid":{handler:function(t){void 0===t&&(this.$set("widget.uid",""),this.$parent.save(),this.$parent.edit(!0)),t&&this.load()},immediate:!0},timezone:"updateClock"},computed:{location:function(){return this.widget.city?this.widget.city+", "+this.widget.country:""},temperature:function(){return"imperial"!==this.widget.units?Math.round(this.temp)+" °C":Math.round(1.8*this.temp+32)+" °F"}},methods:{load:function(){this.widget.uid&&(this.$http.get("admin/dashboard/weather",{action:"weather",data:{id:this.widget.uid,units:"metric"}},{cache:60}).then(function(t){var e=t.data;200==e.cod?this.init(e):this.$set("status","error")},function(){this.$set("status","error")}),this.$http.get("https://maps.googleapis.com/maps/api/timezone/json",{location:this.widget.coords.lat+","+this.widget.coords.lon,timestamp:Math.floor(Date.now()/1e3)},{cache:{key:"timezone-"+this.widget.coords.lat+this.widget.coords.lon,lifetime:1440}}).then(function(t){var e=t.data;e.offset=e.rawOffset+e.dstOffset,this.$set("timezone",e)},function(){this.$set("status","error")}))},init:function(t){this.$set("temp",t.main.temp),this.$set("icon",this.getIconUrl(t.weather[0].icon)),this.$set("status","done")},getIconUrl:function(t){var e={"01d":"sun.svg","01n":"moon.svg","02d":"cloud-sun.svg","02n":"cloud-moon.svg","03d":"cloud.svg","03n":"cloud.svg","04d":"cloud.svg","04n":"cloud.svg","09d":"drizzle-sun.svg","09n":"drizzle-moon.svg","10d":"rain-sun.svg","10n":"rain-moon.svg","11d":"lightning.svg","11n":"lightning.svg","13d":"snow.svg","13n":"snow.svg","50d":"fog.svg","50n":"fog.svg"};return this.$url("app/system/modules/dashboard/assets/images/weather-{icon}",{icon:e[t]})},updateClock:function(){var t=this.$get("timezone.offset")||0,e=new Date,i=t?new Date(e.getTime()+6e4*e.getTimezoneOffset()+1e3*t):new Date;return this.$set("time",i),this.updateClock},clear:function(){this.$els.location.value=""}},destroyed:function(){clearInterval(this.timer)}}},function(t,e){"use strict";t.exports={props:{widget:{},editing:{"default":!1}},created:function(){this.$options.components=this.$parent.$options.components},computed:{type:function(){return this.$root.getType(this.widget.type)}},methods:{edit:function(){this.$set("editing",!0)},save:function(){this.$root.save(this.widget),this.$set("editing",!1)},remove:function(){this.$root.remove(this.widget)}}}},function(t,e){t.exports="<form class=\"pk-panel-teaser uk-form uk-form-stacked\" v-if=editing> <div class=uk-form-row> <label for=form-feed-title class=uk-form-label>{{ 'Title' | trans }}</label> <div class=uk-form-controls> <input id=form-feed-title class=uk-width-1-1 type=text name=widget[title] v-model=widget.title> </div> </div> <div class=uk-form-row> <label for=form-feed-url class=uk-form-label>{{ 'URL' | trans }}</label> <div class=uk-form-controls> <input id=form-feed-url class=uk-width-1-1 type=text name=url v-model=widget.url lazy> </div> </div> <div class=uk-form-row> <label for=form-feed-count class=uk-form-label>{{ 'Number of Posts' | trans }}</label> <div class=uk-form-controls> <select id=form-feed-count class=uk-width-1-1 v-model=widget.count number> <option value=1>1</option> <option value=2>2</option> <option value=3>3</option> <option value=4>4</option> <option value=5>5</option> <option value=6>6</option> <option value=7>7</option> <option value=8>8</option> <option value=9>9</option> <option value=10>10</option> </select> </div> </div> <div class=uk-form-row> <span class=uk-form-label>{{ 'Post Content' | trans }}</span> <div class=\"uk-form-controls uk-form-controls-text\"> <p class=uk-form-controls-condensed> <label><input type=radio value=\"\" v-model=widget.content> {{ \"Don't show\" | trans }}</label> </p> <p class=uk-form-controls-condensed> <label><input type=radio value=1 v-model=widget.content> {{ 'Show on all posts' | trans }}</label> </p> <p class=uk-form-controls-condensed> <label><input type=radio value=2 v-model=widget.content> {{ 'Only show on first post.' | trans }}</label> </p> </div> </div> </form> <div v-show=\"status != 'loading'\"> <h3 class=uk-panel-title v-if=widget.title>{{ widget.title }}</h3> <ul class=\"uk-list uk-list-line uk-margin-remove\"> <li v-for=\"entry in feed.entries | count\"> <a :href=entry.link target=_blank>{{ entry.title }}</a> <span class=\"uk-text-muted uk-text-nowrap\">{{ entry.publishedDate | relativeDate }}</span> <p class=uk-margin-small-top v-if=\"widget.content == '1'\">{{ entry.contentSnippet }}</p> <p class=uk-margin-small-top v-if=\"widget.content == '2'\">{{ $index == 0 ? entry.contentSnippet : '' }}</p> </li> </ul> <div v-if=\"status == 'error'\">{{ 'Unable to retrieve feed data.' | trans }}</div> <div v-if=\"!widget.url && !editing\">{{ 'No URL given.' | trans }}</div> </div> <div class=uk-text-center v-else> <v-loader></v-loader> </div>"},function(t,e){t.exports='<div class=uk-panel-badge> <ul class="uk-subnav pk-subnav-icon"> <li v-show=!editing> <a class="pk-icon-contrast pk-icon-edit pk-icon-hover uk-hidden" :title="\'Edit\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=$parent.edit></a> </li> <li v-show=!editing> <a class="pk-icon-contrast pk-icon-handle pk-icon-hover uk-hidden uk-sortable-handle" :title="\'Drag\' | trans" data-uk-tooltip="{delay: 500}"></a> </li> <li v-show=editing> <a class="pk-icon-delete pk-icon-hover" :title="\'Delete\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=$parent.remove v-confirm="\'Delete widget?\'"></a> </li> <li v-show=editing> <a class="pk-icon-check pk-icon-hover" :title="\'Close\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=$parent.save></a> </li> </ul> </div> <form class="pk-panel-teaser uk-form uk-form-stacked" v-show=editing @submit.prevent> <div class=uk-form-row> <label for=form-city class=uk-form-label>{{ \'Location\' | trans }}</label> <div class=uk-form-controls> <div v-el:autocomplete class="uk-autocomplete uk-width-1-1"> <input id=form-city class=uk-width-1-1 type=text :placeholder=location v-el:location @blur=clear autocomplete=off> </div> </div> </div> <div class=uk-form-row> <span class=uk-form-label>{{ \'Unit\' | trans }}</span> <div class="uk-form-controls uk-form-controls-text"> <p class=uk-form-controls-condensed> <label><input type=radio value=metric v-model=widget.units> {{ \'Metric\' | trans }}</label> </p> <p class=uk-form-controls-condensed> <label><input type=radio value=imperial v-model=widget.units> {{ \'Imperial\' | trans }}</label> </p> </div> </div> </form> <div class="pk-panel-background uk-contrast" v-if="status != \'loading\'"> <h1 class="uk-margin-large-top uk-margin-small-bottom uk-text-center pk-text-xlarge" v-if=time>{{ time | date format }}</h1> <h2 class="uk-text-center uk-h4 uk-margin-remove" v-if=time>{{ time | date \'longDate\' }}</h2> <div class="uk-margin-large-top uk-flex uk-flex-middle uk-flex-space-between uk-flex-wrap" data-uk-margin> <h3 class=uk-margin-remove v-if=widget.city>{{ widget.city }}</h3> <h3 class="uk-flex uk-flex-middle uk-margin-remove" v-if="status==\'done\'">{{ temperature }} <img class=uk-margin-small-left :src=icon width=25 height=25 alt=Weather></h3> </div> </div> <div class=uk-text-center v-else> <v-loader></v-loader> </div>'},function(t,e){t.exports='<div> <div class=uk-panel-badge v-if=!type.disableToolbar> <ul class="uk-subnav pk-subnav-icon"> <li v-show="type.editable !== false && !editing"> <a class="pk-icon-edit pk-icon-hover uk-hidden" :title="\'Edit\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=edit></a> </li> <li v-show=!editing> <a class="pk-icon-handle pk-icon-hover uk-hidden uk-sortable-handle" :title="\'Drag\' | trans" data-uk-tooltip="{delay: 500}"></a> </li> <li v-show=editing> <a class="pk-icon-delete pk-icon-hover" :title="\'Delete\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=remove v-confirm="\'Delete widget?\'"></a> </li> <li v-show=editing> <a class="pk-icon-check pk-icon-hover" :title="\'Close\' | trans" data-uk-tooltip="{delay: 500}" @click.prevent=save></a> </li> </ul> </div> <component :is=type.component :widget=widget :editing.sync=editing></component> </div>'},function(t,e,i){var o,s;o=i(2),s=i(5),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e,i){var o,s;o=i(3),s=i(6),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e,i){var o,s;o=i(4),s=i(7),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)}]);