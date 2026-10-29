# School Database System Design

## Table Descriptions
- **`students`**: Stores core personal and contact information for each student registered in the school system. Enforces uniqueness on email addresses.
- **`courses`**: Stores information about available academic units, classes, or modules offered by the institution, identified by a unique course code.
- **`enrolments`**: A junction (join) table that connects students to courses, tracking the relationship instance along with performance data (`grade`).

## Relationships & Join Table Justification
- **Students to Courses Relationship:** This is a **many-to-many** relationship because a single student can enroll in multiple courses, and a single course can be taken by many students.
- **Why a Join Table is Needed:** Relational databases cannot store multi-valued arrays directly inside a single row cell. The `enrolments` table resolves this by breaking the many-to-many relationship into two one-to-many relationships (`students` $\rightarrow$ `enrolments`, and `courses` $\rightarrow$ `enrolments`). Furthermore, it serves as the home for relationship-specific attributes (the grade) and enforces a composite `UNIQUE(student_id, course_id)` constraint to prevent duplicate enrolments.

## Indexing
- **Index Recommendation:** Create an index on the foreign key columns in the `enrolments` table—specifically `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`. 
- **Reason:** As the school grows to thousands of records, searching or joining enrolments by student ID becomes frequent (such as in Query 1 and Query 4). Indexing foreign keys drastically speeds up lookup and join operations by avoiding full table scans.

## SQL vs. NoSQL Decision
For an academic school management system, a **Relational SQL database** is the optimal choice. School data is highly structured, predictable, and strictly relational. Academic records require absolute data integrity, atomicity, and consistency (ACID compliance), especially regarding grades, unique student identities, and immutable enrolment linkages. Relational constraints (such as foreign keys and unique rules preventing double-enrolment) guarantee that invalid or orphaned records cannot exist, which is a core requirement in educational software.
