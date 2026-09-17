-- UP 2 Hand Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- This creates 6 tables: members, items, item_images, conversations, messages, reviews

CREATE TABLE members (
    member_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE items (
    item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE item_images (
    image_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_id BIGINT NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE conversations (
    conversation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_id BIGINT NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (item_id, member_id)
);


CREATE TABLE messages (
    message_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE reviews (
    review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reviewer_id UUID NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_no_self_review CHECK (reviewer_id <> reviewee_id)
);