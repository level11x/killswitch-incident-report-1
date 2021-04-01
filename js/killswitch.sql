-- -------------------------------------------------------------
-- TablePlus 3.12.2(358)
--
-- https://tableplus.com/
--
-- Database: killswitch
-- Generation Time: 2564-04-01 11:12:03.8590
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS all_deposit_lp_id_seq;

-- Table Definition
CREATE TABLE "public"."all_deposit_lp" (
    "id" int4 NOT NULL DEFAULT nextval('all_deposit_lp_id_seq'::regclass),
    "wallet" varchar,
    "lp_value" varchar,
    "hash" varchar,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS all_withdraw_lp_id_seq;

-- Table Definition
CREATE TABLE "public"."all_withdraw_lp" (
    "id" int4 NOT NULL DEFAULT nextval('all_withdraw_lp_id_seq'::regclass),
    "wallet" varchar,
    "lp_value" varchar,
    "hash" varchar,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS total_per_wallet_id_seq;

-- Table Definition
CREATE TABLE "public"."total_per_wallet" (
    "id" int4 NOT NULL DEFAULT nextval('total_per_wallet_id_seq'::regclass),
    "wallet" varchar,
    "total_lp_value" varchar,
    PRIMARY KEY ("id")
);

