# music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# vuemusic

# 实现的功能：

## 排行榜
1. 轮播图展示
2. 搜索推荐
3. 搜索歌曲
4. 上一曲，下一曲，播放暂停
5. 歌词滚动
6. 加入/删除播放列表
7. 音乐进度条

## 图片展示
![img1](http://wx2.sinaimg.cn/mw690/a359ab18gy1fg6xvj21ijj208e0f2grr.jpg)
![img1](http://wx4.sinaimg.cn/mw690/a359ab18gy1fg6xvg6wyuj208e0ex40g.jpg)
![img1](http://wx1.sinaimg.cn/mw690/a359ab18gy1fg6xvgx4yxj208g0ezmzq.jpg)
![img1](http://wx4.sinaimg.cn/mw690/a359ab18gy1fg6xvf7wzij208e0f2dg7.jpg)

## API
        //获取榜单
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
				})
	//榜单详情
	this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp    .fcg', {
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
			})
	//播放音乐
	http://ws.stream.qqmusic.qq.com//${id}.m4a?fromtag=46

使用api来自（https://github.com/gaoxiaosong1113/vue-music）
