-- Создание таблицы пользователей
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);
-- Создание последовательности test_id_seq
CREATE SEQUENCE test_id_seq;

-- Создание таблицы тестов
CREATE TABLE tests (
    test_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- Новый столбец
    created_at DATE DEFAULT CURRENT_DATE,
    unique_id VARCHAR(8) UNIQUE DEFAULT lpad(nextval('test_id_seq')::text, 8, '0')
);

-- Создание таблицы вопросов с каскадным удалением
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(test_id) ON DELETE CASCADE, -- К какому тесту относится
    question_order INT NOT NULL, -- Номер вопроса
    type VARCHAR(20) NOT NULL CHECK (type IN ('single-choice', 'multiple-choice', 'priority', 'text')), -- Тип вопроса
    question_text TEXT NOT NULL -- Вопрос
);

-- Создание таблицы вариантов ответов с каскадным удалением
CREATE TABLE options (
    option_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE, -- К какому вопросу относится вариант ответа
    option_text TEXT[] NOT NULL -- Для хранения множества вариантов ответов сразу в нужном порядке
);

-- Создание таблицы правильных ответов с каскадным удалением
CREATE TABLE correct_answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE, -- К какому вопросу относятся правильные ответы
    correct_answer_indices TEXT[] -- Хранение правильных ответов
);


drop table test_results
-- Создание таблицы результатов тестов 
CREATE TABLE test_results (
    result_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(test_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL, -- Изменение на ON DELETE SET NULL
    user_name VARCHAR(50),
    total_score INT,
    results JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

select * from  test_results where test_id=46
select * from  tests

CREATE OR REPLACE FUNCTION add_test_result(
    p_test_id INT,
    p_user_id INT,
    p_user_name VARCHAR(50),
    p_total_score INT,
    p_results JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO test_results (test_id, user_id, user_name, total_score, results)
    VALUES (p_test_id, p_user_id, p_user_name, p_total_score, p_results);
END;
$$ LANGUAGE plpgsql;



select *from test_results



SELECT * FROM tests WHERE user_id = 2

select * from  users
select * from  questions
select * from  options
select * from  correct_answers
select * from  tests

DELETE FROM tests WHERE test_id = 1;





-- Вставка данных пользователя (предположим, что у нас уже есть пользователь с user_id=1)
INSERT INTO users (username, password, email)
VALUES ('example_user', 'hashed_password', 'user@example.com');

-- Вставка данных теста
INSERT INTO tests (user_id, title, description)
VALUES (1, 'Моя анкета', 'Пример');


-- Вставка данных вопросов
INSERT INTO questions (test_id, question_order, type, question_text)
VALUES
    (1, 1, 'single-choice', 'что лучше'),
    (1, 2, 'multiple-choice', 'выбери несколько'),
    (1, 3, 'priority', 'а здесь наоборот');

INSERT INTO options (question_id, option_text)
VALUES
    (1, ARRAY['вариант 1', 'вариант 2']);

-- Для вопроса 2 (multiple-choice)
INSERT INTO options (question_id, option_text)
VALUES
    (2, ARRAY['вариант 1', 'вариант 2', 'вариант 3']);

-- Для вопроса 3 (priority)
INSERT INTO options (question_id, option_text)
VALUES
    (3, ARRAY['вариант 1', 'вариант 2', 'вариант 3']);

-- Вставка данных правильных ответов
-- Для вопроса 1 (single-choice)
INSERT INTO correct_answers (question_id, correct_answer_indices)
VALUES (1, ARRAY['вариант 1']); -- Правильный ответ индекс 0 (первый вариант)

-- Для вопроса 2 (multiple-choice)
INSERT INTO correct_answers (question_id, correct_answer_indices)
VALUES (2, ARRAY['вариант 1', 'вариант 2']); -- Правильные ответы индексы 0 и 1 (первый и второй варианты)

-- Для вопроса 3 (priority)
INSERT INTO correct_answers (question_id, correct_answer_indices)
VALUES (3, ARRAY['вариант 3', 'вариант 2','вариант 1']); -- Правильные ответы индексы 0, 1 и 2 (первый, второй и третий варианты)




CREATE OR REPLACE FUNCTION save_test_data(user_id_param BIGINT, type_param VARCHAR, test_data JSONB)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    new_test_id INT;
    q_id INT;
    i INT;
    question JSONB;
    options_array TEXT[];
    correct_answer_indices_array INT[];
    correct_answers_array TEXT[];
BEGIN
    -- Вставка данных теста и получение test_id
    INSERT INTO tests (user_id, title, description, type)
    VALUES (user_id_param, test_data->>'title', test_data->>'description', type_param)
    RETURNING test_id INTO new_test_id;

    -- Проверка правильности вставки данных
    RAISE NOTICE 'Inserted test with ID: %, Type: %', new_test_id, type_param;

    -- Итерация по вопросам
    FOR i IN 0 .. jsonb_array_length(test_data->'questions') - 1 LOOP
        question := (test_data->'questions'->i)::JSONB;
        options_array := ARRAY(SELECT jsonb_array_elements_text(question->'options'));

        -- Проверка наличия correctAnswerIndices и их корректности
        IF jsonb_exists(question, 'correctAnswerIndices') AND jsonb_typeof(question->'correctAnswerIndices') = 'array' THEN
            correct_answer_indices_array := ARRAY(SELECT jsonb_array_elements_text(question->'correctAnswerIndices')::INT);
        ELSE
            correct_answer_indices_array := '{}'; -- Пустой массив, если correctAnswerIndices отсутствует или не является массивом
        END IF;

        -- Вставка вопроса
        INSERT INTO questions (test_id, question_order, type, question_text)
        VALUES (new_test_id, i + 1, question->>'type', question->>'question')
        RETURNING question_id INTO q_id;

        -- Вставка вариантов ответов (options)
        INSERT INTO options (question_id, option_text)
        VALUES (q_id, options_array);

        -- Получение фактических ответов по индексам
        correct_answers_array := ARRAY(
            SELECT options_array[idx + 1]
            FROM unnest(correct_answer_indices_array) WITH ORDINALITY AS u(idx, ord)
            WHERE idx IS NOT NULL AND idx + 1 <= cardinality(options_array) -- Игнорируем NULL значения и проверяем на выход за пределы массива
        );

        -- Вставка фактических ответов (correct_answers)
        INSERT INTO correct_answers (question_id, correct_answer_indices)
        VALUES (q_id, correct_answers_array);

    END LOOP;

END;
$$;



select * from  tests

SELECT get_test_info(3);


CREATE OR REPLACE FUNCTION get_test_info(test_id_param INT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    test_info JSONB;
BEGIN
    -- Собираем информацию о тесте
    SELECT jsonb_build_object(
        'test_id', t.test_id,
        'user_id', t.user_id,
        'title', t.title,
        'description', t.description,
        'type', t.type,  -- Добавлено поле type
        'created_at', t.created_at,
        'questions', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'question_id', q.question_id,
                    'question_order', q.question_order,
                    'type', q.type,
                    'question_text', q.question_text,
                    'options', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'option_id', o.option_id,
                                'option_text', o.option_text
                            )
                        )
                        FROM options o
                        WHERE o.question_id = q.question_id
                    ),
                    'correct_answer_indices', ca.correct_answer_indices
                )
                ORDER BY q.question_order -- Сортировка здесь
            )
            FROM questions q
            LEFT JOIN correct_answers ca ON q.question_id = ca.question_id
            WHERE q.test_id = test_id_param
        )
    )
    INTO test_info
    FROM tests t
    WHERE t.test_id = test_id_param;

    RETURN test_info;
END;
$$;



