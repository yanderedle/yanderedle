let characters=[],targetCharacter=null,guessCount=0;const MAX_GUESSES=10;function seededRandom(e){let t=1e4*Math.sin(e++);return t-Math.floor(t)}function getDailySeed(){let e=new Date;return 1e4*e.getFullYear()+(e.getMonth()+1)*100+e.getDate()}function getDailyCharacter(e){let t=e.filter(e=>"202X"===e.time),a=getDailySeed(),r=Math.floor(seededRandom(a)*t.length);return t[r]}async function preloadImages(e){let t=e.map(e=>new Promise((t,a)=>{let r=new Image;r.onload=()=>t(),r.onerror=()=>{console.warn(`Failed to load image for ${e.name}`),t()},r.src=e.imageUrl}));await Promise.all(t)}function updateCountdown(){let e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1),a=t-e;document.getElementById("countdown").textContent=`${Math.floor(a/36e5)}h ${Math.floor(a%36e5/6e4)}m ${Math.floor(a%6e4/1e3)}s`}function resetGame(){document.getElementById("mode-selection").style.display="flex",document.getElementById("timer").style.display="block",document.getElementById("game-area").style.display="none",guessesDiv.innerHTML="",guessCount=0}async function startGame(e){try{document.getElementById("mode-selection").style.display="none",document.getElementById("timer").style.display="none",document.getElementById("game-area").style.display="block",guessCount=0,guessesDiv.innerHTML="",guessInput.value="";let t=await initializeGame("free"===e);if(!t||!targetCharacter)throw Error("Game failed to initialize properly")}catch(a){console.error("Error starting game:",a),alert("Error starting game. Please try again."),resetGame()}}let timeFilter202X=!1,timeFilter1980s=!1;function toggleTimeFilter(e){"202X"===e?timeFilter1980s=!(timeFilter202X=!timeFilter202X)&&timeFilter1980s:timeFilter202X=!(timeFilter1980s=!timeFilter1980s)&&timeFilter202X,document.getElementById("filter-202x").checked=timeFilter202X,document.getElementById("filter-1980s").checked=timeFilter1980s}async function initializeGame(e=!1){window.freePlay=e;try{let t=await fetch("yandere_characters.json");if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let a=await t.json(),r=characters=a.characters.map(e=>({name:e.name,gender:e.gender,class:e.class,club:e.club,persona:e.persona,crush:e.crush,overallReputation:e.reputation.overall||0,liked:e.reputation.liked||0,respected:e.reputation.respected||0,feared:e.reputation.feared||0,strength:e.strength,appears:e.appears,time:e.time,imageUrl:e.imageUrl.split("/revision")[0]}));if(e&&(timeFilter202X?r=characters.filter(e=>"202X"===e.time):timeFilter1980s&&(r=characters.filter(e=>"1980s"===e.time))),0===r.length)throw Error("No characters available with current filters");if(!(targetCharacter=e?r[Math.floor(Math.random()*r.length)]:getDailyCharacter(characters)))throw Error("Failed to select target character");return await preloadImages(characters),!0}catch(s){return console.error("Error loading character data:",s),alert("Error loading character data: "+s.message),!1}}window.debugNewGame=function(){if(!characters||0===characters.length){console.error("Game not initialized yet!");return}let e=Math.floor(Math.random()*characters.length);return targetCharacter=characters[e],guessCount=0,guessesDiv.innerHTML="",console.log("Debug: New game started with random character"),"New game started! Make your guesses..."},setInterval(updateCountdown,1e3),updateCountdown();const guessInput=document.getElementById("guessInput"),characterList=document.getElementById("characterList"),guessesDiv=document.getElementById("guesses");function compareAttributes(e,t){let a=[],r=["overallReputation","liked","respected","feared"];for(let[s,i]of Object.entries(e)){if("name"===s)continue;let l;if(r.includes(s)){let n=Math.abs(parseFloat(i)-parseFloat(t[s]));l=0===n?"match":n<=25?"close":"no-match"}else l=i===t[s]?"match":"no-match";a.push({attribute:s,value:i,status:l})}return a}function revealTargetCharacter(){let e=document.createElement("div");e.className="guess";let t=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase()),a=Object.entries(targetCharacter).filter(([e])=>"imageUrl"!==e&&"name"!==e).map(([e,a])=>`
            <div class="attribute">
                <span>${t(e)}: ${a}</span>
            </div>
        `).join("");if(window.freePlay){let r=document.createElement("button");r.textContent="Play Again",r.onclick=()=>{startGame("free")},r.style.marginTop="20px",e.innerHTML=`
            <div class="guess-header">
                <h3>Game Over! The character was:</h3>
                <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image">
                <h3>${targetCharacter.name}</h3>
            </div>
            <div class="attributes-container">
                ${a}
            </div>
        `,e.appendChild(r)}else{let s=document.createElement("button");s.textContent="Try Free Play Mode",s.onclick=()=>startGame("free"),s.style.marginTop="20px",e.innerHTML=`
            <div class="guess-header">
                <h3>Game Over! The character was:</h3>
                <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image">
                <h3>${targetCharacter.name}</h3>
            </div>
            <div class="attributes-container">
                ${a}
            </div>
            <p style="margin-top: 15px;">Want to keep playing? Try Free Play Mode!</p>
        `,e.appendChild(s)}guessesDiv.insertBefore(e,guessesDiv.firstChild)}function createGuessElement(e,t){let a=document.createElement("div");a.className="guess";let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());return a.innerHTML=`
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
    `,a}function createConfetti(e){let t=["#ff1493","#00ff9d","#ffb700","#ff69b4","#ffffff"],a=e.getBoundingClientRect(),r=a.left+a.width/2,s=a.top+a.height/2;for(let i=0;i<50;i++){let l=document.createElement("div");l.className="confetti",l.style.left=`${r}px`,l.style.top=`${s}px`;let n=360*Math.random()*(Math.PI/180),o=100+200*Math.random(),c=Math.cos(n)*o,d=Math.sin(n)*o,m=720*Math.random()-360;l.style.backgroundColor=t[Math.floor(Math.random()*t.length)],l.style.setProperty("--tx",`${c}px`),l.style.setProperty("--ty",`${d}px`),l.style.setProperty("--r",`${m}deg`),l.style.animation=`confettiExplode ${1+Math.random()}s ease-out`,l.style.animationDelay=.2*Math.random()+"s",document.body.appendChild(l),setTimeout(()=>l.remove(),2e3)}}function displayGuessResults(e,t,a){let r=document.createElement("div");r.className="guess",e.name===targetCharacter.name&&r.classList.add("correct");let s=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());r.innerHTML=`
        <div class="guess-header">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container">
            ${t.map(e=>"imageUrl"===e.attribute||"time"===e.attribute&&(timeFilter202X||timeFilter1980s)||"time"===e.attribute&&!a?"":`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${s(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `).join("")}
        </div>
    `,guessesDiv.insertBefore(r,guessesDiv.firstChild),e.name===targetCharacter.name?(createConfetti(r),setTimeout(()=>{if(a){let e=document.createElement("div");e.className="modal-overlay",e.style.display="flex",e.innerHTML=`
                    <div class="congrats-modal">
                        <h2>Thanks for playing!</h2>
                        <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image" style="margin: 1rem 0">
                        <p style="margin: 1.5rem 0">In free play${timeFilter202X?" (202X only)":timeFilter1980s?" (1980s only)":""} mode, it took ${guessCount} ${1===guessCount?"guess":"guesses"} to find <b>${targetCharacter.name}</b>! Thanks for playing Yanderedle!</p>
                        <div class="modal-buttons">
                            <button onclick="startGame('free'); this.closest('.modal-overlay').remove()">Play Again</button>
                            <button onclick="this.closest('.modal-overlay').remove()">Close</button>
                        </div>
                        <div class="modal-footer">yanderedle.github.io</div>
                    </div>
                `,document.body.appendChild(e)}else{let t=document.createElement("div");t.className="modal-overlay",t.style.display="flex",t.innerHTML=`
                    <div class="congrats-modal">
                        <h2>Thanks for playing!</h2>
                        <p style="margin: 1.5rem 0">You completed the daily challenge in ${guessCount} ${1===guessCount?"guess":"guesses"}. Thanks for playing Yanderedle!</p>
                        <div class="modal-buttons">
                            <button onclick="this.closest('.modal-overlay').remove()">Close</button>
                            <button onclick="this.closest('.modal-overlay').remove(); startGame('free')">Free Play</button>
                        </div>
                        <div class="modal-footer">yanderedle.github.io</div>
                    </div>
                `,document.body.appendChild(t)}},1e3)):guessCount>=10&&revealTargetCharacter()}function makeGuess(){if(!targetCharacter||0===characters.length){alert("Please wait for the game to finish loading...");return}let e=guessInput.value.trim(),t=characters.find(t=>t.name.toLowerCase()===e.toLowerCase());if(!t){console.log("Attempted guess:",e),console.log("Available characters:",characters.map(e=>e.name)),alert("Character not found! Please select a character from the dropdown list.");return}guessCount++;let a=compareAttributes(t,targetCharacter);displayGuessResults(t,a,freePlay),guessInput.value="",characterList.style.display="none"}function selectCharacter(e){guessInput.value=e,characterList.style.display="none"}guessInput.addEventListener("input",()=>{let e=guessInput.value.toLowerCase();if(!e){characterList.style.display="none";return}let t=characters.filter(t=>t.name.toLowerCase().includes(e)).slice(0,5);t.length?(characterList.innerHTML=t.map(e=>`
                <div class="character-option" onclick="selectCharacter('${e.name}')">
                    <img src="${e.imageUrl}" alt="${e.name}" onerror="this.src='https://yanderesimulator.com/img/favicon.png'">
                    <div class="character-info">
                        <div class="character-name">${e.name}</div>
                    </div>
                </div>
            `).join(""),characterList.style.display="block"):characterList.style.display="none"}),guessInput.addEventListener("keypress",e=>{"Enter"===e.key&&makeGuess()});