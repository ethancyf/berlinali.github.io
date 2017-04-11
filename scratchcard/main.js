(function(){

  var mousedown = false;
  var bodyStyle = document.body.style;
  bodyStyle.mozUserSelect = 'none';
  bodyStyle.webkitUserSelect = 'none';

  var i= 0;
  var imgGenerateSpeed = 200;
  var imgScrollSpeed = 2000;
  var arcSize = 40;

  var imgs = [
    'p_0.jpg',
    'p_0.jpg',
    'p_0.jpg',
    'p_0.jpg',
    'p_1.jpg'
  ];

  var hints = [
    '请在以上的刮奖区刮奖',
    '再给你一次机会刮奖',
    '不中，再给你一次机会',
    '好吧，老板说把奖放在第5个...',
    '呵呵，都说我不是骗子啦'
  ];


  function draw(i){

    if(i<5){
      //if(i<2){
      var canvas = ( function createCanvas() {
        var canvas = document.createElement('canvas'); // <canvas></canvas>
        var div = document.createElement('div');       // <div></div>
        div.appendChild(canvas);                       //
        document.body.appendChild(div);

        canvas.id = i;
        canvas.style.backgroundColor='transparent';
        canvas.style.margin = '20px auto';
        canvas.style.display='block';
        return canvas;
      })();

      (function initImg(canvas){
        var  img = new Image();
        img.src = imgs[i]; //i - index
        img.addEventListener('load',function(e){
            drawScratchCard(e, canvas);
        });
      })(canvas);

      //explaination added below the scratch card
      var p = document.createElement('p');
      p.id="status";
      p.textContent = hints[i];
      document.body.appendChild(p);

      //jQuery scroll down feature
      if(i>0){
        jQuery('html, body').animate({
          scrollTop: jQuery("canvas#"+i).offset().top + $( "canvas" ).height()
        }, imgScrollSpeed);
      }

    }else{
      jumpToAnimation();
    }
  };

  function drawScratchCard(e, canvas){

      var img = e.target;
      var ctx;
      var w = img.width,
          h = img.height;

      canvas.width=w;
      canvas.height=h;
      canvas.style.backgroundImage='url('+img.src+')';

      ctx=canvas.getContext('2d');
      // ctx.fillStyle = 'gray';
      // ctx.fillRect(0, 0, w, h);

      layer(ctx,w,h);

      ctx.globalCompositeOperation = 'destination-out';

      attachEvent(canvas, ctx);
  }

  function layer(ctx,w,h){
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, w, h);
  }

  function attachEvent(canvas, ctx) {
      canvas.addEventListener('touchstart', handlerEventDown /* .bind(mousedown) */ );
      canvas.addEventListener('touchmove', handlerEventMove.bind({canvas: canvas, ctx: ctx}));
      canvas.addEventListener('touchend', handlerEventUp.bind({canvas: canvas, ctx: ctx}));

      // canvas.addEventListener('mousedown', handlerEventDown.bind(mousedown));
      // canvas.addEventListener('mousemove', handlerEventMove.bind({canvas: canvas, ctx: ctx}));
      // canvas.addEventListener('mouseup', handlerEventUp.bind({canvas: canvas, ctx: ctx}));
  }


  function handlerEventDown(e){
    // mousedown = this; //question
    e.preventDefault();
    mousedown=true;
  }

  function handlerEventUp(e){
    // mousedown = this;
    e.preventDefault();
    mousedown=false;
    //eraseAreaDetection(canvas,ctx);
  // }

  /*
  todo
  i tried to put the code below into a function and call it in handlerEventUp but it is not working. I have passed the argument in function. Don't know what is going wrong.
  */
  // function eraseAreaDetection(canvas,ctx){
    //if the erased area percentage is > 0.5, clear the layer and generate new one
    var imgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    var pixelsArr= imgData.data;
    var loop = pixelsArr.length;
    var transparent = 0;

    for(var j=0; j<loop ; j+=4){
      var alpha = pixelsArr[j+3];
      if(alpha<10){
        transparent++;
      }
    }
    var erasePercentage = transparent/(loop/4);
    var mouseAt = parseInt(e.target.id);
    console.log("I = "+i,"mouse at = "+mouseAt,erasePercentage>.5);
    if(i == mouseAt && erasePercentage >.5){


      /*todo
        if the if statement is true,
        action 1:
        clear the layer(line220). Changes its color from brown to transparent.My solution below does not work.
        action 2(finished):
        generate a new scratch card below.
      */

      setTimeout(() => {
        console.log("action 1");
        this.ctx.rect(0, 0, 320, 160);
        this.ctx.fill();
      }, imgGenerateSpeed*0.1);

      setTimeout(function(){
        console.log("action 2");
        draw(mouseAt+1);
      }, imgGenerateSpeed);

      i++;
      return i;
    }
  }

  function handlerEventMove(e){
    e.preventDefault();
    var offsetX = this.canvas.offsetLeft,
        offsetY = this.canvas.offsetTop;

    if(mousedown) {
      if(e.changedTouches){
        e=e.changedTouches[e.changedTouches.length-1];
      }

      var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0; //question
      var y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;

      with(this.ctx) {//question
           beginPath();
           arc(x, y, arcSize, 0, Math.PI * 2);
           closePath();
           fill();
      }
    }
  }

  function jumpToAnimation(){
    $('canvas').fadeOut("slow");
    setTimeout(function(){
      window.open("http://www.goodboydigital.com/pixijs/bunnymark_v3/","_self");
    }, 0);
  }


  draw(i);


})()

var numInTitle = 550;

$(function () {
    // 微信分享授权配置参数
    wx.config({
        appId: '${params.appId}', // 公众号唯一标识
        timestamp: '${params.timestamp}', // 时间戳
        nonceStr: '${params.nonceStr}', // 随机字符串
        signature: '${params.signature}', // 签名
        jsApiList: [
            "onMenuShareTimeline", // 分享到朋友圈
            "onMenuShareAppMessage" // 分享给朋友
        ]
    });

    wx.ready(function () {
        //发送给微信朋友
        wx.onMenuShareAppMessage({
            title: "this is "+ numInTitle + "a title", // 分享标题
            title: "this is a title", // 分享标题
            desc: "this is a desc", // 分享描述
            link: "link", // 分享链接
            imgUrl: "", // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享到朋友圈
        wx.onMenuShareTimeline({
            //title:"this is "+ numInTitle + "a title",
            title:"this is a title",
            link: "",
            imgUrl: "",
            success: function () {
            },
            cancel: function () {
            }
        });
    });
});