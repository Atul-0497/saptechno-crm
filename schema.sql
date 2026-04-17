-- =======================================================
-- FINAL MASTER TABLES SCHEMA
-- This script creates the 12 master tables requested.
-- Please execute this on your SQL Server Database.
-- =======================================================

-- 1. COMPANY MASTER (ROOT)
CREATE TABLE CompanyMaster (
    CompanyId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NULL,
    Mobile NVARCHAR(50) NULL,
    Website NVARCHAR(255) NULL,
    PlanStartDate DATE NULL,
    PlanEndDate DATE NULL,
    Address NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 2. DEPARTMENT MASTER
CREATE TABLE DepartmentMaster (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    DepartmentName NVARCHAR(255) NOT NULL,
    DepartmentCode NVARCHAR(50) NULL,
    Description NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 3. DESIGNATION MASTER
CREATE TABLE DesignationMaster (
    DesignationId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    DesignationName NVARCHAR(255) NOT NULL,
    DesignationLevel NVARCHAR(50) NULL,
    Description NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 4. EMPLOYEE MASTER
CREATE TABLE EmployeeMaster (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NULL,
    EmailId NVARCHAR(255) NULL,
    MobileNo NVARCHAR(50) NULL,
    DepartmentId INT FOREIGN KEY REFERENCES DepartmentMaster(DepartmentId),
    DesignationId INT FOREIGN KEY REFERENCES DesignationMaster(DesignationId),
    ReportingTo INT NULL FOREIGN KEY REFERENCES EmployeeMaster(EmployeeId),
    PasswordHash NVARCHAR(MAX) NULL,
    EmployeeCode NVARCHAR(50) NULL,
    JoiningDate DATE NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 10. COUNTRY MASTER (Global Location)
CREATE TABLE CountryMaster (
    CountryId INT IDENTITY(1,1) PRIMARY KEY,
    CountryName NVARCHAR(255) NOT NULL,
    CountryCode NVARCHAR(10) NULL,
    Active BIT DEFAULT 1
);

-- 11. STATE MASTER (Global Location)
CREATE TABLE StateMaster (
    StateId INT IDENTITY(1,1) PRIMARY KEY,
    CountryId INT FOREIGN KEY REFERENCES CountryMaster(CountryId),
    StateName NVARCHAR(255) NOT NULL,
    Active BIT DEFAULT 1
);

-- 12. CITY MASTER (Global Location)
CREATE TABLE CityMaster (
    CityId INT IDENTITY(1,1) PRIMARY KEY,
    StateId INT FOREIGN KEY REFERENCES StateMaster(StateId),
    CityName NVARCHAR(255) NOT NULL,
    Active BIT DEFAULT 1
);

-- 5. VENDOR MASTER
CREATE TABLE VendorMaster (
    VendorId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    VendorName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NULL,
    Mobile NVARCHAR(50) NULL,
    Address NVARCHAR(MAX) NULL,
    CityId INT FOREIGN KEY REFERENCES CityMaster(CityId),
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 6. PRODUCT MASTER
CREATE TABLE ProductMaster (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    ProductName NVARCHAR(255) NOT NULL,
    ProductCode NVARCHAR(50) NULL,
    Price DECIMAL(18,2) NULL,
    Description NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 7. DEALER MASTER
CREATE TABLE DealerMaster (
    DealerId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    DealerName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NULL,
    Mobile NVARCHAR(50) NULL,
    CityId INT FOREIGN KEY REFERENCES CityMaster(CityId),
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 8. LEAD SOURCE MASTER
CREATE TABLE LeadSourceMaster (
    LeadSourceId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    SourceName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- 9. INDUSTRY MASTER
CREATE TABLE IndustryMaster (
    IndustryId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES CompanyMaster(CompanyId),
    IndustryName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);
