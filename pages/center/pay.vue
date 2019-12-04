<template>
	<view style="width: 90%;margin: 0 auto;flex-direction:column;">

		<view v-for="(item,index) in payList" :key="item.id" class="pay_text" @click="onActive(index, item)" :class="{'active' : active === index}">
			<text class="pay_title">
				<text>{{item.title}}</text>
				<text class="li_shen">{{item.detail}}</text>
			</text>
			<!-- <text class="old_price">{{item.price}}元</text> -->
			<text class="price">{{item.price}}元</text>
		</view>

		<view>
			<button class="pat_btn" type="primary" @click="onPay()">支付宝充值</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: -1,
				payList: [],
				vipTime: '',
				token: '',
				shopID: '',
			}
		},
		onLoad() {
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
				}
			})
			this.getPayList();
		},
		methods: {
			onActive(idx, item) {
				this.shopID = item.id;
				this.active = idx;
				this.vipTime = item.duration * 60 * 60 * 1000;
				console.log(item.duration / 24)
				uni.showToast({
					title: item.title + ',价格:' + item.price + '元',
					icon: 'none',
				})
			},
			onPay() {
				if (!this.token) {
					uni.showToast({
						title: '暂未登录',
						icon: 'none',
					})
					return;
				}
				if (!this.shopID) {
					uni.showToast({
						title: '请选择充值类型',
						icon: 'none',
					})
					return;
				}
				var nowTime = Date.parse(new Date());
				// console.log(nowTime)
				nowTime = Number(this.vipTime + nowTime);
				// console.log(nowTime)
				var date = new Date(nowTime);
				var Y = date.getFullYear()
				var M = date.getMonth() + 1;
				var D = date.getDate();
				var h = date.getHours();
				var m = date.getMinutes();
				uni.showToast({
					title: Y + '-' + M + '-' + D + ' ' + h + ':' + m,
					icon: 'none',
				})
				uni.navigateTo({
					url: "../about/about?id=" + this.shopID
				})

				// uni.request({
				// 	url: this.$serverUrl + '/recharge/create/h5',
				// 	data: {
				// 		id: this.shopID,
				// 		callbackUrl: 'https://www.bilibili.com',
				// 	},
				// 	header: {
				// 		// "Content-Type": "application/json;charset=UTF-8",
				// 		"Content-Type": "application/x-www-form-urlencoded",
				// 		"authorization": this.token
				// 	},
				// 	method: "POST",
				// 	success: (ret) => {
				// 		console.log(ret.data.data)
				// 		if (ret.statusCode !== 200) {
				// 			console.log('失败!');
				// 		} else {
				// 			// uni.requestPayment({
				// 			// 	provider: 'alipay',
				// 			// 	orderInfo: ret.data,
				// 			// 	success: (e) => {
				// 			// 		uni.showToast({
				// 			// 			title: "支付成功"
				// 			// 		})
				// 			// 	},
				// 			// 	fail: (e) => {
				// 			// 		uni.showModal({
				// 			// 			content: "抱歉，您的支付不成功",
				// 			// 			showCancel: false
				// 			// 		})
				// 			// 	},
				// 			// 	complete: () => {}
				// 			// });
				// 		}
				// 	}
				// });
			},
			getPayList() {
				uni.request({
					url: this.$serverUrl + '/recharge/list',
					data: {},
					header: {
						// "Content-Type": "application/json;charset=UTF-8",
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
					},
					method: "POST",
					success: (ret) => {
						if (ret.statusCode !== 200) {
							console.log('失败!');
						} else {
							console.log(ret.data.data)
							this.payList = ret.data.data
						}
					}
				});
			}
		}
	}
</script>

<style>
	.pay_text {
		display: block;
		width: 100%;
		height: 76upx;
		font-size: 30upx;
		line-height: 76upx;
		color: #4B4B4B;
		text-align: right;
		padding: 1px;
		margin-top: 20upx;
	}

	.pay_title {
		float: left;
		margin-left: 20upx;
	}

	.li_shen {
		color: #FFFFFF;
		background-color: #ff4200;
		font-size: 22upx;
		padding: 5upx 30upx;
		margin-left: 20upx;
		border-radius: 50upx;
	}

	.old_price {
		text-decoration: line-through;
		font-size: 18upx;
	}

	.price {
		color: #FF4200;
		font-size: 34upx;
		font-family: Hiragino Sans GB;
		font-weight: bold;
		margin: 0 20upx;
	}

	.active {
		border: 1px solid #ff4200;
		padding: 0px;
		background-color: #fadacf;
	}

	.pat_btn {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		background-image: linear-gradient(to right, #db2322, #fe9000);
		border-radius: 80upx;
		margin-top: 20upx;
	}
</style>
