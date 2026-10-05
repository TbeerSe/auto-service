(function () {
  'use strict';

  var form = document.getElementById('bookingForm');
  if (!form) return;

  var nameInput = document.getElementById('name');
  var phoneInput = document.getElementById('phone');
  var status = document.getElementById('formStatus');

  // Phone mask +7 (999) 123-45-67
  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);

    var out = '+7';
    if (digits.length > 1) out += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) out += '-' + digits.slice(7, 9);
    if (digits.length >= 9) out += '-' + digits.slice(9, 11);
    return out;
  }

  if (phoneInput) {
    phoneInput.addEventListener('focus', function () {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });
    phoneInput.addEventListener('input', function () {
      phoneInput.value = formatPhone(phoneInput.value);
    });
    phoneInput.addEventListener('blur', function () {
      var v = phoneInput.value;
      if (v === '+7 (' || v === '+7' || v === '+7 ') phoneInput.value = '';
    });
  }

  function setError(fieldName, message) {
    var err = form.querySelector('[data-error="' + fieldName + '"]');
    var input = form.querySelector('[name="' + fieldName + '"]');
    if (err) err.textContent = message || '';
    if (input) input.classList.toggle('is-invalid', !!message);
  }

  function validate() {
    var ok = true;

    var nameValue = (nameInput.value || '').trim();
    if (nameValue.length < 2) {
      setError('name', 'Введите имя (минимум 2 символа)');
      ok = false;
    } else {
      setError('name', '');
    }

    var digits = (phoneInput.value || '').replace(/\D/g, '');
    if (digits.length !== 11) {
      setError('phone', 'Введите телефон полностью');
      ok = false;
    } else {
      setError('phone', '');
    }

    return ok;
  }

  if (nameInput) nameInput.addEventListener('blur', validate);
  if (phoneInput) phoneInput.addEventListener('blur', validate);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправка...';
    status.className = 'form__status';
    status.textContent = '';

    var data = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          status.classList.add('is-success');
          status.textContent = 'Заявка отправлена! Мы свяжемся с вами в течение 15 минут.';
          form.reset();
        } else {
          throw new Error(json.message || 'Ошибка отправки');
        }
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = 'Не удалось отправить заявку. Позвоните: +7 (495) 123-45-67';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = originalText;
      });
  });
})();
