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
    deleted_at TIMESTAMP NULL
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
    stock INT CHECK (stock >= 0) DEFAULT 0,
    image text ,  -- Store book cover as binary data
    publisher VARCHAR(255),
    publication_year INT CHECK (publication_year > 0),
    pages INT CHECK (pages > 0),
    language VARCHAR(100),
    description TEXT,
    isbn VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Borrowing history table
CREATE TABLE borrowing_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status VARCHAR(20) CHECK (status IN ('borrowed', 'returned')) NOT NULL DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- User details table
CREATE TABLE user_details (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    about_me TEXT,
    genre VARCHAR(50),
    phone VARCHAR(20) UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);


drop table user_details;
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

INSERT INTO books (title, author, category, stock, image, publisher, publication_year, pages, language, description, isbn)  
VALUES  
('Dune', 'Frank Herbert', 'Science Fiction', 5, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'Ace Books', 1965, 412, 'English', 'A science fiction classic set in a desert world.', '9780441013593'),  
('Pride and Prejudice', 'Jane Austen', 'Romance', 8, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'Penguin Classics', 1813, 432, 'English', 'A timeless romantic novel about manners and marriage.', '9780141439518'),  
('The Silent Patient', 'Alex Michaelides', 'Thriller', 7, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'Celadon Books', 2019, 336, 'English', 'A psychological thriller about a woman who stops speaking.', '9781250301697'),  
('The Name of the Wind', 'Patrick Rothfuss', 'Fantasy', 12, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'DAW Books', 2007, 662, 'English', 'The story of a gifted young man in a magical world.', '9780756404741'),  
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Mystery', 6, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'Knopf', 2005, 672, 'English', 'A gripping mystery featuring hacker Lisbeth Salander.', '9780307949486'),  
('The Martian', 'Andy Weir', 'Science Fiction', 9, 'https://images.unsplash.com/photo-1634200823867-923b5929737c', 'Crown', 2011, 369, 'English', 'A stranded astronaut fights for survival on Mars.', '9780553418026'),  
('Gone Girl', 'Gillian Flynn', 'Thriller', 4, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Crown', 2012, 432, 'English', 'A psychological thriller about a missing wife.', '9780307588371'),  
('Educated', 'Tara Westover', 'Biography', 3, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Random House', 2018, 352, 'English', 'A memoir about growing up in a strict and abusive household.', '9780399590504'),  
('The Power of Habit', 'Charles Duhigg', 'Self-Help', 11, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Random House', 2012, 371, 'English', 'Exploring the science behind habit formation.', '9780812981605'),  
('Atomic Habits', 'James Clear', 'Self-Help', 15, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Avery', 2018, 320, 'English', 'How small habits can lead to remarkable results.', '9780735211292'),  
('Sapiens', 'Yuval Noah Harari', 'History', 6, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Harper', 2011, 464, 'English', 'A history of humankind.', '9780062316097'),  
('The Psychology of Money', 'Morgan Housel', 'Finance', 14, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Harriman House', 2020, 252, 'English', 'Timeless lessons on wealth and investing.', '9780857197689'),  
('Meditations', 'Marcus Aurelius', 'Philosophy', 5, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Penguin Classics', 180, 256, 'English', 'Philosophical reflections by a Roman Emperor.', '9780140449334'),  
('The Catcher in the Rye', 'J.D. Salinger', 'Classic', 7, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Little, Brown', 1951, 277, 'English', 'A novel about teenage alienation.', '9780316769488'),  
('To Kill a Mockingbird', 'Harper Lee', 'Classic', 10, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'J.B. Lippincott & Co.', 1960, 336, 'English', 'A classic novel about racial injustice.', '9780061120084'),  
('Harry Potter and the Sorcerer’s Stone', 'J.K. Rowling', 'Fantasy', 20, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Bloomsbury', 1997, 309, 'English', 'The first book in the Harry Potter series.', '9780439554930'),  
('1984', 'George Orwell', 'Dystopian', 9, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Secker & Warburg', 1949, 328, 'English', 'A dystopian novel about a totalitarian regime.', '9780451524935'),  
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 13, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Scribner', 1925, 180, 'English', 'A novel about the American Dream.', '9780743273565'),  
('Brave New World', 'Aldous Huxley', 'Dystopian', 10, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Chatto & Windus', 1932, 311, 'English', 'A futuristic dystopian novel.', '9780060850524'),  
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 18, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Allen & Unwin', 1937, 310, 'English', 'A prelude to The Lord of the Rings.', '9780618260300'),  
('Fahrenheit 451', 'Ray Bradbury', 'Dystopian', 12, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'Ballantine Books', 1953, 194, 'English', 'A novel about book burning and censorship.', '9781451673319'),  
('Crime and Punishment', 'Fyodor Dostoevsky', 'Classic', 7, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'The Russian Messenger', 1866, 671, 'English', 'A psychological exploration of guilt.', '9780486415871'),  
('Les Misérables', 'Victor Hugo', 'Classic', 5, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'A. Lacroix', 1862, 1463, 'English', 'A novel about law and grace.', '9780451419439'),  
('War and Peace', 'Leo Tolstoy', 'Classic', 8, 'https://images.unsplash.com/photo-1736612356952-64812fbd8c3c', 'The Russian Messenger', 1869, 1225, 'English', 'A novel about Napoleon’s invasion of Russia.', '9781853260629');  

INSERT INTO user_details (user_id, username, full_name, about_me, genre, phone, address)
VALUES
    (1, 'admin', 'Admin User', 'Administrator account', 'None', '1234567890', 'Admin Office'),
    (2, 'salsa', 'Salsa User', 'Loves reading fiction', 'Fiction', '9876543210', 'Jakarta, Indonesia'),
    (3, 'niar', 'Niar User', 'Technology enthusiast', 'Technology', '8123456789', 'Bandung, Indonesia'),
    (4, 'niarsalsa', 'Niarsalsa', 'Passionate about AI', 'Science', '8212345678', 'Surabaya, Indonesia'),
    (5, 'admin2', 'Admin2', 'Second admin account', 'None', '8312345678', 'Admin HQ'),
    (7, 'niarsa', 'Niarsa', 'Enjoys traveling', 'Travel', '8412345678', 'Yogyakarta, Indonesia');

   
SELECT * FROM books;
SELECT * FROM books WHERE id = 2;
SELECT * FROM users;
SELECT * FROM user_details;

SELECT * FROM user_details WHERE user_id = 3 and deleted_At is null ;

SELECT u.id, u.username, u.email, u.role, 
       ud.full_name, ud.about_me, ud.genre, 
       ud.phone, ud.address
FROM users u
LEFT JOIN user_details ud ON u.id = ud.user_id
WHERE u.username = 'niar';
