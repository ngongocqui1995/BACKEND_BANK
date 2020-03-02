-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 13, 2020 at 03:52 PM
-- Server version: 5.7.29
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thongbao_test`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_DangNhap` (IN `Username_IN` VARCHAR(64) CHARSET utf8mb4, IN `Pass_IN` VARCHAR(128) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN    
    IF exists(select* from TaiKhoan where Username = Username_IN and Pass = Pass_IN) THEN
    	SET Ketqua_OUT = '0: Đăng Nhập Thành Công!';
        
    ELSEIF exists(select* from TaiKhoan where Username = Username_IN and Pass != Pass_IN) THEN
    	SET Ketqua_OUT = '1: Bạn Nhập Sai Password!';
    ELSEIF exists(select* from TaiKhoan where Username != Username_IN)THEN
    	SET Ketqua_OUT = '2: Tài Khoản này không tồn tại!';
     END IF;
END$$
CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_DoiPassTaiKhoan` (IN `Username_IN` VARCHAR(64) CHARSET utf8mb4, IN `Pass_IN` VARCHAR(560) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
    DECLARE ktra int;
    SET ktra = 0;
    IF Pass_IN='' THEN
    	SET Ketqua_OUT = '1: Bạn chưa nhập pass';
        SET ktra = 1;
    END IF;

   
        IF (LENGTH(Pass_IN) >= 560 or LENGTH(Pass_IN) <= 5) and Pass_IN !='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 3: Pass có số lượng từ không hợp lệ!');
        
        SET ktra = 1;
    END IF;    

    IF Username_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 4: Bạn chưa nhập  Username');
        SET ktra = 1;
    END IF;


    IF(ktra = 0) THEN
    	UPDATE TaiKhoan
        SET Pass = Pass_IN
		WHERE Username = Username_IN;
        SET Ketqua_OUT = '0: Sửa Password thành công!';
    END IF;
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_GiaoDichDoiNo` (IN `ID_TaiKhoan_TTTK_A_IN` INT(12), IN `TenNganHangLienKet_A_IN` VARCHAR(64) CHARSET utf8mb4, IN `ID_TaiKhoan_TTTK_B_IN` INT(12), IN `TenNganHangLienKet_B_IN` VARCHAR(64) CHARSET utf8mb4, IN `SoTien_IN` FLOAT(12), IN `LoaiGiaoDich_IN` VARCHAR(64) CHARSET utf8mb4, IN `GhiChu_IN` VARCHAR(564) CHARSET utf8mb4, IN `NguoiTraPhi_IN` VARCHAR(564) CHARSET utf8mb4, IN `ID_TraNo_IN` INT(12), OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
    DECLARE ktra int;
    DECLARE tktt int;
    DECLARE idnganhanglienket_A int;
    DECLARE idnganhanglienket_B int;
    DECLARE tiencantra int;
    DECLARE sodu_A FLOAT;
    SET tiencantra = (SELECT SoTien FROM GiaoDich WHERE ID_GiaoDich = ID_TraNo_IN);
    SET ktra = 0;
    IF ID_TaiKhoan_TTTK_A_IN='' THEN
    	SET Ketqua_OUT = '1: Bạn chưa nhập TK bên A';
        SET ktra = 1;
    END IF;

	IF ID_TaiKhoan_TTTK_B_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',2: Bạn chưa nhập TK bên B');
        SET ktra = 1;
    END IF;

	IF 	TenNganHangLienKet_A_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',3: Bạn chưa nhập Ngân Hàng bên A');
        SET ktra = 1;
    END IF;
    
	IF 	TenNganHangLienKet_B_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',4: Bạn chưa nhập Ngân Hàng bên B');
        SET ktra = 1;
    END IF;
    
	IF 	SoTien_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',5: Bạn chưa nhập Số Tiền');
        SET ktra = 1;
    END IF;
    
    IF 	LoaiGiaoDich_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',6: Bạn chưa nhập Loại giao dịch');
        SET ktra = 1;
    END IF;
    
    IF 	NguoiTraPhi_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',7: Bạn chưa nhập Bên Nào Trả Phí');
        SET ktra = 1;
    END IF;

    
    IF not exists(select* from NganHangLienKet where TenNganHang = TenNganHangLienKet_A_IN) THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',11: Ngan Hang Bên A chưa liên kết');
        SET ktra = 1;
    END IF;    
    
    IF not exists(select* from NganHangLienKet where TenNganHang = TenNganHangLienKet_B_IN) THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',12: Ngan Hang Bên B chưa liên kết');
        SET ktra = 1;
    END IF; 
    
    SET idnganhanglienket_A = (SELECT ID_NganHangLienKet FROM NganHangLienKet WHERE TenNganHang = TenNganHangLienKet_A_IN);
    SET idnganhanglienket_B = (SELECT ID_NganHangLienKet FROM NganHangLienKet WHERE TenNganHang = TenNganHangLienKet_B_IN);
    
    IF idnganhanglienket_B = 1 AND exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_B_IN AND Loai = 'TK') AND exists (SELECT* FROM TaiKhoan TK, TaiKhoan_TTTK TTTK WHERE TK.ID_TaiKhoan = TTTK.ID_TaiKhoanNguoiDung AND TTTK.ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN AND TK.Loai ='KH') THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',14: Tài khoảng B này là TK tiết kiệm, ko thể thanh toán, chỉ có thể nạp tiền bởi nhân viên ngân hàng');
        SET ktra = 1;
    END IF;

    IF idnganhanglienket_A = 1 AND exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN  AND TinhTrang != 'BinhThuong') THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',15: Tài khoảng A này đang bị khóa');
        SET ktra = 1;
    END IF;           

    IF idnganhanglienket_A = 1 AND not exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN) THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',13: Tài khoảng A này không tồn tại');
        SET ktra = 1;
    END IF;     

    IF idnganhanglienket_A = 1 AND  exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN AND Loai = 'TK') THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',14: Tài khoảng A này là TK tiết kiệm, ko thể thanh toán');
        SET ktra = 1;
    END IF;

    IF idnganhanglienket_B = 1 AND exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_B_IN  AND TinhTrang != 'BinhThuong') THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',15: Tài khoảng B này đang bị khóa');
        SET ktra = 1;
    END IF;           

    IF idnganhanglienket_B = 1 AND not exists(select* from TaiKhoan_TTTK where ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_B_IN) THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',13: Tài khoảng B này không tồn tại');
        SET ktra = 1;
    END IF;     
    
    SET sodu_A = (SELECT SoDu FROM TaiKhoan_TTTK WHERE ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN);
    
	IF LoaiGiaoDich_IN = 'Gui' or LoaiGiaoDich_IN = 'TraNo' THEN 
    	    IF idnganhanglienket_A = 1 AND sodu_A < SoTien_IN THEN	
    			SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',14: Tài khoảng này không đủ tiền để giao dịch');
        		SET ktra = 1;            	
    		END IF;
    END IF;
    
	IF LoaiGiaoDich_IN = 'TraNo' AND SoTien_IN != tiencantra THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',15: Số tiền thanh toán nợ này ko đủ đối với khoảng nợ');
    END IF;
    
    IF LoaiGiaoDich_IN = 'TraNo' AND EXISTS(SELECT* FROM GiaoDich where ID_GiaoDich = ID_TraNo_IN AND TinhTrang = 'DaTra') THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',16: Bạn đã trả nợ cho người này rồi');
    END IF;
    	
     IF LoaiGiaoDich_IN = 'TraNo' AND NOT EXISTS(SELECT* FROM GiaoDich where ID_GiaoDich = ID_TraNo_IN ) THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ',17: Không tồn tại lời đòi nợ để trả');
    END IF;	
   
    
    IF(ktra = 0) THEN
    	IF LoaiGiaoDich_IN = 'Gui' THEN
        	IF idnganhanglienket_A = 1 THEN
        		UPDATE TaiKhoan_TTTK
            	SET SoDu = SoDu - SoTien_IN
            	WHERE ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN;
        	END IF;        
        	IF idnganhanglienket_B = 1 THEN
            	UPDATE TaiKhoan_TTTK
            	SET SoDu = SoDu + SoTien_IN
            	WHERE ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_B_IN;
        	END IF;
        	INSERT INTO GiaoDich (ID_TaiKhoan_TTTK_A, ID_NganHangLienKet_A, ID_TaiKhoan_TTTK_B, ID_NganHangLienKet_B, SoTien, LoaiGiaoDich, GhiChu, NguoiTraPhi, ID_TraNo, ThoiGian, TinhTrang)
            VALUES (ID_TaiKhoan_TTTK_A_IN, idnganhanglienket_A, ID_TaiKhoan_TTTK_B_IN, idnganhanglienket_B, SoTien_IN, 'Gui', GhiChu_IN, NguoiTraPhi_IN, 0, TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP()), 'DaGui');
            SET Ketqua_OUT = '0: Đã giao dịch thành công!';
        END IF;


        IF LoaiGiaoDich_IN = 'TraNo' AND idnganhanglienket_A = 1 AND idnganhanglienket_B = 1 THEN
        	UPDATE TaiKhoan_TTTK
            SET SoDu = SoDu - SoTien_IN
            WHERE ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_A_IN;  
            
            UPDATE TaiKhoan_TTTK
            SET SoDu = SoDu + SoTien_IN
            WHERE ID_TaiKhoanTTTK = ID_TaiKhoan_TTTK_B_IN;
            
            INSERT INTO GiaoDich (ID_TaiKhoan_TTTK_A, ID_NganHangLienKet_A, ID_TaiKhoan_TTTK_B, ID_NganHangLienKet_B, SoTien, LoaiGiaoDich, GhiChu, NguoiTraPhi, ID_TraNo, ThoiGian, TinhTrang)
            VALUES (ID_TaiKhoan_TTTK_A_IN, idnganhanglienket_A, ID_TaiKhoan_TTTK_B_IN, idnganhanglienket_B, SoTien_IN, 'TraNo', GhiChu_IN, NguoiTraPhi_IN, ID_TraNo_IN, TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP()), 'DaTra');
            
            UPDATE GiaoDich
            SET TinhTrang = 'DaNhan'
            WHERE ID_GiaoDich = ID_TraNo_IN;
            SET Ketqua_OUT = '0: Đã Trả nợ!';
       END IF;
       
       IF LoaiGiaoDich_IN = 'Doi' AND idnganhanglienket_A = 1 AND idnganhanglienket_B = 1 THEN
            INSERT INTO GiaoDich (ID_TaiKhoan_TTTK_A, ID_NganHangLienKet_A, ID_TaiKhoan_TTTK_B, ID_NganHangLienKet_B, SoTien, LoaiGiaoDich, GhiChu, NguoiTraPhi, ID_TraNo, ThoiGian, TinhTrang)       
            VALUES (ID_TaiKhoan_TTTK_A_IN, idnganhanglienket_A, ID_TaiKhoan_TTTK_B_IN, idnganhanglienket_B, SoTien_IN, 'Doi', GhiChu_IN, NguoiTraPhi_IN, 0, TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP()), 'DangDoi');
       	SET Ketqua_OUT = '0: Đã đòi!';
       END IF;
     END IF;
END$$
CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_KhoaTaiKhoan(KoDung)` (IN `Username_IN` VARCHAR(64) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
    	UPDATE TaiKhoan
        SET TinhTrang = 'Khoa'
		WHERE Username = Username_IN;
        SET Ketqua_OUT = '0: Khóa thành công!';
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_SuaBietDanh` (IN `Username_IN` VARCHAR(128) CHARSET utf8mb4, IN `BietDanh_IN` VARCHAR(128) CHARSET utf8mb4, IN `ID_TaiKhoan_TTTK_B_IN` INT, IN `TenNganHang_IN` VARCHAR(128) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(128) CHARSET utf8mb4)  NO SQL
BEGIN
 	DECLARE iduser int;
    DECLARE idnh int;
    DECLARE ktra int;
    SET iduser = (SELECT ID_TaiKhoan FROM TaiKhoan WHERE Username = Username_IN);
    SET idnh = (SELECT ID_NganHangLienKet FROM NganHangLienKet WHERE TenNganHang = TenNganHang_IN);
    SET ktra = 0;
    IF EXISTS(SELECT* FROM DS_GDDN WHERE ID_TaiKhoan_A	= iduser AND ID_TaiKhoan_TTTK_B	!= ID_TaiKhoan_TTTK_B_IN AND ID_NganHangLienKet != idnh AND BietDanh = BietDanh_IN) THEN
    	SET Ketqua_OUT = '1: Biệt danh bạn đặt bị trùng';
        SET ktra = 1;
    END IF;

    
    IF BietDanh_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 2: Biệt danh không được để trống!');
        
        SET ktra = 1;
    END IF;    

   
    IF (LENGTH(BietDanh_IN) >= 50 or LENGTH(BietDanh_IN) <= 1) and BietDanh_IN != '' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 3: Biệt danh nhiều hơn 1 và nhỏ hơn 50 ký tự!');
        SET ktra = 1;
    END IF;

    IF(ktra = 0) THEN
    	UPDATE DS_GDDN
        SET BietDanh = BietDanh_IN
		WHERE ID_TaiKhoan_A	= iduser AND ID_TaiKhoan_TTTK_B	= ID_TaiKhoan_TTTK_B_IN AND ID_NganHangLienKet = idnh;
        SET Ketqua_OUT = '0: Sửa thành công!';
    END IF;
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_SuaNganHang` (IN `TenNganHangCu_IN` VARCHAR(128) CHARSET utf8mb4, IN `TenNganHangMoi_IN` VARCHAR(128) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(128) CHARSET utf8mb4)  NO SQL
BEGIN
    DECLARE ktra int;
    DECLARE idNH int;
    SET idNH = (SELECT ID_NganHangLienKet FROM NganHangLienKet WHERE TenNganHang = TenNganHangCu_IN);
    SET ktra = 0;
    IF EXISTS(SELECT* FROM NganHangLienKet WHERE TenNganHang = TenNganHangMoi_IN AND ID_NganHangLienKet	!= idNH) THEN
    	SET Ketqua_OUT = '1: Ngân Hàng này đã tồn tại!';
        SET ktra = 1;
    END IF;

    
    IF TenNganHangMoi_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 2: Ngân Hàng không được để trống!');
        
        SET ktra = 1;
    END IF;    

   
    IF (LENGTH(TenNganHangMoi_IN) >= 50 or LENGTH(TenNganHangMoi_IN) <= 1) and TenNganHangMoi_IN != '' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 3: tên Ngân Hàng nhiều hơn 1 và nhỏ hơn 50 ký tự!');
        SET ktra = 1;
    END IF;

    IF(ktra = 0) THEN
    	UPDATE NganHangLienKet
        SET TenNganHang = TenNganHangMoi_IN
        WHERE TenNganHang = TenNganHangCu_IN;
        SET Ketqua_OUT = '0: Sửa thành công!';
    END IF;
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_SuaTaiKhoan` (IN `Username_IN` VARCHAR(64) CHARSET utf8mb4, IN `HoTen_IN` VARCHAR(128) CHARSET utf8mb4, IN `Email_IN` VARCHAR(128) CHARSET utf8mb4, IN `DienThoai_IN` INT(12), OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
    DECLARE ktra int;
    SET ktra = 0;
    IF Email_IN='' THEN
    	SET Ketqua_OUT = '1: Bạn chưa nhập email';
        SET ktra = 1;
    END IF;

    
        IF (LENGTH(Email_IN) >= 50 or LENGTH(Email_IN) <= 5) and Email_IN !='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 3: Email có số lượng từ không hợp lệ!');
        
        SET ktra = 1;
    END IF;    

    IF Username_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 4: Bạn chưa nhập  Username');
        SET ktra = 1;
    END IF;

    

    IF HoTen_IN='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 9: Bạn chưa nhập tên!');
        SET ktra = 1;
    END IF;
    
    IF (LENGTH(HoTen_IN) >= 50 or LENGTH(HoTen_IN) <= 5) and HoTen_IN != '' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 10: Họ tên có số lượng từ không hợp lệ!');
        SET ktra = 1;
    END IF;

    IF DienThoai_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 11: Bạn chưa nhập  SDT');
        SET ktra = 1;
    END IF;


    IF (LENGTH(DienThoai_IN) >= 15 or LENGTH(DienThoai_IN) <= 5) and Email_IN !='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 13: SDT có số lượng từ không hợp lệ!');
        
        SET ktra = 1;
    END IF;
  

    IF(ktra = 0) THEN
    	UPDATE TaiKhoan
        SET HoTen = HoTen_IN, Email = Email_IN, DienThoai = DienThoai_IN
		WHERE Username = Username_IN;
        SET Ketqua_OUT = '0: Sửa thành công!';
    END IF;
END$$


CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_TaoTKTietKiem` (IN `Username_IN` VARCHAR(64) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
	DECLARE idtk INT;
    SET idtk = (SELECT ID_TaiKhoan FROM TaiKhoan WHERE Username = Username_IN);
    INSERT INTO TaiKhoan_TTTK (ID_TaiKhoanNguoiDung	, SoDu, Loai, TinhTrang)
	VALUES (idtk, 0, 'TK', 'BinhThuong');
    SET Ketqua_OUT = '0:Thêm thành công!';
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_ThemAuth_RefreshToken` (IN `Username_IN` VARCHAR(128) CHARSET utf8mb4, IN `ClientID_IN` VARCHAR(528) CHARSET utf8mb4, IN `Refresh_token_IN` VARCHAR(528) CHARSET utf8mb4, IN `Type_IN` VARCHAR(528) CHARSET utf8mb4, IN `Limit_Time_IN` INT, OUT `Ketqua_OUT` VARCHAR(256) CHARSET utf8mb4)  NO SQL
BEGIN
    DECLARE gettime nvarchar(128);
    IF Type_IN ='giay' THEN
    	SET gettime = (SELECT TIMESTAMPADD(SECOND,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    ELSEIF Type_IN ='phut' THEN
    	SET gettime = (SELECT TIMESTAMPADD(MINUTE,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );	
   	ELSEIF Type_IN ='gio' THEN
    	SET gettime = (SELECT TIMESTAMPADD(HOUR,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    ELSEIF Type_IN ='ngay' THEN
    	SET gettime = (SELECT TIMESTAMPADD(DAY,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    ELSEIF Type_IN ='tuan' THEN
    	SET gettime = (SELECT TIMESTAMPADD(WEEK,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    ELSEIF Type_IN ='thang' THEN
    	SET gettime = (SELECT TIMESTAMPADD(MONTH,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    ELSEIF Type_IN ='nam' THEN
    	SET gettime = (SELECT TIMESTAMPADD(YEAR,Limit_Time_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP())) );
    END IF;
    	INSERT INTO Auth_RefreshToken(Username, ClientID, Refresh_token, Start_Time, End_Time, Type, Limit_Time )
        VALUES(Username_IN, ClientID_IN, Refresh_token_IN,TIMESTAMPADD(HOUR,7,CURRENT_TIMESTAMP()), gettime, Type_IN, Limit_Time_IN);
        SET Ketqua_OUT = '0: Thêm 1 session thành công!';
END$$

CREATE DEFINER=`thongbao`@`localhost` PROCEDURE `proc_ThemBietDanh` (IN `Username_IN` VARCHAR(128) CHARSET utf8mb4, IN `BietDanh_IN` VARCHAR(128) CHARSET utf8mb4, IN `ID_TaiKhoan_TTTK_B_IN` INT, IN `TenNganHang_IN` VARCHAR(128) CHARSET utf8mb4, OUT `Ketqua_OUT` VARCHAR(128) CHARSET utf8mb4)  NO SQL
BEGIN
 	DECLARE iduser int;
    DECLARE idnh int;
    DECLARE ktra int;
    SET iduser = (SELECT ID_TaiKhoan FROM TaiKhoan WHERE Username = Username_IN);
    SET idnh = (SELECT ID_NganHangLienKet FROM NganHangLienKet WHERE TenNganHang = TenNganHang_IN);
    SET ktra = 0;
    IF EXISTS(SELECT* FROM DS_GDDN WHERE ID_TaiKhoan_A	= iduser AND ID_TaiKhoan_TTTK_B	!= ID_TaiKhoan_TTTK_B_IN AND ID_NganHangLienKet != idnh AND BietDanh = BietDanh_IN) THEN
    	SET Ketqua_OUT = '1: Biệt danh bạn đặt bị trùng';
        SET ktra = 1;
    END IF;

    
    IF BietDanh_IN ='' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 2: Biệt danh không được để trống!');
        
        SET ktra = 1;
    END IF;    

   
    IF (LENGTH(BietDanh_IN) >= 50 or LENGTH(BietDanh_IN) <= 1) and BietDanh_IN != '' THEN
    	SET Ketqua_OUT = CONCAT_WS(' ',Ketqua_OUT, ', 3: Biệt danh nhiều hơn 1 và nhỏ hơn 50 ký tự!');
        SET ktra = 1;
    END IF;

    IF(ktra = 0) THEN
    	INSERT INTO DS_GDDN(ID_TaiKhoan_A, ID_TaiKhoan_TTTK_B, ID_NganHangLienKet, BietDanh)
        VALUES(iduser, ID_TaiKhoan_TTTK_B_IN, idnh, BietDanh_IN);
        SET Ketqua_OUT = '0: Thêm thành công!';
    END IF;
END$$

-- --------------------------------------------------------

--
-- Table structure for table `Auth_RefreshToken`
--

CREATE TABLE `Auth_RefreshToken` (
  `ID` int(11) NOT NULL,
  `Username` varchar(516) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ClientID` varchar(516) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Refresh_token` varchar(516) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Start_Time` datetime DEFAULT NULL,
  `End_Time` datetime DEFAULT NULL,
  `Type` varchar(516) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Limit_Time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Auth_RefreshToken`
--

INSERT INTO `Auth_RefreshToken` (`ID`, `Username`, `ClientID`, `Refresh_token`, `Start_Time`, `End_Time`, `Type`, `Limit_Time`) VALUES
(2, 'test', 'hehe', 'hehe', '2020-02-12 19:21:28', '2020-02-12 21:21:27', 'gio', 2),
(3, 'test', 'hehe', 'hehe', '2020-02-12 19:21:28', '2020-02-12 21:21:27', 'gio', 2),
(4, 'ngoctrinh', '12wqwd1233es', 'ascwew32we12', '2020-02-12 19:40:42', '2020-05-12 19:40:42', 'thang', 3);

-- --------------------------------------------------------

--
-- Table structure for table `DS_GDDN`
--

CREATE TABLE `DS_GDDN` (
  `ID_DS` int(11) NOT NULL,
  `ID_TaiKhoan_A` int(11) DEFAULT NULL,
  `ID_TaiKhoan_TTTK_B` int(11) DEFAULT NULL,
  `ID_NganHangLienKet` int(11) NOT NULL,
  `BietDanh` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `DS_GDDN`
--

INSERT INTO `DS_GDDN` (`ID_DS`, `ID_TaiKhoan_A`, `ID_TaiKhoan_TTTK_B`, `ID_NganHangLienKet`, `BietDanh`) VALUES
(1, 1, 3, 1, 'Qúy PeDe'),
(2, 1, 4, 1, 'Sang PeDe'),
(4, 2, 1, 1, 'tâm pro'),
(5, 3, 1, 1, 'Tâm Zâm'),
(6, 3, 3, 1, 'Quy De'),
(7, 2, 1, 2, 'Dâm'),
(8, 2, 2, 3, 'NgocCuTe'),
(9, 2, 7, 1, 'Thuy free 1 đêm');

-- --------------------------------------------------------

--
-- Table structure for table `GiaoDich`
--

CREATE TABLE `GiaoDich` (
  `ID_GiaoDich` int(11) NOT NULL,
  `ID_TaiKhoan_TTTK_A` int(11) DEFAULT NULL,
  `ID_NganHangLienKet_A` int(11) NOT NULL,
  `ID_TaiKhoan_TTTK_B` int(11) DEFAULT NULL,
  `ID_NganHangLienKet_B` int(11) NOT NULL,
  `SoTien` float DEFAULT NULL,
  `LoaiGiaoDich` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL,
  `GhiChu` varchar(512) CHARACTER SET utf8mb4 DEFAULT NULL,
  `NguoiTraPhi` varchar(16) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ID_TraNo` int(11) DEFAULT NULL,
  `ThoiGian` datetime DEFAULT NULL,
  `TinhTrang` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `GiaoDich`
--

INSERT INTO `GiaoDich` (`ID_GiaoDich`, `ID_TaiKhoan_TTTK_A`, `ID_NganHangLienKet_A`, `ID_TaiKhoan_TTTK_B`, `ID_NganHangLienKet_B`, `SoTien`, `LoaiGiaoDich`, `GhiChu`, `NguoiTraPhi`, `ID_TraNo`, `ThoiGian`, `TinhTrang`) VALUES
(1, 1, 1, 3, 1, 2000, 'Gui', 'Ói tiền nè', 'B', 0, NULL, 'DaGui'),
(2, 3, 1, 1, 1, 2000, 'Doi', 'Tiền đâu', 'B', 0, NULL, 'DanNhan'),
(3, 1, 1, 3, 1, 2000, 'TraNo', 'Trả nè', 'A', 2, NULL, 'DaTra'),
(4, 1, 1, 3, 1, 1000, 'Gui', 'li xi', 'A', 0, '2020-02-09 00:19:26', 'DaGui'),
(5, 1, 1, 7, 1, 123, 'Gui', 'asd', 'A', 0, '2020-02-09 08:03:46', 'DaGui'),
(6, 1, 1, 7, 1, 123, 'Gui', 'asd', 'A', 0, '2020-02-09 08:05:12', 'DaGui'),
(7, 1, 1, 3, 1, 69, 'Doi', 'tien dau cung', 'B', 0, '2020-02-09 08:07:25', 'DaNhan'),
(8, 3, 1, 1, 1, 69, 'TraNo', 'tra tien ne', 'A', 7, '2020-02-09 09:39:37', 'DaTra'),
(9, 3, 1, 1, 2, 200, 'Gui', 'ert', 'A', 0, '2020-02-09 13:13:51', 'DaGui'),
(10, 3, 1, 4, 1, 100, 'Gui', 'ertert', 'A', 0, '2020-02-09 13:15:53', 'DaGui'),
(11, 1, 1, 1, 2, 100, 'Gui', 'qwe', 'A', 0, '2020-02-09 14:40:53', 'DaGui'),
(13, 1, 2, 3, 1, 100, 'Gui', 'qwe', 'A', 0, '2020-02-09 14:50:29', 'DaGui'),
(14, 3, 1, 69, 2, 100, 'Gui', 'opi', 'A', 0, '2020-02-09 14:51:15', 'DaGui'),
(15, 3, 1, 1, 1, 100, 'Gui', 'wewe', 'A', 0, '2020-02-09 15:28:19', 'DaGui'),
(16, 1, 1, 3, 1, 150, 'Gui', 'asas', 'A', 0, '2020-02-09 15:28:59', 'DaGui'),
(17, 3, 1, 1, 1, 30, 'Doi', 'asdads', 'A', 0, '2020-02-09 15:29:29', 'DaNhan'),
(27, 1, 1, 3, 1, 30, 'TraNo', 'asdqwe', 'A', 17, '2020-02-09 15:43:49', 'DaTra'),
(28, 3, 1, 1, 3, 20, 'Gui', 'ertert', 'A', 0, '2020-02-09 15:46:13', 'DaGui'),
(29, 3, 1, 2, 3, 12, 'Gui', 'asdqweasd', 'A', 0, '2020-02-09 15:51:49', 'DaGui'),
(30, 1, 1, 2, 3, 14, 'Gui', 'asdqwds', 'A', 0, '2020-02-09 15:52:28', 'DaGui'),
(31, 1, 3, 3, 1, 15, 'Gui', 'asdasc', 'A', 0, '2020-02-09 15:53:19', 'DaGui'),
(32, 2, 3, 3, 1, 100, 'Gui', 'wefsdc', 'A', 0, '2020-02-09 15:54:16', 'DaGui'),
(33, 3, 1, 1, 1, 69, 'Doi', 'tien dau cung', 'B', 0, '2020-02-09 08:07:25', 'DangDoi'),
(34, 1, 1, 8, 1, 1234, 'Gui', 'sdfsdv', 'A', 0, '2020-02-11 15:45:44', 'DaGui'),
(35, 1, 1, 7, 1, 1212, 'Gui', 'sdfsd', 'A', 0, '2020-02-11 15:48:08', 'DaGui'),
(36, 3, 1, 7, 1, 500, 'Gui', 'Tặng tiền em yêu', 'A', 0, '2020-02-11 21:57:28', 'DaGui'),
(37, 7, 1, 3, 1, 500, 'Doi', 'Cho tiền em đi anh q', 'B', 0, '2020-02-11 23:02:05', 'DaNhan'),
(38, 3, 1, 7, 1, 500, 'TraNo', 'Cho em yêu luôn', 'A', 37, '2020-02-11 23:14:45', 'DaTra'),
(39, 7, 1, 3, 1, 100, 'Doi', 'Cho tiền đi anh yêu', 'A', 0, '2020-02-12 11:54:38', 'DangDoi');

-- --------------------------------------------------------

--
-- Table structure for table `NganHangLienKet`
--

CREATE TABLE `NganHangLienKet` (
  `ID_NganHangLienKet` int(11) NOT NULL,
  `TenNganHang` varchar(512) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TinhTrang` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `NganHangLienKet`
--

INSERT INTO `NganHangLienKet` (`ID_NganHangLienKet`, `TenNganHang`, `TinhTrang`) VALUES
(1, 'BBC', 'NoiBo'),
(2, 'CCD', 'LienKet'),
(3, 'AAA', 'LienKet'),
(4, 'VietBank', 'LienKet');

-- --------------------------------------------------------

--
-- Table structure for table `TaiKhoan`
--

CREATE TABLE `TaiKhoan` (
  `ID_TaiKhoan` int(64) NOT NULL,
  `Username` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Pass` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL,
  `HoTen` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Email` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DienThoai` int(64) DEFAULT NULL,
  `Loai` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TinhTrang` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `TaiKhoan`
--

INSERT INTO `TaiKhoan` (`ID_TaiKhoan`, `Username`, `Pass`, `HoTen`, `Email`, `DienThoai`, `Loai`, `TinhTrang`) VALUES
(1, 'minhtam', '123456', 'Ng minh tam', 'atamatr@gmail.com', 123123123, 'NV', 'KichThoat'),
(2, 'ngocquy', '123456', 'ngoc quy', 'ngocquy@gmail.com', 823838281, 'KH', 'KichThoat'),
(3, 'tansang', '123456', 'tan sang', 'tansang@gmail.com', 823838281, 'AD', 'KichThoat'),
(5, 'thuthuy', '123456', 'thu thuy', 'thuthuy@gmail.com', 1231231234, 'KH', 'KichThoat');

-- --------------------------------------------------------

--
-- Table structure for table `TaiKhoan_TTTK`
--

CREATE TABLE `TaiKhoan_TTTK` (
  `ID_TaiKhoanTTTK` int(11) NOT NULL,
  `ID_TaiKhoanNguoiDung` int(11) DEFAULT NULL,
  `SoDu` float DEFAULT NULL,
  `Loai` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TinhTrang` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `TaiKhoan_TTTK`
--

INSERT INTO `TaiKhoan_TTTK` (`ID_TaiKhoanTTTK`, `ID_TaiKhoanNguoiDung`, `SoDu`, `Loai`, `TinhTrang`) VALUES
(1, 1, 7775, 'TT', 'BinhThuong'),
(2, 1, 1107000, 'TK', 'BinhThuong'),
(3, 2, 111133, 'TT', 'BinhThuong'),
(4, 3, 111169, 'TT', 'BinhThuong'),
(5, 2, 1110000, 'TK', 'BinhThuong'),
(6, 2, 1110000, 'TK', 'BinhThuong'),
(7, 5, 52458, 'TT', 'BinhThuong'),
(8, 5, 11234, 'TK', 'BinhThuong'),
(9, 2, 50000, 'TK', 'BinhThuong');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Auth_RefreshToken`
--
ALTER TABLE `Auth_RefreshToken`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `DS_GDDN`
--
ALTER TABLE `DS_GDDN`
  ADD PRIMARY KEY (`ID_DS`);

--
-- Indexes for table `GiaoDich`
--
ALTER TABLE `GiaoDich`
  ADD PRIMARY KEY (`ID_GiaoDich`);

--
-- Indexes for table `NganHangLienKet`
--
ALTER TABLE `NganHangLienKet`
  ADD PRIMARY KEY (`ID_NganHangLienKet`);

--
-- Indexes for table `TaiKhoan`
--
ALTER TABLE `TaiKhoan`
  ADD PRIMARY KEY (`ID_TaiKhoan`);

--
-- Indexes for table `TaiKhoan_TTTK`
--
ALTER TABLE `TaiKhoan_TTTK`
  ADD PRIMARY KEY (`ID_TaiKhoanTTTK`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Auth_RefreshToken`
--
ALTER TABLE `Auth_RefreshToken`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `DS_GDDN`
--
ALTER TABLE `DS_GDDN`
  MODIFY `ID_DS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `GiaoDich`
--
ALTER TABLE `GiaoDich`
  MODIFY `ID_GiaoDich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `NganHangLienKet`
--
ALTER TABLE `NganHangLienKet`
  MODIFY `ID_NganHangLienKet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `TaiKhoan`
--
ALTER TABLE `TaiKhoan`
  MODIFY `ID_TaiKhoan` int(64) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `TaiKhoan_TTTK`
--
ALTER TABLE `TaiKhoan_TTTK`
  MODIFY `ID_TaiKhoanTTTK` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
