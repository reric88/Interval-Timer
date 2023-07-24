const minBpmVal = document.querySelector("#min-bpm-value");
const minBpmUp = document.querySelector("#min-bpm-increase");
const minBpmDown = document.querySelector("#min-bpm-decrease");
const maxBpmVal = document.querySelector("#max-bpm-value");
const maxBpmUp = document.querySelector("#max-bpm-increase");
const maxBpmDown = document.querySelector("#max-bpm-decrease");
const intervalLock = document.querySelector("#interval-lock");

const minIntervalVal = document.querySelector("#min-interval-value");
const minIntervalUp = document.querySelector("#min-interval-increase");
const minIntervalDown = document.querySelector("#min-interval-decrease");
const maxIntervalVal = document.querySelector("#max-interval-value");
const maxIntervalUp = document.querySelector("#max-interval-increase");
const maxIntervalDown = document.querySelector("#max-interval-decrease");

const minRestVal = document.querySelector("#min-rest-value");
const minRestUp = document.querySelector("#min-rest-increase");
const minRestDown = document.querySelector("#min-rest-decrease");
const maxRestVal = document.querySelector("#max-rest-value");
const maxRestUp = document.querySelector("#max-rest-increase");
const maxRestDown = document.querySelector("#max-rest-decrease");

const intervalToggle = document.querySelector("#interval-toggle");
const bpmToggle = document.querySelector("#bpm-toggle");
const restToggle = document.querySelector("#rest-toggle");
const toggles = document.querySelectorAll(".track");

const getHelp = document.querySelector('.get-help')
const helpMenu = document.querySelector('.help')
const helpOK = document.querySelector('.ok')

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let timerRunning;
let interval = 0;
let bpm = 0;
let rest = 0;
let resting = false;
let intervalId = null;
let bpmID = null;
let woodBlockSound;
let metalBowlSound;
let selectedInterval;
let selectedBPM;
let intervalSwitch = false;
let bpmSwitch = false;
let restSwitch = false;
let isLocked = false;
let restId = null;
let restValue;
let handleRest;
let handleTimer;

function loadSound(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      context.decodeAudioData(request.response, (buffer) => {
        resolve(buffer);
      });
    };

    request.onerror = () => {
      reject(new Error("Error loading audio file"));
    };

    request.send();
  });
}

const context = new (window.AudioContext || window.webkitAudioContext)();

loadSound("sounds/woodBlockB.wav")
  .then((buffer) => {
    woodBlockSound = buffer;
  })
  .catch((error) => {
    console.error(error);
  });

loadSound("sounds/metalBowl.wav")
  .then((buffer) => {
    metalBowlSound = buffer;
  })
  .catch((error) => {
    console.error(error);
  });

let intervalMin = 0;
let intervalMax = 5;
let bpmMin = 30;
let bpmMax = 180;
let restMin = 5;
let restMax = 10;

minIntervalVal.innerHTML = intervalMin;
maxIntervalVal.innerHTML = intervalMax;
minBpmVal.innerHTML = bpmMin;
maxBpmVal.innerHTML = bpmMax;
minRestVal.innerHTML = restMin;
maxRestVal.innerHTML = restMax;

minIntervalDown.addEventListener("click", () => {
  if (!intervalMin <= 0) {
    intervalMin -= 5;
    minIntervalVal.innerHTML = intervalMin;
  }
});
minIntervalUp.addEventListener("click", () => {
  intervalMin += 5;
  minIntervalVal.innerHTML = intervalMin;
  if (intervalMax < intervalMin + 5) {
    intervalMax = intervalMin + 5;
    maxIntervalVal.innerHTML = intervalMax;
  }
});
maxIntervalDown.addEventListener("click", () => {
  if (intervalMax <= intervalMin + 5 && !intervalMin <= 0) {
    intervalMin -= 5;
  }
  if (intervalMax <= 5) {
    intervalMax = 5;
    if (intervalMax <= intervalMin) {
      intervalMin = intervalMax - 5;
    }
  } else {
    intervalMax -= 5;
  }
  maxIntervalVal.innerHTML = intervalMax;
  minIntervalVal.innerHTML = intervalMin;
});
maxIntervalUp.addEventListener("click", () => {
  intervalMax += 5;
  maxIntervalVal.innerHTML = intervalMax;
});

minBpmDown.addEventListener("click", () => {
  if (!bpmMin <= 0) {
    bpmMin -= 10;
    minBpmVal.innerHTML = bpmMin;
  }
});
minBpmUp.addEventListener("click", () => {
  bpmMin += 10;
  minBpmVal.innerHTML = bpmMin;
  if (bpmMax < bpmMin + 10) {
    bpmMax = bpmMin + 10;
    maxBpmVal.innerHTML = bpmMax;
  }
});
maxBpmDown.addEventListener("click", () => {
  if (bpmMax <= bpmMin + 10 && !bpmMin <= 0) {
    bpmMin -= 10;
  }
  if (bpmMax <= 10) {
    bpmMax = 10;
    if (bpmMax <= bpmMin) {
      bpmMin = bpmMax - 10;
    }
  } else {
    bpmMax -= 10;
  }
  maxBpmVal.innerHTML = bpmMax;
  minBpmVal.innerHTML = bpmMin;
});
maxBpmUp.addEventListener("click", () => {
  bpmMax += 10;
  maxBpmVal.innerHTML = bpmMax;
});

minRestDown.addEventListener("click", () => {
  if (!restMin <= 0) {
    restMin -= 5;
    minRestVal.innerHTML = restMin;
  }
});
minRestUp.addEventListener("click", () => {
  restMin += 5;
  minRestVal.innerHTML = restMin;
  if (restMax < restMin + 5) {
    restMax = restMin + 5;
    maxRestVal.innerHTML = restMax;
  }
});
maxRestDown.addEventListener("click", () => {
  if (restMax <= restMin + 5 && !restMin <= 0) {
    restMin -= 5;
  }
  if (restMax <= 5) {
    restMax = 0;
  } else {
    restMax -= 5;
  }
  maxRestVal.innerHTML = restMax;
  minRestVal.innerHTML = restMin;
});
maxRestUp.addEventListener("click", () => {
  restMax += 5;
  maxRestVal.innerHTML = restMax;
});

getHelp.addEventListener('click', ()=>{
    helpMenu.classList.toggle('help-up')
})
helpOK.addEventListener('click', ()=>{
    helpMenu.classList.toggle('help-up')
})


toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("track-on");
    toggle.children[0].classList.toggle("slid");

    if (toggle.parentElement.className === "rest-buttons") {
      if (restSwitch === false) {
        restSwitch = true;
      } else {
        restSwitch = false;
      }
    } else if (
      toggle.parentElement.parentElement.className === "left-buttons"
    ) {
      if (intervalSwitch === false) {
        intervalSwitch = true;
      } else {
        intervalSwitch = false;
      }
    } else if (toggle.parentElement.className === "right-buttons") {
      if (bpmSwitch === false) {
        bpmSwitch = true;
      } else {
        bpmSwitch = false;
      }
    }
  });
});

intervalLock.addEventListener("click", () => {
  if (isLocked === false) {
    intervalLock.innerHTML = '<i class="fa-solid fa-lock"></i>';
    isLocked = true;
  } else {
    intervalLock.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
    isLocked = false;
  }
});

function updateDisplay() {
  document.getElementById("interval-display").textContent = interval;
  document.getElementById("bpm-display").textContent = bpm;
  document.getElementById("rest-display").textContent = rest;
}

function playWoodBlockSound() {
  if (woodBlockSound) {
    const source = context.createBufferSource();
    source.buffer = woodBlockSound;
    source.connect(context.destination);
    source.start(0);
  }
}

function playMetalBowlSound() {
  if (metalBowlSound) {
    const source = context.createBufferSource();
    source.buffer = metalBowlSound;
    source.connect(context.destination);
    source.start(0);
  }
}

let woodBlockIntervalId;

const startTheTimer = () => {
  timerRunning = true;
//   document.querySelectorAll("button").forEach((button) => {
//     button.classList.toggle("fade");
//   });

//   minIntervalDown.disabled = true;
//   minIntervalUp.disabled = true;
//   maxIntervalDown.disabled = true;
//   maxIntervalUp.disabled = true;
//   minBpmDown.disabled = true;
//   minBpmUp.disabled = true;
//   maxBpmDown.disabled = true;
//   maxBpmUp.disabled = true;
//   minRestDown.disabled = true;
//   minRestUp.disabled = true;
//   maxRestDown.disabled = true;
//   maxRestUp.disabled = true;
//   document.getElementById("start-button").disabled = true;
//   document.getElementById("stop-button").disabled = false;

  function startCountdown() {
    if (intervalSwitch) {
      interval = getRandomNumber(intervalMin, intervalMax);
    } else if (!intervalSwitch) {
      interval = intervalMax;
    }
    if (bpmSwitch) {
      bpm = getRandomNumber(bpmMin, bpmMax);
    } else {
      bpm = bpmMax;
    }
    if (restSwitch) {
      rest = getRandomNumber(restMin, restMax);
    } else {
      rest = restMax;
    }
    restValue = rest - 1;
    if (!resting) {
      updateDisplay();
    }
    let intervalCounter = 0;
    let restCounter = 0;


    intervalId = setInterval(() => {
      intervalCounter++;
      if (interval === 0) {
        playMetalBowlSound();
        if (intervalSwitch) {
          interval = getRandomNumber(intervalMin, intervalMax);
        } else if (!intervalSwitch) {
          interval = intervalMax + 1;
        }
        if (bpmSwitch) {
          bpm = getRandomNumber(bpmMin, bpmMax);
        } else {
          bpm = bpmMax;
        }
        clearInterval(woodBlockIntervalId);
        woodBlockIntervalId = setInterval(
          playWoodBlockSound,
          (60 / bpm) * 1000
        );
        resting = true;
      }
      if (!isLocked) {
        interval--;
      }

      if (interval < 0) {
        clearInterval(intervalId);
        clearInterval(woodBlockIntervalId);
        intervalId = null;
        document.getElementById("interval-up").disabled = false;
        document.getElementById("interval-down").disabled = false;
        document.getElementById("bpm-up").disabled = false;
        document.getElementById("bpm-down").disabled = false;
        document.getElementById("start-button").disabled = false;
        document.getElementById("stop-button").disabled = true;
        return;
      }
      if (!resting) {
        updateDisplay();
      }
    }, 1000);
    woodBlockIntervalId = setInterval(playWoodBlockSound, (60 / bpm) * 1000);
  }
  startCountdown();
};

document.getElementById("start-button").addEventListener("click", () => {
    document.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("fade");
  });
toggles.forEach(toggle=>{
    toggle.classList.toggle('fade')
})
  minIntervalDown.disabled = true;
  minIntervalUp.disabled = true;
  maxIntervalDown.disabled = true;
  maxIntervalUp.disabled = true;
  minBpmDown.disabled = true;
  minBpmUp.disabled = true;
  maxBpmDown.disabled = true;
  maxBpmUp.disabled = true;
  minRestDown.disabled = true;
  minRestUp.disabled = true;
  maxRestDown.disabled = true;
  maxRestUp.disabled = true;
  document.getElementById("start-button").disabled = true;
  document.getElementById("stop-button").disabled = false;
  timerRunning = true;
  startTheTimer();

  handleRest = setInterval(() => {
    if (timerRunning === false) {
      restValue = restValue - 1;
      if (restValue < 0) {
        restValue = 0;
      }
      document.getElementById("rest-display").textContent = restValue;
    } else {
      restValue = rest;
    }
    if (resting) {
      clearInterval(intervalId);
      clearInterval(woodBlockIntervalId);
      resting = false;
      timerRunning = false;
      handleTimer = setTimeout(startTheTimer, rest * 1000);
    }
    changeBG();
  }, 1000);
});

const changeBG = () => {
  const body = document.querySelector("html");
  if (!timerRunning) {
    if (restValue > 4) {
      body.className = "red-back";
    } else if (restValue > 0 && restValue < 4) {
      body.className = "yellow-back";
    } else if (restValue === 0 || restValue === rest) {
      body.className = "green-back";
    }
  }
};

document.getElementById("stop-button").addEventListener("click", () => {
  timerRunning = false;
  clearInterval(intervalId);
  clearInterval(woodBlockIntervalId);
  clearInterval(handleRest);
  clearTimeout(handleTimer)
  intervalId = null;
  document.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("fade");
  });
  toggles.forEach(toggle=>{
    toggle.classList.toggle('fade')
})
  minIntervalDown.disabled = false;
  minIntervalUp.disabled = false;
  maxIntervalDown.disabled = false;
  maxIntervalUp.disabled = false;
  minBpmDown.disabled = false;
  minBpmUp.disabled = false;
  maxBpmDown.disabled = false;
  maxBpmUp.disabled = false;
  minRestDown.disabled = false;
  minRestUp.disabled = false;
  maxRestDown.disabled = false;
  maxRestUp.disabled = false;
  document.getElementById("start-button").disabled = false;
  document.getElementById("stop-button").disabled = true;
});
