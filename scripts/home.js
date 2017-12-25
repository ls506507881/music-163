
$('.tabs').on('click','li',function(e){
    let $li = $(e.currentTarget)
    let index = $li.index()
    $li.addClass('active').siblings().removeClass('active')
    $('.tab-content').children().eq(index)
        .addClass('active').siblings().removeClass('active')
})

// var SongObject = AV.Object.extend('Song');
// //创建一个类
// var songObject = new SongObject();
// //创建一个实例
// songObject.save({
// name: '像我这样的人',
// singer: '毛不易',
// url:'http://oxklvemx3.bkt.clouddn.com/%E5%83%8F%E6%88%91%E8%BF%99%E6%A0%B7%E7%9A%84%E4%BA%BA.mp3'
// }).then(function(object) {
// alert('保存成功');
// })

// 批量存储
// var SongObject = AV.Object.extend('Song');
// var songObject = new SongObject();
// songObject.set('name','1')
// songObject.set('singer','1')
// var songObject2 = new SongObject()
// songObject2.set('name','2')
// let songs = [songObject,songObject2]
// AV.Object.saveAll(songs)

var $newList = $('ol#newList')
var $songList = $('#songlist')
var $searchResult = $('#searchResult')
// 获取在线歌单
var queryList = new AV.Query('Playlist');
queryList.find().then(function (results) {
    for (var i = 0;i<results.length;i++){
        let songList = results[i].attributes
        let li = `
        <li><a href="./playlist.html?id=${results[i].id}">
                <div class="cover">
                    <img src="${songList.url}" alt="封面">
                </div>
                <p>${songList.musicListName}</p>
            </a>
        </li>
        `
        $songList.append(li)
    }
}, function (error) {
});

// 创建查询
var query = new AV.Query('Song');
// query.equalTo('hot', false);
// query.startsWith('contain', 'true');
var cql = 'select * from Song where hot != true';
AV.Query.doCloudQuery(cql).then(function (data) {
    $('#songs-loading').remove()
    var results = data.results;
    for( var i = 0;i<10;i++){
        let song = results[i].attributes
        let li = `
        <li>
            <a href="./song.html?id=${results[i].id}">
                <h3 class="text-hidden">${song.name}
                    <span>${song.reMark}</span>
                </h3>
                <p class="text-hidden">
                    <svg class="icon icon-sq">
                        <use xlink:href="#icon-sq"></use>
                    </svg>
                    ${song.singer} - ${song.album}</p>
                <div class="play-button" >
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-play"></use>
                    </svg>
                </div>
                </a>
            </li>
        `
        $newList.append(li)
    }
    
}, function (error) {
    alert('获取歌曲失败')
});
// query.find().then(function (results) {
//     console.log(results)
// }, function (error) {
// });

var timer = null
$('input#search').on('input', function (e) {
        if (timer) { window.clearTimeout(timer) }
        timer = setTimeout(function () {
            // console.log('时间到')
            let $input = $(e.currentTarget)
            let value = $input.val().trim()
            if (value == "") { return $searchResult.empty() }
            var query1 = new AV.Query('Song');
            var query2 = new AV.Query('Song');
            query1.contains('name', value);
            query2.contains('singer', value);
            var queryAll = AV.Query.or(query1, query2);
            queryAll.find().then(function (results) {
                $searchResult.empty()
                if (results.length === 0) {
                    $searchResult.html(`
                    <li>
                        <a href="#"> 
                        <div class="search-icon">
                            <svg class="icon icon-search" aria-hidden="true"><use xlink:href="#icon-search"></use></svg>
                        </div>
                        <div class="search-info underline">没有结果</div></a>
                    </li>`)
                } else {
                    for (var i = 0; i < results.length; i++) {
                        let song = results[i].attributes
                        // console.log(song)
                        let li = `
                        <li>
                            <a href="./song.html?id=${results[i].id}">
                            <div class="search-icon">
                                <svg class="icon icon-search" aria-hidden="true"><use xlink:href="#icon-search"></use></svg>
                            </div>
                            <div class="search-info text-hidden underline">${song.name} - ${song.singer}</div></a>
                        </li>
                        `
                        $searchResult.append(li)
                    }
                }
            })
            timer = null
        }, 300)

    })

    var $hotSong = $('#hot-song')
    var $hotSongLi = $('#hot-song li')
    var $number = $('#hot-song .number')
    // 在线获取热歌榜
    var hotQuery = new AV.Query('Song');
    var cqh = 'select * from Song where hot = true';
    AV.Query.doCloudQuery(cqh).then(function (data) {
        let results = data.results;
        for(var i = 0;i<results.length;i++){
            let song = results[i].attributes
            let li = `
                <li>
                    <a href="./song.html?id=${results[i].id}">
                        <div id="number" class="number">${song.number}</div>
                        <div class="song-info">
                            <h3 class="text-hidden">${song.name}</h3>
                            <p class="text-hidden">${song.singer} - ${song.album}</p>
                        </div>
                        <div class="play-button">
                            <svg class="icon icon-play">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                            </svg>
                        </div>
                    </a>
                </li>
            `
            $hotSong.append(li)
        }
        //添加排名数字（废弃），因为列表是在线获取的，html中没元素，索引获取不到
        //想通过定时器延迟执行，未解决，存档等哪天想出解决的办法
        // $hotSongLi.each(function(a,b){
        //     if( a<=2 ){
        //         $number[a].append('0'+(a+1))
        //         $number.eq(a).addClass('hot-number')
        //     }
        //     else if( a>=2 && a<=8 ){
        //         $number[a].append('0'+(a+1))
        //     }else{
        //         $number[a].append(a+1)
        //     }
        //     console.log($hotSong)
        // })
    })
