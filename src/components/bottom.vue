<template>
	<div class="bottom"> 
		<div class="music-bg" @click="songShow">
			<img src="../../static/imgs/五月天.jpg" alt="">
		</div>
		<div class="music-info" @click="songShow">
			<div class="song-name">{{currentSongData.songname}}</div>
			<div class="song-singer">
				<span v-for="singer in currentSongData.singer">{{singer.name}}</span>
			</div>
		</div>
		<div class="music-control">
			<i class="iconfont icon-backward" @click="toward('prev')"></i>
				<i class="iconfont" :class="{'icon-play1':!isPlaying,'icon-stop':isPlaying}" @click="toggle"></i>
				<i class="iconfont icon-forward" @click="toward('next')"></i>
		</div>
	</div>
</template>

<script>
	export default{
		data:function(){
			return {
				song:{},
				audio:null
			}
		},
		computed:{
			isPlaying(){
				return this.$store.state.isPlaying;
			},
			currentSongData(){
				return this.$store.state.currentSong.data;
			}
		},
		mounted:function(){
			this.$nextTick(() => {
				setTimeout(() => {
					this.audio = this.$store.state.audio;
				}, 500);
			})
		},
		methods:{
			toward(pos){
				var  currentList = this.$store.state.currentList;
				if(currentList.length <= 1){
					return;
				}
				if(pos === 'next'){
					console.log("next");
					//弹出当前歌曲
					var current = currentList.shift();
					var next = currentList.shift();
					//切换当前歌曲
					this.$store.commit('addSong',next);
					this.$store.commit('refreshList',currentList);
					if(this.$store.state.isPlaying){
						this.$store.commit('togglePlaying')
					}
				}else if(pos === 'prev'){
					//弹出最后一首歌
					var prev = currentList.pop();
					//弹出当前歌曲
					var current = currentList.shift();
					//切换当前歌曲
					this.$store.commit('addSong',prev);
					this.$store.commit('refreshList',currentList);
					if(this.$store.state.isPlaying){
						this.$store.commit('togglePlaying')
					}
				}
			},
			songShow(){
				this.$store.commit('toggleShowSong');
			},
			toggle(){
				var audio = this.audio;
				if(this.isPlaying){
					audio.pause();
					this.$store.commit('togglePlaying')
				}else{
					audio.play();
					//把歌曲添加到播放列表
					this.$store.commit('togglePlaying')
				}
			}
		}
	}
</script>

<style lang="scss">
	.bottom{
		position: fixed;
		bottom:0;
		left:0;
		right:0;
		height:4.9rem;
		display:flex;
		flex-direction:row;
		background: linear-gradient(to left,#423e3e, #7d7373);
		border-top:1px solid #a29da7;
		.music-bg{
			flex: 0 0 6.5rem;
			height:5rem;
			margin-right:1rem;
			img{
				width:100%;
				height:100%;
			}
		}
		.music-info{
			flex:1;
			display:flex;
			flex-direction:column;
			margin-left:1rem;
			.song-name{
				margin:0.3rem 0 0.2rem 0;
				color:#fff;
				font-size:1.4rem;
			}
			.song-singer{
				margin:0.2rem 0;
				font-size:1.2rem;
				color:#e4dddd;
				span+span{
					margin-left:0.6rem;
				}
			}
		}
		.music-control{
			flex:1;
			display:flex;
			justify-content:center;
			align-items:center;
			color:#fff;
			padding-right:0.5rem;
			i{
				margin:0 1.1rem;
				font-size:2.4rem;
				&:last-child{
					margin-right:0;
				}
			}
		}
	}
</style>