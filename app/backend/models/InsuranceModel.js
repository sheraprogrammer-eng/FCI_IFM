const sql = require('mssql');
const database = require('../config/database');
class InsuranceModel {
    async createIfm(ifmData) {
        try {
            const pool = await database.getPool();
            const transaction = new sql.Transaction(pool);
            await transaction.begin();
            try {
                const request = new sql.Request(transaction);
                // Insured_DOB เก็บเป็น string (คงรูปแบบ YYYY-MM-DD)
                if (ifmData.Insured_DOB) {
                    const d = new Date(ifmData.Insured_DOB);
                    if (isNaN(d.getTime())) {
                        ifmData.Insured_DOB = null;
                    } else {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        ifmData.Insured_DOB = `${yyyy}-${mm}-${dd}`;
                    }
                } else {
                    ifmData.Insured_DOB = null;
                }

                // ฟิลด์วันที่ที่ต้องเป็น DateTime จริง
                const dateTimeFields = ['Policy_EffectiveDate','Paid_Date'];
                for (const key of dateTimeFields) {
                    if (ifmData[key]) {
                        const d = new Date(ifmData[key]);
                        if (isNaN(d.getTime())) {
                            ifmData[key] = null;
                        } else {
                            ifmData[key] = d; // Date object for sql.DateTime
                        }
                    } else {
                        ifmData[key] = null;
                    }
                }
                // UW flags must be 'Y' or 'N'
                const ynFields = ['Ins1_UW1','Ins1_UW2','Ins1_UW3','Ins1_UW4','Ins1_UW5'];
                for (const key of ynFields) {
                    const value = ifmData[key];
                    if (value === true || value === 1 || value === '1' || (typeof value === 'string' && value.toUpperCase() === 'Y')) {
                        ifmData[key] = 'Y';
                    } else if (value === false || value === 0 || value === '0' || (typeof value === 'string' && value.toUpperCase() === 'N')) {
                        ifmData[key] = 'N';
                    } else if (typeof value === 'string') {
                        ifmData[key] = value.substring(0, 2);
                    } else if (value == null) {
                        ifmData[key] = 'N';
                    } else {
                        ifmData[key] = String(value).substring(0, 2);
                    }
                }
                // Generate Quotation No if not provided: <PREFIX><YY>-SST-<RUNNING6>
                // PREFIX depends on Insurance_Type + Payment_Type
                const product = (ifmData.Insurance_Type || '').toUpperCase();
                const paymentType = (ifmData.Payment_Type || '').toUpperCase();
                function computePrefix() {
                    // Map for CI6Fix
                    const year2 = new Date().getFullYear().toString().slice(-2);
                    if (product === 'CI6FIX') {
                        const m = {
                            'TWO MONTH': 'T',
                            'QUARTERLY': 'Q',
                            'SEMI ANNUALLY': 'S',
                            'YEARLY': 'Y'
                        }[paymentType] || 'Y';
                        return `${m}CI6F${year2}-SST-`;
                    }
                    if (product === 'PRO CANCER') {
                        const m = {
                            'YEARLY': 'Y',
                            'SEMI ANNUALLY': 'SP',
                            'QUARTERLY': 'Q',
                            'TWO MONTH': 'T'
                        }[paymentType] || 'Y';
                        // Use specific prefixes per doc
                        if (m === 'Y') return `YPROCC${year2}-SST-`;
                        if (m === 'SP') return `SPROCC${year2}-SST-`;
                        if (m === 'Q') return `QPROCC${year2}-SST-`;
                        if (m === 'T') return `TPROCC${year2}-SST-`;
                    }
                    // Fallback generic prefix
                    return `Q${year2}-SST-`;
                }
                if (!ifmData.Quatation_No || String(ifmData.Quatation_No).trim() === '') {
                    const prefix = computePrefix();
                    // Compute next running number within transaction using a helper table
                    await new sql.Request(transaction)
                        .query(`IF OBJECT_ID('dbo.ifm_seq', 'U') IS NULL
                                CREATE TABLE dbo.ifm_seq(prefix nvarchar(50) NOT NULL PRIMARY KEY, last_no int NOT NULL);
                        `);
                    const upsert = new sql.Request(transaction);
                    upsert.input('prefix', sql.NVarChar(50), prefix);
                    await upsert.query(`MERGE dbo.ifm_seq AS t
                        USING (SELECT @prefix AS prefix) AS s
                        ON t.prefix = s.prefix
                        WHEN NOT MATCHED THEN INSERT(prefix, last_no) VALUES(s.prefix, 0);`);
                    const nextReq = new sql.Request(transaction);
                    nextReq.input('prefix', sql.NVarChar(50), prefix);
                    const nextRes = await nextReq.query(`UPDATE dbo.ifm_seq SET last_no = last_no + 1 OUTPUT inserted.last_no WHERE prefix = @prefix;`);
                    const nextNo = nextRes.recordset[0].last_no;
                    const running = String(nextNo).padStart(6, '0');
                    ifmData.Quatation_No = `${prefix}${running}`;
                }

                await request
                    .input('Quatation_No', sql.NVarChar(50), ifmData.Quatation_No)
                    .input('Cust_Salutation', sql.NVarChar(255), ifmData.Cust_Salutation)
                    .input('Cust_FirstName', sql.NVarChar(255), ifmData.Cust_FirstName)
                    .input('Cust_LastName', sql.NVarChar(255), ifmData.Cust_LastName)
                    .input('Cust_Address', sql.NVarChar(255), ifmData.Cust_Address)
                    .input('Cust_District', sql.NVarChar(255), ifmData.Cust_District)
                    .input('Cust_Amphur', sql.NVarChar(255), ifmData.Cust_Amphur)
                    .input('Cust_Province', sql.NVarChar(255), ifmData.Cust_Province)
                    .input('Cust_Zipcode', sql.NVarChar(255), ifmData.Cust_Zipcode)
                    .input('Cust_Telephone1', sql.NVarChar(50), ifmData.Cust_Telephone1)
                    .input('Cust_Telephone2', sql.NVarChar(50), ifmData.Cust_Telephone2)
                    .input('Cust_Telephone3', sql.NVarChar(50), ifmData.Cust_Telephone3)
                    .input('Insured_Salutation', sql.NVarChar(255), ifmData.Insured_Salutation)
                    .input('Insured_NationalID', sql.NVarChar(13), ifmData.Insured_NationalID)
                    .input('Insured_FirstName', sql.NVarChar(255), ifmData.Insured_FirstName)
                    .input('Insured_LastName', sql.NVarChar(255), ifmData.Insured_LastName)
                    .input('Insured_Address', sql.NVarChar(255), ifmData.Insured_Address)
                    .input('Insured_District', sql.NVarChar(255), ifmData.Insured_District)
                    .input('Insured_Amphur', sql.NVarChar(255), ifmData.Insured_Amphur)
                    .input('Insured_Province', sql.NVarChar(255), ifmData.Insured_Province)
                    .input('Insured_Zipcode', sql.NVarChar(255), ifmData.Insured_Zipcode)
                    .input('Insured_Telephone1', sql.NVarChar(50), ifmData.Insured_Telephone1)
                    .input('Insured_Telephone2', sql.NVarChar(50), ifmData.Insured_Telephone2)
                    .input('Insured_Telephone3', sql.NVarChar(50), ifmData.Insured_Telephone3)
                    .input('Insured_DOB', sql.NVarChar(255), ifmData.Insured_DOB)
                    .input('Insured_Gender', sql.NVarChar(255), ifmData.Insured_Gender)
                    .input('Insured_Marital_Status', sql.NVarChar(255), ifmData.Insured_Marital_Status)
                    .input('Insured_Occupation', sql.NVarChar(255), ifmData.Insured_Occupation)
                    .input('Insured_Occupation_Detail', sql.NVarChar(500), ifmData.Insured_Occupation_Detail)
                    .input('Benefit1_Salutation', sql.NVarChar(255), ifmData.Benefit1_Salutation)
                    .input('Benefit1_FirstName', sql.NVarChar(255), ifmData.Benefit1_FirstName)
                    .input('Benefit1_LastName', sql.NVarChar(255), ifmData.Benefit1_LastName)
                    .input('Benefit1_Relation', sql.NVarChar(255), ifmData.Benefit1_Relation)
                    .input('Benefit1_Rate', sql.NVarChar(5), ifmData.Benefit1_Rate)
                    .input('Benefit2_Salutation', sql.NVarChar(255), ifmData.Benefit2_Salutation)
                    .input('Benefit2_FirstName', sql.NVarChar(255), ifmData.Benefit2_FirstName)
                    .input('Benefit2_LastName', sql.NVarChar(255), ifmData.Benefit2_LastName)
                    .input('Benefit2_Relation', sql.NVarChar(255), ifmData.Benefit2_Relation)
                    .input('Benefit2_Rate', sql.NVarChar(5), ifmData.Benefit2_Rate)
                    .input('Benefit3_Salutation', sql.NVarChar(255), ifmData.Benefit3_Salutation)
                    .input('Benefit3_FirstName', sql.NVarChar(255), ifmData.Benefit3_FirstName)
                    .input('Benefit3_LastName', sql.NVarChar(255), ifmData.Benefit3_LastName)
                    .input('Benefit3_Relation', sql.NVarChar(255), ifmData.Benefit3_Relation)
                    .input('Benefit3_Rate', sql.NVarChar(5), ifmData.Benefit3_Rate)
                    .input('Benefit4_Salutation', sql.NVarChar(255), ifmData.Benefit4_Salutation)
                    .input('Benefit4_FirstName', sql.NVarChar(255), ifmData.Benefit4_FirstName)
                    .input('Benefit4_LastName', sql.NVarChar(255), ifmData.Benefit4_LastName)
                    .input('Benefit4_Relation', sql.NVarChar(255), ifmData.Benefit4_Relation)
                    .input('Benefit4_Rate', sql.NVarChar(5), ifmData.Benefit4_Rate)
                    .input('Policy_EffectiveDate', sql.DateTime, ifmData.Policy_EffectiveDate)
                    .input('Policy_Plan', sql.NVarChar(255), ifmData.Policy_Plan)
                    .input('Policy_SumInsured', sql.Float, ifmData.Policy_SumInsured)
                    .input('Payment_Amount', sql.Float, ifmData.Payment_Amount)
                    .input('Payment_Type', sql.NVarChar(50), ifmData.Payment_Type)
                    .input('Policy_Premium', sql.Float, ifmData.Policy_Premium)
                    .input('Paid_Date', sql.DateTime, ifmData.Paid_Date)
                    .input('Payment_Method', sql.NVarChar(50), ifmData.Payment_Method)
                    .input('Credit_IDCard', sql.NVarChar(16), ifmData.Credit_IDCard)
                    .input('Card_Issuer_Bank', sql.NVarChar(10), ifmData.Card_Issuer_Bank)
                    .input('Credit_Type', sql.NVarChar(255), ifmData.Credit_Type)
                    .input('Credit_CardName', sql.NVarChar(255), ifmData.Credit_CardName)
                    .input('CreditCardExpDate', sql.NVarChar(255), ifmData.CreditCardExpDate)
                    .input('Approve_Code', sql.NVarChar(10), ifmData.Approve_Code)
                    .input('Payor_Salutation', sql.NVarChar(255), ifmData.Payor_Salutation)
                    .input('Payor_FirstName', sql.NVarChar(255), ifmData.Payor_FirstName)
                    .input('Payor_Surname', sql.NVarChar(255), ifmData.Payor_Surname)
                    .input('Payor_Relation', sql.NVarChar(255), ifmData.Payor_Relation)
                    .input('REF_Change_Plan', sql.NVarChar(50), ifmData.REF_Change_Plan)
                    .input('AgentID', sql.NVarChar(255), ifmData.AgentID)
                    .input('t_tsrName', sql.NVarChar(255), ifmData.t_tsrName)
                    .input('Remark', sql.NVarChar(1500), ifmData.Remark)
                    .input('Insured_Email_Address', sql.NVarChar(100), ifmData.Insured_Email_Address)
                    .input('Insured_LINEID', sql.NVarChar(100), ifmData.Insured_LINEID)
                    .input('Ref_Quotation_FN', sql.NVarChar(50), ifmData.Ref_Quotation_FN)
                    .input('Ref_Quotation_UW', sql.NVarChar(50), ifmData.Ref_Quotation_UW)
                    .input('Ref_Relation', sql.NVarChar(50), ifmData.Ref_Relation)
                    .input('E_Policy', sql.NVarChar(1), ifmData.E_Policy)
                    .input('Insured_Height_Heal', sql.NVarChar(50), ifmData.Insured_Height_Heal)
                    .input('Insured_Weight_Heal', sql.NVarChar(50), ifmData.Insured_Weight_Heal)
                    .input('Ins1_UW1', sql.NVarChar(2), ifmData.Ins1_UW1)
                    .input('Ins1_UW1_Des', sql.NVarChar(1500), ifmData.Ins1_UW1_Des)
                    .input('Ins1_UW1_ID', sql.Int, ifmData.Ins1_UW1_ID)
                    .input('Ins1_UW2', sql.NVarChar(2), ifmData.Ins1_UW2)
                    .input('Ins1_UW2_Des', sql.NVarChar(1500), ifmData.Ins1_UW2_Des)
                    .input('Ins1_UW2_ID', sql.Int, ifmData.Ins1_UW2_ID)
                    .input('Ins1_UW3', sql.NVarChar(2), ifmData.Ins1_UW3)
                    .input('Ins1_UW3_Des', sql.NVarChar(1500), ifmData.Ins1_UW3_Des)
                    .input('Ins1_UW3_ID', sql.Int, ifmData.Ins1_UW3_ID)
                    .input('Ins1_UW4', sql.NVarChar(2), ifmData.Ins1_UW4)
                    .input('Ins1_UW4_Des', sql.NVarChar(1500), ifmData.Ins1_UW4_Des)
                    .input('Ins1_UW4_ID', sql.Int, ifmData.Ins1_UW4_ID)
                    .input('Ins1_UW5', sql.NVarChar(2), ifmData.Ins1_UW5)
                    .input('Ins1_UW5_Des', sql.NVarChar(1500), ifmData.Ins1_UW5_Des)
                    .input('Ins1_UW5_ID', sql.Int, ifmData.Ins1_UW5_ID)
                    .input('Tax_Consent', sql.NVarChar(1), ifmData.Tax_Consent)
                    .input('Data_Consent', sql.NVarChar(5), ifmData.Data_Consent)
                    .query(`
                        INSERT INTO ifm (
                            Quatation_No, Cust_Salutation, Cust_FirstName, Cust_LastName, Cust_Address, Cust_District, Cust_Amphur, Cust_Province, Cust_Zipcode,
                            Cust_Telephone1, Cust_Telephone2, Cust_Telephone3, Insured_Salutation, Insured_NationalID, Insured_FirstName, Insured_LastName,
                            Insured_Address, Insured_District, Insured_Amphur, Insured_Province, Insured_Zipcode, Insured_Telephone1, Insured_Telephone2, Insured_Telephone3,
                            Insured_DOB, Insured_Gender, Insured_Marital_Status, Insured_Occupation, Insured_Occupation_Detail,
                            Benefit1_Salutation, Benefit1_FirstName, Benefit1_LastName, Benefit1_Relation, Benefit1_Rate,
                            Benefit2_Salutation, Benefit2_FirstName, Benefit2_LastName, Benefit2_Relation, Benefit2_Rate,
                            Benefit3_Salutation, Benefit3_FirstName, Benefit3_LastName, Benefit3_Relation, Benefit3_Rate,
                            Benefit4_Salutation, Benefit4_FirstName, Benefit4_LastName, Benefit4_Relation, Benefit4_Rate,
                            Policy_EffectiveDate, Policy_Plan, Policy_SumInsured, Payment_Amount, Payment_Type, Policy_Premium, Paid_Date, Payment_Method,
                            Credit_IDCard, Card_Issuer_Bank, Credit_Type, Credit_CardName, CreditCardExpDate, Approve_Code,
                            Payor_Salutation, Payor_FirstName, Payor_Surname, Payor_Relation, REF_Change_Plan, AgentID, t_tsrName, Remark,
                            Insured_Email_Address, Insured_LINEID, Ref_Quotation_FN, Ref_Quotation_UW, Ref_Relation, E_Policy, Insured_Height_Heal, Insured_Weight_Heal,
                            Ins1_UW1, Ins1_UW1_Des, Ins1_UW1_ID, Ins1_UW2, Ins1_UW2_Des, Ins1_UW2_ID, Ins1_UW3, Ins1_UW3_Des, Ins1_UW3_ID,
                            Ins1_UW4, Ins1_UW4_Des, Ins1_UW4_ID, Ins1_UW5, Ins1_UW5_Des, Ins1_UW5_ID, Tax_Consent, Data_Consent
                        ) VALUES (
                            @Quatation_No, @Cust_Salutation, @Cust_FirstName, @Cust_LastName, @Cust_Address, @Cust_District, @Cust_Amphur, @Cust_Province, @Cust_Zipcode,
                            @Cust_Telephone1, @Cust_Telephone2, @Cust_Telephone3, @Insured_Salutation, @Insured_NationalID, @Insured_FirstName, @Insured_LastName,
                            @Insured_Address, @Insured_District, @Insured_Amphur, @Insured_Province, @Insured_Zipcode, @Insured_Telephone1, @Insured_Telephone2, @Insured_Telephone3,
                            @Insured_DOB, @Insured_Gender, @Insured_Marital_Status, @Insured_Occupation, @Insured_Occupation_Detail,
                            @Benefit1_Salutation, @Benefit1_FirstName, @Benefit1_LastName, @Benefit1_Relation, @Benefit1_Rate,
                            @Benefit2_Salutation, @Benefit2_FirstName, @Benefit2_LastName, @Benefit2_Relation, @Benefit2_Rate,
                            @Benefit3_Salutation, @Benefit3_FirstName, @Benefit3_LastName, @Benefit3_Relation, @Benefit3_Rate,
                            @Benefit4_Salutation, @Benefit4_FirstName, @Benefit4_LastName, @Benefit4_Relation, @Benefit4_Rate,
                            @Policy_EffectiveDate, @Policy_Plan, @Policy_SumInsured, @Payment_Amount, @Payment_Type, @Policy_Premium, @Paid_Date, @Payment_Method,
                            @Credit_IDCard, @Card_Issuer_Bank, @Credit_Type, @Credit_CardName, @CreditCardExpDate, @Approve_Code,
                            @Payor_Salutation, @Payor_FirstName, @Payor_Surname, @Payor_Relation, @REF_Change_Plan, @AgentID, @t_tsrName, @Remark,
                            @Insured_Email_Address, @Insured_LINEID, @Ref_Quotation_FN, @Ref_Quotation_UW, @Ref_Relation, @E_Policy, @Insured_Height_Heal, @Insured_Weight_Heal,
                            @Ins1_UW1, @Ins1_UW1_Des, @Ins1_UW1_ID, @Ins1_UW2, @Ins1_UW2_Des, @Ins1_UW2_ID, @Ins1_UW3, @Ins1_UW3_Des, @Ins1_UW3_ID,
                            @Ins1_UW4, @Ins1_UW4_Des, @Ins1_UW4_ID, @Ins1_UW5, @Ins1_UW5_Des, @Ins1_UW5_ID, @Tax_Consent, @Data_Consent
                        )
                    `);
                await transaction.commit();
                return { success: true, Quatation_No: ifmData.Quatation_No };
            } catch (error) {
                try { await transaction.rollback(); } catch (_) {}
                const enriched = new Error(error.message || 'SQL error');
                enriched.originalError = error.originalError || error;
                enriched.precedingErrors = error.precedingErrors || [];
                enriched.code = error.code; enriched.number = error.number; enriched.state = error.state; enriched.class = error.class;
                enriched.lineNumber = error.lineNumber; enriched.procName = error.procName;
                throw enriched;
            }
        } catch (error) {
            console.error('Error creating ifm:', error);
            throw error;
        }
    }
}
module.exports = new InsuranceModel();