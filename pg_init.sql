-- Adminer 5.3.0 PostgreSQL 17.5 dump

DROP TABLE IF EXISTS "products";
DROP SEQUENCE IF EXISTS products_id_seq;
CREATE SEQUENCE products_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."products" (
    "id" integer DEFAULT nextval('products_id_seq') NOT NULL,
    "product_name" character varying NOT NULL,
    "price" double precision NOT NULL,
    "description" character varying,
    "image" character varying,
    "category" character varying[] NOT NULL,
    "brand" character varying,
    "size" character varying[],
    "color" character varying[],
    "stock" integer NOT NULL,
    "average_rating" double precision,
    "total_rating" integer,
    "original" character varying,
    "created_at" timestamp,
    "updated_at" timestamp,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX ix_products_id ON public.products USING btree (id);

INSERT INTO "products" ("id", "product_name", "price", "description", "image", "category", "brand", "size", "color", "stock", "average_rating", "total_rating", "original", "created_at", "updated_at") VALUES
(5,	'Áo thun nam',	129000,	'Áo thun nam mùa hè mát mẻ.',	'https://down-vn.img.susercontent.com/file/6aba1d32171c02c7e0c3d59a5f75fbb8@resize_w900_nl.webp',	'{Shirt}',	'Gucci',	'{S}',	'{Trắng,Đen}',	100,	0,	0,	'China',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(6,	'Quần jeans nữ dáng ôm',	249000,	'Quần jeans nữ co giãn, tôn dáng, phù hợp đi làm và đi chơi.',	'https://down-vn.img.susercontent.com/file/d97cf8971fc45df9b770cd8552b64654',	'{Pants}',	'Levi''s',	'{M,L}',	'{"Xanh nhạt",Đen}',	80,	0,	0,	'Vietnam',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(7,	'Áo sơ mi nam dài tay',	199000,	'Áo sơ mi nam lịch sự, phù hợp công sở.',	'https://down-vn.img.susercontent.com/file/6db21c30c98ab9a50f0420f3a914d971.webp',	'{Shirt}',	'Zara',	'{M,L,XL}',	'{Trắng,"Xanh dương"}',	60,	0,	0,	'Bangladesh',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(8,	'Váy maxi nữ hoa nhí',	189000,	'Váy maxi nữ chất vải voan nhẹ nhàng, họa tiết hoa nhí.',	'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvm-lzvrlm7oqf787e.webp',	'{Dress}',	'H&M',	'{S,M}',	'{Hồng,"Xanh pastel"}',	50,	0,	0,	'China',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(9,	'Áo khoác gió nam thể thao',	299000,	'Áo khoác gió nhẹ, chống nước, thích hợp tập luyện thể thao.',	'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m13mnwkyxsprc6.webp',	'{Jacket}',	'Nike',	'{L,XL}',	'{Đen,Xám}',	70,	0,	0,	'Indonesia',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(10,	'Chân váy chữ A nữ',	149000,	'Chân váy ngắn chữ A năng động, dễ phối đồ.',	'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxc-ly4urtwkaccb9b.webp',	'{Skirt}',	'Uniqlo',	'{S,M,L}',	'{Be,Nâu}',	65,	0,	0,	'Vietnam',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(11,	'Quần short nam kaki',	139000,	'Quần short nam chất kaki thoáng mát, trẻ trung.',	'https://thoitrangbigsize.vn/wp-content/uploads/2024/03/BS2419-2.jpg',	'{Shorts}',	'Lacoste',	'{M,L}',	'{"Xanh navy",Xám}',	90,	0,	0,	'Thailand',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(12,	'Áo hai dây nữ lụa',	99000,	'Áo hai dây nữ chất lụa mềm mại, mát mẻ mùa hè.',	'https://down-vn.img.susercontent.com/file/sg-11134201-7rbll-ln1lq7tp83pi29.webp',	'{Shirt}',	'Mango',	'{S,M}',	'{"Trắng kem","Hồng nude"}',	100,	0,	0,	'China',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739'),
(14,	'Áo khoác len nữ cổ tròn',	229000,	'Áo len cardigan cổ tròn, nhẹ nhàng phù hợp mùa thu.',	'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrdfp9c0jj313.webp',	'{Jacket}',	'Local Brand',	'{S,M,L}',	'{"Đỏ đô","Xanh lá"}',	45,	0,	0,	'Vietnam',	'2025-07-23 19:35:06.739',	'2025-07-23 19:35:06.739');

DROP TABLE IF EXISTS "ratings";
DROP SEQUENCE IF EXISTS ratings_id_seq;
CREATE SEQUENCE ratings_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."ratings" (
    "id" integer DEFAULT nextval('ratings_id_seq') NOT NULL,
    "product_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "rating" double precision NOT NULL,
    "comment" character varying,
    "created_at" timestamp,
    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX ix_ratings_id ON public.ratings USING btree (id);


DROP TABLE IF EXISTS "user_infos";
CREATE TABLE "public"."user_infos" (
    "user_id" integer NOT NULL,
    "first_name" character varying,
    "last_name" character varying,
    "address" character varying,
    "email" character varying NOT NULL,
    "phone_number" character varying,
    CONSTRAINT "user_infos_pkey" PRIMARY KEY ("user_id")
)
WITH (oids = false);

CREATE INDEX ix_user_infos_user_id ON public.user_infos USING btree (user_id);

CREATE UNIQUE INDEX ix_user_infos_email ON public.user_infos USING btree (email);

INSERT INTO "user_infos" ("user_id", "first_name", "last_name", "address", "email", "phone_number") VALUES
(3,	'Undefined',	'Undefined',	'Undefined',	'123',	'Undefined'),
(4,	'Undefined',	'Undefined',	'Undefined',	'longdb1@gmail.com',	'Undefined');

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_user_id_seq;
CREATE SEQUENCE users_user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "user_id" integer DEFAULT nextval('users_user_id_seq') NOT NULL,
    "role" character varying NOT NULL,
    "email" character varying NOT NULL,
    "hashed_password" character varying NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
)
WITH (oids = false);

CREATE INDEX ix_users_user_id ON public.users USING btree (user_id);

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);

INSERT INTO "users" ("user_id", "role", "email", "hashed_password") VALUES
(3,	'admin',	'123',	'$2b$12$z1YEf1gO6e5wa7/eVe1gte.6pXI8KcNwPRBQWVodOdg7ubAS4oKHm'),
(4,	'user',	'longdb1@gmail.com',	'$2b$12$2KKRd1ox4xEuIGY6i1p8kuKdAveCDz9Wlmq4kQoPqb5cYI86Xeiqy');

ALTER TABLE ONLY "public"."user_infos" ADD CONSTRAINT "user_infos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) NOT DEFERRABLE;

-- 2025-07-23 23:20:56 UTC