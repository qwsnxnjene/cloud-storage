package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/qwsnxnjene/cloud-storage/backend/internal/auth"
	"github.com/qwsnxnjene/cloud-storage/backend/internal/models"
	"github.com/qwsnxnjene/cloud-storage/backend/pkg/utils"
)

type AuthHandler struct {
	store *auth.UserStore
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		store: auth.GetStore(),
	}
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Username, email and password are required", http.StatusBadRequest)
		return
	}

	// Create user
	user, err := h.store.CreateUser(req.Username, req.Email, req.Password)
	if err != nil {
		switch err.(type) {
		case *auth.DuplicateUserError, *auth.DuplicateEmailError:
			http.Error(w, err.Error(), http.StatusConflict)
		default:
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
		}
		return
	}

	// Generate token
	token, err := auth.GenerateToken(user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Return response
	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Username == "" || req.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	// Get user
	user, err := h.store.GetUserByUsername(req.Username)
	if err != nil {
		http.Error(w, "Неверные данные", http.StatusUnauthorized)
		return
	}

	// Check password
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		http.Error(w, "Неверный пароль", http.StatusUnauthorized)
		return
	}

	// Generate token
	token, err := auth.GenerateToken(user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Return response
	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetProfile returns the current user's profile
func (h *AuthHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user from context (set by middleware)
	user := r.Context().Value(userContextKey).(*models.User)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// UpdateTheme updates the user's theme preference
func (h *AuthHandler) UpdateTheme(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user from context
	user := r.Context().Value(userContextKey).(*models.User)

	var req models.ThemeUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate theme
	if req.Theme != "light" && req.Theme != "dark" {
		http.Error(w, "Theme must be 'light' or 'dark'", http.StatusBadRequest)
		return
	}

	// Update theme
	if err := h.store.UpdateUserTheme(user.ID, req.Theme); err != nil {
		http.Error(w, "Failed to update theme", http.StatusInternalServerError)
		return
	}

	// Get updated user
	updatedUser, err := h.store.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedUser)
}

// contextKey is a custom type for context keys
type contextKey string

const userContextKey contextKey = "user"

// AuthMiddleware validates JWT token and sets user in context
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing authorization header", http.StatusUnauthorized)
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Validate token
		claims, err := auth.ValidateToken(token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Get user from store
		store := auth.GetStore()
		user, err := store.GetUserByID(claims.UserID)
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		// Set user in context
		ctx := context.WithValue(r.Context(), userContextKey, user)
		r = r.WithContext(ctx)

		next(w, r)
	}
}
