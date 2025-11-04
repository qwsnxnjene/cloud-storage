package auth

import (
	"sync"
	"time"

	"github.com/qwsnxnjene/cloud-storage/backend/internal/models"
	"github.com/qwsnxnjene/cloud-storage/backend/pkg/utils"
)

// UserStore is an in-memory user store (for simplicity in this educational project)
type UserStore struct {
	users map[string]*models.User // key is user ID
	mu    sync.RWMutex
}

var store = &UserStore{
	users: make(map[string]*models.User),
}

// GetStore returns the global user store
func GetStore() *UserStore {
	return store
}

// CreateUser creates a new user
func (s *UserStore) CreateUser(username, email, password string) (*models.User, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if username already exists
	for _, user := range s.users {
		if user.Username == username {
			return nil, &DuplicateUserError{Username: username}
		}
		if user.Email == email {
			return nil, &DuplicateEmailError{Email: email}
		}
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	// Generate ID
	id, err := utils.GenerateID()
	if err != nil {
		return nil, err
	}

	user := &models.User{
		ID:        id,
		Username:  username,
		Email:     email,
		Password:  hashedPassword,
		Theme:     "light",
		CreatedAt: time.Now(),
	}

	s.users[id] = user
	return user, nil
}

// GetUserByUsername returns a user by username
func (s *UserStore) GetUserByUsername(username string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, user := range s.users {
		if user.Username == username {
			return user, nil
		}
	}

	return nil, &UserNotFoundError{Username: username}
}

// GetUserByID returns a user by ID
func (s *UserStore) GetUserByID(id string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, ok := s.users[id]
	if !ok {
		return nil, &UserNotFoundError{ID: id}
	}

	return user, nil
}

// UpdateUserTheme updates a user's theme preference
func (s *UserStore) UpdateUserTheme(userID, theme string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	user, ok := s.users[userID]
	if !ok {
		return &UserNotFoundError{ID: userID}
	}

	user.Theme = theme
	return nil
}

// Custom errors
type DuplicateUserError struct {
	Username string
}

func (e *DuplicateUserError) Error() string {
	return "username already exists: " + e.Username
}

type DuplicateEmailError struct {
	Email string
}

func (e *DuplicateEmailError) Error() string {
	return "email already exists: " + e.Email
}

type UserNotFoundError struct {
	Username string
	ID       string
}

func (e *UserNotFoundError) Error() string {
	if e.Username != "" {
		return "user not found: " + e.Username
	}
	return "user not found with ID: " + e.ID
}
