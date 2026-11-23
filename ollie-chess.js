(function(){
sessionStorage.removeItem('_alPanic');
['_al','_alQueen','_alStyle'].forEach(function(id){
  var el=document.getElementById(id);if(el)el.remove();
});
if(window._alTick){clearInterval(window._alTick);window._alTick=null;}
var d=document;

var ss=d.createElement('style');ss.id='_alStyle';
ss.textContent=`
#_al{position:fixed!important;top:50%!important;right:6px!important;transform:translateY(-50%)!important;
z-index:2147483647!important;width:168px;background:rgba(10,10,14,.97);
border:1.5px solid rgba(255,255,255,.12);border-radius:18px;padding:14px 10px 12px;
font-family:-apple-system,sans-serif;box-shadow:0 12px 48px rgba(0,0,0,.9);
color:#fff;touch-action:none;user-select:none}
#_alh{font-size:9px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;
text-align:center;margin-bottom:10px;background:linear-gradient(90deg,#00C6FF,#34C759);
-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
._alr{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:10px;margin-bottom:4px}
._alrb{background:rgba(0,180,255,.12);border:1px solid rgba(0,180,255,.3)}
._alrg{background:rgba(160,210,0,.1);border:1px solid rgba(160,210,0,.3)}
._alrw{background:rgba(255,59,48,.12);border:1px solid rgba(255,59,48,.3)}
._alrd{opacity:.35}
._ald{width:7px;height:7px;border-radius:50%;flex-shrink:0}
._alrb ._ald{background:#00B4FF}._alrg ._ald{background:#AADD00}._alrw ._ald{background:#FF3B30}
._all{font-size:7px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;margin-bottom:1px}
._alrb ._all{color:rgba(0,180,255,.85)}._alrg ._all{color:rgba(160,210,0,.85)}._alrw ._all{color:rgba(255,59,48,.85)}
._alv{font-size:11px;font-weight:900;font-family:monospace;color:#fff;line-height:1.3}
#_als{font-size:8px;color:rgba(255,255,255,.35);text-align:center;margin-top:6px}
#_alx{position:absolute;top:8px;right:9px;background:none;border:none;
color:rgba(255,255,255,.35);font-size:13px;cursor:pointer;line-height:1;padding:0}
._aldiv{height:1px;background:rgba(255,255,255,.08);margin:8px 0}
._alopt{display:flex;align-items:center;justify-content:space-between;
padding:5px 8px;cursor:pointer;border-radius:8px;margin-bottom:3px;
font-size:9px;font-weight:600;letter-spacing:.5px;color:rgba(255,255,255,.7);
transition:background .15s}
._alopt:active{background:rgba(255,255,255,.08)}
._alcb{width:13px;height:13px;border-radius:4px;border:1.5px solid rgba(255,255,255,.3);
flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}
._alcb.on{background:#00B4FF;border-color:#00B4FF}
._alcb.on::after{content:'✓';font-size:9px;color:#000;font-weight:900}
#_alPanic{width:100%;margin-top:8px;padding:7px;border-radius:10px;
background:rgba(255,59,48,.15);border:1.5px solid rgba(255,59,48,.4);
color:#FF3B30;font-size:9px;font-weight:800;letter-spacing:1px;cursor:pointer;
text-transform:uppercase;transition:all .15s}
#_alPanic:active{background:rgba(255,59,48,.4)}
#_alPanic.armed{background:rgba(255,59,48,.5);border-color:#FF3B30;
color:#fff;animation:_alPulse .3s ease}
@keyframes _alPulse{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
#_alQueen{position:fixed!important;bottom:80px!important;right:10px!important;
width:48px;height:48px;border-radius:50%;
background:linear-gradient(135deg,#0066FF,#00C6FF);
box-shadow:0 4px 20px rgba(0,100,255,.6),0 0 0 2px rgba(255,255,255,.15);
z-index:2147483647!important;cursor:pointer;
display:flex;align-items:center;justify-content:center;
font-size:24px;border:none;touch-action:none;
transition:transform .15s,box-shadow .15s}
#_alQueen:active{transform:scale(.92)}
#_albrand{font-size:7px;color:rgba(255,255,255,.2);text-align:center;
margin-top:8px;letter-spacing:.5px}
`;
d.head.appendChild(ss);

var opts={brilliant:true,good:true,worst:true};
var lastFEN='',lastMoves=null,lastSide='w',lastBoard={},lastActive=false;
var curX=null,curY=null,dragActive=false,dsx=0,dsy=0;
var arrowSVG=null;

function buildPanel(){
  var old=d.getElementById('_al');if(old)old.remove();
  var p=d.createElement('div');p.id='_al';
  p.innerHTML=`
<button id="_alx">✕</button>
<div id="_alh">♟ Made By @avoidleaks</div>
<div class="_alr _alrb ${opts.brilliant?'':'_alrd'}">
  <div class="_ald"></div>
  <div style="flex:1"><div class="_all">Brilliant</div><div class="_alv" id="_b">—</div></div>
</div>
<div class="_alr _alrg ${opts.good?'':'_alrd'}">
  <div class="_ald"></div>
  <div style="flex:1"><div class="_all">Good</div><div class="_alv" id="_g">—</div></div>
</div>
<div class="_alr _alrw ${opts.worst?'':'_alrd'}">
  <div class="_ald"></div>
  <div style="flex:1"><div class="_all">Worst</div><div class="_alv" id="_w">—</div></div>
</div>
<div id="_als">Connecting...</div>
<div class="_aldiv"></div>
<div class="_alopt" id="_optB"><span>Brilliant Moves</span><div class="_alcb ${opts.brilliant?'on':''}"></div></div>
<div class="_alopt" id="_optG"><span>Good Moves</span><div class="_alcb ${opts.good?'on':''}"></div></div>
<div class="_alopt" id="_optW"><span>Worst Moves</span><div class="_alcb ${opts.worst?'on':''}"></div></div>
<button id="_alPanic">⚠ PANIC MODE</button>
<div id="_albrand">Made By @avoidleaks</div>`;
  d.documentElement.appendChild(p);

  d.getElementById('_alx').onclick=minimize;

  function mkToggle(id,key,rowIdx){
    d.getElementById(id).onclick=function(){
      opts[key]=!opts[key];
      this.querySelector('._alcb').classList.toggle('on',opts[key]);
      p.querySelectorAll('._alr')[rowIdx].classList.toggle('_alrd',!opts[key]);
      if(lastMoves)drawArrows(lastMoves,lastSide,lastBoard);
    };
  }
  mkToggle('_optB','brilliant',0);
  mkToggle('_optG','good',1);
  mkToggle('_optW','worst',2);

  var panicArmed=false;
  d.getElementById('_alPanic').onclick=function(){
    if(panicArmed){
      panic();
    } else {
      panicArmed=true;
      this.classList.add('armed');
      this.textContent='⚠ TAP AGAIN TO PANIC';
      setTimeout(function(){
        panicArmed=false;
        var btn=d.getElementById('_alPanic');
        if(btn){btn.classList.remove('armed');btn.textContent='⚠ PANIC MODE';}
      },2500);
    }
  };

  attachDrag(p);
}

function minimize(){
  clrArr();
  var p=d.getElementById('_al');if(p)p.remove();
  var q=d.createElement('button');q.id='_alQueen';q.textContent='♛';
  d.documentElement.appendChild(q);
  q.onclick=function(){q.remove();buildPanel();};
}

function panic(){
  clrArr();
  ['_al','_alQueen','_alStyle'].forEach(function(id){
    var el=d.getElementById(id);if(el)el.remove();
  });
  if(window._alTick){clearInterval(window._alTick);window._alTick=null;}
  lastMoves=null;lastActive=false;lastFEN='';
}

function attachDrag(el){
  el.addEventListener('touchstart',function(e){
    if(e.target.id==='_alx'||e.target.id==='_alPanic'||
       e.target.closest('._alopt')||e.target.closest('#_alPanic'))return;
    e.preventDefault();
    dragActive=true;
    if(curX===null){
      var r=el.getBoundingClientRect();
      curX=r.left+window.pageXOffset;
      curY=r.top+window.pageYOffset;
      el.style.position='absolute';
      el.style.right='auto';
      el.style.bottom='auto';
      el.style.transform='none';
    }
    el.style.left=curX+'px';
    el.style.top=curY+'px';
    dsx=e.touches[0].clientX;
    dsy=e.touches[0].clientY;
  },{passive:false});
  d.addEventListener('touchmove',function(e){
    if(!dragActive)return;
    e.preventDefault();
    var el2=d.getElementById('_al');if(!el2)return;
    el2.style.left=(curX+(e.touches[0].clientX-dsx))+'px';
    el2.style.top=(curY+(e.touches[0].clientY-dsy))+'px';
  },{passive:false});
  d.addEventListener('touchend',function(){
    if(!dragActive)return;
    dragActive=false;
    var el2=d.getElementById('_al');if(!el2)return;
    var r=el2.getBoundingClientRect();
    curX=r.left+window.pageXOffset;
    curY=r.top+window.pageYOffset;
  },{passive:true});
}

var FL='abcdefgh';
var SYM={P:'♙',N:'♘',B:'♗',R:'♖',Q:'♕',K:'♔',p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'};
var PVAL={p:100,n:320,b:330,r:500,q:900,k:20000};
var PSQ={
  p:[0,0,0,0,0,0,0,0,5,10,10,-20,-20,10,10,5,5,-5,-10,0,0,-10,-5,5,0,0,0,20,20,0,0,0,5,5,10,25,25,10,5,5,10,10,20,30,30,20,10,10,50,50,50,50,50,50,50,50,0,0,0,0,0,0,0,0],
  n:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,5,5,0,-20,-40,-30,5,10,15,15,10,5,-30,-30,0,15,20,20,15,0,-30,-30,5,15,20,20,15,5,-30,-30,0,10,15,15,10,0,-30,-40,-20,0,0,0,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
  b:[-20,-10,-10,-10,-10,-10,-10,-20,-10,5,0,0,0,0,5,-10,-10,10,10,10,10,10,10,-10,-10,0,10,10,10,10,0,-10,-10,5,5,10,10,5,5,-10,-10,0,5,10,10,5,0,-10,-10,0,0,0,0,0,0,-10,-20,-10,-10,-10,-10,-10,-10,-20],
  r:[0,0,0,5,5,0,0,0,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,5,10,10,10,10,10,10,5,0,0,0,0,0,0,0,0],
  q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,5,0,0,0,0,-10,-10,5,5,5,5,5,0,-10,0,0,5,5,5,5,0,-5,-5,0,5,5,5,5,0,-5,-10,0,5,5,5,5,0,-10,-10,0,0,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
  k:[20,30,10,0,0,10,30,20,20,20,0,0,0,0,20,20,-10,-20,-20,-20,-20,-20,-20,-10,-20,-30,-30,-40,-40,-30,-30,-20,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30]
};

function isW(pc){return pc>='A'&&pc<='Z'}
function sq(f,r){return FL[f]+r}
function psqBonus(pc,sqStr,side){
  var t=pc.toLowerCase();if(!PSQ[t])return 0;
  var f=FL.indexOf(sqStr[0]),r=parseInt(sqStr[1])-1;
  return PSQ[t][side==='w'?f+r*8:f+(7-r)*8];
}
function applyMove(board,mv){
  var nb={};Object.keys(board).forEach(function(k){nb[k]=board[k]});
  var fr=mv.slice(0,2),to=mv.slice(2,4);
  nb[to]=nb[fr];delete nb[fr];
  if(nb[to]==='P'&&to[1]==='8')nb[to]='Q';
  if(nb[to]==='p'&&to[1]==='1')nb[to]='q';
  return nb;
}
function kingSquare(board,s){
  var kp=s==='w'?'K':'k',keys=Object.keys(board);
  for(var i=0;i<keys.length;i++)if(board[keys[i]]===kp)return keys[i];
  return null;
}
function isAttacked(board,sq2,byS){
  var keys=Object.keys(board);
  for(var i=0;i<keys.length;i++){
    var from=keys[i],pc=board[from];
    if(byS==='w'?!isW(pc):isW(pc))continue;
    var f=FL.indexOf(from[0]),r=parseInt(from[1]);
    var tf=FL.indexOf(sq2[0]),tr=parseInt(sq2[1]),t=pc.toLowerCase();
    if(t==='p'){var dir=byS==='w'?1:-1;if(r+dir===tr&&Math.abs(f-tf)===1)return true}
    if(t==='n'){var df=Math.abs(f-tf),dr=Math.abs(r-tr);if((df===2&&dr===1)||(df===1&&dr===2))return true}
    if(t==='k'){if(Math.abs(f-tf)<=1&&Math.abs(r-tr)<=1)return true}
    var rays=t==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:t==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:t==='q'?[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]:[];
    for(var ri=0;ri<rays.length;ri++){
      var cf=f+rays[ri][0],cr=r+rays[ri][1];
      while(cf>=0&&cf<8&&cr>=1&&cr<=8){
        var s2=sq(cf,cr);if(s2===sq2)return true;if(board[s2])break;
        cf+=rays[ri][0];cr+=rays[ri][1];
      }
    }
  }
  return false;
}
function inCheck(board,s){
  var ks=kingSquare(board,s);if(!ks)return false;
  return isAttacked(board,ks,s==='w'?'b':'w');
}
function pseudoMoves(board,s){
  var moves=[];
  Object.keys(board).forEach(function(from){
    var pc=board[from];
    if(s==='w'?!isW(pc):isW(pc))return;
    var f=FL.indexOf(from[0]),r=parseInt(from[1]),t=pc.toLowerCase();
    if(t==='p'){
      var dir=s==='w'?1:-1,nr=r+dir;
      if(nr>=1&&nr<=8){
        var fwd=sq(f,nr);
        if(!board[fwd]){
          moves.push(from+fwd);
          var sr=s==='w'?2:7;
          if(r===sr){var d2=sq(f,r+2*dir);if(!board[d2])moves.push(from+d2)}
        }
        [-1,1].forEach(function(df){
          var cf=f+df;
          if(cf>=0&&cf<8){var cap=sq(cf,nr);if(board[cap]&&(s==='w'?!isW(board[cap]):isW(board[cap])))moves.push(from+cap)}
        });
      }
    }
    if(t==='n')[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(dd){
      var nf=f+dd[0],nr2=r+dd[1];
      if(nf>=0&&nf<8&&nr2>=1&&nr2<=8){
        var to=sq(nf,nr2);
        if(!(board[to]&&(s==='w'?isW(board[to]):!isW(board[to]))))moves.push(from+to);
      }
    });
    var rays=t==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:
             t==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:
             t==='q'?[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]:[];
    rays.forEach(function(ray){
      var cf=f+ray[0],cr=r+ray[1];
      while(cf>=0&&cf<8&&cr>=1&&cr<=8){
        var to=sq(cf,cr);
        if(board[to]){if(!(s==='w'?isW(board[to]):!isW(board[to])))moves.push(from+to);return}
        moves.push(from+to);cf+=ray[0];cr+=ray[1];
      }
    });
    if(t==='k'){
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(dd){
        var nf=f+dd[0],nr3=r+dd[1];
        if(nf>=0&&nf<8&&nr3>=1&&nr3<=8){
          var to=sq(nf,nr3);
          if(!(board[to]&&(s==='w'?isW(board[to]):!isW(board[to]))))moves.push(from+to);
        }
      });
      if(s==='w'&&from==='e1'){
        if(board['h1']==='R'&&!board['f1']&&!board['g1']&&
           !isAttacked(board,'e1','b')&&!isAttacked(board,'f1','b')&&!isAttacked(board,'g1','b'))
          moves.push('e1g1');
        if(board['a1']==='R'&&!board['d1']&&!board['c1']&&!board['b1']&&
           !isAttacked(board,'e1','b')&&!isAttacked(board,'d1','b')&&!isAttacked(board,'c1','b'))
          moves.push('e1c1');
      }
      if(s==='b'&&from==='e8'){
        if(board['h8']==='r'&&!board['f8']&&!board['g8']&&
           !isAttacked(board,'e8','w')&&!isAttacked(board,'f8','w')&&!isAttacked(board,'g8','w'))
          moves.push('e8g8');
        if(board['a8']==='r'&&!board['d8']&&!board['c8']&&!board['b8']&&
           !isAttacked(board,'e8','w')&&!isAttacked(board,'d8','w')&&!isAttacked(board,'c8','w'))
          moves.push('e8c8');
      }
    }
  });
  return moves;
}
function legalMoves(board,s){
  return pseudoMoves(board,s).filter(function(mv){return!inCheck(applyMove(board,mv),s)});
}
function evalBoard(board){
  var score=0;
  Object.keys(board).forEach(function(sqStr){
    var pc=board[sqStr],t=pc.toLowerCase(),base=PVAL[t]||0,side=isW(pc)?'w':'b';
    score+=side==='w'?base+psqBonus(pc,sqStr,'w'):-(base+psqBonus(pc,sqStr,'b'));
  });
  return score;
}
function mvvLva(board,mv){
  var vic=board[mv.slice(2,4)];if(!vic)return 0;
  return(PVAL[vic.toLowerCase()]||0)*10-(PVAL[(board[mv.slice(0,2)]||'p').toLowerCase()]||0);
}
function orderMoves(board,moves){
  return moves.slice().sort(function(a,b){return mvvLva(board,b)-mvvLva(board,a)});
}
var NODES=0;
function negamax(board,s,depth,alpha,beta){
  NODES++;
  if(depth===0)return s==='w'?evalBoard(board):-evalBoard(board);
  var moves=orderMoves(board,legalMoves(board,s));
  if(!moves.length)return inCheck(board,s)?-99999+(3-depth):0;
  var best=-Infinity,opp=s==='w'?'b':'w';
  for(var i=0;i<moves.length;i++){
    var score=-negamax(applyMove(board,moves[i]),opp,depth-1,-beta,-alpha);
    if(score>best)best=score;
    if(score>alpha)alpha=score;
    if(alpha>=beta)break;
  }
  return best;
}
function bestMoves(board,s){
  var moves=orderMoves(board,legalMoves(board,s));
  if(!moves.length)return{brilliant:null,good:null,worst:null};
  var opp=s==='w'?'b':'w';NODES=0;
  var scored=moves.map(function(mv){
    return{mv:mv,sc:-negamax(applyMove(board,mv),opp,2,-Infinity,Infinity)};
  }).sort(function(a,b){return b.sc-a.sc});
  var n=scored.length;
  return{
    brilliant:scored[0].mv,
    good:scored[Math.min(Math.floor(n*0.3),n-1)].mv,
    worst:scored[n-1].mv
  };
}
function isCastle(mv){
  return mv==='e1g1'||mv==='e1c1'||mv==='e8g8'||mv==='e8c8';
}
function label(mv,board){
  if(!mv)return'—';
  if(isCastle(mv))return'♔ '+(mv==='e1g1'||mv==='e8g8'?'0-0':'0-0-0');
  return(SYM[board[mv.slice(0,2)]]||'')+mv.slice(0,2)+'→'+mv.slice(2,4);
}
function getFEN(){
  var src=[
    function(){var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');return el&&el.game&&el.game.getFEN&&el.game.getFEN()},
    function(){var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');return el&&el.getFEN&&el.getFEN()},
    function(){var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');if(!el)return null;var ks=Object.keys(el);for(var i=0;i<ks.length;i++){var v=el[ks[i]];if(v&&typeof v==='object'&&typeof v.getFEN==='function')return v.getFEN()}return null},
    function(){var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');var g=el&&(el._component||el.__vue__||el._instance);return g&&typeof g.getFEN==='function'?g.getFEN():g&&g.fen||null},
    function(){var g=window.chessboard||window.board||window.game;return g&&typeof g.getFEN==='function'?g.getFEN():null}
  ];
  for(var i=0;i<src.length;i++){try{var r=src[i]();if(r&&r.indexOf('/')>-1)return r}catch(e){}}
  return null;
}
function parseFEN(fen){
  var board={},parts=fen.split(' '),rows=parts[0].split('/');
  for(var ri=0;ri<8;ri++){
    var fi=0;
    for(var ci=0;ci<rows[ri].length;ci++){
      var ch=rows[ri][ci];
      if(isNaN(ch)){board[FL[fi]+(8-ri)]=ch;fi++}else fi+=parseInt(ch);
    }
  }
  return{board:board,side:parts[1]||'w'};
}
function isGameActive(fen){
  if(!fen)return false;
  var p=parseFEN(fen),b=p.board,wk=false,bk=false;
  Object.keys(b).forEach(function(s){if(b[s]==='K')wk=true;if(b[s]==='k')bk=true});
  return wk&&bk&&Object.keys(b).length>2;
}
function getSamSide(){
  var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');
  if(!el)return'w';
  return(el.hasAttribute('flipped')||el.classList.contains('flipped'))?'b':'w';
}
function isLiveGame(){
  var url=window.location.href;
  if(url.indexOf('chess.com/game/live')===-1&&url.indexOf('chess.com/play')===-1)return false;
  var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');
  if(!el)return false;
  var game=el.game||el._component||el.__vue__||el._instance;
  if(game){
    if(game.isGameOver&&game.isGameOver())return false;
    if(game.gameOver===true)return false;
    if(game.isFinished===true)return false;
  }
  return true;
}
function clrArr(){if(arrowSVG){arrowSVG.remove();arrowSVG=null}}
function drawArrows(moves,side,board){
  clrArr();
  if(!moves)return;
  var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');if(!el)return;
  var rect=el.getBoundingClientRect();if(rect.width<100)return;
  var sqSz=rect.width/8;
  var flip=el.hasAttribute('flipped')||el.classList.contains('flipped')||(side==='b');
  var pX=window.pageXOffset,pY=window.pageYOffset;
  function sqCenter(sqStr){
    var f=FL.indexOf(sqStr[0]),r=parseInt(sqStr[1])-1;
    var col=flip?7-f:f,row=flip?r:7-r;
    return[rect.left+pX+col*sqSz+sqSz/2,rect.top+pY+row*sqSz+sqSz/2];
  }
  var bL=rect.left+pX,bT=rect.top+pY;
  var svg=d.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.cssText='position:absolute;left:'+bL+'px;top:'+bT+'px;width:'+rect.width+'px;height:'+rect.height+'px;pointer-events:none;z-index:2147483645;overflow:visible';
  var defs=d.createElementNS('http://www.w3.org/2000/svg','defs');
  var arr=[
    {key:'brilliant',m:moves.brilliant,c1:'#0044FF',c2:'#00DDFF'},
    {key:'good',     m:moves.good,     c1:'#55AA00',c2:'#AAFF00'},
    {key:'worst',    m:moves.worst,    c1:'#CC1A10',c2:'#FF6B52'}
  ];
  arr.forEach(function(a,i){
    if(!opts[a.key])return;
    if(!a.m||a.m.length<4)return;
    var fromSq=a.m.slice(0,2);
    var toSq=isCastle(a.m)?(a.m==='e1g1'?'g1':a.m==='e1c1'?'c1':a.m==='e8g8'?'g8':'c8'):a.m.slice(2,4);
    var p1=sqCenter(fromSq),p2=sqCenter(toSq);
    var x1=p1[0]-bL,y1=p1[1]-bT,x2=p2[0]-bL,y2=p2[1]-bT;
    var dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy)||1;
    var perp=len*0.18;
    var cpx=(x1+x2)/2-(dy/len)*perp;
    var cpy=(y1+y2)/2+(dx/len)*perp;
    var tdx=x2-cpx,tdy=y2-cpy,tlen=Math.sqrt(tdx*tdx+tdy*tdy)||1;
    var shrink=sqSz*0.28;
    var ex=x2-(tdx/tlen)*shrink,ey=y2-(tdy/tlen)*shrink;
    var gid='ag'+i,fid='af'+i,mid='am'+i;
    var grad=d.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    grad.setAttribute('id',gid);grad.setAttribute('gradientUnits','userSpaceOnUse');
    grad.setAttribute('x1',x1);grad.setAttribute('y1',y1);
    grad.setAttribute('x2',x2);grad.setAttribute('y2',y2);
    var s1=d.createElementNS('http://www.w3.org/2000/svg','stop');
    s1.setAttribute('offset','0%');s1.setAttribute('stop-color',a.c1);
    var s2=d.createElementNS('http://www.w3.org/2000/svg','stop');
    s2.setAttribute('offset','100%');s2.setAttribute('stop-color',a.c2);
    grad.appendChild(s1);grad.appendChild(s2);defs.appendChild(grad);
    var filt=d.createElementNS('http://www.w3.org/2000/svg','filter');
    filt.setAttribute('id',fid);filt.setAttribute('x','-50%');filt.setAttribute('y','-50%');
    filt.setAttribute('width','200%');filt.setAttribute('height','200%');
    var blur=d.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
    blur.setAttribute('stdDeviation','2.5');blur.setAttribute('result','coloredBlur');
    var merge=d.createElementNS('http://www.w3.org/2000/svg','feMerge');
    var mn1=d.createElementNS('http://www.w3.org/2000/svg','feMergeNode');mn1.setAttribute('in','coloredBlur');
    var mn2=d.createElementNS('http://www.w3.org/2000/svg','feMergeNode');mn2.setAttribute('in','SourceGraphic');
    merge.appendChild(mn1);merge.appendChild(mn2);
    filt.appendChild(blur);filt.appendChild(merge);defs.appendChild(filt);
    var mk=d.createElementNS('http://www.w3.org/2000/svg','marker');
    mk.setAttribute('id',mid);mk.setAttribute('markerWidth','6');mk.setAttribute('markerHeight','6');
    mk.setAttribute('refX','5');mk.setAttribute('refY','3');mk.setAttribute('orient','auto');
    var poly=d.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points','0 0,6 3,0 6');poly.setAttribute('fill',a.c2);
    mk.appendChild(poly);defs.appendChild(mk);
    var path=d.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M'+x1+','+y1+' Q'+cpx+','+cpy+' '+ex+','+ey);
    path.setAttribute('stroke','url(#'+gid+')');
    path.setAttribute('stroke-width','5');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('opacity','0.85');
    path.setAttribute('filter','url(#'+fid+')');
    path.setAttribute('marker-end','url(#'+mid+')');
    svg.appendChild(path);
    var circ=d.createElementNS('http://www.w3.org/2000/svg','circle');
    circ.setAttribute('cx',x2);circ.setAttribute('cy',y2);
    circ.setAttribute('r',sqSz*0.32);
    circ.setAttribute('fill','none');
    circ.setAttribute('stroke',a.c2);
    circ.setAttribute('stroke-width','3');
    circ.setAttribute('opacity','0.75');
    circ.setAttribute('filter','url(#'+fid+')');
    svg.appendChild(circ);
    var dot=d.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx',x2);dot.setAttribute('cy',y2);
    dot.setAttribute('r',sqSz*0.1);
    dot.setAttribute('fill',a.c2);
    dot.setAttribute('opacity','0.6');
    svg.appendChild(dot);
  });
  svg.appendChild(defs);
  d.body.appendChild(svg);
  arrowSVG=svg;
}
window.addEventListener('scroll',function(){
  if(lastMoves&&lastActive)drawArrows(lastMoves,lastSide,lastBoard);
},{passive:true});

function set(t){var el=d.getElementById('_als');if(el)el.textContent=t}
function show(id,v){var el=d.getElementById(id);if(el)el.textContent=v||'—'}

function tick(){
  if(!isLiveGame()){
    if(lastActive){clrArr();show('_b');show('_g');show('_w');set('Not a live game')}
    lastActive=false;return;
  }
  var fen=getFEN();
  if(!fen||!isGameActive(fen)){
    if(lastActive){clrArr();show('_b');show('_g');show('_w');set('Waiting...')}
    lastActive=false;return;
  }
  lastActive=true;
  var parsed=parseFEN(fen);
  var samSide=getSamSide();
  if(parsed.side!==samSide){
    clrArr();show('_b','—');show('_g','—');show('_w','—');
    set('Opponent thinking…');lastFEN='';return;
  }
  if(fen===lastFEN)return;
  lastFEN=fen;set('Analyzing…');
  setTimeout(function(){
    try{
      var res=bestMoves(parsed.board,parsed.side);
      lastMoves=res;lastSide=parsed.side;lastBoard=parsed.board;
      show('_b',label(res.brilliant,parsed.board));
      show('_g',label(res.good,parsed.board));
      show('_w',label(res.worst,parsed.board));
      drawArrows(res,parsed.side,parsed.board);
      set('Live — ready ('+NODES+' nodes)');
    }catch(e){set('Err: '+e.message)}
  },10);
}

buildPanel();
if(window._alTick)clearInterval(window._alTick);
window._alTick=setInterval(tick,1200);
tick();setTimeout(tick,600);setTimeout(tick,2000);
})();
