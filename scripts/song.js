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
var $lyricWrap = $('.lyric-wrap')
var $circle = $('.circle')
var $bg = $('.bg')
var query = new AV.Query('Song');
query.get(id).then(function (song) {
    // console.log(song)
    let { url, lyric , name , singer , cover} = song.attributes

    //在线获取歌曲名
    let h1 = `<h1> ${name} - ${singer} </h1>`
    $lyricWrap.prepend(h1)

    //在线获取封面图片
    let imgCover = `<img src="${cover}" alt="封面">`
    $circle.append(imgCover)

    // 在线获取背景图片
    let imgBg = `<img src="${cover}" alt="封面">`
    $bg.append(imgBg)

    let video = document.createElement('video')
    video.src = url;
    // video.oncanplay = function () {
    //     video.play()
    // }
    $('.icon-pause').on('click', function () {
        video.pause()
        $circle.addClass('pause')
    })
    $('.icon-play').on('click', function () {
        video.play()
        $circle.removeClass('pause')
        if($circle.hasClass("playing")){
            return
        }
        $circle.addClass('playing')
    })

    let array = []
    var parts = lyric.split('\n')
    parts.forEach(function (string, index) {
        let xxx = string.split(']')
        xxx[0] = xxx[0].substring(1)
        let regex = /(\d+):([\d.]+)/
        let matches = xxx[0].match(regex)
        let minute = +matches[1]
        let seconds = +matches[2]

        array.push({
            time: minute * 60 + seconds,
            lyric: xxx[1]
        })
    })

    let $lyric = $('.lyric')
    array.map(function (object) {
        let $p = $('<p/>')
        $p.attr('data-time', object.time).text(object.lyric)
        $p.appendTo($lyric.children('.lines'))
    })

    setInterval(function(){
        let seconds = video.currentTime
        let $lines = $('.lines > p')
        let $whichLine
        for( let i = 0;i < $lines.length; i++){
            let currentLineTime = $lines.eq(i).attr('data-time')
            let nextLineTime = $lines.eq(i+1).attr('data-time')
            // let bug = $lines.eq(i+1).length !== 0   最后一行bug ==  $lines[i+1] !== undefined
            if( $lines[i+1] !== undefined && currentLineTime < seconds &&  nextLineTime > seconds ){
                // console.log($lines[i])
                $whichLine = $lines.eq(i)
                break;
            }
        }
        if($whichLine){
            $whichLine.addClass('active').prev().removeClass('active')
            let top = $whichLine.offset().top
            let linesTop = $('.lines').offset().top
            let delta = top - linesTop - $('.lyric').height()/3
            $('.lines').css(`transform`,`translateY(-${delta}px)`)
        }
    },500)
    // console.log(array)
    // setInterval(function(){
    //     // console.log(video.currentTime)
    //     let current = video.currentTime
    //     for(let i = 0;i<array.length; i++){
    //         if(i === array.length -1){
    //             console.log(array[i].lyric)
    //         }else if(array[i].time <= current && array[i+1].time > current){
    //             console.log(array[i])
    //             break;
    //         }
    //     }
    // },500)
})