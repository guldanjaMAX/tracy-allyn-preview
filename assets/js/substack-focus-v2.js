(function () {
  'use strict';
  document.querySelectorAll('.homepage-sections [data-ss-focus]').forEach(function (section) {
    if (section.classList.contains('ss-enhanced')) return;
    var list = section.querySelector('.ss-selectors');
    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-ss-tab]'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('[data-ss-panel]'));
    if (!list || tabs.length !== 3 || panels.length !== tabs.length) return;
    if (!tabs.every(function (tab, index) {
      return tab.getAttribute('aria-controls') === panels[index].id;
    })) return;

    var selected = 0;
    var desktop = false;
    var initialized = false;

    function show(index, focus) {
      selected = (index + tabs.length) % tabs.length;
      tabs.forEach(function (tab, current) {
        var active = current === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[current].hidden = desktop && !active;
      });
      if (focus) tabs[selected].focus();
    }

    function updateLayout() {
      var nextDesktop = section.getBoundingClientRect().width > 800;
      if (initialized && nextDesktop === desktop) return;
      var active = document.activeElement;
      var focusWasTab = tabs.some(function (tab) { return tab === active || tab.contains(active); });
      var focusedPanel = panels.findIndex(function (panel) { return panel.contains(active); });
      // Preserve the essay a keyboard reader is using when the layout changes.
      if (nextDesktop && focusedPanel >= 0) selected = focusedPanel;
      desktop = nextDesktop;
      initialized = true;
      section.setAttribute('data-ss-layout', desktop ? 'tabs' : 'stacked');
      list.hidden = !desktop;
      panels.forEach(function (panel, index) {
        if (desktop) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tabs[index].id);
          panel.tabIndex = 0;
        } else {
          panel.removeAttribute('role');
          panel.setAttribute('aria-labelledby', panel.id + '-heading');
          panel.removeAttribute('tabindex');
        }
      });
      show(selected, false);
      if (!desktop && focusWasTab) {
        panels[selected].tabIndex = -1;
        panels[selected].focus();
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        if (desktop) show(index, false);
      });
      tab.addEventListener('keydown', function (event) {
        if (!desktop) return;
        var next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = selected + 1;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = selected - 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        show(next, true);
      });
    });

    section.classList.add('ss-enhanced');
    updateLayout();
    if ('ResizeObserver' in window) {
      var observer = new ResizeObserver(updateLayout);
      observer.observe(section);
    } else {
      var queued = false;
      window.addEventListener('resize', function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () { queued = false; updateLayout(); });
      });
    }
  });
})();
