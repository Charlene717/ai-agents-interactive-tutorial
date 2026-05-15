(function(){
  const SK='aiagents_lang';
  let lang=localStorage.getItem(SK)||'zh';

  function apply(l){
    lang=l; localStorage.setItem(SK,l);
    document.documentElement.lang=l==='zh'?'zh-Hant':'en';
    // Show/hide lang-specific blocks
    document.querySelectorAll('[data-lang]').forEach(el=>{
      el.style.display=el.dataset.lang===l?'':'none';
    });
    // Update simple text swaps
    document.querySelectorAll('[data-zh][data-en]').forEach(el=>{
      el.textContent=el.dataset[l];
    });
    // Toggle button
    const btn=document.getElementById('langToggle');
    if(btn) btn.textContent=l==='zh'?'EN':'中文';
    // Fire event for charts etc
    document.dispatchEvent(new CustomEvent('langchange',{detail:{lang:l}}));
  }

  function toggle(){ apply(lang==='zh'?'en':'zh'); }
  function get(){ return lang; }

  document.addEventListener('DOMContentLoaded',()=>{
    const nav=document.querySelector('.top-nav-inner');
    if(nav && !document.getElementById('langToggle')){
      const btn=document.createElement('button');
      btn.id='langToggle'; btn.className='lang-toggle';
      btn.textContent=lang==='zh'?'EN':'中文';
      btn.onclick=toggle; nav.appendChild(btn);
    }
    apply(lang);

    // Reading progress bar
    const bar=document.getElementById('progressBar');
    if(bar){
      const upd=()=>{
        const h=document.documentElement;
        const total=h.scrollHeight-h.clientHeight;
        bar.style.width=total>0?(h.scrollTop/total*100)+'%':'0%';
      };
      window.addEventListener('scroll',upd,{passive:true});
      upd();
    }

    // Code tabs
    document.querySelectorAll('.code-tabs').forEach(ct=>{
      const btns=ct.querySelectorAll('.code-tab-btn');
      const panes=ct.querySelectorAll('.code-tab-content');
      btns.forEach((b,i)=>{
        b.onclick=()=>{
          btns.forEach(x=>x.classList.remove('active'));
          panes.forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          panes[i].classList.add('active');
        };
      });
    });

    // Accordion
    document.querySelectorAll('.accordion-btn').forEach(b=>{
      b.onclick=()=>{
        b.classList.toggle('open');
        const body=b.nextElementSibling;
        if(body) body.classList.toggle('open');
      };
    });

    // Quiz
    document.querySelectorAll('.quiz-q').forEach(q=>{
      const opts=q.querySelectorAll('.quiz-opt');
      const fb=q.querySelector('.quiz-feedback');
      opts.forEach(o=>{
        o.onclick=()=>{
          opts.forEach(x=>x.classList.remove('correct','wrong'));
          const isOk=o.dataset.correct==='1';
          o.classList.add(isOk?'correct':'wrong');
          if(fb){
            fb.classList.add('show');
            fb.classList.remove('correct-fb','wrong-fb');
            fb.classList.add(isOk?'correct-fb':'wrong-fb');
          }
        };
      });
    });
  });

  window.I18n={apply,toggle,get};
})();
