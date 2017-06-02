<template>
	<div class="songlist-wrap" ref="songlistWrap">
		<div class="header">
			<div class="left">收藏全部</div>
			<div class="middle">播放列表({{currentList.length}})</div>
			<div class="right" @click="clear">清空</div>
		</div>
		<div class="songlist" ref="songlist">
			<ul>
				<li v-for="(song,$index) in currentList" class="border-scale">
					<div class="content">
						<span class="songname">{{song.data.songname}}</span>
						<span class="singer" v-for="singer in song.data.singer">{{singer.name}}</span>
					</div>	
					<i class="iconfont icon-jiaocha delete" @click="removeSong($index)"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	export default{
		data(){
			return {
				songlist:null,
				fold:false
			}
		},
		methods:{
			songlistShow(){
				this.$store.commit('toggleSongList');
			},
			removeSong(index){
				this.$store.commit('removeSong',index);
			},
			refresh(){
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.songlist, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			clear(){
				this.$store.commit('clearCurrentList')
			}
		},
		computed:{
			currentList(){
				var currentList = this.$store.state.currentList;
				if(!this.fold){
					this.refresh();
				}
				return  currentList;
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mixin.scss';
	.songlist-wrap{
		position: fixed;
		bottom:0;
		left:0;
		right:0;
		height:30rem;
		background:#fff;
		color:#333;
		z-index:2000;
		overflow:hidden;
		transform:translate3d(0,100%,0);
		transition:all 0.6s;
		.header{
			height:3rem;
			display:flex;
			flex-direction:row;
			justify-content:space-between;
			align-items:center;
			padding:1rem 2rem;
			.left,.right{
				font-size:1.4rem;
				color:#999;
			}
			.middle{
				font-size:1.6rem;
				color:#333;
			}
		}
		.songlist{
			max-height:25rem;
			overflow: hidden;
			ul{
				padding:0;
				margin:0;
				list-style:none;
				li{
					display:flex;
					flex-direction:row;
					justify-content:space-between;
					padding:.7rem 2rem .7rem 1rem;
					@include border-1px(#ccc);
					.content{
						width:80%;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						.songname{
							font-size:1.6rem;
							color:#333;
							margin-right:.8rem;
						}
						.singer{
							font-size:1.4rem;
							color:#999;
							span{

							}
							span+span{
								margin-left:.5rem;
							}
						}
					}
					.delete{
						font-size:1.8rem;
						color:#999;
					}
				}
			}
		}
	}
</style>