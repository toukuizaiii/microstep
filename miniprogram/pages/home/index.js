const { pad, dateKey, getRecords, saveRecords } = require('../../utils/records');
const weekNames = ['日', '一', '二', '三', '四', '五', '六'];

Page({
  data: { month: 0, day: 0, weekday: '', holes: [58,118,178,238,298,358,418,478], content: '', durationOptions: ['15 分钟','30 分钟','45 分钟','60 分钟','90 分钟','120 分钟','自定义'], durationValues: [15,30,45,60,90,120], durationIndex: 1, customDuration: '', categories: ['阅读','编程','课程','其他'], categoryIndex: 0, weekDays: [], weekCount: 0, todayRecords: [], saving: false },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const now = new Date(), records = getRecords(), today = dateKey(now);
    const offset = now.getDay() === 0 ? -6 : 1 - now.getDay();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset + i), key = dateKey(d);
      return { name: weekNames[d.getDay()], label: `${d.getMonth()+1}/${d.getDate()}`, date: key, done: records.some(r => r.date === key), isToday: key === today };
    });
    this.setData({ month: now.getMonth()+1, day: now.getDate(), weekday: `周${weekNames[now.getDay()]}`, weekDays, weekCount: weekDays.filter(d => d.done).length, todayRecords: records.filter(r => r.date === today).sort((a,b) => b.createdAt-a.createdAt) });
  },
  onContentInput(e) { this.setData({ content: e.detail.value }); },
  onDurationChange(e) { this.setData({ durationIndex: Number(e.detail.value) }); },
  onCustomDurationInput(e) { this.setData({ customDuration: e.detail.value.replace(/\D/g, '').slice(0, 3) }); },
  onCategoryChange(e) { this.setData({ categoryIndex: Number(e.detail.value) }); },
  saveRecord() {
    const content = this.data.content.trim();
    if (!content) { wx.showToast({ title: '先写下一点收获吧', icon: 'none' }); return; }
    const isCustom = this.data.durationIndex === this.data.durationOptions.length - 1;
    const duration = isCustom ? Number(this.data.customDuration) : this.data.durationValues[this.data.durationIndex];
    if (!duration || duration < 1 || duration > 999) { wx.showToast({ title: '请输入 1–999 分钟', icon: 'none' }); return; }
    this.setData({ saving: true });
    const now = new Date(), records = getRecords();
    records.push({ id: `${now.getTime()}`, date: dateKey(now), content, duration, category: this.data.categories[this.data.categoryIndex], createdAt: now.getTime(), createdTime: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
    saveRecords(records); this.setData({ content: '', customDuration: '', saving: false }); this.refresh();
    wx.showToast({ title: '今天又前进了一步', icon: 'success' });
  }
});
