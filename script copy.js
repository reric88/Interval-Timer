document.getElementById("start-button").addEventListener("click", () => {
  if (intervalId) return;
  document.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("fade");
  });

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

  let intervalId = null;
  let resting = false;
  let restCounter = 0;

  function startCountdown() {
    interval = getRandomNumber(intervalMin, intervalMax);
    bpm = getRandomNumber(bpmMin, bpmMax);
    rest = getRandomNumber(restMin, restMax);
    updateDisplay();

    function countdown() {
      if (!resting) {
        let intervalCounter = 0;

        intervalId = setInterval(() => {
          intervalCounter++;

          if (interval === 0) {
            playMetalBowlSound();
            interval = getRandomNumber(intervalMin, intervalMax);
            bpm = getRandomNumber(bpmMin, bpmMax);
            clearInterval(woodBlockIntervalId);
            woodBlockIntervalId = setInterval(
              playWoodBlockSound,
              (60 / bpm) * 1000
            );
          }
          interval--;

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
          updateDisplay();
        }, 1000);
      } else {
        restCounter = rest;
        const restIntervalId = setInterval(() => {
          restCounter--;

          if (restCounter < 0) {
            clearInterval(restIntervalId);
            resting = false;
            countdown(); // Resume the countdown after the rest period
          }
          // Update the display with restCounter value here if needed
        }, 1000);
      }

      woodBlockIntervalId = setInterval(playWoodBlockSound, (60 / bpm) * 1000);
    }

    startCountdown();
  }

  // Add event listener for the stop-button to clear intervals and reset the state
  document.getElementById("stop-button").addEventListener("click", () => {
    clearInterval(intervalId);
    clearInterval(woodBlockIntervalId);
    intervalId = null;
    resting = false;
    // Re-enable buttons here as needed
  });
});
