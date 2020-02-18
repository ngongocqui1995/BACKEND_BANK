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
