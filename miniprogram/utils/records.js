const STORAGE_KEY = 'studyRecords';

function pad(value) { return String(value).padStart(2, '0'); }
function dateKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function getRecords() { return wx.getStorageSync(STORAGE_KEY) || []; }
function saveRecords(records) { wx.setStorageSync(STORAGE_KEY, records); }

module.exports = { pad, dateKey, getRecords, saveRecords };
