// timerWorker.js
let interval;
let elapsedTime = 0;
let isActive = false;
let startTime;
let savedTime = 0;
let clockMode = true; // true for stopwatch, false for timer
let remainingTime = 0;

self.onmessage = (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'START':
      isActive = true;
      clockMode = data.clockMode;
      if (clockMode) {
        // For stopwatch mode
        if (!interval) {
          startTime = performance.now() - savedTime;
          interval = setInterval(() => {
            elapsedTime = performance.now() - startTime;
            postMessage({ elapsed: elapsedTime });
          }, 1000 / 60);
        }
      } else {
        // 타이머 모드
        if (!interval) {
          // 처음 시작하거나 재시작하는 경우, 남은 시간을 설정
          remainingTime = data.startTime ? data.startTime : remainingTime;
          if (!remainingTime) break;
          interval = setInterval(() => {
            remainingTime -= 1000 / 60; // 매 틱마다 감소
            if (remainingTime <= 0) {
              remainingTime = 0;
              postMessage({ over: true });
              clearInterval(interval);
              interval = null;
            }
            postMessage({ elapsed: remainingTime });
          }, 1000 / 60);
        }
      }
      break;
    case 'PAUSE':
      clearInterval(interval);
      interval = null;
      isActive = false;
      // if (clockMode) {
      //   // Save elapsed time for stopwatch
      //   savedTime = performance.now() - startTime;
      // } else {
      //   // Save remaining time for timer
      // }
      savedTime = elapsedTime;
      break;
    case 'RESET':
      clearInterval(interval);
      interval = null;
      elapsedTime = 0;
      savedTime = 0;
      isActive = false;
      postMessage({ elapsed: 0 });
      break;
    default:
      break;
  }
};
