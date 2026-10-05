CREATE TABLE appointments (
    appointmentId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patientId UUID NOT NULL REFERENCES patients(patientId) ON DELETE CASCADE,
    createdBy UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    appointmentDate TIMESTAMP NOT NULL,

    reason TEXT NOT NULL,

    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),

    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);