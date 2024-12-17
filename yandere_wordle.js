let characters=[],targetCharacter=null,guessCount=0;const MAX_GUESSES=10;function seededRandom(e){let t=1e4*Math.sin(e++);return t-Math.floor(t)}function getDailySeed(){let e=new Date;return 1e4*e.getFullYear()+(e.getMonth()+1)*100+e.getDate()}function getDailyCharacter(e){let t=getDailySeed(),a=Math.floor(seededRandom(t)*e.length);return e[a]}async function preloadImages(e){let t=e.map(e=>new Promise((t,a)=>{let r=new Image;r.onload=()=>t(),r.onerror=()=>{console.warn(`Failed to load image for ${e.name}`),t()},r.src=e.imageUrl}));await Promise.all(t)}function updateCountdown(){let e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1),a=t-e;document.getElementById("countdown").textContent=`${Math.floor(a/36e5)}h ${Math.floor(a%36e5/6e4)}m ${Math.floor(a%6e4/1e3)}s`}function resetGame(){document.getElementById("mode-selection").style.display="flex",document.getElementById("timer").style.display="block",document.getElementById("game-area").style.display="none",guessesDiv.innerHTML="",guessCount=0}async function startGame(e){document.getElementById("mode-selection").style.display="none",document.getElementById("timer").style.display="none",document.getElementById("game-area").style.display="block","free"===e?await initializeGame(!0):await initializeGame(!1)}async function initializeGame(e=!1){try{let t=await fetch("yandere_characters.json");if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let a=await t.json();characters=a.characters.map(e=>({name:e.name,gender:e.gender,class:e.class,club:e.club,persona:e.persona,crush:e.crush,overallReputation:e.reputation.overall||0,liked:e.reputation.liked||0,respected:e.reputation.respected||0,feared:e.reputation.feared||0,strength:e.strength,appears:e.appears,imageUrl:e.imageUrl.split("/revision")[0]})),targetCharacter=e?characters[Math.floor(Math.random()*characters.length)]:getDailyCharacter(characters),console.log("Game initialized with",characters.length,"characters"),await preloadImages(characters),console.log("All character images preloaded")}catch(r){console.error("Error loading character data:",r),alert("Error loading character data. Please refresh the page.")}}window.debugNewGame=function(){if(!characters||0===characters.length){console.error("Game not initialized yet!");return}let e=Math.floor(Math.random()*characters.length);return targetCharacter=characters[e],guessCount=0,guessesDiv.innerHTML="",console.log("Debug: New game started with random character"),"New game started! Make your guesses..."},setInterval(updateCountdown,1e3),updateCountdown(),console.log("Parsed characters:",characters),console.log("Debug command available: debugNewGame()");const guessInput=document.getElementById("guessInput"),characterList=document.getElementById("characterList"),guessesDiv=document.getElementById("guesses");function compareAttributes(e,t){let a=[],r=["overallReputation","liked","respected","feared"];for(let[s,n]of Object.entries(e)){if("name"===s)continue;let l;if(r.includes(s)){let i=Math.abs(parseFloat(n)-parseFloat(t[s]));l=0===i?"match":i<=25?"close":"no-match"}else l=n===t[s]?"match":"no-match";a.push({attribute:s,value:n,status:l})}return a}function revealTargetCharacter(){let e=document.createElement("div");e.className="guess";let t=document.createElement("button");t.textContent="Try Free Play Mode",t.onclick=debugNewGame,t.style.marginTop="20px";let a=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase()),r=Object.entries(targetCharacter).filter(([e])=>"imageUrl"!==e&&"name"!==e).map(([e,t])=>`
            <div class="attribute">
                <span>${a(e)}: ${t}</span>
            </div>
        `).join("");e.innerHTML=`
        <div class="guess-header">
            <h3>Game Over! The character was:</h3>
            <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image">
            <h3>${targetCharacter.name}</h3>
        </div>
        <div class="attributes-container">
            ${r}
        </div>
        <p style="margin-top: 15px;">Want to keep playing? Try Free Play Mode!</p>
    `,e.appendChild(t),guessesDiv.insertBefore(e,guessesDiv.firstChild)}function createGuessElement(e,t){let a=document.createElement("div");a.className="guess";let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());return a.innerHTML=`
        <div class="guess-header">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container">
            ${t.map(e=>"imageUrl"!==e.attribute?`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${r(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `:"").join("")}
        </div>
    `,a}function createConfetti(e){let t=["#ff1493","#00ff9d","#ffb700","#ff69b4","#ffffff"],a=e.getBoundingClientRect(),r=a.left+a.width/2,s=a.top+a.height/2;for(let n=0;n<50;n++){let l=document.createElement("div");l.className="confetti",l.style.left=`${r}px`,l.style.top=`${s}px`;let i=360*Math.random()*(Math.PI/180),c=100+200*Math.random(),o=Math.cos(i)*c,d=Math.sin(i)*c,u=720*Math.random()-360;l.style.backgroundColor=t[Math.floor(Math.random()*t.length)],l.style.setProperty("--tx",`${o}px`),l.style.setProperty("--ty",`${d}px`),l.style.setProperty("--r",`${u}deg`),l.style.animation=`confettiExplode ${1+Math.random()}s ease-out`,l.style.animationDelay=.2*Math.random()+"s",document.body.appendChild(l),setTimeout(()=>l.remove(),2e3)}}function displayGuessResults(e,t){let a=document.createElement("div");a.className="guess",e.name===targetCharacter.name&&a.classList.add("correct");let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());a.innerHTML=`
        <div class="guess-header">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container">
            ${t.map(e=>"imageUrl"!==e.attribute?`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${r(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `:"").join("")}
        </div>
    `,guessesDiv.insertBefore(a,guessesDiv.firstChild),e.name===targetCharacter.name?(createConfetti(a),setTimeout(()=>{alert("Congratulations! You found the correct character!"),confirm("Would you like to play again?")&&location.reload()},1e3)):guessCount>=10&&revealTargetCharacter()}function makeGuess(){if(!targetCharacter||0===characters.length){alert("Please wait for the game to finish loading...");return}let e=guessInput.value.trim(),t=characters.find(t=>t.name.toLowerCase()===e.toLowerCase());if(!t){console.log("Attempted guess:",e),console.log("Available characters:",characters.map(e=>e.name)),alert("Character not found! Please select a character from the dropdown list.");return}guessCount++;let a=compareAttributes(t,targetCharacter);displayGuessResults(t,a),guessInput.value="",characterList.style.display="none"}function selectCharacter(e){guessInput.value=e,characterList.style.display="none"}guessInput.addEventListener("input",()=>{let e=guessInput.value.toLowerCase();if(!e){characterList.style.display="none";return}let t=characters.filter(t=>t.name.toLowerCase().includes(e)).slice(0,5);t.length?(characterList.innerHTML=t.map(e=>`
                <div class="character-option" onclick="selectCharacter('${e.name}')">
                    <img src="${e.imageUrl}" alt="${e.name}" onerror="this.src='https://yanderesimulator.com/img/favicon.png'">
                    <div class="character-info">
                        <div class="character-name">${e.name}</div>
                    </div>
                </div>
            `).join(""),characterList.style.display="block"):characterList.style.display="none"}),guessInput.addEventListener("keypress",e=>{"Enter"===e.key&&makeGuess()});