(function () {
  // Bezpečná implementace showPanel, která nevyžaduje globální "event"
  function safeShowPanel(panel, callerEl) {
    // Odebereme aktivní třídy z navigace
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    // Určíme element, který volání spustil
    var triggerEl = callerEl || (window.event && window.event.currentTarget) || null;
    if (!triggerEl) {
      // Hledáme prvek s inline onclick, který odpovídá showPanel('<panel>')
      var q1 = document.querySelector('.nav-item[onclick*="showPanel(\'' + panel + '\')"]');
      var q2 = document.querySelector('.nav-item[onclick*="showPanel(\"' + panel + '\")"]');
      triggerEl = q1 || q2 || null;
    }
    if (triggerEl) {
      triggerEl.classList.add('active');
    }

    // Schováme všechny panely
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    // Otevřeme cílový panel / modal (bez vyvolání chyb pokud id chybí)
    switch (panel) {
      case 'stats':
        document.getElementById('statsPanel')?.classList.add('active');
        break;
      case 'achievements':
        document.getElementById('achievementsPanel')?.classList.add('active');
        break;
      case 'leaderboard':
        document.getElementById('leaderboardPanel')?.classList.add('active');
        break;
      case 'import':
        // import je modal v původním HTML
        document.getElementById('importModal')?.classList.add('active');
        break;
      case 'map':
        // Map je výchozí — nic extra nedělat
        break;
      default:
        var el = document.getElementById(panel + 'Panel');
        if (el) el.classList.add('active');
        break;
    }
  }

  // Nahrajeme tuto funkci jako globální showPanel (přepíše případnou chybně napsanou verzi)
  window.showPanel = safeShowPanel;

  // Upravení inline onclick handlerů při načtení, aby volaly showPanel('x', this)
  function patchInlineHandlers() {
    var nodes = document.querySelectorAll('[onclick]');
    var re = /showPanel\(\s*(['"])([^'"]+)\1\s*\)/;
    nodes.forEach(function (el) {
      var attr = el.getAttribute('onclick');
      if (!attr) return;
      var m = attr.match(re);
      if (m) {
        // Pokud už volání obsahuje this, necháme jej
        if (attr.indexOf('this') === -1) {
          var newAttr = attr.replace(re, "showPanel('" + m[2] + "', this)");
          el.setAttribute('onclick', newAttr);
        }
      }
    });
  }

  // Spustíme patch po DOMContentLoaded (bezpečně)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchInlineHandlers);
  } else {
    patchInlineHandlers();
  }

})();
