var $songList = $('#songlists')
var query = new AV.Query('Song');
var cql = 'select * from Song where hot = true';
AV.Query.doCloudQuery(cql).then(function (data) {
    let result = data.results;
    for( var i = 0;i < result.length;i++){
        let song = result[i].attributes
        let li = `
        <li>
            <a href="./song.html?id=${result[i].id}">
                <div class="number">${song.number}</div>
                <div class="song-info">
                    <h3 class="text-hidden"> ${song.name}</h3>
                    <p class="text-hidden"> ${song.singer} - ${song.album}</p>
                </div>
                <div class="play-button">
                    <svg class="icon icon-play">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                    </svg>
                </div>
            </a>
        </li>
        `
        $songList.append(li)
    }
}, function (error) {
    alert('获取歌曲失败')
});


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
var id = GetQueryString("id");
var Playlist = new AV.Query('Playlist');
Playlist.get(id).then(function (song) {
    console.log(song)
    let { musicListName , uploader , avatar , syn , volume , url} = song.attributes
    let cover = `
    <img class="bg" src="${url}" alt="">
    <div class="list-img">
        <img src="${url}" alt="">
    </div>
    <div class="list-info">
        <h1>${musicListName}</h1>
        <div class="user">
            <a href="#">
                <img src="${avatar}" alt="">
                ${uploader}
            </a>
        </div>
    </div>
    `
    $('.cover').append(cover)
    let info = `
    <h2>标签：<i>华语</i><i>流行</i></h2>
    <div class="text fold">
        ${syn}
    </div>
    <span class="more">
        <svg class="icon icon-down" aria-hidden="true">
            <use xlink:href="#icon-down"></use>
        </svg>
    </span>
    `
    $('.info').append(info)
})