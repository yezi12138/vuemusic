<template>
	<div class="song-wrap">
		<div class="song-header">
			<div class="song-name">{{currentSongData.songname}}</div>
			<div class="song-singer">
				<span v-for="singer in currentSongData.singer">{{singer.name}}</span>
			</div>
			<i class="iconfont icon-fanhui" @click="goBack"></i>
		</div>
		<div class="song-lrc">
			<audio :src="musicUrl" ref="audio"></audio>
			<transition name="fade">
				<img v-show="!showLyric" src="../../static/imgs/五月天.jpg" @click="showLrc">
			</transition>
			<transition name="fade">
				<div v-show="!showLyric" class="song-options">
					<i class="iconfont icon-aixin"></i>
					<i class="iconfont icon-download"></i>
					<i class="iconfont icon-46"></i>
					<i class="iconfont icon-sandian"></i>
				</div>
			</transition>
			<transition name="fade">
				<div v-show="showLyric" class="lrc-wrap" @click="hiddenLrc">
					<ul class="lrc" id="lrc">
						<li v-for="item in lyric">{{item.value}}</li>
					</ul>
				</div>
			</transition>
		</div>
		<div class="loading">
			<audio id="music"></audio>
			<div class="beginTime">{{beginTime}}</div>
			<div class="progressbar-wrap">
				<div class="progressbar" ref="progressbar">
					<div class="indicator" ref="indicator"></div>
				</div>
			</div>
			<div class="endTime">{{endTime}}</div>
		</div>
		<div class="music-control-wrap">
			<i class="iconfont modeIcon" :class="{'icon-iconfontdanquxunhuan2eps':mode==1,'icon-suiji-copy-copy':mode==2}" @click="toggleMode"></i>
			<div class="music-control">
				<i class="iconfont icon-backward" @click="toward('prev')"></i>
				<i class="iconfont" :class="{'icon-play1':!isPlaying,'icon-stop':isPlaying}" @click="toggle"></i>
				<i class="iconfont icon-forward" @click="toward('next')"></i>
			</div>
			<i class="iconfont icon-sanheng songlist" @click="songlistShow"></i>
		</div>
		<div class="song-bg"></div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import Base64 from '../base64.js';
	export default{
		data(){
			return {
				beginTime:'00:00',
				endTime:'00:00',
				duration:0,
				audio:null,
				currentSong:{},
				lyric:[],
				showLyric:false
			}
		},
		methods:{
			goBack(){
				this.$store.commit('toggleShowSong');
			},
			toggleMode(){
				this.$store.commit('toggleMode');
			},
			songlistShow(){
				this.$parent.songListShow();
			},
			showLrc(){
				this.showLyric = true;
			},
			hiddenLrc(){
				this.showLyric = false;
			},
			toggle(){
				var audio = this.$refs.audio;
				if(this.isPlaying){
					audio.pause();
					this.$store.commit('togglePlaying')
				}else{
					audio.play();
					//把歌曲添加到播放列表
					//添加音乐到播放列表
					this.refleshLyric();
					this.$store.commit("addSong",this.currentSong);
					this.$store.commit('togglePlaying')
				}
			},
			formatTime(duration){
				var hours = Math.floor(duration/3600);;
				var minutes = Math.floor(duration%3600/60);
				var seconds = Math.floor(duration%60);
				// console.log(hours,minutes,seconds);
				hours = hours<10?'0'+hours:hours;
				minutes = minutes<10?'0'+minutes:minutes;
				seconds= seconds<10?'0'+seconds:seconds;
				if(hours!== '00'){
					return `${hours}:${minutes}:${seconds}`
				}else{
					return `${minutes}:${seconds}`
				}
			},
			formatlrc(text) {    
				//将文本分隔成一行一行，存入数组    
				var lines = text.split('\n'),  
				//用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]    
				pattern = /\[\d{2}:\d{2}.\d{2}\]/g,    
				//保存最终结果的数组    
				result = [];      
				//去掉不含时间的行    
				while (!pattern.test(lines[0])) {    
					lines = lines.slice(1);    
				};    
				//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉    
				lines[lines.length - 1].length === 0 && lines.pop();    
				lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {    
				//提取出时间[xx:xx.xx]    
				var time = v.match(pattern), 
				//返回的是一个对象类型   
					//提取歌词    
					value = v.replace(pattern, ''); 
				// console.log('第'+i+'次');
				// console.log(time);
				// console.log(typeof time[0]); 
				// console.log(typeof time=='object');
				// console.log(typeof time[0]=='string');
				//因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔     
						//去掉时间里的中括号得到xx:xx.xx    
						if(time!=null&&typeof time=='object'&&typeof time[0]=='string'&&value!=''){
							var t = time[0].substring(1, 9).split(':');    
							//将结果压入最终数组    
							//parseInt(t[0], 10) * 60 代表分钟*60 = 秒数
							var l = {
								time:parseInt(t[0], 10) * 60 + parseFloat(t[1]),
								value:value
							}
							result.push(l); 
							// console.log('已经压入'+i+'');
						}  
					});    
					//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词    
				result.sort(function(a, b) {    //单纯用sort()的话会按子母排序
					return a.time - b.time;    
				});   
				return result;
			} ,
			listenerAudio(){
				var that = this;
				var audio = this.$refs.audio;
				var progressbar = this.$refs.progressbar;
				audio.addEventListener('ended', function () {  
					that.$store.commit('togglePlaying')
				}, false);
				audio.addEventListener('playing', function () {  
					console.log("audio playing");
					that.timer = setInterval(() => {
						that.beginTime = that.formatTime(audio.currentTime);
						progressbar.style.width = Math.round(Math.round(audio.currentTime)/this.duration*100)+"%";
					}, 1000);
				}, false);
				audio.addEventListener('pause', function () {  
					console.log("audio pause");
					clearInterval(that.timer);
				}, false);
				audio.addEventListener('canplay', function () {  
					console.log("audio canplay");
					clearInterval(that.timer);
				}, false);
				audio.addEventListener('emptied', function () {  
					console.log("audio emptied");
					clearInterval(that.timer);
				}, false);
				audio.addEventListener('loadedmetadata', function () { 
					that.duration =  audio.duration;
					that.endTime = that.formatTime(audio.duration)
				}, false);
			},
			linstenerIndicator(){
				var indicator = this.$refs.indicator;
				indicator.addEventListener('touchstart', (event) => {
					this.doOnTouchStart(event);
				});
				indicator.addEventListener('touchmove', (event) => {
					this.doOnTouchMove(event);
					this.clearLyricCss();
				});
				indicator.addEventListener('touchend', (event) => {
					this.doOnTouchEnd(event);
				});
			},
			doOnTouchStart(event){
				this.page = {};
				let x = event.touches[0].pageX;
				this.page.beginX = x;
				this.page.pageWidth = this.$refs.progressbar.clientWidth;
			},
			doOnTouchMove(event){
				var audio = this.$refs.audio;
				var pageWidth = this.page.pageWidth;
				//获取进度条最大的宽度
				var maxLength = this.$refs.progressbar.parentNode.clientWidth-pageWidth;
				let moveX = event.touches[0].pageX;
				var offset = moveX-this.page.beginX;
				offset = Math.min(maxLength,Math.max(offset,-maxLength));
				var width = pageWidth + offset;
				var percent = Math.floor(width/this.$refs.progressbar.parentNode.clientWidth*100);
				if(percent<0){percent = 0};
				// console.log(this.$refs.progressbar.clientWidth,offset,width,percent);
				//设置播放当前时间
				audio.currentTime = Math.floor(this.duration/100*percent);
				this.beginTime = this.formatTime(audio.currentTime);
				//设置位置
				this.$refs.progressbar.style.width = percent + '%';
			},
			doOnTouchEnd(event){
				this.page = null;
				return;
			},
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
			refleshLyric(){
				var audio = this.$refs.audio;
				var that = this;
				audio.addEventListener('timeupdate', function(){
					var ul = document.getElementById('lrc'),
					lis = ul.querySelectorAll('li'),
					lyric = that.lyric;
					for(let i =0;i<lyric.length;i++){
						var j = i+1;
						if(lyric[i].time<audio.currentTime&&lyric[j].time>audio.currentTime&&i>4){
							var height = Math.floor(lis[i].offsetHeight);
							console.log(height);
							ul.style.top = `-${(i-4)*height}px`;
							lis[i].className = 'active';
							return;	
						}else{
							lis[i].className = '';
						}
					}
				});
			},
			clearLyricCss(){
				var ul = document.getElementById('lrc'),
				lis = ul.querySelectorAll('li');
				lis.forEach((item) => {
					item.className = ''
				})
			}
		},
		mounted(){
			//获得播放器
			this.$nextTick(() => {
				this.audio = this.$refs.audio;
				this.$store.commit('addAudio',this.audio);
				this.listenerAudio();
				this.linstenerIndicator();
			})
		},
		computed:{
			isPlaying(){
				return this.$store.state.isPlaying;
			},
			mode(){
				return this.$store.state.mode;
			},
			musicUrl(){
				var id = this.currentSongData.songid;
				if(id!=null){
					var url = `http://ws.stream.qqmusic.qq.com//${id}.m4a?fromtag=46`;
					return url;
				}else{
					return '';
				}
			},
			currentSongData(){
				this.currentSong = this.$store.getters.getCurrentSong;
				var data = this.currentSong.data;
				var songid = data.songid;
				//获取歌词
				this.$http.jsonp('https://api.darlin.me/music/lyric/' + songid, {
					jsonp: 'callback'
				}).then((res) =>{
					var lrc = this.formatlrc(Base64.decode(res.data.lyric));
					this.lyric = lrc;
				})
				return data;
			}
		}
	}
</script>

<style lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition: all .5s;
	}
	.fade-enter, .fade-leave-active {
		opacity:0;
	}
	.song-wrap{
		position: fixed;
		top:0;
		bottom:0;
		left:0;
		right:0;
		background:#251919;
		.song-header{
			display:flex;
			flex-direction:column;
			align-items:center;
			padding:1.4rem 1.2rem 0.8rem 1.2rem;
			margin-bottom:1rem;
			height:10%;
			.song-name{
				font-size:1.6rem;
				color:#fff;
				margin-bottom:0.4rem;
			}
			.song-singer{
				font-size:1.4rem;
				color:#d4b9b9;
				margin-top:0.4rem;
				span+span{
					margin-left:0.8rem
				}
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
		.song-lrc{
			display:flex;
			position: relative;
			flex-direction:column;
			align-items:center;
			justify-content:center;
			.lrc-wrap{
				position: relative;
				display:flex;
				align-items:top;
				justify-content:center;
				width:100%;
				height:100%;
				margin-bottom:1rem;
				overflow:hidden;
				.lrc{
					position: absolute;
					top:0;
					left:0;
					padding:2rem 2rem;
					margin:0;
					list-style:none;
					transition:all .3s;
					li{
						font-size:1.6rem;
						color:#999;
						text-align:center;
						padding:.4rem 0 ;
						height:30px;
						&.active{
							color:#fff;
						}
					}
				}
			}
			img{
				flex:2;
				padding-top:3rem;
				width:23rem;
				height:23rem;
			}
			height:60%;
			.song-options{
				flex:1;
				display:flex;
				flex-direction:row;
				align-items:center;
				justify-content:center;
				margin-top:1rem;
				i{
					font-size:2.8rem;
					color:#fff;
				}
				i+i{
					margin-left:2.8rem;
				}
			}
		}
		.loading{
			display:flex;
			flex-direction:row;
			align-items:center;
			justify-content:center;
			height:10%;
			text-align:center;
			color:#fff;
			font-size:1.4rem;
			.progressbar-wrap{
				flex:3;
				padding:0.2rem;
				border-radius:5px;
				background:#ccc;
				height:0.5rem;
				.progressbar{
					position: relative;
					width:0;
					height:100%;
					background:red;
					border-radius:5px;
					.indicator{
						position: absolute;
						right:-2px;
						top:50%;
						transform:translate(0,-50%);
						border:7px solid #fff;
						height:0.5rem;
						width:0.5rem;
						border-radius:100%;
						background:red;
					}
				}
			}
			.beginTime{
				flex:1;
			}
			.endTime{
				flex:1;
			}
		}
		.music-control-wrap{
			height:20%;
			display:flex;
			flex-direction:row;
			align-items:center;
			justify-content:space-between;
			position: relative;
			padding:0 1.5rem;
			.music-control{
				display:flex;
				flex-direction:row;
				align-items:center;
				justify-content:center;
				padding-bottom:1rem;
				position: relative;
				i{
					font-size:3.6rem;
					color:#fff;
				}
				i+i{
					margin-left:2rem;
				}
			}
			.modeIcon,.songlist{
				font-size:3.6rem;
				color:#fff;
				padding-bottom:1rem;
			}
		}
		.song-bg{
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background: linear-gradient(to bottom,#7d7373, #757575);
			z-index:-1;
		}
	}
</style>