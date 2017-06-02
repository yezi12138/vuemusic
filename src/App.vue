<template>
	<div id="app">
		<router-view></router-view>
		<transition name="slide">
			<song v-show="songShow" ref="song"></song>
		</transition>
		<songlist ref="songlist"></songlist>
		<transition name="fade">
			<div class="bg-wrap" @click="toggleWrapShow" v-show="wrapShow"></div>
		</transition>
	</div>
</template>

<script>
	import song from './components/song'
	import songlist from './components/songlist'
	export default {
		name: 'app',
		data(){
			return {
				currentSong:{}
			}
		},
		components:{
			song,songlist
		},
		created(){
			this.$nextTick(function(){
				var currentSong= this.$store.state.currentSong;
				if(typeof currentSong.data.songid){
					let str = window.localStorage.getItem('lastSong');
					if(str){
						currentSong = JSON.parse(str);
						this.$store.commit('addSong',currentSong);
					}else{
						console.log("第一次打开歌曲，现在创建缓存机制");
						storage.setItem('lastSong', JSON.stringify(currentSong));
					}				
				}
			})
		},
		computed:{
			songShow(){
				return this.$store.state.songShow;
			},
			wrapShow(){
				return this.$store.state.wrapShow;
			}
		},
		methods:{
			songListShow(){
				if(this.wrapShow){
					return;
				}else{
					this.toggleWrapShow();
					var songlist = this.$refs.songlist.$refs.songlistWrap;
					songlist.style.transform="translate3d(0,0,0)";
				}
			},
			toggleWrapShow(){
				var songlist = this.$refs.songlist.$refs.songlistWrap;
					songlist.style.transform="translate3d(0,100%,0)";
				this.$store.commit('toggleWrapShow');
			}
		}
	}
</script>

<style>
	html,body{
		font-size: 62.5%;
	}
	.slide-enter-active, .slide-leave-active {
		transition: all .5s;
	}
	.slide-enter, .slide-leave-active {
		transform: translate3d(100%,0,0);
	}
	.fade-enter-active, .fade-leave-active {
		transition: all .5s;
	}
	.fade-enter, .fade-leave-active {
		opacity:0;
	}
	.bg-wrap{
		position: fixed;
		bottom:0;
		left:0;
		right:0;
		top:0;
		background:rgba(0,0,0,.7);
		z-index:1999;
	}
</style>
