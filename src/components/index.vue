<template>
	<div class="index">
		<search></search>
		<div class="index-content-wrap" ref="content">
			<div class="content">
				<swiper :loop="true">
					<div class="swiper-item">
						<img src="../../static/imgs/crab.png" alt="">
					</div>
					<div class="swiper-item">
						<img src="../../static/imgs/sls.jpg" alt="">
					</div>
					<div class="swiper-item">
						<img src="../../static/imgs/index-top.jpg" alt="">
					</div>
				</swiper>
				<div v-for="item in billboards">
					<router-link tag="div" :to="{path:'/billboardDetail',query:{id:item.id}}">
						<div class="billboard">
							<div class="billboard-bg">
								<img :src="item.picUrl" alt="billboard.avtar">
							</div>
							<div class="billboard-list">
								<h3 class="title">{{item.topTitle.slice(4)}}</h3>
								<ul>
									<li v-for="(song,$index) in item.songList">{{$index+1}}.
										<span class="name">{{song.songname}}</span>
										<span class="singer">{{song.singername}}</span>
									</li>
								</ul>
							</div>
							<i class="iconfont icon-more"></i>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<bottom></bottom>
	</div>
</template>

<script>
	import swiper from 'banner-swiper';
	import search from './search';
	import BScroll from 'better-scroll';
	import bottom from './bottom';
	export default{
		data(){
			return{
				song_list:[],
				billboards:[],
				topList:[]
			}
		},
		components:{
			swiper,
			search,
			bottom
		},
		mounted(){
		},
		created(){
			this.getData();
		},
		methods:{
			_initPage(){
				this.scroll = new BScroll(this.$refs.content,{
					click:true
				})
			},
			getData(){
				this.$http.jsonp('http://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',{
					params: {
						g_tk: 5381,
						uin: 0,
						format: 'jsonp',
						inCharset: 'utf-8',
						outCharset: 'utf-8',
						notice: 0,
						platform: 'h5',
						needNewCode: 1,
						_: new Date().getTime()
					},
					jsonp: 'jsonpCallback'
				}).then((res) => {
					this.billboards = res.data.data.topList;
					this.$nextTick(() => {
						this._initPage();
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.index{
		position:fixed;
		top:0;
		left:0;
		right:0;
		bottom:5rem;
		background: linear-gradient(to bottom,#f1e0e0, #757575);
		.index-content-wrap{
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			overflow:hidden;
			.swiper{
				height:20rem;
				.swiper-items-wrap{
					.swiper-item{
						img{
							width:100%;
							height:100%;
						}
					}
				}
				.swiper-indicators-wrap{
					bottom:1rem;
					.swiper-indicator{
						width:1.2rem;
						height:1.2rem;
					}
				}
			}
			.billboard{
				display:flex;
				position: relative;
				flex-direction:row;
				margin:1rem 0;
				height:10rem;
				.billboard-bg{
					flex: 0 0 10rem;
					overflow:hidden;
					img{
						width:100%;
						height:100%;
					}
				}
				.billboard-list{
					flex:1;
					padding:0.5rem 1.5rem;
					color:#fff;
					overflow:hidden;
					background:rgba(0,0,0,.3);
					.title{
						padding:0;
						margin:0;
						margin-bottom:0.3rem;
						font-size:1.6rem;
					}
					ul{
						padding:0;
						margin:0;
						list-style:none;
						li{
							width:80%;
							font-size:1.4rem;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							margin:0.3rem 0;
							color:#d6bdbd;
							.name{
								margin:0 0.3rem;
								color:#fff;
							}
							.singer{
								color:#d6bdbd;
								margin:0 0.3rem;
							}
						}
					}
				}
				i{
					position: absolute;
					top:50%;
					right:1rem;
					width:3rem;
					height:3rem;
					font-size:2.4rem;
					color:#fff;
					transform:translate(0,-50%);
				}
			}
		}
	}
</style>