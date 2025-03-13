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
	query := `INSERT INTO borrowing_history (user_id, book_id, status) VALUES ($1, $2, 'borrowed')`
	_, err := r.DB.Exec(query, userID, bookID)
	return err
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
	query := `SELECT id, user_id, book_id, borrow_date, return_date, status, created_at, updated_at 
	          FROM borrowing_history WHERE user_id = $1`
	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []models.BorrowHistory
	for rows.Next() {
		var record models.BorrowHistory
		err := rows.Scan(&record.ID, &record.UserID, &record.BookID, &record.BorrowDate, &record.ReturnDate, &record.Status, &record.CreatedAt, &record.UpdatedAt)
		if err != nil {
			return nil, err
		}
		history = append(history, record)
	}
	return history, nil
}
