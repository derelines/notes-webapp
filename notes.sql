
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    storage_limit NUMERIC DEFAULT 1000 -- в MB
);

ALTER SEQUENCE users_id_seq RESTART WITH 1000000;

-- Таблица Folders
CREATE TABLE folders (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES folders(id) ON DELETE SET NULL, -- для вложенности
    owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
ALTER SEQUENCE folders_id_seq RESTART WITH 1000000;

-- Таблица Notes
CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    title VARCHAR(200) NOT NULL,
    folder_id BIGINT REFERENCES folders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
ALTER SEQUENCE notes_id_seq RESTART WITH 1000000;

-- Индекс для поиска (оставляем)
CREATE INDEX idx_notes_content ON notes USING GIN (to_tsvector('english', content));

-- Таблица Note_Links
CREATE TABLE note_links (
    id BIGSERIAL PRIMARY KEY,
    from_note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    to_note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE
);
ALTER SEQUENCE note_links_id_seq RESTART WITH 1000000;

-- Таблица Permissions (resource_id как BIGINT, полиморфный — без REFERENCES)
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    resource_type VARCHAR(10) NOT NULL CHECK (resource_type IN ('note', 'folder')),
    resource_id BIGINT NOT NULL, -- Полиморфный: на notes.id или folders.id
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    permission_level VARCHAR(10) NOT NULL CHECK (permission_level IN ('view', 'edit', 'delete')),
    share_link BIGINT UNIQUE GENERATED ALWAYS AS (id) STORED, -- Пример: используем id как share_link, или генерируйте в коде
    expiration TIMESTAMP WITH TIME ZONE
);
ALTER SEQUENCE permissions_id_seq RESTART WITH 1000000;

-- Таблица Complaints
CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    resource_type VARCHAR(10) NOT NULL CHECK (resource_type IN ('note', 'folder')),
    resource_id BIGINT NOT NULL, -- Полиморфный
    complainant_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER SEQUENCE complaints_id_seq RESTART WITH 1000000;

-- Таблица Logs
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
ALTER SEQUENCE logs_id_seq RESTART WITH 1000000;
GRANT ALL PRIVILEGES ON DATABASE notes TO notes_user;


GRANT ALL ON SCHEMA public TO notes_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO notes_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO notes_user;

-- 5. Дайте права на создание таблиц
ALTER USER notes_user CREATEDB;

select * from users;
select * from notes;