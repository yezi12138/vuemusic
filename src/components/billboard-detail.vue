<template>
	<div class="billboard-detail-wrap">
		<div class="billboard-detail" ref="billboardDetail">
			<div class="detail-content">
				<div class="detail-header">
					<i class="iconfont icon-fanhui" @click="goBack"></i>
					<img class="header-bg" :src="picUrl" alt="">
				</div>
				<div class="list-control border-scale">
					<i class="iconfont icon-play"></i>
					<div class="play-all" @click="addTotal">播放全部<span>(共{{billboard.cur_song_num}}首)</span></div>
				</div>
				<div class="song-list">
					<ul>
						<li v-for="(song,$index) in billboard.songlist" @click="toSong(song.data.songname,song.data.singer,song.data.songid)">
							<div class="song">
								<div class="number">{{$index+1}}</div>
								<div class="song border-scale">
									<div class="song-name">{{song.data.songname}}</div>
									<div class="song-singer">
										<span v-for="singer in song.data.singer">{{singer.name}}</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<bottom></bottom>	
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import bottom from './bottom';
	export default{
		data(){
			return{
				billboard:{},
				picUrl:''
			}
		},
		components:{
			bottom
		},
		created(){
			this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg', {
				params: {
					topid: this.$route.query.id,
					format: 'jsonp',
					inCharset: 'utf8',
					outCharset: 'utf-8',
					notice: 0,
					platform: 'yqq',
					needNewCode: 0
				},
				jsonp: 'jsonpCallback'
			}).then(function (res) {
				this.billboard = res.data;
				this.picUrl =res.data.topinfo.pic_h5;
				this.$nextTick(() => {
					this.scroll = new BScroll(this.$refs.billboardDetail,{
						click:true
					})
				})
			})
		},
		computed:{
			
		},
		methods:{
			goBack(){
				this.$router.go(-1);
			},
			addTotal(){
				this.$store.commit("addCurrentList",this.billboard.songlist);
				this.$parent.$refs.song.toggle();
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
	.billboard-detail-wrap{
		position: fixed;
		top:0;
		left:0;
		right:0;
		bottom:5rem;
		.billboard-detail{
			position: absolute;
			top:0;
			left:0;
			right:0;
			bottom:0;
			overflow:hidden;
			.detail-content{
				.detail-header{
					height:25rem;
					.header-bg{
						width:100%;
						height:100%;
					}
					i{
						position: absolute;
						display:block;
						top:2rem;
						left:2rem;
						font-size:2.4rem;
						color:#fff;
					}
				}
				.list-control{
					display:flex;
					align-items:center;
					padding:0.8rem 0;
					@include border-1px(#ccc);
					i{	
						flex: 0 0 3rem;
						font-size:1.8rem;
						color:#757575;
						text-align:center;
					}
					.play-all{
						margin-left:0.8rem;
						span{
							margin-left:0.5rem;	
							font-size:1.4rem;
							color:#999;
						}
					}
				}
				.song-list{
					ul{
						padding:0;
						margin:0;
						list-style:none;
						li{
							.song{
								display:flex;
								font-size:1.6rem;
								color:#333;
								.number{
									flex:0 0 3rem;
									display:flex;
									align-items:center;
									justify-content:center;
									color:#999;
									font-size:1.8rem;
								}
								.song{
									flex:1;
									display:flex;
									flex-direction:column;
									margin-left:0.8rem;
									@include border-1px(#ccc);
									padding:0.6rem 0;
									.song-name{
										font-size:1.6rem;
										color:#333;
										margin-bottom:0.3rem;
									}
									.song-singer{
										font-size:1.4rem;
										color:#999;
										margin-top:0.3rem;
										span+span{
											margin-left:0.8rem;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>