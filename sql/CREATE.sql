SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Bord;
DROP TABLE IF EXISTS Card_Info;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Foods;
DROP TABLE IF EXISTS Food_Type;
DROP TABLE IF EXISTS Food_Reservation;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Bord(
    bord_id INTEGER NOT NULL AUTO_INCREMENT,
    bord_size INTEGER NOT NULL,
    CONSTRAINT bord_pk PRIMARY KEY(bord_id)
);

CREATE TABLE Card_Info(
    card_id INTEGER NOT NULL AUTO_INCREMENT,
    card_number LONG NOT NULL,
    card_pin INT NOT NULL,
    crad_expiry_date DATE NOT NULL,
    CONSTRAINT card_pk PRIMARY KEY(card_id)
);
    
CREATE TABLE Reservation(
    reservation_id INTEGER NOT NULL AUTO_INCREMENT,
    --card_id INTEGER NOT NULL,
    start_timestamp TIMESTAMP NOT NULL,
    end_timestamp TIMESTAMP NOT NULL,
    for_name VARCHAR(80) NOT NULL,
    bord_id INTEGER NOT NULL,
    card_number LONG NOT NULL,
    card_pin INT NOT NULL,
    card_expiry_date DATE NOT NULL,
    CONSTRAINT reservation_pk PRIMARY KEY(reservation_id),
    --CONSTRAINT reservation_card_fk FOREIGN KEY(card_id) REFERENCES Card_Info(card_id),
    CONSTRAINT bord_reservation_bord_fk FOREIGN KEY(bord_id) REFERENCES Bord(bord_id) 
);

CREATE TABLE Food_Type(
    food_type_id INTEGER NOT NULL,
    food_type_name VARCHAR(20) NOT NULL,
    CONSTRAINT food_type_pk PRIMARY KEY(food_type_id)
);

CREATE TABLE Foods(
    food_id INTEGER NOT NULL AUTO_INCREMENT,
    food_type_id INTEGER NOT NULL,
    food_name VARCHAR(50) NOT NULL,
    food_desc VARCHAR(255) NOT NULL,
    food_price FLOAT NOT NULL,
    CONSTRAINT foods_pk PRIMARY KEY(food_id),
    CONSTRAINT food_type_fk FOREIGN KEY(food_type_id) REFERENCES Food_Type(food_type_id)
);

CREATE TABLE Food_Reservation(
    reservation_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    food_amount INTEGER NOT NULL,
    CONSTRAINT food_reservation_pk PRIMARY KEY(reservation_id, food_id),
    CONSTRAINT food_reservation_food_fk FOREIGN KEY(food_id) REFERENCES Foods(food_id),
    CONSTRAINT food_reservation_reservation_fk FOREIGN KEY(reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);

INSERT INTO Food_Type VALUES (0, 'Forrett');
INSERT INTO Food_Type VALUES (1, 'Hovedrett');
INSERT INTO Food_Type VALUES (2, 'Dessert');
INSERT INTO Food_Type VALUES (3, 'Drikke');
