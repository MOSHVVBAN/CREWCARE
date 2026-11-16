document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const message = document.getElementById('authMessage');

  const showMessage = (text, error = false) => {
    if (!message) return;
    message.textContent = text;
    message.style.color = error ? '#c0392b' : '#16845b';
  };

  loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(loginForm);
    try {
      await SpaceCareAPI.login({ email: form.get('email'), password: form.get('password') });
      location.href = 'index.php';
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  registerForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(registerForm);
    try {
      await SpaceCareAPI.register({ name: form.get('name'), email: form.get('email'), password: form.get('password') });
      location.href = 'index.php';
    } catch (error) {
      showMessage(error.message, true);
    }
  });
});