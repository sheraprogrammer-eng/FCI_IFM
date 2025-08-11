CREATE TABLE ifm (
    Quatation_No nvarchar(50) NOT NULL PRIMARY KEY, -- หมายเลขใบเสนอราคา
    Cust_Salutation nvarchar(255) NOT NULL, -- คำนำหน้าชื่อลูกค้า
    Cust_FirstName nvarchar(255) NOT NULL, -- ชื่อลูกค้า
    Cust_LastName nvarchar(255) NOT NULL, -- นามสกุลลูกค้า
    Cust_Address nvarchar(255) NOT NULL, -- ที่อยู่ลูกค้า
    Cust_District nvarchar(255) NOT NULL, -- ตำบล
    Cust_Amphur nvarchar(255) NOT NULL, -- อำเภอ
    Cust_Province nvarchar(255) NOT NULL, -- จังหวัด
    Cust_Zipcode nvarchar(255) NOT NULL, -- รหัสไปรษณีย์
    Cust_Telephone1 nvarchar(50) NOT NULL, -- เบอร์มือถือ
    Cust_Telephone2 nvarchar(50) NULL, -- เบอร์ที่ทำงาน
    Cust_Telephone3 nvarchar(50) NULL, -- เบอร์บ้าน
    Insured_Salutation nvarchar(255) NOT NULL, -- คำนำหน้าชื่อเจ้าของกรมธรรม์
    Insured_NationalID nvarchar(13) NOT NULL, -- หมายเลขบัตรประจำตัวประชาชน
    Insured_FirstName nvarchar(255) NOT NULL, -- ชื่อเจ้าของกรมธรรม์
    Insured_LastName nvarchar(255) NOT NULL, -- นามสกุลเจ้าของกรมธรรม์
    Insured_Address nvarchar(255) NOT NULL, -- ที่อยู่เจ้าของกรมธรรม์
    Insured_District nvarchar(255) NOT NULL, -- ตำบล
    Insured_Amphur nvarchar(255) NOT NULL, -- อำเภอ
    Insured_Province nvarchar(255) NOT NULL, -- จังหวัด
    Insured_Zipcode nvarchar(255) NOT NULL, -- รหัสไปรษณีย์
    Insured_Telephone1 nvarchar(50) NOT NULL, -- เบอร์มือถือ
    Insured_Telephone2 nvarchar(50) NULL, -- เบอร์ที่ทำงาน
    Insured_Telephone3 nvarchar(50) NULL, -- เบอร์บ้าน
    Insured_DOB nvarchar(255) NOT NULL, -- วันเดือนปีเกิดขอผู้เอาประกัน
    Insured_Gender nvarchar(255) NOT NULL, -- เพศ
    Insured_Marital_Status nvarchar(255) NOT NULL, -- สถานะการสมรส
    Insured_Occupation nvarchar(255) NOT NULL, -- ขั้นอาชีพ
    Insured_Occupation_Detail nvarchar(500) NOT NULL, -- รายละเอียดอาชีพ
    Benefit1_Salutation nvarchar(255) NOT NULL, -- คำนำหน้าชื่อ ผู้รับผลประโยชน์ คนที่ 1
    Benefit1_FirstName nvarchar(255) NOT NULL, -- ชื่อ ผู้รับผลประโยชน์ คนที่ 1
    Benefit1_LastName nvarchar(255) NOT NULL, -- นามสกุล ผู้รับผลประโยชน์ คนที่ 1
    Benefit1_Relation nvarchar(255) NOT NULL, -- ความสัมพันธ์ของผู้รับผลประโยชน์
    Benefit1_Rate nvarchar(5) NOT NULL, -- % รับประโยชน์
    Benefit2_Salutation nvarchar(255) NULL, -- คำนำหน้าชื่อ ผู้รับผลประโยชน์ คนที่ 2
    Benefit2_FirstName nvarchar(255) NULL, -- ชื่อ ผู้รั��ผลประโยชน์ คนที่ 2
    Benefit2_LastName nvarchar(255) NULL, -- นามสกุล ผู้รับผลประโยชน์ คนที่ 2
    Benefit2_Relation nvarchar(255) NULL, -- ความสัมพันธ์ของผู้รับผลประโยชน์ 2
    Benefit2_Rate nvarchar(5) NULL, -- % รับประโยชน์
    Benefit3_Salutation nvarchar(255) NULL, -- คำนำหน้าชื่อ ผู้รับผลประโยชน์ คนที่ 3
    Benefit3_FirstName nvarchar(255) NULL, -- ชื่อ ผู้รับผลประโยชน์ คนที่ 3
    Benefit3_LastName nvarchar(255) NULL, -- นามสกุล ผู้รับผลประโยชน์ คนที่ 3
    Benefit3_Relation nvarchar(255) NULL, -- ความสัมพันธ์ของผู้รับผลประโยชน์ 3
    Benefit3_Rate nvarchar(5) NULL, -- % รับประโยชน์
    Benefit4_Salutation nvarchar(255) NULL, -- คำนำหน้าชื่อ ผู้รับผลประโยชน์ คนที่ 4
    Benefit4_FirstName nvarchar(255) NULL, -- ชื่อ ผู้รับผลประโยชน์ คนที่ 4
    Benefit4_LastName nvarchar(255) NULL, -- นามสกุล ผู้รับผลประโยชน์ คนที่ 4
    Benefit4_Relation nvarchar(255) NULL, -- ความสัมพันธ์ของผู้รับผลประโยชน์ 4
    Benefit4_Rate nvarchar(5) NULL, -- % รับประโยชน์
    Policy_EffectiveDate datetime NOT NULL, -- วันที่มีผลบังคับใช้
    Policy_Plan nvarchar(255) NOT NULL, -- แผนประกัน
    Policy_SumInsured float NOT NULL, -- ทุนประกัน
    Payment_Amount float NOT NULL, -- ค่าเบี้ยเต็มปี (AFYP)
    Payment_Type nvarchar(50) NOT NULL, -- โหมดการชำระ
    Policy_Premium float NOT NULL, -- จำนวนเงินที่ชำระต่องวด
    Paid_Date datetime NOT NULL, -- วันที่มีการชำระเข้ามา
    Payment_Method nvarchar(50) NOT NULL, -- ช่องทางการชำระเงิน
    Credit_IDCard nvarchar(16) NOT NULL, -- ���มายเลขบัตรเครดิต/บัญชี
    Card_Issuer_Bank nvarchar(10) NULL, -- ชื่อธนาคารย่อ
    Credit_Type nvarchar(255) NULL, -- ประเภทบัตรเครดิต
    Credit_CardName nvarchar(255) NULL, -- ชื่อหน้าบัตรเครดิต
    CreditCardExpDate nvarchar(255) NULL, -- วันหมดอายุบัตร
    Approve_Code nvarchar(10) NULL, -- รหัสการตัดเงิน
    Payor_Salutation nvarchar(255) NULL, -- คำนำหน้าชื่อผู้ชำระเงิน
    Payor_FirstName nvarchar(255) NULL, -- ชื่อผู้ชำระเงิน
    Payor_Surname nvarchar(255) NULL, -- นามสกุลผู้ชำระเงิน
    Payor_Relation nvarchar(255) NULL, -- ความสัมพันธ์ผู้ชำระเงินกับเจ้าของกรมธรรม์
    REF_Change_Plan nvarchar(50) NULL, -- หมายเลขกรมธรรม์เดิมกรณีเปลี่ยน Package
    AgentID nvarchar(255) NULL, -- หมายเลขตัวแทน
    t_tsrName nvarchar(255) NOT NULL, -- ชื่อพนักงานขาย
    Remark nvarchar(1500) NULL, -- ข้อคิดเห็น
    Insured_Email_Address nvarchar(100) NULL, -- E-Mail เจ้าของกรมธรรม์
    Insured_LINEID nvarchar(100) NULL, -- Line ID เจ้าของกรมธรรม์
    Ref_Quotation_FN nvarchar(50) NULL, -- อ้างอิงการใช้เงินของ Quotation เดิม
    Ref_Quotation_UW nvarchar(50) NULL, -- หมายเลข Quotation ใช้ Refer
    Ref_Relation nvarchar(50) NULL, -- ความสัมพันธ์ของบุคคลจาก Ref_Quotation_UW
    E_Policy nvarchar(1) NOT NULL, -- ลูกค้ายินยอมรับกรมธรรม์ช่องทาง E-mail
    Insured_Height_Heal nvarchar(50) NULL, -- ส่วนสูง (cm)
    Insured_Weight_Heal nvarchar(50) NULL, -- น้ำหนัก (kg)
    Ins1_UW1 nvarchar(2) NOT NULL, -- คำตอบจากคำถาม Uwข้อ 1
    Ins1_UW1_Des nvarchar(1500) NULL, -- รายละเอี��ดข้อ 1
    Ins1_UW1_ID int NOT NULL, -- Fix 1
    Ins1_UW2 nvarchar(2) NOT NULL, -- คำตอบจากคำถาม Uwข้อ 2
    Ins1_UW2_Des nvarchar(1500) NULL, -- รายละเอียดข้อ 2
    Ins1_UW2_ID int NOT NULL, -- Fix 2
    Ins1_UW3 nvarchar(2) NOT NULL, -- คำตอบจากคำถาม Uwข้อ 3
    Ins1_UW3_Des nvarchar(1500) NULL, -- รายละเอียดข้อ 3
    Ins1_UW3_ID int NOT NULL, -- Fix 3
    Ins1_UW4 nvarchar(2) NOT NULL, -- คำตอบจากคำถาม Uwข้อ 4
    Ins1_UW4_Des nvarchar(1500) NULL, -- รายละเอียดข้อ 4
    Ins1_UW4_ID int NOT NULL, -- Fix 4
    Ins1_UW5 nvarchar(2) NOT NULL, -- คำตอบจากคำถาม Uwข้อ 5
    Ins1_UW5_Des nvarchar(1500) NULL, -- รายละเอียดข้อ 5
    Ins1_UW5_ID int NOT NULL, -- Fix 5
    Tax_Consent nvarchar(1) NOT NULL, -- แจ้งสิทธิการหลดหย่อนภาษี
    Data_Consent nvarchar(5) NOT NULL -- ลูกค้ารับทราบและยินยอมให้บริษัทติดต่อครั้งต่อไป��ด้
);
