import '../assets/styles/global.scss';
import '../assets/styles/constants.scss';
import '../assets/styles/styles.scss';
import { Test, Tests } from './_data';

const navigation = document.querySelector('#navigation');
const navigationList = document.querySelector('#navigation__list');
const navigationArrow = document.querySelector('#navigation__arrow');
const navigationTitle = document.querySelector('#navigation__title');
const navigationBody = document.querySelector('#navigation__body');

const navigationBodyNav = document.querySelector('#navigation__body__nav');

const mainPlace = document.querySelector('#place__main');
const mainPlaceTitle = document.querySelector('#place__main__title');

const testPlaceHeader = document.querySelector('#place__test__header');
const testPlaceBody = document.querySelector('#place__test__body');

interface UserTest {
    testId: number;
    questions: {
        id: number;
        answers: {
            id: number;
        }[];
    }[];
}

navigationList?.addEventListener('click', () => {
    navigation?.classList.add('active');
    navigation?.classList.remove('animation_reverse');
    navigationList.classList.add('hide');
    navigationArrow?.classList.remove('hide');
    navigationTitle?.classList.remove('hide');
    navigationBody?.classList.remove('hide');
});

navigationArrow?.addEventListener('click', () => {
    navigation?.classList.remove('active');
    navigation?.classList.add('animation_reverse');
    navigationList?.classList.remove('hide');
    navigationArrow?.classList.add('hide');
    navigationTitle?.classList.add('hide');
    navigationBody?.classList.add('hide');
});

let testItem = Tests.map(
    (item) => `<li id="${item.id}" class="place__navigation__body__nav__item">
        <div class="place__navigation__body__nav__item__circle"></div>
        <p id="${item.id}" class="place__navigation__body__nav__item__title">${item.name}</p>
    </li>`,
).join('');
navigationBodyNav && (navigationBodyNav.innerHTML = testItem);

const hideTestDescription = () => {
    mainPlaceTitle?.classList.remove('hide');
    mainPlace?.classList.add('place__main');
    mainPlace?.classList.remove('place__test');
    testPlaceHeader?.classList.add('hide');
    testPlaceBody?.classList.add('hide');
};

const showTestResult = (passedTest: Test, userAnswers: UserTest) => {
    testPlaceHeader &&
        (testPlaceHeader.innerHTML = `<div class="place__test__header__inner">
            <p class="place__test__header__inner__exit">Выход</p>
            <h1 class="place__test__header__inner__title">${passedTest.name}</h1>
            <div class="place__test__header__inner__info">
                <p class="place__test__header__inner__info__remove">Результаты</p>
                <p class="place__test__header__inner__info__timer"></p>
            </div>
        </div>`);
    testPlaceBody &&
        (testPlaceBody.innerHTML = `<div class="place__test__body__item">
            <h1 class="place__test__body__item__header">Тест завершён</h1>
            <p>Ваши ответы</p>
            ${passedTest.questions
                .map(
                    (item) => `<div class="place__test__body__item__answers__item">
                    <p class="test__place__body__item__answers__item__name">${item.id}. ${
                        item.question
                    }</p>
                </div>
                ${item.variants
                    .map(
                        (variant) => `<div class="place__test__body__item__answers__item">
                    ${
                        variant.correct
                            ? `<p class="test__place__body__item__answers__item__name">Правильный ответ: ${variant.name}</p>`
                            : ''
                    }
                </div>`,
                    )
                    .join('')}`,
                )
                .join('')}
        </div>`);
};

const startTest = (test: Test) => {
    let model: UserTest = {
        testId: 0,
        questions: [],
    };
    model.testId = test.id;

    let passedTest: Test = {
        id: 0,
        name: '',
        description: '',
        questions: [],
    };
    let userAnswers: UserTest = {
        testId: 0,
        questions: [],
    };
    let selectedAnswersCount = 0;
    testPlaceHeader &&
        (testPlaceHeader.innerHTML = `<div class="place__test__header__inner">
                <p class="place__test__header__inner__exit">Выход</p>
                <h1 class="place__test__header__inner__title">${test.name}</h1>
                <div class="place__test__header__inner__info">
                    <p class="place__test__header__inner__info__remove">Сбросить все ответы</p>
                    <p class="class="place__test__header__inner__info__count">${selectedAnswersCount}/${test.questions.length}</p>
                    <p class="place__test__header__inner__info__timer"></p>
                </div>
            </div>`);
    testPlaceBody &&
        (testPlaceBody.innerHTML = `<div class="place__test__body__item">
                ${test.questions
                    .map(
                        (question) => `<h1 class="place__test__body__item__title">${question.id}. ${
                            question.question
                        }</h1>
                    <div class="place__test__body__item__answers">${question.variants
                        .map(
                            (variant) => `
                            <div class="place__test__body__item__answers__item">
                                <input value="${variant.id}" name="${question.id}-${variant.id}" class="place__test__body__item__answers__item__radio" type="radio"/>
                                <p class="test__place__body__item__answers__item__name">${variant.name}</p>
                            </div>
                        `,
                        )
                        .join('')}</div>`,
                    )
                    .join('')}
                    <div class="place__test__body__footer">
                    <h1 id="submit__test__button" class="place__test__body__footer__button">Завершить</h1>
                    </div>
            </div>`);

    const radios = document.querySelectorAll('.place__test__body__item__answers__item__radio');
    radios.forEach((radio) => {
        selectedAnswersCount++;
        radio.addEventListener('change', (event: Event) => {
            const radioElement = event.target as HTMLInputElement;
            const questionId = parseInt(radioElement.name.split('-')[0]);
            const answerId = parseInt(radioElement.name.split('-')[1]);
            const existingQuestion = model.questions.find((question) => question.id === questionId);
            if (existingQuestion) {
                existingQuestion.answers.push({ id: answerId });
            } else {
                model.questions.push({
                    id: questionId,
                    answers: [{ id: answerId }],
                });
            }
        });
    });

    let hasTest = localStorage.getItem('tests');
    let tests: UserTest[] = [];
    if (hasTest) {
        tests = JSON.parse(hasTest);
        Tests.map((item) => {
            if (Tests.find((test) => test.id == item.id)) {
                passedTest = item;
            }
        });
        tests.map((item) => {
            if (item.testId == test.id) userAnswers = item;
        });
        showTestResult(passedTest, userAnswers);
    }

    document.querySelector('#submit__test__button')?.addEventListener('click', () => {
        let hasTest = localStorage.getItem('tests');
        let tests: UserTest[] = [];
        if (hasTest) {
            tests = JSON.parse(hasTest);
        }
        tests.push(model);
        localStorage.setItem('tests', JSON.stringify(tests));
        hideTestDescription();
    });
};

const showTestDescription = (test: Test) => {
    mainPlaceTitle?.classList.add('hide');
    mainPlace?.classList.remove('place__main');
    mainPlace?.classList.add('place__test');
    testPlaceHeader?.classList.remove('hide');
    testPlaceBody?.classList.remove('hide');

    testPlaceHeader &&
        (testPlaceHeader.innerHTML = `<h1 class="place__test__header__title">Описание</h1>`);
    testPlaceBody &&
        (testPlaceBody.innerHTML = `<p class="place__test__body__description">${test?.description}</p>`);
    testPlaceBody &&
        (testPlaceBody.innerHTML += `<div class="place__test__body__buttons">
            <button id="start__button" class="place__test__body__buttons__start">Начать</button>
            <button id="exit__button" class="place__test__body__buttons__exit">Отмена</button>
        </div>`);
    const exitButton = document.getElementById('exit__button');
    const startButton = document.getElementById('start__button');
    if (exitButton) exitButton.addEventListener('click', hideTestDescription);

    if (startButton) startButton.addEventListener('click', () => startTest(test));
};

navigationBodyNav?.addEventListener('click', (event: any) => {
    if (
        event.target.classList.contains('place__navigation__body__nav__item') ||
        event.target.classList.contains('place__navigation__body__nav__item__title')
    ) {
        const elementId = event.target.id;
        const test = Tests.find((item) => item.id == elementId);
        if (test) showTestDescription(test);
    }
});
