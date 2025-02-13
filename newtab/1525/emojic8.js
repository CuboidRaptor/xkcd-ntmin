(function() {
 
var parentEl = document.getElementById('emoji-ball')
var ballEl = parentEl.getElementsByClassName('ball')[0]
var questionEl = document.getElementById('ball-question')
var answerEl = document.getElementById('ball-answer')
var answerTextEl = answerEl.getElementsByClassName('text')[0]
var answerShadeEl = parentEl.getElementsByClassName('shading')[0]
var permaEl = document.getElementById('emoji-link')
var animTimeout = null

var bunch = ['&#x1F645;', '&#x1F646;', '&#x1F647;', '&#x1F64B;', '&#x1F64C;', '&#x1F64D;', '&#x1F64E;', '&#x1F64F;', '&#x2702;', '&#x2708;', '&#x2709;', '&#x270A;', '&#x270B;', '&#x270C;', '&#x270F;', '&#x2744;', '&#x2764;', '&#x1F680;', '&#x1F683;', '&#x1F684;', '&#x1F685;', '&#x1F687;', '&#x1F689;', '&#x1F68C;', '&#x1F68F;', '&#x1F691;', '&#x1F692;', '&#x1F693;', '&#x1F695;', '&#x1F697;', '&#x1F699;', '&#x1F69A;', '&#x1F6A2;', '&#x1F6A4;', '&#x1F6A5;', '&#x1F6A7;', '&#x1F6A8;', '&#x1F6A9;', '&#x1F6AA;', '&#x1F6AB;', '&#x1F6AC;', '&#x1F6B2;', '&#x1F6B6;', '&#x1F6BD;', '&#x1F6C0;', '&#x231A;', '&#x231B;', '&#x23F0;', '&#x23F3;', '&#x2601;', '&#x260E;', '&#x2614;', '&#x2615;', '&#x2668;', '&#x267B;', '&#x267F;', '&#x2693;', '&#x26A1;', '&#x26BD;', '&#x26BE;', '&#x26C4;', '&#x26C5;', '&#x26EA;', '&#x26F2;', '&#x26F3;', '&#x26F5;', '&#x26FA;', '&#x2B50;', '&#x26FD;', '&#x1F0CF;', '&#x1F300;', '&#x1F301;', '&#x1F302;', '&#x1F303;', '&#x1F304;', '&#x1F305;', '&#x1F306;', '&#x1F307;', '&#x1F308;', '&#x1F309;', '&#x1F30A;', '&#x1F30B;', '&#x1F30F;', '&#x1F319;', '&#x1F31B;', '&#x1F31F;', '&#x1F320;', '&#x1F330;', '&#x1F331;', '&#x1F334;', '&#x1F335;', '&#x1F337;', '&#x1F338;', '&#x1F339;', '&#x1F33A;', '&#x1F33B;', '&#x1F33C;', '&#x1F33D;', '&#x1F33E;', '&#x1F33F;', '&#x1F340;', '&#x1F341;', '&#x1F342;', '&#x1F343;', '&#x1F344;', '&#x1F345;', '&#x1F346;', '&#x1F347;', '&#x1F348;', '&#x1F349;', '&#x1F34A;', '&#x1F34C;', '&#x1F34D;', '&#x1F34E;', '&#x1F34F;', '&#x1F351;', '&#x1F352;', '&#x1F353;', '&#x1F354;', '&#x1F355;', '&#x1F356;', '&#x1F357;', '&#x1F358;', '&#x1F359;', '&#x1F35A;', '&#x1F35B;', '&#x1F35C;', '&#x1F35D;', '&#x1F35E;', '&#x1F35F;', '&#x1F360;', '&#x1F361;', '&#x1F362;', '&#x1F363;', '&#x1F364;', '&#x1F365;', '&#x1F366;', '&#x1F367;', '&#x1F368;', '&#x1F369;', '&#x1F36A;', '&#x1F36B;', '&#x1F36C;', '&#x1F36D;', '&#x1F36E;', '&#x1F36F;', '&#x1F370;', '&#x1F371;', '&#x1F372;', '&#x1F373;', '&#x1F374;', '&#x1F375;', '&#x1F376;', '&#x1F377;', '&#x1F378;', '&#x1F379;', '&#x1F37A;', '&#x1F37B;', '&#x1F380;', '&#x1F381;', '&#x1F382;', '&#x1F383;', '&#x1F384;', '&#x1F385;', '&#x1F386;', '&#x1F387;', '&#x1F388;', '&#x1F389;', '&#x1F38A;', '&#x1F38B;', '&#x1F38C;', '&#x1F38D;', '&#x1F38E;', '&#x1F38F;', '&#x1F390;', '&#x1F391;', '&#x1F392;', '&#x1F393;', '&#x1F3A0;', '&#x1F3A1;', '&#x1F3A2;', '&#x1F3A3;', '&#x1F3A4;', '&#x1F3A5;', '&#x1F3A6;', '&#x1F3A7;', '&#x1F3A8;', '&#x1F3A9;', '&#x1F3AA;', '&#x1F3AB;', '&#x1F3AC;', '&#x1F3AD;', '&#x1F3AE;', '&#x1F3AF;', '&#x1F3B0;', '&#x1F3B1;', '&#x1F3B2;', '&#x1F3B3;', '&#x1F3B4;', '&#x1F3B5;', '&#x1F3B6;', '&#x1F3B7;', '&#x1F3B8;', '&#x1F3B9;', '&#x1F3BA;', '&#x1F3BB;', '&#x1F3BD;', '&#x1F3BE;', '&#x1F3BF;', '&#x1F3C0;', '&#x1F3C1;', '&#x1F3C2;', '&#x1F3C3;', '&#x1F3C4;', '&#x1F3C6;', '&#x1F3C8;', '&#x1F3CA;', '&#x1F3E0;', '&#x1F3E1;', '&#x1F3E2;', '&#x1F3E3;', '&#x1F3E5;', '&#x1F3E6;', '&#x1F3E7;', '&#x1F3E8;', '&#x1F3E9;', '&#x1F3EA;', '&#x1F3EB;', '&#x1F3EC;', '&#x1F3ED;', '&#x1F3EE;', '&#x1F3EF;', '&#x1F3F0;', '&#x1F40C;', '&#x1F40D;', '&#x1F40E;', '&#x1F411;', '&#x1F412;', '&#x1F414;', '&#x1F417;', '&#x1F418;', '&#x1F419;', '&#x1F41A;', '&#x1F41B;', '&#x1F41C;', '&#x1F41D;', '&#x1F41E;', '&#x1F41F;', '&#x1F420;', '&#x1F421;', '&#x1F422;', '&#x1F423;', '&#x1F424;', '&#x1F425;', '&#x1F426;', '&#x1F427;', '&#x1F428;', '&#x1F429;', '&#x1F42B;', '&#x1F42C;', '&#x1F42D;', '&#x1F42E;', '&#x1F42F;', '&#x1F430;', '&#x1F431;', '&#x1F432;', '&#x1F433;', '&#x1F434;', '&#x1F435;', '&#x1F436;', '&#x1F437;', '&#x1F438;', '&#x1F439;', '&#x1F43A;', '&#x1F43B;', '&#x1F43C;', '&#x1F43D;', '&#x1F43E;', '&#x1F440;', '&#x1F442;', '&#x1F443;', '&#x1F444;', '&#x1F445;', '&#x1F446;', '&#x1F447;', '&#x1F448;', '&#x1F449;', '&#x1F44A;', '&#x1F44B;', '&#x1F44C;', '&#x1F44D;', '&#x1F44E;', '&#x1F44F;', '&#x1F450;', '&#x1F451;', '&#x1F452;', '&#x1F453;', '&#x1F454;', '&#x1F455;', '&#x1F456;', '&#x1F457;', '&#x1F458;', '&#x1F459;', '&#x1F45A;', '&#x1F45B;', '&#x1F45C;', '&#x1F45D;', '&#x1F45E;', '&#x1F45F;', '&#x1F460;', '&#x1F461;', '&#x1F462;', '&#x1F463;', '&#x1F464;', '&#x1F466;', '&#x1F467;', '&#x1F468;', '&#x1F469;', '&#x1F46A;', '&#x1F46B;', '&#x1F46E;', '&#x1F46F;', '&#x1F470;', '&#x1F471;', '&#x1F474;', '&#x1F476;', '&#x1F477;', '&#x1F478;', '&#x1F479;', '&#x1F47A;', '&#x1F47B;', '&#x1F47C;', '&#x1F47D;', '&#x1F47E;', '&#x1F47F;', '&#x1F480;', '&#x1F481;', '&#x1F482;', '&#x1F483;', '&#x1F484;', '&#x1F485;', '&#x1F486;', '&#x1F487;', '&#x1F488;', '&#x1F489;', '&#x1F48A;', '&#x1F48B;', '&#x1F48C;', '&#x1F48D;', '&#x1F48E;', '&#x1F48F;', '&#x1F490;', '&#x1F491;', '&#x1F492;', '&#x1F493;', '&#x1F494;', '&#x1F495;', '&#x1F496;', '&#x1F497;', '&#x1F498;', '&#x1F499;', '&#x1F49A;', '&#x1F49B;', '&#x1F49C;', '&#x1F49D;', '&#x1F49E;', '&#x1F49F;', '&#x1F4A0;', '&#x1F4A1;', '&#x1F4A2;', '&#x1F4A3;', '&#x1F4A4;', '&#x1F4A5;', '&#x1F4A6;', '&#x1F4A7;', '&#x1F4A8;', '&#x1F4A9;', '&#x1F4AA;', '&#x1F4AB;', '&#x1F4AC;', '&#x1F4AE;', '&#x1F4AF;', '&#x1F4B0;', '&#x1F4B2;', '&#x1F4B3;', '&#x1F4B5;', '&#x1F4B8;', '&#x1F4BA;', '&#x1F4BB;', '&#x1F4BC;', '&#x1F4BD;', '&#x1F4BE;', '&#x1F4BF;', '&#x1F4C0;', '&#x1F4C3;', '&#x1F4C5;', '&#x1F4C6;', '&#x1F4C8;', '&#x1F4C9;', '&#x1F4CC;', '&#x1F4CD;', '&#x1F4CE;', '&#x1F4D3;', '&#x1F4D4;', '&#x1F4D5;', '&#x1F4D6;', '&#x1F4DE;', '&#x1F4DF;', '&#x1F4E0;', '&#x1F4E1;', '&#x1F4E3;', '&#x1F4E6;', '&#x1F4E7;', '&#x1F4EB;', '&#x1F4F0;', '&#x1F4F1;', '&#x1F4F7;', '&#x1F4F9;', '&#x1F4FA;', '&#x1F4FB;', '&#x1F4FC;', '&#x1F50A;', '&#x1F50B;', '&#x1F50C;', '&#x1F50E;', '&#x1F510;', '&#x1F511;', '&#x1F512;', '&#x1F513;', '&#x1F514;', '&#x1F51C;', '&#x1F525;', '&#x1F526;', '&#x1F527;', '&#x1F528;', '&#x1F529;', '&#x1F52A;', '&#x1F52B;', '&#x1F52E;', '&#x1F5FB;', '&#x1F5FC;', '&#x1F5FD;', '&#x1F5FE;', '&#x1F5FF;', '&#x1F634;', '&#x1F681;', '&#x1F682;', '&#x1F686;', '&#x1F688;', '&#x1F68A;', '&#x1F68D;', '&#x1F68E;', '&#x1F690;', '&#x1F694;', '&#x1F696;', '&#x1F698;', '&#x1F69B;', '&#x1F69C;', '&#x1F69D;', '&#x1F69E;', '&#x1F69F;', '&#x1F6A0;', '&#x1F6A1;', '&#x1F6A3;', '&#x1F6A6;', '&#x1F6AE;', '&#x1F6B5;', '&#x1F6BF;', '&#x1F6C1;', '&#x1F30D;', '&#x1F30E;', '&#x1F31C;', '&#x1F31D;', '&#x1F31E;', '&#x1F332;', '&#x1F333;', '&#x1F34B;', '&#x1F350;', '&#x1F37C;', '&#x1F3C7;', '&#x1F3C9;', '&#x1F3E4;', '&#x1F400;', '&#x1F401;', '&#x1F402;', '&#x1F403;', '&#x1F404;', '&#x1F405;', '&#x1F406;', '&#x1F407;', '&#x1F408;', '&#x1F409;', '&#x1F40A;', '&#x1F40B;', '&#x1F40F;', '&#x1F410;', '&#x1F413;', '&#x1F415;', '&#x1F416;', '&#x1F42A;', '&#x1F46C;', '&#x1F46D;', '&#x1F4EC;', '&#x1F4ED;', '&#x1F4EF;', '&#x1F52C;', '&#x1F52D;']

function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min))
}

function genAnswer() {
  var text = ""
  var chars = []

  var randomStrLength = randInt(1.2, 3.1)
  for (var i = 0; i < randomStrLength; i++) {
    var randomIndex = Math.floor(Math.random() * bunch.length)
    chars.push(bunch[randomIndex])
  }

  return chars
}

function addBr(ans) {
  chars = []
  ans.forEach(function (c) {chars.push(c)})
  
  if (chars.length == 3) {
    chars.splice(1, 0, '<br>')
  }

  return chars.join('')
}

function setAnswer(answer) {
  answerTextEl.innerHTML = addBr(answer)
  answerEl.className = {1: 'one', 2: 'two', 3: 'three'}[answer.length]
  parentEl.className = 'dark'

  if (animTimeout) {
    clearTimeout(animTimeout)
  }
  shake()
}

function change(ev) {
  var answer = genAnswer()
  setAnswer(answer)

  location.hash = window.btoa(JSON.stringify({'q': questionEl.value, 'a': answer}))
  permaEl.innerHTML = ''
  e = document.createElement("a");
  e.href="https://xkcd.com/1525/" + location.hash
  // code patched to copy instead of visiting link for better embed
  e.href = "javascript:void(0)";
  e.onclick = () => {navigator.clipboard.writeText(`https://xkcd.com/1525/${location.hash}`)};
  // </patch>
  e.appendChild(document.createTextNode('permalink'))
  permaEl.appendChild(e)

  ev.preventDefault()
  ev.stopPropagation()
}

//blur, color, location
function shake(count) {
  count = count || 0
  if (count < 3) {
    ballEl.style.transform = 'translate(' + randInt(-10, 10) + 'px, ' + randInt(-10, 10) + 'px)'
    animTimeout = setTimeout(function() { shake(count + 1) }, 100)
  } else {
    ballEl.style.transform = ''
    answerEl.style.transform = 'translate(' + randInt(-80, 80) + 'px, ' + randInt(-80, 80) + 'px) rotate(' + randInt(0, 360) + 'deg) scale(' + randInt(1, 10) / 10 + ', ' + randInt(1, 10) / 10 + ') skewX(' + randInt(-30, 30) + 'deg)'
    answerShadeEl.style.background = 'linear-gradient(' + randInt(0, 360) + 'deg, black 90%, transparent)'
    animTimeout = setTimeout(reveal, 100)
  }
}

function reveal(count) {
  parentEl.className = ''
  answerShadeEl.style.background = 'linear-gradient(' + randInt(0, 360) + 'deg, black 30%, transparent)'
  answerShadeEl.style.opacity = 0
  answerEl.style.transform = 'translate(0, 0)'
  animTimeout = null
}

function recoverState() {
  try {
    o = JSON.parse(window.atob(location.hash.substr(1)))
    if( (typeof o.q != 'string') ||
        (({}.toString).call(o.a) != '[object Array]') ||
	(o.a.every(function (v) { return bunch.indexOf(v) >= 0 }) == false) ) {
      throw "bad input"
    }
    questionEl.value = o.q
    setAnswer(o.a)
  }
  catch(err) { }
}

recoverState()

parentEl.addEventListener('submit', change, false)
}())
