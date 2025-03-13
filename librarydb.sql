CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
    stock INT CHECK (stock >= 0) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

create table borrowing_history (
	id serial primary key,
	user_id int references users(id) on delete cascade,
	book_id int references books(id) on delete cascade,
	borrow_date timestamp default current_timestamp,
	return_date timestamp null,
	status varchar(20) check (status in ('borrowed', 'returned')) not null default 'borrowed',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);	


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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


INSERT INTO users (username, email, password_hash, role) VALUES
('salsa', 'salsa@example.com', 'salsa', 'user'),
('niaradmin', 'niaradmin@example.com', 'niaradmin', 'admin'),
('niar', 'niar@example.com', 'niar', 'user');

SELECT * FROM users;
SELECT password_hash FROM users WHERE email = 'salsa@example.com';
UPDATE users SET password_hash = '$2a$10$9/vS1Fmsjsysd0kv5gAQNuuv4iIp3SX7WVc.iIvkQf9LZorc9Zpkm' WHERE email = 'salsa1@example.com';

INSERT INTO books (title, author, category, stock, image_url)
VALUES
('Book Title 1', 'Author 1', 'Fantasy', 10, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1368'),
('Book Title 2', 'Author 2', 'Science Fiction', 5, 'https://images.unsplash.com/photo-1485740112426-0c2549fa8c86?q=80&w=1470'),
('Book Title 3', 'Author 3', 'Romance', 8, 'https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?q=80&w=1374');

INSERT INTO books (title, author, category, stock, image_url)  
VALUES  
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 10, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1368'),  
('Dune', 'Frank Herbert', 'Science Fiction', 5, 'https://images.unsplash.com/photo-1485740112426-0c2549fa8c86?q=80&w=1470'),  
('Pride and Prejudice', 'Jane Austen', 'Romance', 8, 'https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?q=80&w=1374'),  
('The Silent Patient', 'Alex Michaelides', 'Thriller', 7, 'https://images.unsplash.com/photo-1514894780887-121968d00567?q=80&w=1368'),  
('The Name of the Wind', 'Patrick Rothfuss', 'Fantasy', 12, 'https://images.unsplash.com/photo-1496104679561-38b3c5d5e4d1?q=80&w=1368'),  
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Mystery', 6, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1374'),  
('The Martian', 'Andy Weir', 'Science Fiction', 9, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470'),  
('Gone Girl', 'Gillian Flynn', 'Thriller', 4, 'https://images.unsplash.com/photo-1494972688394-4cc796f9e4c1?q=80&w=1374'),  
('Educated', 'Tara Westover', 'Biography', 3, 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1368'),  
('The Power of Habit', 'Charles Duhigg', 'Self-Help', 11, 'https://images.unsplash.com/photo-1517673132405-bd7a0e37fd68?q=80&w=1368'),  
('Atomic Habits', 'James Clear', 'Self-Help', 15, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1374'),  
('Sapiens', 'Yuval Noah Harari', 'History', 6, 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1470'),  
('The Psychology of Money', 'Morgan Housel', 'Finance', 14, 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1470'),  
('Meditations', 'Marcus Aurelius', 'Philosophy', 5, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1470'),  
('The Catcher in the Rye', 'J.D. Salinger', 'Classic', 7, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1368'),  
('To Kill a Mockingbird', 'Harper Lee', 'Classic', 10, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1470'),  
('Harry Potter and the Sorcerer’s Stone', 'J.K. Rowling', 'Fantasy', 20, 'https://images.unsplash.com/photo-1544716278-95005744e03e?q=80&w=1374'),  
('1984', 'George Orwell', 'Dystopian', 9, 'https://images.unsplash.com/photo-1515168833906-8733dc5da7d9?q=80&w=1368'),  
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 13, 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1368');  

select * from books;

CREATE TABLE book_details (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    publisher VARCHAR(255),
    publication_year INT,
    pages INT,
    language VARCHAR(100),
    description TEXT,
    isbn VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

INSERT INTO book_details (book_id, publisher, publication_year, pages, language, description, isbn) 
VALUES (1, 'Penguin Books', 2022, 350, 'English', 'A detailed book on modern software architecture.', '978-3-16-148410-0');

INSERT INTO book_details (book_id, publisher, publication_year, isbn, pages, language, description)
VALUES
((SELECT id FROM books WHERE title = 'The Hobbit'), 'HarperCollins', 1937, '978-0007525492', 310, 'English', 'A fantasy novel about Bilbo Baggins on an adventure.'),
((SELECT id FROM books WHERE title = 'Dune'), 'Ace Books', 1965, '978-0441013593', 412, 'English', 'A sci-fi novel set in a desert world with political intrigue.'),
((SELECT id FROM books WHERE title = 'Pride and Prejudice'), 'Penguin Classics', 1813, '978-0141439518', 279, 'English', 'A classic romance novel by Jane Austen.'),
((SELECT id FROM books WHERE title = 'The Silent Patient'), 'Celadon Books', 2019, '978-1250301697', 336, 'English', 'A psychological thriller about a woman who stops speaking after a crime.'),
((SELECT id FROM books WHERE title = 'The Name of the Wind'), 'DAW Books', 2007, '978-0756404741', 662, 'English', 'A fantasy novel following the journey of Kvothe.'),
((SELECT id FROM books WHERE title = 'The Martian'), 'Crown Publishing', 2011, '978-0553418026', 369, 'English', 'A stranded astronaut tries to survive on Mars.'),
((SELECT id FROM books WHERE title = 'Educated'), 'Random House', 2018, '978-0399590504', 334, 'English', 'A memoir of a woman’s journey from a survivalist family to education.'),
((SELECT id FROM books WHERE title = 'Atomic Habits'), 'Avery', 2018, '978-0735211292', 320, 'English', 'A self-help book about habit formation and productivity.'),
((SELECT id FROM books WHERE title = '1984'), 'Secker & Warburg', 1949, '978-0451524935', 328, 'English', 'A dystopian novel about a totalitarian regime.'),
((SELECT id FROM books WHERE title = 'The Great Gatsby'), 'Scribner', 1925, '978-0743273565', 180, 'English', 'A classic American novel about wealth and love.');


INSERT INTO book_details (book_id, publisher, publication_year, pages, language, description, isbn)
VALUES
    (2, 'Publisher A', 2020, 350, 'English', 'Description for Book Title 2', '978-1000000001'),
    (3, 'Publisher B', 2019, 400, 'English', 'Description for Book Title 3', '978-1000000002'),
    (5, 'Chilton Books', 1965, 412, 'English', 'Science fiction novel by Frank Herbert.', '978-1000000003'),
    (6, 'T. Egerton, Whitehall', 1813, 432, 'English', 'A novel by Jane Austen.', '978-1000000004'),
    (7, 'Celadon Books', 2019, 336, 'English', 'Psychological thriller by Alex Michaelides.', '978-1000000005'),
    (8, 'DAW Books', 2007, 662, 'English', 'Fantasy novel by Patrick Rothfuss.', '978-1000000006'),
    (9, 'Norstedts Förlag', 2005, 672, 'English', 'Crime novel by Stieg Larsson.', '978-1000000007'),
    (10, 'Crown Publishing', 2014, 369, 'English', 'Sci-fi novel by Andy Weir.', '978-1000000008'),
    (11, 'Crown Publishing', 2012, 432, 'English', 'Psychological thriller by Gillian Flynn.', '978-1000000009'),
    (12, 'Random House', 2018, 352, 'English', 'Memoir by Tara Westover.', '978-1000000010'),
    (13, 'Random House', 2012, 400, 'English', 'Self-help book by Charles Duhigg.', '978-1000000011'),
    (14, 'Penguin Random House', 2018, 320, 'English', 'Self-help book by James Clear.', '978-1000000012'),
    (15, 'Harper', 2011, 464, 'English', 'A brief history of humankind by Yuval Noah Harari.', '978-1000000013'),
    (16, 'Harriman House', 2020, 256, 'English', 'Personal finance book by Morgan Housel.', '978-1000000014'),
    (17, 'Penguin Classics', 2006, 304, 'English', 'Philosophical work by Marcus Aurelius.', '978-1000000015'),
    (18, 'Little, Brown and Company', 1951, 277, 'English', 'Novel by J.D. Salinger.', '978-1000000016'),
    (19, 'J.B. Lippincott & Co.', 1960, 281, 'English', 'Novel by Harper Lee.', '978-1000000017'),
    (20, 'Bloomsbury', 1997, 309, 'English', 'Fantasy novel by J.K. Rowling.', '978-1000000018'),
    (21, 'Secker & Warburg', 1949, 328, 'English', 'Dystopian novel by George Orwell.', '978-1000000019'),
    (22, 'Charles Scribner’s Sons', 1925, 180, 'English', 'Novel by F. Scott Fitzgerald.', '978-1000000020'),
    (23, 'Addison-Wesley', 1999, 352, 'English', 'Software development book by Andrew Hunt and David Thomas.', '978-1000000021');


   
select * from book_details;

SELECT * FROM book_details WHERE isbn = '978-0441013593';
