-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

-- Students table with unique email constraint
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- Enrolments join table linking students and courses
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    -- Prevents the same student from enrolling in the same course twice
    UNIQUE(student_id, course_id)
);

-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

-- Insert at least 3 students (plus one extra to test students with no enrolments)
INSERT INTO students (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('Diana Prince', 'diana@example.com');

-- Insert at least 3 courses
INSERT INTO courses (title, code) VALUES 
('Database Systems', 'CS101'),
('Algorithm Analysis', 'CS102'),
('Web Foundations', 'CS103');

-- Insert at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'B+'),
(1, 2, 'A'),
(2, 1, 'C'),
(2, 3, 'B'),
(3, 2, 'A-');

-- ==========================================
-- 3. REQUIRED QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name, e.g., 'Alice Smith')
SELECT c.title, c.code, e.grade 
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course (e.g., 'Database Systems')
SELECT s.name, s.email, e.grade 
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE c.title = 'Database Systems';

-- Query 3: The number of students per course (using LEFT JOIN to include courses with 0 students)
SELECT c.title, c.code, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.code;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email 
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade (e.g., update Alice's grade in Database Systems)
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;