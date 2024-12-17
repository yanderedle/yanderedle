let characters=[],targetCharacter=null,guessCount=0;const MAX_GUESSES=10;function seededRandom(e){let a=1e4*Math.sin(e++);return a-Math.floor(a)}function getDailySeed(){let e=new Date;return 1e4*e.getFullYear()+(e.getMonth()+1)*100+e.getDate()}function getDailyCharacter(e){let a=getDailySeed(),t=Math.floor(seededRandom(a)*e.length);return e[t]}async function preloadImages(e){let a=e.map(e=>new Promise((a,t)=>{let r=new Image;r.onload=()=>a(),r.onerror=()=>{console.warn(`Failed to load image for ${e.name}`),a()},r.src=e.imageUrl}));await Promise.all(a)}async function initializeGame(){try{let e=await fetch("yandere_characters.json");if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let a=await e.json();characters=a.characters.map(e=>({name:e.name,gender:e.gender,class:e.class,club:e.club,persona:e.persona,crush:e.crush,overallReputation:e.reputation.overall||0,liked:e.reputation.liked||0,respected:e.reputation.respected||0,feared:e.reputation.feared||0,strength:e.strength,appears:e.appears,imageUrl:e.imageUrl.split("/revision")[0]})),targetCharacter=getDailyCharacter(characters),console.log("Game initialized with",characters.length,"characters"),await preloadImages(characters),console.log("All character images preloaded")}catch(t){console.error("Error loading character data:",t),alert("Error loading character data. Please refresh the page.")}}window.debugNewGame=function(){if(!characters||0===characters.length){console.error("Game not initialized yet!");return}let e=Math.floor(Math.random()*characters.length);return targetCharacter=characters[e],guessCount=0,guessesDiv.innerHTML="",console.log("Debug: New game started with random character"),"New game started! Make your guesses..."},initializeGame(),console.log("Parsed characters:",characters),console.log("Debug command available: debugNewGame()");const guessInput=document.getElementById("guessInput"),characterList=document.getElementById("characterList"),guessesDiv=document.getElementById("guesses");function compareAttributes(e,a){let t=[],r=["overallReputation","liked","respected","feared"];for(let[s,n]of Object.entries(e)){if("name"===s)continue;let i;if(r.includes(s)){let c=Math.abs(parseFloat(n)-parseFloat(a[s]));i=0===c?"match":c<=25?"close":"no-match"}else i=n===a[s]?"match":"no-match";t.push({attribute:s,value:n,status:i})}return t}function revealTargetCharacter(){let e=document.createElement("div");e.className="guess";let a=document.createElement("button");a.textContent="Try Free Play Mode",a.onclick=debugNewGame,a.style.marginTop="20px";let t=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase()),r=Object.entries(targetCharacter).filter(([e])=>"imageUrl"!==e&&"name"!==e).map(([e,a])=>`
            <div class="attribute">
                <span>${t(e)}: ${a}</span>
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
    `,e.appendChild(a),guessesDiv.insertBefore(e,guessesDiv.firstChild)}function createGuessElement(e,a){let t=document.createElement("div");t.className="guess";let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());return t.innerHTML=`
        <div class="guess-header">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container">
            ${a.map(e=>"imageUrl"!==e.attribute?`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${r(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `:"").join("")}
        </div>
    `,t}function displayGuessResults(e,a){let t=document.createElement("div");t.className="guess";let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());t.innerHTML=`
        <div class="guess-header">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container">
            ${a.map(e=>"imageUrl"!==e.attribute?`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${r(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `:"").join("")}
        </div>
    `,guessesDiv.insertBefore(t,guessesDiv.firstChild),e.name===targetCharacter.name?setTimeout(()=>{alert("Congratulations! You found the correct character!"),confirm("Would you like to play again?")&&location.reload()},100):guessCount>=10&&revealTargetCharacter()}function makeGuess(){if(!targetCharacter||0===characters.length){alert("Please wait for the game to finish loading...");return}let e=guessInput.value.trim(),a=characters.find(a=>a.name.toLowerCase()===e.toLowerCase());if(!a){console.log("Attempted guess:",e),console.log("Available characters:",characters.map(e=>e.name)),alert("Character not found! Please select a character from the dropdown list.");return}guessCount++;let t=compareAttributes(a,targetCharacter);displayGuessResults(a,t),guessInput.value="",characterList.style.display="none"}function selectCharacter(e){guessInput.value=e,characterList.style.display="none"}guessInput.addEventListener("input",()=>{let e=guessInput.value.toLowerCase();if(!e){characterList.style.display="none";return}let a=characters.filter(a=>a.name.toLowerCase().includes(e)).slice(0,5);a.length?(characterList.innerHTML=a.map(e=>`
                <div class="character-option" onclick="selectCharacter('${e.name}')">
                    <img src="${e.imageUrl}" alt="${e.name}" onerror="this.src='https://yanderesimulator.com/img/favicon.png'">
                    <div class="character-info">
                        <div class="character-name">${e.name}</div>
                    </div>
                </div>
            `).join(""),characterList.style.display="block"):characterList.style.display="none"}),guessInput.addEventListener("keypress",e=>{"Enter"===e.key&&makeGuess()});