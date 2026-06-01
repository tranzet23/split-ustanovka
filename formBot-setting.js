let MainForm = document.querySelector("form.main-form");
let ContactForm = document.querySelector("form#contact-form");
let telegram_bot_token = '8924382595:AAFXPgNG_iR4UIFs4a7Y3BGHgiRFANJkBh4';
let telegram_chat_id = '918605801';


const phoneInput = document.getElementById('phone');
const phoneInput2 = document.getElementById('phone-2');
const nameInput = document.querySelector('.name-input');
const help = document.getElementById('phone-help');
const help2 = document.getElementById('phone-help-2');


// form-main


nameInput.addEventListener('input', () => {
    if (nameInput.value.length < 1) {
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
    } else {
        nameInput.classList.remove('error');
        nameInput.classList.add('success');
    }
});

phoneInput.addEventListener('input', () => {
    if (phoneInput.value.length > 16) {
        phoneInput.classList.add('success');
        help.classList.add('success')
        phoneInput.classList.remove('error');
    } else {
        phoneInput.classList.remove('success');
        help.classList.remove('success');
        phoneInput.classList.add('error');
    }
});


// Форматирует строку в маску +7(XXX) XXX-XX-XX
function formatPhone(value) {
    // 1. Убираем все не-цифры
    let raw = value.replace(/\D/g, '');

    // 2. Если первым символом идёт '7' (код страны), удаляем его
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    // 3. Берём первые 10 цифр пользовательского номера
    const digits = raw.substring(0, 10);
    const parts = [];

    // 4. Добавляем префикс +7
    parts.push('+7');

    // 5. Открывающая скобка и первые 3 цифры
    if (digits.length > 0) {
        parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    // 6. Закрываем скобку после 3 цифр
    if (digits.length >= 3) {
        parts[1] += ')';
    }
    // 7. Следующие 3 цифры с пробелом
    if (digits.length > 3) {
        parts.push(' ' + digits.substring(3, Math.min(6, digits.length)));
    }
    // 8. Две цифры и дефис
    if (digits.length > 6) {
        parts.push('-' + digits.substring(6, Math.min(8, digits.length)));
    }
    // 9. Последние две цифры и дефис
    if (digits.length > 8) {
        parts.push('-' + digits.substring(8, 10));
    }

    // Собираем все части в итоговую строку
    return parts.join('');
}

// Обновляет текст подсказки под полем телефона
function updateHelp(value) {
    // Убираем не-цифры
    let raw = value.replace(/\D/g, '');
    // Удаляем ведущую '7'
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    const count = raw.length;         // Сколько введено цифр
    const remaining = 10 - count;     // Сколько осталось

    if (count === 0) {
        help.textContent = 'Введите номер телефона';
    } else if (count < 10) {
        help.textContent = `Введено ${count} из 10 цифр. Осталось ${remaining}`;
    } else {
        help.textContent = 'Номер введён полностью';
    }
}

// Обработчик ввода: форматируем и обновляем подсказку
phoneInput.addEventListener('input', (e) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
    updateHelp(formatted);

    // Перенос курсора в конец строки
    const pos = e.target.value.length;
    e.target.setSelectionRange(pos, pos);
});

phoneInput.addEventListener('focus', (e) => {
    phoneInput.setSelectionRange(6, 6);
    if (!e.target.value) {
        e.target.value = '+7(';
        updateHelp(e.target.value);
        // Ставим курсор сразу после открывающей скобки
        e.target.setSelectionRange(3, 3);
    }
});

// Обработка Backspace для удаления цифр в скобках
phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        const start = phoneInput.selectionStart;
        // Если каретка стоит сразу после ')', переносим её внутрь скобок
        // Формат префикса: "+7(" — цифры начинаются с позиции 3
        // Через formatPhone: ")." на позиции 4
        if (start === 4) {
            e.preventDefault();               // Отменяем обычный Backspace
            // Перемещаем курсор внутрь скобок
            phoneInput.setSelectionRange(3, 3);
            // Удаляем символ перед новой позицией (цифру)
            const before = phoneInput.value.slice(0, 3);
            const after = phoneInput.value.slice(3);
            // Убираем первый символ после позиции 3, затем форматируем
            const newVal = before + after.substring(1);
            phoneInput.value = formatPhone(newVal);
            updateHelp(phoneInput.value);
            // Ставим каретку обратно в позицию 3
            phoneInput.setSelectionRange(3, 3);
        }
    }
});


// При потере фокуса: очищаем поле и подсказку, если нет цифр
phoneInput.addEventListener('blur', (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }
    if (raw.length === 0) {
        e.target.value = '';
        help.textContent = '';
    }
});


// Валидация при отправке формы
MainForm.addEventListener('submit', (e) => {
    let raw = phoneInput.value.replace(/\D/g, '');
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    if (raw.length !== 10) {
        e.preventDefault();
        phoneInput.classList.add('error');
        phoneInput.focus();
    }

    if (raw.length === 10) {
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
        })  .then(response => {
            console.log(response)
        })
            .catch(error => console.error('Error sending message:', error));
        alert('Ваша заявка успешно отправлена!')
        e.preventDefault();
        MainForm.reset();
    }

    phoneInput.classList.remove('error'); // Снимаем класс ошибки

});


// contact-form


phoneInput2.addEventListener('input', () => {
    if (phoneInput2.value.length > 16) {
        phoneInput2.classList.add('success');
        help2.classList.add('success')
        phoneInput2.classList.remove('error');
    } else {
        phoneInput2.classList.remove('success');
        help2.classList.remove('success');
        phoneInput2.classList.add('error');
    }
});


// Форматирует строку в маску +7(XXX) XXX-XX-XX
function formatPhone2(value) {
    // 1. Убираем все не-цифры
    let raw = value.replace(/\D/g, '');

    // 2. Если первым символом идёт '7' (код страны), удаляем его
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    // 3. Берём первые 10 цифр пользовательского номера
    const digits = raw.substring(0, 10);
    const parts = [];

    // 4. Добавляем префикс +7
    parts.push('+7');

    // 5. Открывающая скобка и первые 3 цифры
    if (digits.length > 0) {
        parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    // 6. Закрываем скобку после 3 цифр
    if (digits.length >= 3) {
        parts[1] += ')';
    }
    // 7. Следующие 3 цифры с пробелом
    if (digits.length > 3) {
        parts.push(' ' + digits.substring(3, Math.min(6, digits.length)));
    }
    // 8. Две цифры и дефис
    if (digits.length > 6) {
        parts.push('-' + digits.substring(6, Math.min(8, digits.length)));
    }
    // 9. Последние две цифры и дефис
    if (digits.length > 8) {
        parts.push('-' + digits.substring(8, 10));
    }

    // Собираем все части в итоговую строку
    return parts.join('');
}

// Обновляет текст подсказки под полем телефона
function updateHelp2(value) {
    // Убираем не-цифры
    let raw = value.replace(/\D/g, '');
    // Удаляем ведущую '7'
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    const count = raw.length;         // Сколько введено цифр
    const remaining = 10 - count;     // Сколько осталось

    if (count === 0) {
        help2.textContent = 'Введите номер телефона';
    } else if (count < 10) {
        help2.textContent = `Введено ${count} из 10 цифр. Осталось ${remaining}`;
    } else {
        help2.textContent = 'Номер введён полностью';
    }
}

// Обработчик ввода: форматируем и обновляем подсказку
phoneInput2.addEventListener('input', (e) => {
    const formatted = formatPhone2(e.target.value);
    e.target.value = formatted;
    updateHelp2(formatted);

    // Перенос курсора в конец строки
    const pos = e.target.value.length;
    e.target.setSelectionRange(pos, pos);
});

phoneInput2.addEventListener('focus', (e) => {
    phoneInput2.setSelectionRange(6, 6);
    if (!e.target.value) {
        e.target.value = '+7(';
        updateHelp2(e.target.value);
        // Ставим курсор сразу после открывающей скобки
        e.target.setSelectionRange(3, 3);
    }
});

// Обработка Backspace для удаления цифр в скобках
phoneInput2.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        const start = phoneInput2.selectionStart;
        // Если каретка стоит сразу после ')', переносим её внутрь скобок
        // Формат префикса: "+7(" — цифры начинаются с позиции 3
        // Через formatPhone: ")." на позиции 4
        if (start === 4) {
            e.preventDefault();               // Отменяем обычный Backspace
            // Перемещаем курсор внутрь скобок
            phoneInput2.setSelectionRange(3, 3);
            // Удаляем символ перед новой позицией (цифру)
            const before = phoneInput2.value.slice(0, 3);
            const after = phoneInput2.value.slice(3);
            // Убираем первый символ после позиции 3, затем форматируем
            const newVal = before + after.substring(1);
            phoneInput2.value = formatPhone2(newVal);
            updateHelp2(phoneInput2.value);
            // Ставим каретку обратно в позицию 3
            phoneInput2.setSelectionRange(3, 3);
        }
    }
});


// При потере фокуса: очищаем поле и подсказку, если нет цифр
phoneInput2.addEventListener('blur', (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }
    if (raw.length === 0) {
        e.target.value = '';
        help2.textContent = '';
    }
});


ContactForm.addEventListener('submit', (e) => {

    // Получаем только цифры без кода '7'
    let raw = phoneInput2.value.replace(/\D/g, '');
    if (raw.charAt(0) === '7') {
        raw = raw.substring(1);
    }

    // Если не 10 цифр — отменяем отправку и подсвечиваем поле
    if (raw.length !== 10) {
        e.preventDefault();
        phoneInput2.classList.add('error');
        phoneInput2.focus();
    }

    if (raw.length === 10) {
        fetch('https://api.telegram.org/bot' + telegram_bot_token + '/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: telegram_chat_id,
                text: "Номер телефона:_" + ContactForm.querySelector('input[name=rphone]').value

            })
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => console.error('Error sending message:', error));
        alert('Ваша заявка успешно отправлена!')
        e.preventDefault();
        ContactForm.reset();
    }

    phoneInput2.classList.remove('error'); // Снимаем класс ошибки

});





