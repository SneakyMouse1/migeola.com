export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');

  const successMsg = form.dataset.msgSuccess || 'Message sent successfully!';
  const errorMsg = form.dataset.msgError || 'An error occurred. Please try again.';
  const sendingMsg = form.dataset.msgSending || 'Sending...';
  const originalBtnText = form.dataset.btnText || 'Send';

  form.onsubmit = async (e) => {
    e.preventDefault();

    if (status) {
      status.classList.remove('text-green-500', 'text-red-500', 'hidden');
      status.textContent = sendingMsg;
      status.classList.add('text-text-muted');
    }

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = sendingMsg;
    if (btnIcon) btnIcon.classList.add('animate-pulse');

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        if (status) {
          status.textContent = successMsg;
          status.classList.remove('text-text-muted');
          status.classList.add('text-green-500');
        }
        form.reset();

        // Reset Turnstile widget if available
        const turnstile = window.turnstile;
        if (turnstile && typeof turnstile.reset === 'function') {
          try {
            turnstile.reset();
          } catch (err) {
            // Ignore reset error if widget wasn't rendered yet
          }
        }
      } else {
        const data = await response.json().catch(() => ({}));
        if (status) {
          status.textContent = data.message || errorMsg;
          status.classList.remove('text-text-muted');
          status.classList.add('text-red-500');
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = errorMsg;
        status.classList.remove('text-text-muted');
        status.classList.add('text-red-500');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = originalBtnText;
      if (btnIcon) btnIcon.classList.remove('animate-pulse');

      if (status && status.classList.contains('text-green-500')) {
        setTimeout(() => {
          status.classList.add('hidden');
        }, 6000);
      }
    }
  };
}
