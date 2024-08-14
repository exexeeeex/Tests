export interface Test {
    id: number;
    name: string;
    description: string;
    questions: {
        id: number;
        question: string;
        variants: {
            id: number;
            name: string;
            correct: boolean;
        }[];
    }[];
}

export const Tests: Test[] = [
    {
        id: 2,
        name: 'text 2',
        description: 'Описание, но другое.',
        questions: [
            {
                id: 1,
                question: 'Вопрос 1',
                variants: [
                    {
                        id: 1,
                        name: 'Вариант 1',
                        correct: true,
                    },
                    {
                        id: 1,
                        name: 'Вариант 2',
                        correct: false,
                    },
                ],
            },
            {
                id: 2,
                question: 'Вопрос 2',
                variants: [
                    {
                        id: 1,
                        name: 'test',
                        correct: true,
                    },
                ],
            },
            {
                id: 3,
                question: 'Вопрос 3',
                variants: [
                    {
                        id: 1,
                        name: 'test',
                        correct: true,
                    },
                ],
            },
        ],
    },
];
