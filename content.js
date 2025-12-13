
// '[id*="advRsyaReact"]' - поиск примерного id 
// '[class*="AppForecastMoney"]' - поиск примерного класса 
//
// elementsToDelete - эти найденные элементы просто удаляются
//
// elementsToCheck - элементы, которые будут удалены, если внутри них встречаются banWords
// stopWords - если эти слова будут найдены внутри elementsToCheck, то эти элементы не будут удалены

function isDiffInMinutes(date1, date2, n) {
  const diffMs = Math.abs(date1.getTime() - date2.getTime()); // разница в мс
  const diffMinutes = diffMs / (1000 * 60); // в минутах
  return diffMinutes >= n; // true, если прошло хотя бы n минут
}

async function DownloadConfigs() {
  const linkToRules = "https://bodaiot.github.io/MyADSBlock/BlockADSRules.json";

  fetch(linkToRules)
    .then(response => {
      if (!response.ok) {
        throw new Error('Сетевая ошибка');
      }

      response.json().then(data => {
        chrome.storage.local.set({
          "DIEMONIC_ADS_BLOCK_elementsToDelete": JSON.stringify(data.elementsToDelete),
          "DIEMONIC_ADS_BLOCK_elementsToCheck": JSON.stringify(data.elementsToCheck),
          "DIEMONIC_ADS_BLOCK_banWords": JSON.stringify(data.banWords),
          "DIEMONIC_ADS_BLOCK_stopWords": JSON.stringify(data.stopWords)
        });

        chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_elementsToDelete', 'DIEMONIC_ADS_BLOCK_elementsToCheck', 'DIEMONIC_ADS_BLOCK_banWords', 'DIEMONIC_ADS_BLOCK_stopWords'], (result) => {
          window.elementsToDelete = result.DIEMONIC_ADS_BLOCK_elementsToDelete;
          window.elementsToCheck = result.DIEMONIC_ADS_BLOCK_elementsToCheck;
          window.banWords = result.DIEMONIC_ADS_BLOCK_banWords;
          window.stopWords = result.DIEMONIC_ADS_BLOCK_stopWords;
        });

        chrome.storage.local.set({
          "DIEMONIC_ADS_BLOCK_last_time_update_configs": (new Date()).toString()
        });

        console.log("%c🚫[DIEMONIC ADS BLOCK] Скачали конфиги", 'background: #464646b9; color: #ff459cff');
      })

      return null;
    })
    .catch(error => console.error('Ошибка:', error))
}

function CheckConfigs() {
  let elementsToDelete;
  let elementsToCheck;
  let banWords;
  let stopWords;

  chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_elementsToDelete', 'DIEMONIC_ADS_BLOCK_elementsToCheck', 'DIEMONIC_ADS_BLOCK_banWords', 'DIEMONIC_ADS_BLOCK_stopWords'], (result) => {
    elementsToDelete = result.DIEMONIC_ADS_BLOCK_elementsToDelete;
    elementsToCheck = result.DIEMONIC_ADS_BLOCK_elementsToCheck;
    banWords = result.DIEMONIC_ADS_BLOCK_banWords;
    stopWords = result.DIEMONIC_ADS_BLOCK_stopWords;

    //#region Default values

    if (elementsToDelete == null || elementsToDelete == undefined) {
      chrome.storage.local.set({
        "DIEMONIC_ADS_BLOCK_elementsToDelete": `
          [
          ".JustifierRowLayout-Incut", 
          ".banner-view",
          "[class*='Card_bottomAdv']", 
          "[class*='DirectFeature']",
          "[class*='AdvMastHead']",
          "[id*='advRsyaReact']", 
          "[class*='AppForecastMoney']", 
          "[class*='topBlockWithMoney']", 
          "[class*='AppMoneySidebar']", 
          "[class*='AppMoney_wrap']"
      ]
      `
      });
    }

    if (elementsToCheck == null || elementsToCheck == undefined) {

      chrome.storage.local.set({
        "DIEMONIC_ADS_BLOCK_elementsToCheck": ` [ "[class*='serp-item_card']" ] `
      });
    }

    if (banWords == null || banWords == undefined) {
      chrome.storage.local.set({
        "DIEMONIC_ADS_BLOCK_banWords": `[ "practicum.yandex.ru", "skillfactory.ru", "AdvLabel-Text"]`
      });
    }

    if (stopWords == null || stopWords == undefined) {
      chrome.storage.local.set({
        "DIEMONIC_ADS_BLOCK_stopWords": `[ "neuro_answer", "нейро", "futuris_search"]`
      });
    }

    //#endregion

    if (window.elementsToDelete == null || window.elementsToDelete == undefined) {
      chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_elementsToDelete'], (result) => {
        window.elementsToDelete = result.DIEMONIC_ADS_BLOCK_elementsToDelete;
      });
    }

    if (window.elementsToCheck == null || window.elementsToCheck == undefined) {
      chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_elementsToCheck'], (result) => {
        window.elementsToCheck = result.DIEMONIC_ADS_BLOCK_elementsToCheck;
      });
    }

    if (window.banWords == null || window.banWords == undefined) {
      chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_banWords'], (result) => {
        window.banWords = result.DIEMONIC_ADS_BLOCK_banWords;
      });
    }

    if (window.stopWords == null || window.stopWords == undefined) {
      chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_stopWords'], (result) => {
        window.stopWords = result.DIEMONIC_ADS_BLOCK_stopWords;
      });
    }

    chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_last_time_update_configs'], (result) => {
      window.DIEMONIC_ADS_BLOCK_last_time_update_configs = result.DIEMONIC_ADS_BLOCK_last_time_update_configs;

      if (window.DIEMONIC_ADS_BLOCK_last_time_update_configs == null
        || window.DIEMONIC_ADS_BLOCK_last_time_update_configs == undefined
        || window.DIEMONIC_ADS_BLOCK_last_time_update_configs == "null") {
        DownloadConfigs();
      }
      else if (isDiffInMinutes(new Date(window.DIEMONIC_ADS_BLOCK_last_time_update_configs), new Date(), 180)) {
        DownloadConfigs();
      }
    });
  });

}

function tryDeleteAds() {
  CheckConfigs();

  if (window.elementsToDelete == undefined) {
    return;
  }

  console.log("%c🚫[DIEMONIC ADS BLOCK] Попытка удалить рекламу. Последнее скачивание конфигов: " + window.DIEMONIC_ADS_BLOCK_last_time_update_configs, 'background: #464646b9; color: #ff459cff');

  const elementsToDelete = JSON.parse(window.elementsToDelete);
  const elementsToCheck = JSON.parse(window.elementsToCheck);
  const banWords = JSON.parse(window.banWords);
  const stopWords = JSON.parse(window.stopWords);

  elementsToDelete.forEach(element => {
    document.querySelectorAll(element).forEach(el => {
      console.log("%c🚫[DIEMONIC ADS BLOCK] По правилу {" + element + "} удален элемент " + el, 'background: #464646b9; color: #ff459cff');
      el.remove();
    });
  });

  elementsToCheck.forEach(element => {
    document.querySelectorAll(element).forEach(el => {
      const DeletedObject = el.innerHTML.toLowerCase();

      if (!stopWords.some(word => DeletedObject.includes(word.toLowerCase()))) {
        // проверка: содержит ли текст хотя бы одно из слов (как подстроку)
        if (banWords.some(word => DeletedObject.includes(word.toLowerCase()))) {
          console.log("%c🚫[DIEMONIC ADS BLOCK] По правилу {" + element + "} удален элемент " + DeletedObject, 'background: #464646b9; color: #ff459cff');
          el.remove();
        }
      }

    });
  });
}

function runTryDeleteAdsSeries() {
  let counter = 0;
  const maxRuns = 5;

  // сразу первый вызов
  tryDeleteAds();

  const intervalId = setInterval(() => {
    counter++;
    tryDeleteAds();

    if (counter >= maxRuns) {
      clearInterval(intervalId);
    }
  }, 300);
}

// throttle
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const throttledSeries = throttle(runTryDeleteAdsSeries, 300);

["mousedown", "click", "wheel", "keydown", "scroll"].forEach(eventName => {
  document.addEventListener(eventName, throttledSeries, { passive: true, capture: true });
});

CheckConfigs();

runTryDeleteAdsSeries();