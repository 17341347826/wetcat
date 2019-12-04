import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.$serverUrl = 'http://192.168.1.227:8888';

Vue.prototype.$downAppImg = 'https://wx1.sinaimg.cn/mw690/007Dgb5mgy1g8eye8sssgj30u00m07e9.jpg';

Vue.prototype.$indexImg = 'https://wx2.sinaimg.cn/mw1024/007Dgb5mgy1g8eyevpt6dj301r01u741.jpg';
Vue.prototype.$indexActiveImg = 'https://wx4.sinaimg.cn/mw690/007Dgb5mgy1g8ezqqirt1j301r01u0kt.jpg';

Vue.prototype.$videoImg = 'https://wx1.sinaimg.cn/mw690/007Dgb5mgy1g8eyr04qdjj301y01vmwy.jpg';
Vue.prototype.$videoActiveImg = 'https://wx3.sinaimg.cn/mw690/007Dgb5mgy1g8ezhndnikj301y01v3ya.jpg';

Vue.prototype.$myImg = 'https://wx4.sinaimg.cn/mw690/007Dgb5mgy1g8eyqsle3gj301f01u0si.jpg';
Vue.prototype.$myActiveImg = 'https://wx1.sinaimg.cn/mw690/007Dgb5mgy1g8ezmdi6r9j301f01u0my.jpg';

Vue.prototype.$movieImg = 'https://wx4.sinaimg.cn/mw690/007Dgb5mgy1g8eyh4y0ojj30du097wfb.jpg';

Vue.prototype.$vipFalse = 'https://wx2.sinaimg.cn/mw690/007Dgb5mgy1g8obpi0os2j302y0140sn.jpg';
Vue.prototype.$vipTrue = 'https://wx2.sinaimg.cn/mw690/007Dgb5mgy1g8obpnr7vhj302y0143yb.jpg';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()