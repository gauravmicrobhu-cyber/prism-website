(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();

(function () {
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced || !('requestAnimationFrame' in window)) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) { animateCount(el); });
    return;
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { counterObserver.observe(el); });
})();

(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  function isDarkNow() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  btn.addEventListener('click', function () {
    var next = isDarkNow() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('prism-theme', next); } catch (e) {}
  });
})();

(function () {
  var track = document.getElementById('kashmirTimeline');
  if (!track) return;
  var detail = document.getElementById('timelineDetail');
  var blocks = track.querySelectorAll('.timeline-block');

  var data = {
    truman: {
      status: 'covered',
      title: 'Truman — 1945–1953',
      intro: '97+ documents read in full or substantial excerpt, drawing on 5 FRUS volumes directly — the archive’s most developed period of coverage.',
      findings: [
        'The actual State Department policy paper, signed by Secretary of State George Marshall the day the UN Security Council first took up Kashmir, showing the plebiscite was America’s own preferred outcome from day one — not something imposed by London or the UN.',
        'A secret partition proposal Washington and India’s own diplomats each considered independently, months apart, neither willing to say so publicly.',
        'A Communist-bloc UN commissioner’s private counsel to Kashmir’s own government against American-backed arbitration.',
        'India’s Cabinet privately preparing, in 1950, to accept losing the Kashmir Valley through a plebiscite it expected to lose — a fact that complicates the simplicity of India’s later public position.'
      ]
    },
    eisenhower: { status: 'pending', title: 'Eisenhower — 1953–1961', intro: 'Not yet covered. This is the next period in line as the archive moves forward chronologically through the FRUS volumes.' },
    'kennedy-johnson': { status: 'pending', title: 'Kennedy–Johnson — 1961–1969', intro: 'Not yet covered.' },
    'nixon-ford': { status: 'pending', title: 'Nixon–Ford — 1969–1977', intro: 'Not yet covered.' },
    'carter-reagan-bush': { status: 'pending', title: 'Carter–Reagan–H.W. Bush — 1977–1993', intro: 'Not yet covered.' },
    'clinton-bush-obama': { status: 'pending', title: 'Clinton–W. Bush–Obama — 1993–2017', intro: 'Not yet covered.' },
    recent: { status: 'pending', title: '2017–present', intro: 'Not yet covered.' }
  };

  function render(key) {
    var d = data[key];
    if (!d || !detail) return;
    var html = '<span class="timeline-detail-status ' + d.status + '">' +
      (d.status === 'covered' ? 'Covered' : 'Not yet covered') + '</span>';
    html += '<h4>' + d.title + '</h4>';
    html += '<p>' + d.intro + '</p>';
    if (d.findings) {
      html += '<ul>' + d.findings.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>';
    }
    detail.innerHTML = html;
    blocks.forEach(function (b) {
      b.classList.toggle('selected', b.getAttribute('data-admin') === key);
    });
  }

  blocks.forEach(function (b) {
    b.addEventListener('click', function () { render(b.getAttribute('data-admin')); });
  });

  render('truman');
})();

(function () {
  var bar = document.getElementById('insightsFilter');
  if (!bar) return;
  var buttons = bar.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.card[data-pillar]');

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var filter = btn.getAttribute('data-filter');

    buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
    cards.forEach(function (card) {
      var match = filter === 'all' || card.getAttribute('data-pillar') === filter;
      card.classList.toggle('filtered-out', !match);
    });
  });
})();
