create database librarydb;

-- ENUM for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
    stock INT CHECK (stock >= 0) DEFAULT 0,
    image BYTEA,  -- Store book cover as binary data
    publisher VARCHAR(255),
    publication_year INT CHECK (publication_year > 0),
    pages INT CHECK (pages > 0),
    language VARCHAR(100),
    description TEXT,
    isbn VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Borrowing history table
CREATE TABLE borrowing_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL, -- New: Borrowing due date
    return_date TIMESTAMP NULL,
    status VARCHAR(20) CHECK (status IN ('borrowed', 'returned', 'overdue')) NOT NULL DEFAULT 'borrowed',
    late_fee DECIMAL(10,2) DEFAULT 0, -- New: Track late fees
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Function to update the "updated_at" timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update "updated_at" on modification
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_borrowing_history_updated_at
BEFORE UPDATE ON borrowing_history
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO books (
    title, author, category, stock, publisher, publication_year, pages, language, description, isbn
) VALUES
('The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 'Programming', 10, 'Addison-Wesley', 1999, 352, 'English', 'A classic book covering best practices for software development.', '978-0201616224'),
('Clean Code', 'Robert C. Martin', 'Software Engineering', 15, 'Prentice Hall', 2008, 464, 'English', 'A book that teaches how to write maintainable and clean software.', '978-0132350884'),
('Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 'Computer Science', 5, 'MIT Press', 2009, 1312, 'English', 'A fundamental book on algorithms covering a broad range of topics.', '978-0262033848'),
('Deep Learning', 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', 'Machine Learning', 8, 'MIT Press', 2016, 800, 'English', 'Comprehensive deep learning fundamentals.', '978-0262035613'),
('You Don''t Know JS', 'Kyle Simpson', 'JavaScript', 12, 'O''Reilly Media', 2015, 278, 'English', 'An in-depth book on JavaScript.', '978-1491904244'),
('Eloquent JavaScript', 'Marijn Haverbeke', 'JavaScript', 7, 'No Starch Press', 2018, 472, 'English', 'A modern introduction to JavaScript.', '978-1593279509'),
('JavaScript: The Good Parts', 'Douglas Crockford', 'JavaScript', 9, 'O''Reilly Media', 2008, 176, 'English', 'A guide to writing better JavaScript.', '978-0596517748'),
('Python Crash Course', 'Eric Matthes', 'Python', 10, 'No Starch Press', 2019, 544, 'English', 'A beginner-friendly introduction to Python.', '978-1593279288'),
('Fluent Python', 'Luciano Ramalho', 'Python', 6, 'O''Reilly Media', 2015, 792, 'English', 'A deep dive into Python’s advanced concepts.', '978-1491946008'),
('Automate the Boring Stuff with Python', 'Al Sweigart', 'Python', 13, 'No Starch Press', 2019, 592, 'English', 'Learn how to automate everyday tasks with Python.', '978-1593279929'),
('The Rust Programming Language', 'Steve Klabnik, Carol Nichols', 'Rust', 5, 'No Starch Press', 2018, 552, 'English', 'An introduction to Rust programming.', '978-1718500440'),
('C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'C', 4, 'Prentice Hall', 1988, 272, 'English', 'The classic C programming guide.', '978-0131103627'),
('Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Software Engineering', 6, 'Addison-Wesley', 1994, 395, 'English', 'A guide to software design patterns.', '978-0201633610'),
('Refactoring', 'Martin Fowler', 'Software Engineering', 8, 'Addison-Wesley', 2018, 448, 'English', 'A guide to improving existing code.', '978-0134757599'),
('Code Complete', 'Steve McConnell', 'Software Engineering', 10, 'Microsoft Press', 2004, 960, 'English', 'A practical handbook of software construction.', '978-0735619678'),
('The Mythical Man-Month', 'Frederick P. Brooks Jr.', 'Software Engineering', 7, 'Addison-Wesley', 1995, 336, 'English', 'Essays on software engineering.', '978-0201835957'),
('The Art of Computer Programming', 'Donald E. Knuth', 'Computer Science', 2, 'Addison-Wesley', 1968, 672, 'English', 'A legendary computer science book.', '978-0201896835'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Artificial Intelligence', 3, 'Pearson', 2020, 1136, 'English', 'Comprehensive AI textbook.', '978-0134610993'),
('Data Science from Scratch', 'Joel Grus', 'Data Science', 9, 'O''Reilly Media', 2019, 406, 'English', 'Learn data science with Python.', '978-1492041139'),
('Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', 'Aurélien Géron', 'Machine Learning', 7, 'O''Reilly Media', 2019, 856, 'English', 'A practical guide to ML.', '978-1492032649'),
('Reinforcement Learning: An Introduction', 'Richard S. Sutton, Andrew G. Barto', 'Machine Learning', 4, 'MIT Press', 2018, 552, 'English', 'An introduction to RL.', '978-0262039246'),
('Compilers: Principles, Techniques, and Tools', 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman', 'Computer Science', 3, 'Pearson', 2006, 1009, 'English', 'The Dragon Book for compiler design.', '978-0321486813'),
('Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', 'Computer Science', 6, 'Wiley', 2018, 944, 'English', 'A comprehensive guide to operating systems.', '978-1119456339'),
('Computer Networking: A Top-Down Approach', 'James F. Kurose, Keith W. Ross', 'Networking', 5, 'Pearson', 2020, 912, 'English', 'A deep dive into networking.', '978-0136681557');

select * from books;