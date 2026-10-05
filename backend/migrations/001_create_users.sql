CREATE TABLE users (
    userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    fullName VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(50) NOT NULL CHECK (role IN ('staff', 'admin')),

    avatar VARCHAR(500),

    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);