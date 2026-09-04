export function initCaseFilters() {
  const filterBtns = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-card-wrapper');

  if (filterBtns.length === 0 || caseCards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      const filter = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-accent/15', 'border-accent/40', 'text-accent');
        b.classList.add('bg-bg-card/40', 'border-border', 'text-text-secondary');
      });

      btn.classList.add('active', 'bg-accent/15', 'border-accent/40', 'text-accent');
      btn.classList.remove('bg-bg-card/40', 'border-border', 'text-text-secondary');

      caseCards.forEach((card) => {
        const cats = (card.getAttribute('data-categories') || '').split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };
  });
}
