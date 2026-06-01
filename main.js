const accordeones = Array.from(document.querySelectorAll(".accordeon-el")); // считываем все элементы аккордеона в массив

accordeones.forEach((accordeon) => {
    accordeon.addEventListener("click", accordeonHandler); // при нажатии на бокс вызываем ф-ию accordeonHanlder
});

function accordeonHandler(e) {
    e.preventDefault(); // сбрасываем стандартное поведение
    let currentaccordeon = e.target.closest(".accordeon-el"); // определяем текущий бокс
    let currentContent = e.target.nextElementSibling; // находим скрытый контент
    currentaccordeon.classList.toggle("active"); // присваиваем ему активный класс
    if (currentaccordeon.classList.contains("active")) {
        // если класс активный ..
        currentContent.style.maxHeight = currentContent.scrollHeight + "px"; // открываем контент
    } else {
        // в противном случае
        currentContent.style.maxHeight = 0; // скрываем контент
    }
}

document.querySelectorAll('a[href*="#"]').forEach(anchor => anchor.addEventListener("click", function (e) {
    const anchorTargetID = anchor.getAttribute("href").substring(1);
    const $anchorTarget = document.getElementById(anchorTargetID);

    if (!$anchorTarget) return;

    e.preventDefault();
    $anchorTarget.scrollIntoView({behavior: "smooth", block: "start"});
}));


//tabs
const tabs = document.querySelectorAll("[role='tab']");
const tabContents = document.querySelectorAll("[role='tabpanel']");

function setSelectedTab(target) {
    // Select content target
    let targetTabContent = document.querySelector("#" + target.getAttribute('aria-controls'));
    // Remove all .active
    tabContents.forEach((tabContent) => {
        tabContent.classList.remove("active");
    });
    tabs.forEach((tab) => {
        tab.classList.remove("active");
        tab.ariaSelected = false;
        tab.tabIndex = -1;
    });
    // Add .active
    target.classList.add("active");
    target.ariaSelected = true;
    target.tabIndex = 0;
    target.focus();
    targetTabContent.classList.add("active");
}

tabs.forEach((tab) => {
    tab.addEventListener("click", e => {

        setSelectedTab(e.currentTarget);
    });
    tab.addEventListener("keydown", e => {
        let target = e.currentTarget,
            index = Array.from(tabs).indexOf(target),
            flag = false;

        switch (e.key) {
            case 'ArrowLeft':
                if ((index - 1) < 0) {
                    index = tabs.length - 1;
                    setSelectedTab(tabs[index]);
                } else {
                    setSelectedTab(tabs[index - 1]);
                }
                flag = true;
                break;

            case 'ArrowRight':
                if ((index + 1) > (tabs.length - 1)) {
                    setSelectedTab(tabs[0]);
                } else {
                    setSelectedTab(tabs[index + 1]);
                }
                flag = true;
                break;

            case 'Home':
                setSelectedTab(tabs[0]);
                flag = true;
                break;

            case 'End':
                setSelectedTab(tabs[tabs.length - 1]);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    });
});


//burger

let burger = document.getElementById('burger'),
    nav = document.getElementById('main-nav')
    navListEl = document.querySelectorAll('.main-nav ul li')


burger.addEventListener('click', function (e) {
    BurgerMenuIsOpen()
});

navListEl.forEach((item, i) => {
    item.addEventListener('click', function (e) {
        BurgerMenuIsOpen()
    });
});


let BurgerMenuIsOpen = () => {
    nav.classList.toggle('is-open')
    burger = document.getElementById('burger')
    console.log(123)
};





