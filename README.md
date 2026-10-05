    USERS {
        UUID userId PK
        VARCHAR fullName
        VARCHAR email UK
        VARCHAR password
        VARCHAR role
        VARCHAR avatar
        TIMESTAMP createdAt
    }

    PATIENTS {
        UUID patientId PK
        VARCHAR fullName
        VARCHAR cin UK
        DATE birthDate
        VARCHAR phone
        VARCHAR address
        TIMESTAMP createdAt
    }

    APPOINTMENTS {
        UUID appointmentId PK
        UUID patientId FK
        UUID createdBy FK
        TIMESTAMP appointmentDate
        TEXT reason
        VARCHAR status
        TIMESTAMP createdAt
    }
