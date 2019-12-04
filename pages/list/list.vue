<template>
	<view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#4cd964"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				选项卡1的内容
			</view>
			<view v-show="current === 1">
				选项卡2的内容
			</view>
			<view v-show="current === 2">
				选项卡3的内容
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				loadMoreText: '加载中...',
				dataList: [],
				id: 0,
				fetchPageNum: 0,
				items: ['选项卡1', '选项卡2', '选项卡3'],
				current: 0
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: '专题'
			});
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.grid {
		padding-top: 10px;
	}

	.grid-c-12 {
		justify-content: center;
	}
</style>
