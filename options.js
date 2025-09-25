chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_last_time_update_configs'], (result) => {
    const el = document.getElementById('DIEMONIC_ADS_BLOCK_latUpdateTime');
    el.innerHTML = result.DIEMONIC_ADS_BLOCK_last_time_update_configs;
    console.log(result.DIEMONIC_ADS_BLOCK_last_time_update_configs);
});

chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_elementsToDelete', 'DIEMONIC_ADS_BLOCK_elementsToCheck', 'DIEMONIC_ADS_BLOCK_banWords', 'DIEMONIC_ADS_BLOCK_stopWords'], (result) => {
    document.getElementById('DIEMONIC_ADS_BLOCK_elementsToDelete').innerHTML += result.DIEMONIC_ADS_BLOCK_elementsToDelete;
    document.getElementById('DIEMONIC_ADS_BLOCK_elementsToCheck').innerHTML += result.DIEMONIC_ADS_BLOCK_elementsToCheck;
    document.getElementById('DIEMONIC_ADS_BLOCK_banWords').innerHTML += result.DIEMONIC_ADS_BLOCK_banWords;
    document.getElementById('DIEMONIC_ADS_BLOCK_stopWords').innerHTML += result.DIEMONIC_ADS_BLOCK_stopWords;
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('DIEMONIC_ADS_BLOCK_resetBtn');
    btn.addEventListener('click', () => {
        chrome.storage.local.clear();

        chrome.storage.local.get(['DIEMONIC_ADS_BLOCK_last_time_update_configs'], (result) => {
            console.log(result.DIEMONIC_ADS_BLOCK_last_time_update_configs);
        });

        location.reload();
    });
});
