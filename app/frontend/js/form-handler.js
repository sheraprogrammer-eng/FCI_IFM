document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('insuranceForm');
  if (!form) return;
    
  function showPopup(message, isError = true) {
    const existing = document.getElementById('globalPopup');
    if (existing) existing.remove();
        const popup = document.createElement('div');
    popup.id = 'globalPopup';
    popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:30000;';
        popup.innerHTML = `
      <div style="background:#fff;max-width:90vw;padding:28px 36px;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);text-align:center;">
        <div style="font-size:1.2rem;font-weight:600;color:${isError ? '#dc3545' : '#198754'};margin-bottom:10px;">
          ${isError ? '<i class="fas fa-exclamation-triangle me-2"></i>เกิดข้อผิดพลาด' : '<i class="fas fa-check-circle me-2"></i>สำเร็จ'}
                </div>
        <div style="color:#555;max-height:60vh;overflow:auto;text-align:left;white-space:pre-wrap;">${message}</div>
        <div style="margin-top:18px;">
          <button id="popupCloseBtn" style="background:${isError ? '#dc3545' : '#198754'};color:#fff;border:none;border-radius:8px;padding:9px 24px;cursor:pointer;">ตกลง</button>
                </div>
      </div>`;
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
    popup.addEventListener('click', (e) => {
      if (e.target.id === 'popupCloseBtn' || e.target.id === 'globalPopup') {
                popup.remove();
                document.body.style.overflow = '';
            }
        });
    }
    
  function getAllFormValues(frm) {
    const values = {};
    const elements = frm.querySelectorAll('input, select, textarea');
    elements.forEach((el) => {
      const name = el.name;
      if (!name) return;
      if (el.type === 'checkbox') {
        values[name] = el.checked ? 'Y' : 'N';
      } else if (el.type === 'radio') {
        if (el.checked) values[name] = el.value;
        if (!(name in values)) values[name] = values[name];
      } else {
        values[name] = el.value ?? '';
      }
    });
    // ensure unchecked checkboxes exist
    frm.querySelectorAll('input[type="checkbox"][name]').forEach((el) => {
      if (!(el.name in values)) values[el.name] = 'N';
    });
    return values;
  }

  function toNumber(val, fallback = 0) {
    if (val === undefined || val === null || String(val).trim() === '') return fallback;
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  }

  function toInt(val, fallback = 0) {
    if (val === undefined || val === null || String(val).trim() === '') return fallback;
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function toDateISO(val) {
    if (!val) return null;
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  function toDobString(val) {
    if (!val) return null;
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function buildPayload(values) {
    const payload = {
      // Quotation no. will be generated on backend based on product and payment
      // Quatation_No: intentionally omitted
      Insurance_Type: (values.insurance_type || '').trim(),

      // Customer (NOT NULL mostly)
      Cust_Salutation: (values.Cust_Salutation || '').trim(),
      Cust_FirstName: (values.Cust_FirstName || '').trim(),
      Cust_LastName: (values.Cust_LastName || '').trim(),
      Cust_Address: (values.Cust_Address || '').trim(),
      Cust_District: (values.Cust_District || '').trim(),
      Cust_Amphur: (values.Cust_Amphur || '').trim(),
      Cust_Province: (values.Cust_Province || '').trim(),
      Cust_Zipcode: (values.Cust_Zipcode || '').trim(),
      Cust_Telephone1: (values.Cust_Telephone1 || '').trim(),
      Cust_Telephone2: (values.Cust_Telephone2 || '').trim(),
      Cust_Telephone3: (values.Cust_Telephone3 || '').trim(),

      // Insured (NOT NULL mostly)
      Insured_Salutation: (values.Insured_Salutation || values.Cust_Salutation || '').trim(),
      Insured_NationalID: (values.Insured_NationalID || '').trim(),
      Insured_FirstName: (values.Insured_FirstName || values.Cust_FirstName || '').trim(),
      Insured_LastName: (values.Insured_LastName || values.Cust_LastName || '').trim(),
      Insured_Address: (values.Insured_Address || values.Cust_Address || '').trim(),
      Insured_District: (values.Insured_District || values.Cust_District || '').trim(),
      Insured_Amphur: (values.Insured_Amphur || values.Cust_Amphur || '').trim(),
      Insured_Province: (values.Insured_Province || values.Cust_Province || '').trim(),
      Insured_Zipcode: (values.Insured_Zipcode || values.Cust_Zipcode || '').trim(),
      Insured_Telephone1: (values.Insured_Telephone1 || values.Cust_Telephone1 || '').trim(),
      Insured_Telephone2: (values.Insured_Telephone2 || '').trim(),
      Insured_Telephone3: (values.Insured_Telephone3 || '').trim(),
      Insured_DOB: toDobString(values.Insured_DOB),
      Insured_Gender: (values.Insured_Gender || '').trim(),
      Insured_Marital_Status: (values.Insured_Marital_Status || 'Single').trim(),
      Insured_Occupation: (values.Insured_Occupation || '').trim(),
      Insured_Occupation_Detail: (values.Insured_Occupation_Detail || '').trim(),

      // Beneficiary 1 (NOT NULL)
      Benefit1_Salutation: (values.Benefit1_Salutation || values.Insured_Salutation || values.Cust_Salutation || '').trim(),
      Benefit1_FirstName: (values.Benefit1_FirstName || values.Insured_FirstName || values.Cust_FirstName || '').trim(),
      Benefit1_LastName: (values.Benefit1_LastName || values.Insured_LastName || values.Cust_LastName || '').trim(),
      Benefit1_Relation: (values.Benefit1_Relation || 'Self').trim(),
      Benefit1_Rate: (values.Benefit1_Rate || '100').trim(),

      // Optional beneficiary 2-4
      Benefit2_Salutation: (values.Benefit2_Salutation || '').trim(),
      Benefit2_FirstName: (values.Benefit2_FirstName || '').trim(),
      Benefit2_LastName: (values.Benefit2_LastName || '').trim(),
      Benefit2_Relation: (values.Benefit2_Relation || '').trim(),
      Benefit2_Rate: (values.Benefit2_Rate || '').trim(),
      Benefit3_Salutation: (values.Benefit3_Salutation || '').trim(),
      Benefit3_FirstName: (values.Benefit3_FirstName || '').trim(),
      Benefit3_LastName: (values.Benefit3_LastName || '').trim(),
      Benefit3_Relation: (values.Benefit3_Relation || '').trim(),
      Benefit3_Rate: (values.Benefit3_Rate || '').trim(),
      Benefit4_Salutation: (values.Benefit4_Salutation || '').trim(),
      Benefit4_FirstName: (values.Benefit4_FirstName || '').trim(),
      Benefit4_LastName: (values.Benefit4_LastName || '').trim(),
      Benefit4_Relation: (values.Benefit4_Relation || '').trim(),
      Benefit4_Rate: (values.Benefit4_Rate || '').trim(),

      // Policy / Payment (NOT NULL many)
      Policy_EffectiveDate: toDateISO(values.Policy_EffectiveDate),
      Policy_Plan: (values.Policy_Plan || '').trim(),
      Policy_SumInsured: toNumber(values.Policy_SumInsured, 0),
      Payment_Amount: toNumber(values.Payment_Amount, 0),
      Payment_Type: (values.Payment_Type || '').trim(),
      Policy_Premium: toNumber(values.Policy_Premium, 0),
      Paid_Date: toDateISO(values.Paid_Date || values.Policy_EffectiveDate),
      Payment_Method: (values.Payment_Method || '').trim(),

      // Credit
      Credit_IDCard: (values.Credit_IDCard || '').trim().slice(0, 16),
      Card_Issuer_Bank: (values.Card_Issuer_Bank || '').trim(),
      Credit_Type: (values.Credit_Type || '').trim(),
      Credit_CardName: (values.Credit_CardName || '').trim(),
      CreditCardExpDate: (values.CreditCardExpDate || '').trim(),
      Approve_Code: (values.Approve_Code || '').trim(),

      // Payor/Refs
      Payor_Salutation: (values.Payor_Salutation || '').trim(),
      Payor_FirstName: (values.Payor_FirstName || '').trim(),
      Payor_Surname: (values.Payor_Surname || '').trim(),
      Payor_Relation: (values.Payor_Relation || '').trim(),
      REF_Change_Plan: (values.REF_Change_Plan || values.REST_Change_Plan || '').trim(),
      AgentID: (values.AgentID || '').trim(),
      t_tsrName: (values.t_tsrName || '').trim(),
      Remark: (values.Remark || '').trim(),

      // Contacts / refs
      Insured_Email_Address: (values.Insured_Email_Address || '').trim(),
      Insured_LINEID: (values.Insured_LINEID || '').trim(),
      Ref_Quotation_FN: (values.Ref_Quotation_FN || '').trim(),
      Ref_Quotation_UW: (values.Ref_Quotation_UW || '').trim(),
      Ref_Relation: (values.Ref_Relation || '').trim(),

      // Flags
      E_Policy: values.E_Policy === 'Y' ? 'Y' : 'N',
      Insured_Height_Heal: (values.Insured_Height_Heal || '').trim(),
      Insured_Weight_Heal: (values.Insured_Weight_Heal || '').trim(),

      // UW answers (NVarChar(2))
      Ins1_UW1: (values.Ins1_UW1 === 'Y' || values.Ins1_UW1 === 'เคย' || values.Ins1_UW1 === 'สูบ/เสพ') ? 'Y' : 'N',
      Ins1_UW1_Des: (values.Ins1_UW1_Des || '').trim(),
      Ins1_UW1_ID: toInt(values.Ins1_UW1_ID, 0),
      Ins1_UW2: (values.Ins1_UW2 === 'Y' || values.Ins1_UW2 === 'เคย' || values.Ins1_UW2 === 'สูบ/เสพ') ? 'Y' : 'N',
      Ins1_UW2_Des: (values.Ins1_UW2_Des || '').trim(),
      Ins1_UW2_ID: toInt(values.Ins1_UW2_ID, 0),
      Ins1_UW3: (values.Ins1_UW3 === 'Y' || values.Ins1_UW3 === 'เคย' || values.Ins1_UW3 === 'สูบ/เสพ') ? 'Y' : 'N',
      Ins1_UW3_Des: (values.Ins1_UW3_Des || '').trim(),
      Ins1_UW3_ID: toInt(values.Ins1_UW3_ID, 0),
      Ins1_UW4: (values.Ins1_UW4 === 'Y' || values.Ins1_UW4 === 'เคย' || values.Ins1_UW4 === 'สูบ/เสพ') ? 'Y' : 'N',
      Ins1_UW4_Des: (values.Ins1_UW4_Des || '').trim(),
      Ins1_UW4_ID: toInt(values.Ins1_UW4_ID, 0),
      Ins1_UW5: (values.Ins1_UW5 === 'Y' || values.Ins1_UW5 === 'เคย' || values.Ins1_UW5 === 'สูบ/เสพ') ? 'Y' : 'N',
      Ins1_UW5_Des: (values.Ins1_UW5_Des || '').trim(),
      Ins1_UW5_ID: toInt(values.Ins1_UW5_ID, 0),

      Tax_Consent: values.Tax_Consent === 'Y' ? 'Y' : 'N',
      Data_Consent: values.Data_Consent === 'Y' ? 'Y' : 'N'
    };
    return payload;
  }

  function validateAgainstSchema(p) {
    const missing = [];
    const required = [
      'Cust_Salutation','Cust_FirstName','Cust_LastName','Cust_Address','Cust_District','Cust_Amphur','Cust_Province','Cust_Zipcode','Cust_Telephone1',
      'Insured_Salutation','Insured_NationalID','Insured_FirstName','Insured_LastName','Insured_Address','Insured_District','Insured_Amphur','Insured_Province','Insured_Zipcode','Insured_Telephone1',
      'Insured_DOB','Insured_Gender','Insured_Marital_Status','Insured_Occupation','Insured_Occupation_Detail',
      'Benefit1_Salutation','Benefit1_FirstName','Benefit1_LastName','Benefit1_Relation','Benefit1_Rate',
      'Policy_EffectiveDate','Policy_Plan','Policy_SumInsured','Payment_Amount','Payment_Type','Policy_Premium','Paid_Date','Payment_Method',
      'Credit_IDCard','t_tsrName','E_Policy','Ins1_UW1','Ins1_UW1_ID','Ins1_UW2','Ins1_UW2_ID','Ins1_UW3','Ins1_UW3_ID','Ins1_UW4','Ins1_UW4_ID','Ins1_UW5','Ins1_UW5_ID','Tax_Consent','Data_Consent'
    ];
    required.forEach((k) => {
      if (p[k] === null || p[k] === undefined || String(p[k]).trim() === '') missing.push(k);
    });
    if (p.Credit_IDCard && p.Credit_IDCard.length > 16) missing.push('Credit_IDCard(<=16)');
    if (!p.Policy_EffectiveDate) missing.push('Policy_EffectiveDate(valid date)');
    if (!p.Paid_Date) missing.push('Paid_Date(valid date)');
    if (!p.Insured_DOB) missing.push('Insured_DOB(valid YYYY-MM-DD)');
    return missing;
  }

  form.addEventListener('submit', async function (e) {
        e.preventDefault();

    // If external validator exists, honor it
    if (window.validateInsuranceForm && !window.validateInsuranceForm()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>กำลังส่งข้อมูล...';
        submitBtn.disabled = true;
    }

    try {
      const values = getAllFormValues(form);
      const payload = buildPayload(values);

      const missing = validateAgainstSchema(payload);
      if (missing.length > 0) {
        showPopup('ข้อมูลที่จำเป็นไม่ครบหรือรูปแบบไม่ถูกต้อง:\n- ' + missing.join('\n- '));
        return;
      }

      console.log('IFM payload:', payload);
      const res = await fetch('/api/insurance/ifm', {
                method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await res.json();
      } catch (err) {
        showPopup('เซิร์ฟเวอร์ตอบกลับไม่ใช่ JSON');
        return;
      }
            
            if (result.success) {
        const id = (result.data && result.data.id) || 'success';
                window.location.href = `https://phpuat.falconinsurance.co.th/confirmation?id=${id}`;
            } else {
        const err = result.sqlError || result.details || {};
        const meta = [
          err.number ? `Number: ${err.number}` : '',
          err.state ? `State: ${err.state}` : '',
          err.procName ? `Proc: ${err.procName}` : ''
        ].filter(Boolean).join(' ');
        const prev = Array.isArray(err.precedingErrors) && err.precedingErrors.length > 0
          ? '\nPrev: ' + err.precedingErrors.map(p => p.message).join(' | ')
          : '';
        const msg = `${result.message || 'บันทึกไม่สำเร็จ'}\n${err.message || ''}${meta ? '\n' + meta : ''}${prev}`;
        console.log('SQL error details:', err);
        showPopup(msg);
      }
    } catch (err) {
      console.error(err);
      showPopup('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        } finally {
      if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
      }
        }
    });
});