create table carinfo(
carnumber varchar(10),
brand varchar(20),
name varchar(20),
price int(10)
);

create table parkinfo(
carnumber varchar(10),
parkin datetime,
parkingnumber int(20),
firstpay datetime,
parkout datetime,
secondpay datetime
);

create table parkinginfo(
parkingnumber int(20),
parkingname varchar(50),
parkloc varchar(50)
);

create table userinfo(
account varchar(50),
nickname varchar(50),
carnumber1 varchar(10),
carnumber2 varchar(10),
carnumber3 varchar(10),
carnumber4 varchar(10),
carnumber5 varchar(10)
);

