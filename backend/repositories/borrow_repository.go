package repositories

import (
	"database/sql"
	"errors"

	"backend/models"
)

type BorrowingRepository interface {
	BorrowBook(userID, bookID int) error
	ReturnBook(userID, bookID int) error
	GetBorrowingHistory(userID int) ([]models.BorrowHistory, error)
}

type borrowingRepository struct {
	DB *sql.DB
}

func NewBorrowingRepository(db *sql.DB) BorrowingRepository {
	return &borrowingRepository{DB: db}
}

func (r *borrowingRepository) BorrowBook(userID, bookID int) error {
	var stock int
	err := r.DB.QueryRow(`SELECT stock FROM books WHERE id = $1`, bookID).Scan(&stock)
	if err != nil {
		return errors.New("book not found")
	}
	if stock <= 0 {
		return errors.New("book is out of stock")
	}

	query := `INSERT INTO borrowing_history (user_id, book_id, borrow_date, status, created_at, updated_at) 
	          VALUES ($1, $2, NOW(), 'borrowed', NOW(), NOW())`
	_, err = r.DB.Exec(query, userID, bookID)
	if err != nil {
		return err
	}

	_, err = r.DB.Exec(`UPDATE books SET stock = stock - 1 WHERE id = $1`, bookID)
	if err != nil {
		return err
	}

	return nil
}

func (r *borrowingRepository) ReturnBook(userID, bookID int) error {
	query := `UPDATE borrowing_history 
 	          SET return_date = NOW(), status = 'returned', updated_at = NOW() 
 	          WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'`
	result, err := r.DB.Exec(query, userID, bookID)
	if err != nil {
		return err
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("no active borrowing record found")
	}
	return nil
}

func (r *borrowingRepository) GetBorrowingHistory(userID int) ([]models.BorrowHistory, error) {
	query := `
	SELECT bh.id, bh.user_id, bh.book_id, b.title, b.image, b.author, b.category, 
	       bh.borrow_date, bh.return_date, bh.status, bh.created_at, bh.updated_at
	FROM borrowing_history bh
	JOIN books b ON bh.book_id = b.id
	WHERE bh.user_id = $1`

	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []models.BorrowHistory
	for rows.Next() {
		var record models.BorrowHistory
		err := rows.Scan(
			&record.ID, &record.UserID, &record.BookID,
			&record.Title, &record.Image, &record.Author, &record.Category,
			&record.BorrowDate, &record.ReturnDate, &record.Status,
			&record.CreatedAt, &record.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		history = append(history, record)
	}
	return history, nil
}
