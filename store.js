import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


const state = {
	isPlaying:false,
	mode:1,
	audio:null,
	currentList:[],
	currentSong:{
		data:{}
	},
	songShow:false,
	lastSong:null,
	firstEnter:0,
	songShow:false,
	oldId:null,
	onceSong:{
		data:{}
	},   //用来保存歌曲信息
	wrapShow:false
};

const mutations = {
	togglePlaying(state){
		state.isPlaying = !state.isPlaying
	},
	initPlaying(state){
		state.isPlaying = false;
	},
	toggleMode(state){
		if(state.mode==1){
			state.mode = 2;
		}else if(state.mode==2){
			state.mode = 1;
		}
	},
	addCurrentList(state,array){  //设置全部播放列表
		state.currentList.splice(0,state.currentList.length);
		state.currentList = array;
		state.currentSong = state.currentList[0];
	},
	refreshList(state,array){
		state.currentList = array;
	},
	addSong(state,song){   //设置现在播放歌曲
		console.log("addSong",song);
		if(!song.data&&!song.data.songid){
			console.log("song的格式不对");
			return;
		};
		if(state.currentList.length!=0&&song.data.songid==state.currentList[0].data.songid){
			console.log("忽略再次添加同样歌曲");
			return;
		}
		//把歌曲添加到播放列表
		state.currentList.unshift(song);
		state.currentSong = song;
		console.log("目前播放歌曲是",song);
		//缓存最后一首歌在本地
		var storage = window.localStorage;
		storage.setItem('lastSong', JSON.stringify(song));
	},
	addAudio(state,audio){
		state.audio = audio;
	},
	toggleShowSong(state){
		state.songShow = !state.songShow 
	},
	toggleWrapShow(state){
		state.wrapShow = !state.wrapShow;
	},
	removeSong(state,index){
		state.currentList.splice(index,1);
	},
	clearCurrentList(state){
		state.currentList.splice(0,state.currentList.length);
	}
};

const getters = {
	getCurrentSong:function(state){
		var currentSong= state.currentSong;
		if(typeof currentSong.data === 'undefined'){
			let str = window.localStorage.getItem('lastSong');
			if(str){
				currentSong = JSON.parse(str);
				state.currentSong = currentSong;
			}else{
				console.log("第一次打开歌曲，现在创建缓存机制");
				storage.setItem('lastSong', currentSong);
				return currentSong;
			}
		}
		if(state.currentSong.data){
			return state.currentSong;
		}else{
			return "不存在歌曲"
		}
	}
}


export default new Vuex.Store({
	state,
	mutations,
	getters
});