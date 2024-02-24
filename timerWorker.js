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
        // 스톱워치 모드
        if (!interval) {
          startTime = new Date().getTime() - savedTime;
          interval = setInterval(() => {
            elapsedTime = new Date().getTime() - startTime;
            postMessage({ elapsed: elapsedTime });
          }, 1000 / 60);
        }
      } else {
        // 타이머 모드
        if (!interval) {
          remainingTime = data.startTime ? data.startTime : remainingTime;
          if (!remainingTime) break;
          interval = setInterval(() => {
            remainingTime -= 1000 / 60;
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
