(function(){
if(document.getElementById('_al'))return;
var d=document;
var ss=d.createElement('style');
ss.textContent=`
#_al{position:fixed!important;top:50%!important;right:6px!important;transform:translateY(-50%)!important;
z-index:2147483647!important;width:152px;background:rgba(10,10,14,.96);
border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:12px 10px 10px;
font-family:-apple-system,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.85);
color:#fff;touch-action:none;user-select:none}
#_alh{font-size:9px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;
text-align:center;margin-bottom:10px;background:linear-gradient(90deg,#00C6FF,#34C759);
-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
._alr{display:flex;align-items:center;gap:7px;padding:7px 8px;border-radius:10px;margin-bottom:5px}
._alrb{background:rgba(0,180,255,.12);border:1px solid rgba(0,180,255,.3)}
._alrg{background:rgba(160,210,0,.1);border:1px solid rgba(160,210,0,.3)}
._alrw{background:rgba(255,59,48,.12);border:1px solid rgba(255,59,48,.3)}
._ald{width:7px;height:7px;border-radius:50%;flex-shrink:0}
._alrb ._ald{background:#00B4FF}._alrg ._ald{background:#AADD00}._alrw ._ald{background:#FF3B30}
._all{font-size:7px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;margin-bottom:2px}
._alrb ._all{color:rgba(0,180,255,.85)}._alrg ._all{color:rgba(160,210,0,.85)}._alrw ._all{color:rgba(255,59,48,.85)}
._alv{font-size:11px;font-weight:900;font-family:monospace;letter-spacing:.5px;color:#fff;line-height:1.3}
#_als{font-size:8px;color:rgba(255,255,255,.35);text-align:center;margin-top:6px}
#_alx{position:absolute;top:8px;right:9px;background:none;border:none;
color:rgba(255,255,255,.35);font-size:13px;cursor:pointer;line-height:1}
`;
d.head.appendChild(ss);

var p=d.createElement('div');p.id='_al';
p.innerHTML=`<button id="_alx">✕</button>
<div id="_alh">♟ @avoidleaks</div>
<div class="_alr _alrb"><div class="_ald"></div><div><div class="_all">Brilliant</div><div class="_alv" id="_b">—</div></div></div>
<div class="_alr _alrg"><div class="_ald"></div><div><div class="_all">Good</div><div class="_alv" id="_g">—</div></div></div>
<div class="_alr _alrw"><div class="_ald"></div><div><div class="_all">Worst</div><div class="_alv" id="_w">—</div></div></div>
<div id="_als">Connecting...</div>`;
d.documentElement.appendChild(p);
d.getElementById('_alx').onclick=function(){p.remove();clrArr()};

/* ── DRAG — both axes, persists across multiple drags ── */
var drag=false,curX=null,curY=null,sx=0,sy=0;
p.addEventListener('touchstart',function(e){
  if(e.target.id==='_alx')return;
  e.preventDefault();
  drag=true;
  // first drag: read from fixed position, convert to page coords
  if(curX===null){
    var r=p.getBoundingClientRect();
    curX=r.left+window.pageXOffset;
    curY=r.top+window.pageYOffset;
    p.style.position='absolute';
    p.style.right='auto';
    p.style.bottom='auto';
    p.style.transform='none';
  }
  // anchor start touch
  sx=e.touches[0].clientX;
  sy=e.touches[0].clientY;
  p.style.left=curX+'px';
  p.style.top=curY+'px';
},{passive:false});
d.addEventListener('touchmove',function(e){
  if(!drag)return;
  e.preventDefault();
  var dx=e.touches[0].clientX-sx;
  var dy=e.touches[0].clientY-sy;
  p.style.left=(curX+dx)+'px';
  p.style.top=(curY+dy)+'px';
},{passive:false});
d.addEventListener('touchend',function(e){
  if(!drag)return;
  drag=false;
  // persist final position so next touchstart anchors correctly
  var r=p.getBoundingClientRect();
  curX=r.left+window.pageXOffset;
  curY=r.top+window.pageYOffset;
},{passive:true});

/* ── LIVE GAME DETECTION ── */
function isLiveGame(){
  // bail on game review/analysis pages
  var url=window.location.href;
  if(url.indexOf('/game/')>-1&&url.indexOf('/live')===-1)return false;
  if(url.indexOf('/analysis')>-1)return false;
  if(url.indexOf('/review')>-1)return false;
  // DOM signals: review coach bubble, move navigator arrows
  if(d.querySelector('.review-coach-bubble'))return false;
  if(d.querySelector('.move-list-buttons'))return false;
  if(d.querySelector('[data-cy="move-list-backward"]'))return false;
  // the bottom nav prev/next move buttons appear in review but not live
  if(d.querySelector('.game-review-controller'))return false;
  return true;
}

/* ── CHESS ENGINE (unchanged) ── */
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
function inCheck(board,s){var ks=kingSquare(board,s);if(!ks)return false;return isAttacked(board,ks,s==='w'?'b':'w')}
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
        if(!board[fwd]){moves.push(from+fwd);var sr=s==='w'?2:7;if(r===sr){var d2=sq(f,r+2*dir);if(!board[d2])moves.push(from+d2)}}
        [-1,1].forEach(function(df){var cf=f+df;if(cf>=0&&cf<8){var cap=sq(cf,nr);if(board[cap]&&(s==='w'?!isW(board[cap]):isW(board[cap])))moves.push(from+cap)}});
      }
    }
    if(t==='n')[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(dd){
      var nf=f+dd[0],nr2=r+dd[1];
      if(nf>=0&&nf<8&&nr2>=1&&nr2<=8){var to=sq(nf,nr2);if(!(board[to]&&(s==='w'?isW(board[to]):!isW(board[to]))))moves.push(from+to)}
    });
    var rays=t==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:t==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:t==='q'?[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]:[];
    rays.forEach(function(ray){
      var cf=f+ray[0],cr=r+ray[1];
      while(cf>=0&&cf<8&&cr>=1&&cr<=8){
        var to=sq(cf,cr);
        if(board[to]){if(!(s==='w'?isW(board[to]):!isW(board[to])))moves.push(from+to);return}
        moves.push(from+to);cf+=ray[0];cr+=ray[1];
      }
    });
    if(t==='k')[[ 1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(dd){
      var nf=f+dd[0],nr3=r+dd[1];
      if(nf>=0&&nf<8&&nr3>=1&&nr3<=8){var to=sq(nf,nr3);if(!(board[to]&&(s==='w'?isW(board[to]):!isW(board[to]))))moves.push(from+to)}
    });
  });
  return moves;
}
function legalMoves(board,s){return pseudoMoves(board,s).filter(function(mv){return!inCheck(applyMove(board,mv),s)})}
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
function orderMoves(board,moves){return moves.slice().sort(function(a,b){return mvvLva(board,b)-mvvLva(board,a)})}
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
  return{brilliant:scored[0].mv,good:scored[Math.min(Math.floor(n*0.3),n-1)].mv,worst:scored[n-1].mv};
}
function label(mv,board){if(!mv)return'—';return(SYM[board[mv.slice(0,2)]]||'')+mv.slice(0,2)+'→'+mv.slice(2,4)}
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
  for(var ri=0;ri<8;ri++){var fi=0;for(var ci=0;ci<rows[ri].length;ci++){var ch=rows[ri][ci];if(isNaN(ch)){board[FL[fi]+(8-ri)]=ch;fi++}else fi+=parseInt(ch)}}
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

/* ── ARROWS ── */
var arrowSVG=null;
function clrArr(){if(arrowSVG){arrowSVG.remove();arrowSVG=null}}
function drawArrows(moves,side,board){
  clrArr();
  var el=d.querySelector('chess-board')||d.querySelector('wc-chess-board');if(!el)return;
  var rect=el.getBoundingClientRect();if(rect.width<100)return;
  var sqSz=rect.width/8,flip=el.hasAttribute('flipped')||el.classList.contains('flipped')||(side==='b');
  var pX=window.pageXOffset,pY=window.pageYOffset;
  function xy(s){var f=FL.indexOf(s[0]),r=parseInt(s[1])-1,col=flip?7-f:f,row=flip?r:7-r;return[rect.left+pX+col*sqSz+sqSz/2,rect.top+pY+row*sqSz+sqSz/2]}
  var bL=rect.left+pX,bT=rect.top+pY;
  var svg=d.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.cssText='position:absolute;left:'+bL+'px;top:'+bT+'px;width:'+rect.width+'px;height:'+rect.height+'px;pointer-events:none;z-index:2147483645;overflow:hidden';
  var defs=d.createElementNS('http://www.w3.org/2000/svg','defs');
  [{m:moves.brilliant,c1:'#0055FF',c2:'#00CFFF'},{m:moves.good,c1:'#88BB00',c2:'#CCFF33'},{m:moves.worst,c1:'#CC1A10',c2:'#FF5A52'}].forEach(function(a,i){
    if(!a.m||a.m.length<4)return;
    var p1=xy(a.m.slice(0,2)),p2=xy(a.m.slice(2,4));
    var x1=p1[0]-bL,y1=p1[1]-bT,x2=p2[0]-bL,y2=p2[1]-bT;
    var gid='ag'+i,mid='am'+i;
    var g=d.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    g.setAttribute('id',gid);g.setAttribute('gradientUnits','userSpaceOnUse');
    g.setAttribute('x1',x1);g.setAttribute('y1',y1);g.setAttribute('x2',x2);g.setAttribute('y2',y2);
    var s1=d.createElementNS('http://www.w3.org/2000/svg','stop');s1.setAttribute('offset','0%');s1.setAttribute('stop-color',a.c1);
    var s2=d.createElementNS('http://www.w3.org/2000/svg','stop');s2.setAttribute('offset','100%');s2.setAttribute('stop-color',a.c2);
    g.appendChild(s1);g.appendChild(s2);defs.appendChild(g);
    var mk=d.createElementNS('http://www.w3.org/2000/svg','marker');
    mk.setAttribute('id',mid);mk.setAttribute('markerWidth','4');mk.setAttribute('markerHeight','4');
    mk.setAttribute('refX','3.5');mk.setAttribute('refY','2');mk.setAttribute('orient','auto');
    var poly=d.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points','0 0,4 2,0 4');poly.setAttribute('fill',a.c2);poly.setAttribute('opacity','0.7');
    mk.appendChild(poly);defs.appendChild(mk);
    var ln=d.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('x1',x1);ln.setAttribute('y1',y1);ln.setAttribute('x2',x2);ln.setAttribute('y2',y2);
    ln.setAttribute('stroke','url(#'+gid+')');ln.setAttribute('stroke-width','3');
    ln.setAttribute('stroke-opacity','0.5');ln.setAttribute('stroke-linecap','round');
    ln.setAttribute('marker-end','url(#'+mid+')');
    svg.appendChild(ln);
  });
  svg.appendChild(defs);d.body.appendChild(svg);arrowSVG=svg;
}
window.addEventListener('scroll',function(){if(lastMoves&&lastActive)drawArrows(lastMoves,lastSide,lastBoard)},{passive:true});

/* ── TICK ── */
var lastFEN='',lastMoves=null,lastSide='w',lastBoard={},lastActive=false;
function set(t){var el=d.getElementById('_als');if(el)el.textContent=t}
function show(id,v){var el=d.getElementById(id);if(el)el.textContent=v||'—'}
function tick(){
  // kill on review/analysis pages
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
    set('Opponent thinking…');
    lastFEN='';return;
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
setInterval(tick,1200);tick();setTimeout(tick,600);setTimeout(tick,2000);
})();
