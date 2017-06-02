<template>
	<div class="serch-wrap" @click="clearResult">
		<div class="border-scale" :class="{'search-active':showSearch,'search':!showSearch}">
			<div class="search-content">
				<span class="iconfont" :class="{'icon-fanhui':showSearch,'icon-category':!showSearch}" @click="outInput">
				</span>
				<div class="search-input-wrap border-scale">
					<input type="text" placeholder="搜索 歌曲/专辑/歌手" class="search-input" @focus="onInput" v-model="searchValue">
					<div class="search-result">
						<ul>
							<li v-show="songs.length" v-for="song in songs" @click="toSong(song.name,song.singer,song.id)">
								<div class="item border-scale">
									<span>{{song.name}}</span>
									<span>{{song.singer}}</span>
								</div>
							</li>
							<li v-show="searchInfo">找不到这首歌</li>
						</ul>
					</div>
				</div>
				<span class="iconfont icon-STATISTICS" v-show="!showSearch" @click="songShow"></span>
				<span class="iconfont icon-search" v-show="showSearch" @click="search()"></span>
			</div>
		</div>
		<transition name="fade">
			<div class="wrap" v-show="showSearch">
			<div class="history">
				<div class="title">所搜历史</div>
				<div class="record">
					<ul>
						<li v-for="item in history" @click="search(item)">
							{{item}}
						</li>
					</ul>
				</div>
			</div>
		</div>
		</transition>
	</div>
</template>

<script>

	export default{
		data(){
			return {
				showSearch:false,
				history:[],
				searchValue:'',
				songs:[],
				currentSong:{},
				searchInfo:false
			}
		},
		created(){
			
		},
		methods:{
			onInput(){
				this.showSearch = true;
			},
			outInput(){
				this.showSearch = false;
			},
			search(value){
				value = value?value:this.searchValue;
				if(value === '') return;
				this.$http.jsonp('http://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg', {
					params: {
						is_xml: 0,
						format: 'jsonp',
						key: value,
						g_tk: 5381,
						loginUin: 0,
						hostUin: 0,
						inCharset: 'utf8',
						outCharset: 'utf-8',
						notice: 0,
						platform: 'yqq',
						needNewCode: 0
					},
					jsonp: 'jsonpCallback'
				}).then((res) => {
					// console.log(res.data);	
					if(res.data.data.song){
						var itemlist = res.data.data.song.itemlist;
					}
					if(itemlist){
						this.songs = itemlist;
					}else{
						this.searchInfo =true;
						return;
					}
				})
				if(this.searchValue === ''){
					return;
				}else{
					this.setStorage();
				}
			},
			getStorage(){
				var storage = window.localStorage; 
				var history=[];
				if(history = storage.getItem('searchHistory')){
					this.history = history.split(',');
				}else{
					storage.setItem('searchHistory', this.history);
					console.log("创建本地缓存");
				}
			},
			setStorage(){
				var storage = window.localStorage;
				this.history.push(this.searchValue);
				storage.setItem('searchHistory', this.history);
			},
			clearResult(){
				this.songs = [];
				this.searchInfo = false;
			},
			songShow(){
				this.$store.commit('toggleShowSong');
			},
			toSong(songname,singer,songid){
				var song = {
					data:{
						songname:songname,
						singer:singer,
						songid:songid
					}
				};
				//判断进入的是否是正在播放的歌曲，如果不是则重置播放按钮样式
				var currentSong = this.$store.state.currentSong.data;
				if(currentSong.songid != songid){
					this.$store.commit('initPlaying')
				}
				//添加音乐到播放列表
				this.$store.commit("addSong",song);
				this.$store.commit('toggleShowSong');
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/iconfont.css';
	@import '../../static/css/mixin.scss';
	.search{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		background-color:rgba(0,0,0,0.5);
		z-index:2000;
		.search-content{
			padding:1rem 1rem;
			display:flex;
			flex-derection:row;
			justify-content:space-between;
			align-items:center;
			font-size:1.6rem;
			span{
				color:#fff;
				font-size:2.2rem;
			}
			.search-input-wrap{
				display:flex;
				align-items:center;
				justify-content:center;
				.search-input{
					border:1px solid #eee;
					border-radius:6px;
					padding:0.5rem 2rem;
					outline:none;
					color:#fff;
					background-color:transparent;
				}
				.search-result{
					display:none
				}
			}
		}
	}
	.wrap{
		position: fixed;
		top:4.5rem;
		bottom:0;
		left:0;
		right:0;
		z-index:800;
		background:#fff;
		.history{
			margin-top:2rem;
			color:#999;
			text-align:center;
			.title{
				font-size:1.6rem;
			}
			.record{
				padding:2rem 2rem 1rem 2rem;
				overflow:hidden;
				font-size:1.6rem;
				ul{
					padding:0;
					margin:0;
					list-style:none;
					li{
						display:inline-block;
						text-decoration:underline;
						margin:0.3rem 0.8rem 0.3rem 0;
						&:last-child{
							margin:0;
						}
					}
				}
			}
		}
	}
	.search-active{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		background-color:#fff;
		z-index:1000;
		padding:0.5rem 0;
		.search-content{
			padding:0.6rem 2rem;
			display:flex;
			flex-derection:row;
			justify-content:center;
			align-items:center;
			font-size:1.6rem;
			span{
				flex:1;
				color:#333;
				font-size:2.2rem;
				text-align:right;
				&:first-child{
					text-align:left;
				}
			}
			.search-input-wrap{
				position: relative;
				flex:3;
				@include border-1px(#ccc);
				.search-input{
					border:0;
					padding:0.5rem 2rem;
					outline:none;
					color:#999;
					background-color:transparent;
				}
				.search-result{
					position: absolute;
					top:125%;
					left:0;
					width:100%;
					z-index:999;
					background:#f7f7f7;
					ul{
						padding:0;
						margin:0;
						list-style:none;
						box-shadow: 2px 3px 8px #333;
						li{
							.item{
								height:4rem;
								padding:0.5rem 1rem;
								color:#333;
								line-height:4rem;
								overflow:hidden;
								@include border-1px(#ccc);
								span{
									font-size:1.6rem;
								}
								span+span{
									margin-left:0.5rem;
									font-size:1.4rem;
									color:#999;
								}
							}
						}
					}
				}
			}
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: all .3s;
	}
	.fade-enter, .fade-leave-active {
		opacity:0;
	}
</style>