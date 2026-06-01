const validationRules = {
    username: (value) => {
        if (!value || value.trim() === '') return 'Имя пользователя обязательно';
        if (value.length < 3) return 'Имя должно содержать минимум 3 символа';
        return null;
    },
    email: (value) => {
        if (!value || value.trim() === '') return 'Email обязателен';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Введите корректный email';
        return null;
    },

    phone: (value) => {
        if (!value || value.trim() === '') return 'Телефон обязателен';
        const phoneRegex = /^[\d\+\(\)\s-]{10,}$/;
        if (!phoneRegex.test(value)) return 'Введите корректный номер телефона';
        return null;
    }
};

// Валидация одной формы
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');

    // Удаляем предыдущие сообщения об ошибках
    form.querySelectorAll('.error').forEach(error => error.remove());
    form.querySelectorAll('.input-error').forEach(input => {
        input.classList.remove('input-error');
        input.classList.remove('success');
    });

    inputs.forEach(input => {
        const rule = validationRules[input.name];
        if (rule) {
            const errorMessage = rule(input.value);

            if (errorMessage) {
                isValid = false;
                input.classList.add('input-error');

                // Добавляем сообщение об ошибке
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error';
                errorSpan.textContent = errorMessage;
                input.parentNode.insertBefore(errorSpan, input.nextSibling);
            } else {
                input.classList.add('success');
            }
        }
    });

    return isValid;
}

// Обработка отправки всех форм
document.querySelectorAll('.dynamic-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            console.log('Форма валидна! Данные:', new FormData(this));
            alert('Форма успешно отправлена!');

            fetch('https://api.telegram.org/bot' + telegram_bot_token + '/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: telegram_chat_id,
                    text: "Имя Клиента:_" + MainForm.querySelector('input[name=rname]').value
                        + "Номер телефона:_" + MainForm.querySelector('input[name=rphone]').value
                        + "Сообщение:_" + MainForm.querySelector('textarea[name=rtext]').value
                })
            })
                .catch(error => console.error('Error sending message:', error));
        } else {
            console.log('Форма содержит ошибки');
        }
    });

    // Валидация в реальном времени (опционально)
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            validateSingleField(this, form);
        });
    });
});

// Валидация одного поля в реальном времени
function validateSingleField(input, form) {
    const rule = validationRules[input.name];
    if (rule) {
        const errorMessage = rule(input.value);
        const existingError = input.parentNode.querySelector('.error');

        if (existingError) existingError.remove();

        if (errorMessage) {
            input.classList.add('input-error');
            input.classList.remove('success');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.textContent = errorMessage;
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        } else {
            input.classList.remove('input-error');
            input.classList.add('success');
        }
    }
}
