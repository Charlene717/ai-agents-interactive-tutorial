/* AI Literacy Quiz · i18n
 * - localStorage key 'ai_literacy_quiz_lang'
 * - data-lang block toggle + data-zh/data-en textContent toggle
 * - emits 'langchange' CustomEvent so dynamic renderers refresh
 */
(function(){
  const SK = 'ai_literacy_quiz_lang';
  let lang = localStorage.getItem(SK) || 'en';

  // UI string dictionary used by JS dynamic rendering
  const STR = {
    appTitle:        { zh:"🤖 AI 工具素養互動考題", en:"🤖 AI Literacy Interactive Quiz" },
    backHome:        { zh:"← 回首頁", en:"← Home" },
    defaultUser:     { zh:"預設使用者", en:"Default user" },
    answeredOf:      { zh:(a,t)=>"已答 <strong>"+a+"</strong> / "+t, en:(a,t)=>"Answered <strong>"+a+"</strong> / "+t },
    notStarted:      { zh:"尚未開始作答", en:"Not started" },
    progressLine:    { zh:(a,t,c)=>a+"/"+t+" · 答對 "+c+" · 正確率 "+(a?Math.round(c/a*100):0)+"%", en:(a,t,c)=>a+"/"+t+" · Correct "+c+" · "+(a?Math.round(c/a*100):0)+"%" },
    examOngoing:     { zh:(n,t)=>"📋 考試進行中 "+n+"/"+t, en:(n,t)=>"📋 Exam in progress "+n+"/"+t },
    sectionDone:     { zh:(c,t)=>"✓ 已完成 · 對 "+c+"/"+t, en:(c,t)=>"✓ Completed · "+c+"/"+t+" correct" },
    practicing:      { zh:(a,t,c)=>"📝 練習中 "+a+"/"+t+" · 對 "+c, en:(a,t,c)=>"📝 Practicing "+a+"/"+t+" · "+c+" correct" },
    notAnswered:     { zh:"尚未作答", en:"Not answered" },
    qCount:          { zh:n=>"("+n+" 題)", en:n=>"("+n+" Q)" },
    practiceMode:    { zh:"📝 練習模式", en:"📝 Practice Mode" },
    examMode:        { zh:"📋 考試模式", en:"📋 Exam Mode" },
    chooseAnswer:    { zh:"請先選擇答案", en:"Please select an answer first" },
    submitAnswer:    { zh:"📤 送出答案", en:"📤 Submit Answer" },
    submitExam:      { zh:"📋 交卷查看結果", en:"📋 Submit & See Results" },
    multiHint:       { zh:n=>"已勾選 "+n+" 個（多選題請勾選所有正確選項）", en:n=>n+" selected (select all correct options)" },
    tfHint:          { zh:"選 ○正確 或 ✕錯誤 後送出", en:"Choose ○ Correct or ✕ Incorrect then submit" },
    singleHint:      { zh:"選 A/B/C/D 後送出", en:"Choose A/B/C/D then submit" },
    examHintBanner:  { zh:'📋 <strong>考試模式</strong>：作答中無反饋，全部答完後請按側邊欄「<strong>交卷查看結果</strong>」。',
                       en:'📋 <strong>Exam Mode</strong>: no feedback during answering. When done, click the sidebar "<strong>Submit & See Results</strong>".' },
    correct:         { zh:"✓ 答對", en:"✓ Correct" },
    incorrect:       { zh:"✗ 答錯", en:"✗ Incorrect" },
    correctAnswer:   { zh:"正解：", en:"Answer: " },
    yourAnswer:      { zh:" · 你的答案：", en:" · Your answer: " },
    noExp:           { zh:"（此題未附解析）", en:"(No explanation provided)" },
    qNum:            { zh:(i,n)=>"第 "+i+" 題 / "+n, en:(i,n)=>"Q "+i+" / "+n },
    typeSingle:      { zh:"單選", en:"Single" },
    typeMulti:       { zh:"多選", en:"Multi" },
    typeTF:          { zh:"是非", en:"T/F" },
    markBtn:         { zh:"🔖 標記", en:"🔖 Mark" },
    markedBtn:       { zh:"🔖 已標記", en:"🔖 Marked" },
    prev:            { zh:"← 上一題", en:"← Previous" },
    next:            { zh:"下一題 →", en:"Next →" },
    redo:            { zh:"↺ 重做本題", en:"↺ Redo" },
    sbTotal:         { zh:(t,a,c)=>"題號（共 "+t+" 題）· 已答 "+a+(a?" · 對 "+c:""), en:(t,a,c)=>"Questions (total "+t+") · Answered "+a+(a?" · "+c+" correct":"") },
    sbTotalExam:     { zh:(a,t)=>"📋 已作答 "+a+"/"+t, en:(a,t)=>"📋 Answered "+a+"/"+t },
    summaryTitle:    { zh:"📊 本卷總結", en:"📊 Quiz Summary" },
    examResultTitle: { zh:"📋 考試結果", en:"📋 Exam Result" },
    examModePill:    { zh:"📋 考試模式", en:"📋 Exam Mode" },
    practicePill:    { zh:"📝 練習模式", en:"📝 Practice Mode" },
    retryPill:       { zh:"🎲 隨機練習", en:"🎲 Random Practice" },
    wrongReviewPill: { zh:"📝 錯題複習", en:"📝 Wrong Review" },
    qTotal:          { zh:"總題數", en:"Total" },
    correctN:        { zh:"答對", en:"Correct" },
    wrongN:          { zh:"答錯", en:"Wrong" },
    unansN:          { zh:"未作答", en:"Unanswered" },
    markedN:         { zh:"已標記", en:"Marked" },
    wrongList:       { zh:"錯題清單（點選跳到該題）", en:"Wrong questions (click to jump)" },
    backHomeBtn:     { zh:"回首頁", en:"Home" },
    youLabel:        { zh:"你：", en:"You: " },
    answerLabel:     { zh:"正解：", en:"Answer: " },
    nothingToPick:   { zh:"沒有可抽取的題目", en:"No questions to pick" },
    noWrong:         { zh:"目前沒有錯題～", en:"No wrong questions yet" },
    confirmReset:    { zh:n=>"確定要清除「"+n+"」的所有作答記錄？", en:n=>'Clear all answers for "'+n+'" ?' },
    confirmDelUser:  { zh:n=>"確定要刪除使用者「"+n+"」？相關進度也會一併移除。", en:n=>'Delete user "'+n+'" ? All progress will be removed.' },
    confirmResetSec: { zh:"確定要重置本卷的所有作答？", en:"Reset all answers for this quiz?" },
    confirmSubmitExam:{ zh:(t,a,u)=>"確定要交卷？\n\n本卷共 "+t+" 題，已作答 "+a+" 題（"+u+" 題未答將計為錯）。", en:(t,a,u)=>"Submit your exam?\n\nTotal "+t+" questions, "+a+" answered ("+u+" unanswered will count as wrong)." },
    toastResetDone:  { zh:"已重置作答", en:"Answers reset" },
    toastSwitched:   { zh:n=>"已切換到 "+n, en:n=>"Switched to "+n },
    toastCreated:    { zh:n=>"已建立並切換到 "+n, en:n=>"Created and switched to "+n },
    toastEnterName:  { zh:"請輸入名字", en:"Please enter a name" },
    toastCorrect:    { zh:"✓ 答對", en:"✓ Correct" }
  };

  function applyAttrSwap(){
    // data-zh / data-en textContent
    document.querySelectorAll('[data-zh],[data-en]').forEach(el=>{
      const v = el.getAttribute('data-' + lang);
      if(v != null) el.textContent = v;
    });
    // placeholder swap
    document.querySelectorAll('[data-zh-ph],[data-en-ph]').forEach(el=>{
      const v = el.getAttribute('data-' + lang + '-ph');
      if(v != null) el.setAttribute('placeholder', v);
    });
    // [data-lang="zh|en"] block visibility
    document.querySelectorAll('[data-lang]').forEach(el=>{
      el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
    });
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
  }

  function set(newLang){
    if(newLang !== 'zh' && newLang !== 'en') return;
    if(newLang === lang) return;
    lang = newLang;
    localStorage.setItem(SK, lang);
    applyAttrSwap();
    document.dispatchEvent(new CustomEvent('langchange', { detail:{ lang } }));
  }
  function toggle(){ set(lang === 'zh' ? 'en' : 'zh'); }
  function get(){ return lang; }

  function t(key /* , ...args */){
    const args = Array.prototype.slice.call(arguments, 1);
    const entry = STR[key];
    if(!entry) return key;
    const v = entry[lang] != null ? entry[lang] : entry.zh;
    return (typeof v === 'function') ? v.apply(null, args) : v;
  }

  window.I18n = { set, toggle, get, t, applyAttrSwap };

  // Apply once after DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applyAttrSwap);
  } else {
    applyAttrSwap();
  }
})();
