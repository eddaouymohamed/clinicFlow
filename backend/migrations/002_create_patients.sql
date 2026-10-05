CREATE TABLE patients (
    patientId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    fullName VARCHAR(255) NOT NULL,
    cin VARCHAR(20) NOT NULL UNIQUE,

    birthDate DATE NOT NULL,

    phone  VARCHAR(15) NOT NULL,

    address TEXT NOT NULL,

    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

